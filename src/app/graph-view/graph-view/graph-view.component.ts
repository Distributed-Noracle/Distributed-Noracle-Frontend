import {Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {D3, D3Service} from 'd3-ng2-service';
import {ForceLink, Simulation} from 'd3-force';
import {GraphNode} from './graph-data-model/graph-node';
import {Edge} from './graph-data-model/edge';
import {ZoomTransform} from 'd3-zoom';
import {GraphInteractionMode} from './graph-data-model/graph-interaction-mode.enum';
import {GraphViewService} from './graph-view.service';
import {Relation} from '../../shared/rest-data-model/relation';
import {Question} from '../../shared/rest-data-model/question';
import {Network} from './graph-data-model/network';

@Component({
  selector: 'dnor-graph-view',
  templateUrl: './graph-view.component.html',
  styleUrls: ['./graph-view.component.css']
})
export class GraphViewComponent implements OnInit, OnChanges {
  @ViewChild('d3root') private d3Root;
  @Input('height') private height = 400;
  @Input('width') private width = 400;
  @Input('interactionMode') private interactionMode: GraphInteractionMode;

  private d3: D3;
  private network = new Network();
  private transform: ZoomTransform;
  private hasDragSubject = false;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private d3Sim: Simulation<GraphNode, Edge>;
  private activatedInteractionMode: GraphInteractionMode;


  constructor(private graphViewService: GraphViewService,
              private d3Service: D3Service) {
    this.d3 = d3Service.getD3();
    this.transform = this.d3.zoomIdentity;
  }

  ngOnInit() {
    this.canvas = this.d3Root.nativeElement;
    this.context = this.canvas.getContext('2d');
    this.d3Sim = this.d3.forceSimulation() as Simulation<GraphNode, Edge>;

    this.initData().then(() => {
      this.initVisualization();
      this.updateInteractionMode();
    });
  }

  ngOnChanges() {
    if (this.d3Sim) {
      this.d3Sim.force('center', this.d3.forceCenter(this.width / 2, this.height / 2));
      this.d3Sim.restart();
      this.updateInteractionMode();
    }
  }

  initVisualization() {
    const context = this.context;
    const d3Sim = this.d3Sim;

    d3Sim.force('link', this.d3.forceLink<GraphNode, Edge>().id((n, i, d) => n.id.toString()));
    d3Sim.force('charge', this.d3.forceManyBody());
    d3Sim.force('center', this.d3.forceCenter(this.width / 2, this.height / 2));

    d3Sim.force('collide', this.d3.forceCollide((node) => (node as GraphNode).radius * 1.2));
    d3Sim.nodes(this.network.getNodes()).on('tick', () => {
      context.save();
      context.clearRect(0, 0, this.width, this.height);
      context.translate(this.transform.x, this.transform.y);
      context.scale(this.transform.k, this.transform.k);
      this.network.getEdges().forEach((e: Edge) => {
        // draw edge
        e.draw(context as CanvasRenderingContext2D);
      });
      this.network.getNodes().forEach((n) => {
        // draw node
        n.draw(context as CanvasRenderingContext2D);
      });
      context.restore();
    });
    d3Sim.force<ForceLink<GraphNode, Edge>>('link').links(this.network.getEdges())
      .distance((link, i, links) => (link as Edge).getDistance());
  }

  private updateInteractionMode() {
    if (this.activatedInteractionMode === this.interactionMode) {
      // no change
      return;
    }
    if (this.interactionMode === GraphInteractionMode.SelectAndNavigate) {
      this.setNodeSelectionBehavior((n) => this.changeSelection(n));
    } else if (this.interactionMode === GraphInteractionMode.AddQuestion) {
      this.setNodeSelectionBehavior((n) => this.addNewChildToNode(n));
    } else if (this.interactionMode === GraphInteractionMode.EditQuestion) {
      this.setNodeSelectionBehavior((n) => this.editNode(n));
    } else if (this.interactionMode === GraphInteractionMode.AddRelation) {
      // TODO: implement and set Behavior
      this.setExploreBehavior();
    } else if (this.interactionMode === GraphInteractionMode.EditRelation) {
      this.setEdgeSelectionBehavior((e: Edge) => {
        this.network.getEdges().forEach((edge) => edge.isSelected = false);
        e.isSelected = true;
      });
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
          const nodes = this.network.getNodes();
          for (let i = nodes.length - 1; i >= 0; i--) {
            const n = nodes[i];
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

  private setNodeSelectionBehavior(editFunction: (n: GraphNode) => Promise<any>) {
    const canvas = this.canvas;
    const d3Sim = this.d3Sim;

    // drag behavior
    this.d3.select(canvas)
      .call(this.d3.drag()
        .container(canvas)
        .subject(() => {
          // console.log('subject: (' + this.d3.event.x + '/' + this.d3.event.y + ')')
          this.hasDragSubject = false;
          const nodes = this.network.getNodes();
          for (let i = nodes.length - 1; i >= 0; i--) {
            const n = nodes[i];
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
            editFunction(n).then(() => {
              d3Sim.nodes(this.network.getNodes());
              d3Sim.force<ForceLink<GraphNode, Edge>>('link').links(this.network.getEdges())
                .distance((link, i, links) => (link as Edge).getDistance());
              d3Sim.alpha(1).restart();
            });
          }
        }))
      .call(this.d3.zoom().filter(() => false));
  }

  private addNewChildToNode(n: GraphNode): Promise<any> {
    return new Promise((resolve, reject) => {
      const label = window.prompt('Ask a follow up question to: ' + n.label);
      if (label !== null) {
        // TODO: POST question, use questionId from response, POST relation
        const newId = this.network.getNodes().reduce((p, c) => (p === null || c.id > p.id) ? c : p, null).id + 1;
        const newRel = new Relation();
        newRel.firstQuestionId = n.id;
        newRel.secondQuestionId = newId;
        newRel.relationId = '[' + n.id + '][' + newId + ']';
        newRel.name = 'follow up';
        newRel.directed = true;
        const newNode = new GraphNode(this.context, newId, label, [newRel]);
        newNode.x = n.x;
        newNode.y = n.y;
        newNode.isSelected = true;
        this.network.addNode(newNode);
      }
      resolve();
    });
  }

  private editNode(n: GraphNode) {
    return new Promise((resolve, reject) => {
      const label = window.prompt('Edit Question:', n.label);
      if (label !== null) {
        n.setLabel(label, this.context);
      }
      resolve();
    });
  }

  private changeSelection(n: GraphNode): Promise<any> {
    if (n.isSelected && this.network.getNodes().filter((node) => node.isSelected).length > 1) {
      n.isSelected = false;
      return new Promise((resolve, reject) => {
        const nodes = this.network.getNodes();
        for (let i = nodes.length - 1; i >= 0; i--) {
          const node = nodes[i];
          if (!node.isSelected && !this.network.hasSelectedNeighbour(node)) {
            this.network.removeNode(node);
          }
        }
        resolve();
      });
    } else if (n.isSelected) {
      return Promise.resolve(window.alert('You can\'t deselect the last selected node.'));
    } else {
      n.isSelected = true;
      return this.graphViewService.getRelationsForQuestion(n.id)
        .then((relations) => {
          const promises = [];
          const newIds: string[] = [];
          relations.forEach((r) => {
            const id = r.firstQuestionId === n.id ? r.secondQuestionId : r.firstQuestionId;
            if (this.network.getNodes().findIndex((node) => node.id === id) === -1
              && newIds.indexOf(id) === -1) {
              // question not yet in network and not yet scheduled for download
              newIds.push(id);
              promises.push(this.graphViewService.getQuestion(id));
            }
          });
          return Promise.all<Question>(promises).then((questions) => {
            for (let i = questions.length - 1; i >= 0; i--) {
              const question = questions[i];
              const graphNode = new GraphNode(this.context, question.questionId, question.text,
                relations.filter(
                  (r) => r.firstQuestionId === question.questionId || r.secondQuestionId === question.questionId
                )
              );
              graphNode.x = n.x;
              graphNode.y = n.y;
              this.network.addNode(graphNode);
            }
          });
        });
    }
  }

  private setEdgeSelectionBehavior(editFunction: (e: Edge) => void) {
    const canvas = this.canvas;
    const d3Sim = this.d3Sim;
    const squaredDistanceThreshold = 100;

    // drag behavior
    this.d3.select(canvas)
      .call(this.d3.drag()
        .container(canvas)
        .subject(() => {
          // console.log('subject: (' + this.d3.event.x + '/' + this.d3.event.y + ')')
          this.hasDragSubject = false;
          const edges = this.network.getEdges();
          for (let i = edges.length - 1; i >= 0; i--) {
            const edge = edges[i];
            const d_sqr = this.getPointToLineSegmentSquaredDistance(
              (edge.source as GraphNode).x, (edge.source as GraphNode).y,
              (edge.target as GraphNode).x, (edge.target as GraphNode).y,
              this.transform.invertX(this.d3.event.x), this.transform.invertY(this.d3.event.y)
            );
            if (d_sqr <= squaredDistanceThreshold) {
              return edge;
            }
          }
        })
        .on('start', () => false)
        .on('drag', () => false)
        .on('end', () => {
          const edge = this.d3.event.subject as Edge;
          const d_sqr = this.getPointToLineSegmentSquaredDistance(
            (edge.source as GraphNode).x, (edge.source as GraphNode).y,
            (edge.target as GraphNode).x, (edge.target as GraphNode).y,
            this.transform.invertX(this.d3.event.x), this.transform.invertY(this.d3.event.y)
          );
          if (d_sqr <= squaredDistanceThreshold) {
            editFunction(edge);
            d3Sim.nodes(this.network.getNodes());
            d3Sim.force<ForceLink<GraphNode, Edge>>('link').links(this.network.getEdges())
              .distance((link, i, links) => (link as Edge).getDistance());
            d3Sim.alpha(1).restart();
          }
        }))
      .call(this.d3.zoom().filter(() => false));
  }

  private getPointToLineSegmentSquaredDistance(ax: number, ay: number, bx: number, by: number, px: number, py: number) {
    // calculate unit vector of AB
    const ab_len = Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
    const abx_0 = (bx - ax) / ab_len;
    const aby_0 = (by - ay) / ab_len;

    // calculate projection point C, projecting AP on AB
    const dot = abx_0 * (px - ax) + aby_0 * (py - ay);
    const cx = ax + dot * abx_0;
    const cy = ay + dot * aby_0;

    // calculate multiplier for unit vector to reach point C from point A
    const ac_mul = (cx - ax) / abx_0;

    let d_sqr;
    if (ac_mul < 0) {
      // not above the line segment, closer to A
      d_sqr = Math.pow(ax - px, 2) + Math.pow(ay - py, 2);
    } else if (ac_mul > ab_len) {
      // not above the line segment, closer to B
      d_sqr = Math.pow(bx - px, 2) + Math.pow(by - py, 2);
    } else {
      // above the line segment, distance to C === distance to AB
      d_sqr = Math.pow(cx - px, 2) + Math.pow(cy - py, 2);
    }
    return d_sqr;
  }

  private initData() {
    const context = this.d3Root.nativeElement.getContext('2d');
    const initialSelection = ['1'];
    return Promise.all<Question, Relation[]>([this.graphViewService.getQuestion(initialSelection[0]),
      this.graphViewService.getRelationsForQuestion(initialSelection[0])])
      .then((values) => {
        const initialQuestion = values[0];
        const initialQuestionRelations = values[1];

        return Promise.all<Question>(initialQuestionRelations.map((r) => {
          if (r.firstQuestionId === initialQuestion.questionId) {
            return this.graphViewService.getQuestion(r.secondQuestionId);
          } else {
            return this.graphViewService.getQuestion(r.firstQuestionId);
          }
        })).then((questions) => {
          // generate nodes
          this.network.addNode(
            new GraphNode(context, initialQuestion.questionId, initialQuestion.text, initialQuestionRelations, true));
          // TODO: consider loading relations eagerly; see also: Network.updateEdgesFromNodeRelationships()
          questions.forEach((q) => this.network.addNode(new GraphNode(context, q.questionId, q.text,
            initialQuestionRelations.filter(
              (r) => r.firstQuestionId === q.questionId || r.secondQuestionId === q.questionId
            ))));
        });
      });


  }

}
