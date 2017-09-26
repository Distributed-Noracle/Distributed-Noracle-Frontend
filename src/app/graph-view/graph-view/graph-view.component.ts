import {AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {SpaceService} from '../space.service';
import {QuestionService} from '../question.service';
import {RelationService} from '../relation.service';
import {D3, D3Service} from 'd3-ng2-service';
import {ForceLink, Simulation} from 'd3-force';
import {GraphNode} from './graph-data-model/graph-node';
import {Edge} from './graph-data-model/edge';
import {ZoomTransform} from 'd3-zoom';
import {GraphInteractionMode} from './graph-data-model/graph-interaction-mode.enum';

@Component({
  selector: 'dnor-graph-view',
  templateUrl: './graph-view.component.html',
  styleUrls: ['./graph-view.component.css']
})
export class GraphViewComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('d3root') private d3Root;
  @Input('height') private height = 400;
  @Input('width') private width = 400;
  @Input('interactionMode') private interactionMode: GraphInteractionMode;

  private d3: D3;
  private nodes: GraphNode[];
  private edges: Edge[];
  private transform: ZoomTransform;
  private hasDragSubject = false;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private d3Sim: Simulation<GraphNode, Edge>;


  constructor(private SpaceService: SpaceService,
              private QuestionService: QuestionService,
              private RelationService: RelationService,
              private D3Service: D3Service) {
    this.d3 = D3Service.getD3();
    this.transform = this.d3.zoomIdentity;
  }

  ngOnInit() {
    // TODO: load data
    // this.SpaceService.getSpace().then((resp) => {
    //   console.log(resp);
    //   // TODO: process and push data
    // });
    this.canvas = this.d3Root.nativeElement;
    this.context = this.canvas.getContext('2d');
    this.d3Sim = this.d3.forceSimulation() as Simulation<GraphNode, Edge>;

    this.initData();
  }

  ngAfterViewInit() {
    this.initVisualization();
  }

  ngOnChanges() {
    if (this.d3Sim) {
      this.d3Sim.force('center', this.d3.forceCenter(this.width / 2, this.height / 2));
      this.d3Sim.restart();
      // TODO: add dirty check
      if (this.interactionMode === GraphInteractionMode.AddQuestion) {
        this.setEditBehavior((n) => this.addNewChildToNode(n));
      } else if (this.interactionMode === GraphInteractionMode.EditQuestion) {
        this.setEditBehavior((n) => this.editNode(n));
      } else if (this.interactionMode === GraphInteractionMode.AddRelation) {
        // TODO: implement and set Behavior
        this.setExploreBehavior();
      } else if (this.interactionMode === GraphInteractionMode.EditRelation) {
        // TODO: implement and set Behavior
        this.setExploreBehavior();
      } else {
        this.setExploreBehavior();
      }
    }
  }

  initVisualization() {
    const canvas = this.canvas;
    const context = this.context;
    const d3Sim = this.d3Sim;

    d3Sim.force('link', this.d3.forceLink<GraphNode, Edge>().id((n, i, d) => n.id.toString()));
    d3Sim.force('charge', this.d3.forceManyBody());
    d3Sim.force('center', this.d3.forceCenter(this.width / 2, this.height / 2));

    d3Sim.force('collide', this.d3.forceCollide((node) => (node as GraphNode).radius * 1.2));
    d3Sim.nodes(this.nodes).on('tick', () => {
      context.save();
      context.clearRect(0, 0, this.width, this.height);
      context.translate(this.transform.x, this.transform.y);
      context.scale(this.transform.k, this.transform.k);
      this.edges.forEach((e: Edge) => {
        // draw edge
        e.draw(context as CanvasRenderingContext2D);
      });
      this.nodes.forEach((n) => {
        // draw node
        n.draw(context as CanvasRenderingContext2D);
      });
      context.restore();
    });
    d3Sim.force<ForceLink<GraphNode, Edge>>('link').links(this.edges)
      .distance((link, i, links) => (link as Edge).getDistance());

    if (this.interactionMode) {
      this.setEditBehavior((n) => this.addNewChildToNode(n));
    } else {
      this.setExploreBehavior();
    }
  }

  private  setExploreBehavior() {
    const canvas = this.canvas;
    const d3Sim = this.d3Sim;

    // drag behavior
    this.d3.select(canvas)
      .call(this.d3.drag()
        .container(canvas)
        .subject(() => {
          // console.log('subject: (' + this.d3.event.x + '/' + this.d3.event.y + ')')
          this.hasDragSubject = false;
          for (let i = this.nodes.length - 1; i >= 0; i--) {
            const n = this.nodes[i];
            const dx = this.transform.invertX(this.d3.event.x) - n.x;
            const dy = this.transform.invertY(this.d3.event.y) - n.y;
            if (Math.pow(n.radius, 2) > Math.pow(dx, 2) + Math.pow(dy, 2)) {
              n.x = this.transform.applyX(n.x);
              n.y = this.transform.applyY(n.y);
              this.hasDragSubject = true;
              return n;
            }
          }
        })
        .on('start', () => {
          if (!this.d3.event.active) {
            d3Sim.alphaTarget(0.3).restart();
          }
          this.d3.event.subject.fx = this.transform.invertX(this.d3.event.x);
          this.d3.event.subject.fy = this.transform.invertY(this.d3.event.y);
        })
        .on('drag', () => {
          // console.log(this.transform.invertX(this.d3.event.x) + '/' + this.transform.invertY(this.d3.event.y));
          this.d3.event.subject.fx = this.transform.invertX(this.d3.event.x);
          this.d3.event.subject.fy = this.transform.invertY(this.d3.event.y);
        })
        .on('end', () => {
          if (!this.d3.event.active) {
            d3Sim.alphaTarget(0);
          }
          this.d3.event.subject.fx = null;
          this.d3.event.subject.fy = null;
        })
      )
      .call(this.d3.zoom()
        .scaleExtent([1 / 4, 4])
        .filter(() => {
          // TODO: verify this is working on touch devices aswell
          if (this.d3.event.type === 'mousedown' || this.d3.event.type === 'touchstart') {
            if (this.hasDragSubject) {
              return false;
            }
          }
          return true;
        }).on('zoom', () => {
          if (!this.d3.event.active) {
            d3Sim.restart();
          }
          this.transform = this.d3.event.transform;
        }));
  }

  private   setEditBehavior(editFunction: (n: GraphNode) => void) {
    const canvas = this.canvas;
    const d3Sim = this.d3Sim;

    // drag behavior
    this.d3.select(canvas)
      .call(this.d3.drag()
        .container(canvas)
        .subject(() => {
          // console.log('subject: (' + this.d3.event.x + '/' + this.d3.event.y + ')')
          this.hasDragSubject = false;
          for (let i = this.nodes.length - 1; i >= 0; i--) {
            const n = this.nodes[i];
            const dx = this.transform.invertX(this.d3.event.x) - n.x;
            const dy = this.transform.invertY(this.d3.event.y) - n.y;
            if (Math.pow(n.radius, 2) > Math.pow(dx, 2) + Math.pow(dy, 2)) {
              n.x = this.transform.applyX(n.x);
              n.y = this.transform.applyY(n.y);
              this.hasDragSubject = true;
              return n;
            }
          }
        })
        .on('start', () => false)
        .on('drag', () => false)
        .on('end', () => {
          const n = this.d3.event.subject as GraphNode;
          const dx = this.transform.invertX(this.d3.event.x) - n.x;
          const dy = this.transform.invertY(this.d3.event.y) - n.y;
          if (Math.pow(n.radius, 2) > Math.pow(dx, 2) + Math.pow(dy, 2)) {
            editFunction(n);
            d3Sim.nodes(this.nodes);
            d3Sim.force<ForceLink<GraphNode, Edge>>('link').links(this.edges)
              .distance((link, i, links) => (link as Edge).getDistance());
            d3Sim.alpha(1).restart();
          }
        }))
      .call(this.d3.zoom().filter(() => false));
  }

  private addNewChildToNode(n: GraphNode) {
    const label = window.prompt('Ask a follow up question to: ' + n.label);
    const newId = this.nodes.reduce((p, c) => (p === null || c.id > p.id) ? c : p, null).id + 1;
    const newNode = new GraphNode(this.context, newId, label);
    this.nodes.push(newNode);
    this.edges.push(new Edge(n, newNode));
  }

  private editNode(n: GraphNode) {
    const label = window.prompt('Edit Question:', n.label);
    n.setLabel(label, this.context);
  }


  private initData() {
    const context = this.d3Root.nativeElement.getContext('2d');

    // generate nodes
    this.nodes = [
      {
        id: 1,
        label: 'What is the most imporatant challenge for European Youth Workers?',
        title: 'asked by Bernhard'
      },
      {
        id: 11,
        label: 'How do we finance our work',
        title: 'asked by Bernhard'
      },
      {
        id: 111,
        label: 'Are we administrators or pedagogues?',
        title: 'asked by Bernhard'
      },
      {
        id: 112,
        label: 'How do we finance our lives?',
        title: 'asked by Bernhard'
      },
      {
        id: 12,
        label: 'Do our intentions match our actions?',
        title: 'asked by Bernhard'
      },
      {
        id: 121,
        label: 'Do we have the same intentions?',
        title: 'asked by Bernhard'
      },
      {
        id: 122,
        label: 'How can you evaluate the connection between ideology and practice?',
        title: 'asked by Bernhard'
      },
      {
        id: 13,
        label: 'If you have an answer, what question have you asked yourself to arrive at that answer?',
        title: 'asked by Bernhard'
      },
      {
        id: 131,
        label: 'What are the barriers to participation?',
        title: 'asked by Bernhard'
      },
      {
        id: 1311,
        label: 'Which barriers do we think we can address?',
        title: 'asked by Bernhard'
      },
      {
        id: 1312,
        label: 'Do we even know who we are serving?',
        title: 'asked by Bernhard'
      },
      {
        id: 14,
        label: 'Why am I doing this',
        title: 'asked by Bernhard'
      },
      {
        id: 15,
        label: 'How do I know what I do is effective?',
        title: 'asked by Bernhard'
      },
      {
        id: 16,
        label: 'Who is actually benefiting from our work',
        title: 'asked by Bernhard'
      }
    ].map((d) => new GraphNode(context, d.id, d.label));
    // create an array with edges
    this.edges = [
      {from: 1, to: 11, label: 'follow up', title: 'related by Bernhard', arrows: 'to'},
      {from: 1, to: 12, label: 'follow up', title: 'related by Bernhard', arrows: 'to'},
      {from: 1, to: 13, label: 'follow up', title: 'related by Bernhard', arrows: 'to'},
      {from: 1, to: 14, label: 'follow up', title: 'related by Bernhard', arrows: 'to'},
      {from: 1, to: 15, label: 'follow up', title: 'related by Bernhard', arrows: 'to'},
      {from: 1, to: 16, label: 'follow up', title: 'related by Bernhard', arrows: 'to'},
      {from: 11, to: 111, label: 'follow up', title: 'related by Bernhard', arrows: 'to'},
      {from: 11, to: 112, label: 'follow up', title: 'related by Bernhard', arrows: 'to'},
      {from: 12, to: 121, label: 'follow up', title: 'related by Bernhard', arrows: 'to'},
      {from: 12, to: 122, label: 'follow up', title: 'related by Bernhard', arrows: 'to'},
      {from: 13, to: 131, label: 'follow up', title: 'related by Bernhard', arrows: 'to'},
      {from: 131, to: 1311, label: 'follow up', title: 'related by Bernhard', arrows: 'to'},
      {from: 131, to: 1312, label: 'follow up', title: 'related by Bernhard', arrows: 'to'},
    ].map((e) => new Edge(e.from, e.to));
  }

}
