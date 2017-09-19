import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {TextlayoutService} from '../textlayout.service';
import {SpaceService} from '../space.service';
import {QuestionService} from '../question.service';
import {RelationService} from '../relation.service';
import {D3, D3Service} from 'd3-ng2-service';
import {ForceLink} from 'd3-force';
import {GraphNode} from './graph-data-model/graph-node';
import {Edge} from './graph-data-model/edge';

@Component({
  selector: 'app-graph-view',
  templateUrl: './graph-view.component.html',
  styleUrls: ['./graph-view.component.css']
})
export class GraphViewComponent implements OnInit, AfterViewInit {
  @ViewChild('d3root') private d3Root;
  private d3: D3;
  private nodes: GraphNode[];
  private edges: Edge[];


  constructor(private TextlayoutService: TextlayoutService, private SpaceService: SpaceService,
              private QuestionService: QuestionService, private RelationService: RelationService,
              private D3Service: D3Service) {
    this.d3 = D3Service.getD3();
  }

  ngOnInit() {
    // TODO: load data
    // this.SpaceService.getSpace().then((resp) => {
    //   console.log(resp);
    //   // TODO: process and push data
    // });
  }

  ngAfterViewInit() {
    this.initVisualization();
  }

  initVisualization() {
    const canvas = this.d3Root.nativeElement;
    const context = canvas.getContext('2d');
    // TODO: eventually handle changes in size (currently static)
    const width = canvas.width;
    const height = canvas.height;

    const d3Sim = this.d3.forceSimulation()
      .force('link', this.d3.forceLink<GraphNode, Edge>().id((n, i, d) => n.id.toString()))
      .force('charge', this.d3.forceManyBody())
      .force('center', this.d3.forceCenter(width / 2, height / 2));

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
    ].map((d) => new GraphNode(d.id, d.label));

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


    d3Sim.nodes(this.nodes).on('tick', () => {
      context.clearRect(0, 0, width, height);
      // TODO: draw stuff independently so we can use different colors etc. for different parts of the graph
      context.beginPath();
      this.edges.forEach((e: Edge) => {
        // draw edge
        e.draw(context as CanvasRenderingContext2D);
      });
      context.strokeStyle = '#aaa';
      context.stroke();
      context.beginPath();
      this.nodes.forEach((n) => {
        // draw node
        n.draw(context as CanvasRenderingContext2D);
      });
      context.fill();
      context.strokeStyle = '#fff';
      context.stroke();
    });
    d3Sim.force<ForceLink<GraphNode, Edge>>('link').links(this.edges);

    // drag behavior
    this.d3.select(canvas)
      .call(this.d3.drag()
        .container(canvas)
        .subject(() => d3Sim.find(this.d3.event.x, this.d3.event.y))
        .on('start', () => {
          if (!this.d3.event.active) {
            d3Sim.alphaTarget(0.3).restart();
          }
          this.d3.event.subject.fx = this.d3.event.x;
          this.d3.event.subject.fy = this.d3.event.y;
        })
        .on('drag', () => {
          this.d3.event.subject.fx = this.d3.event.x;
          this.d3.event.subject.fy = this.d3.event.y;
        })
        .on('end', () => {
          if (!this.d3.event.active) {
            d3Sim.alphaTarget(0);
          }
          this.d3.event.subject.fx = null;
          this.d3.event.subject.fy = null;
        })
      );
    // TODO: add zoom behavior
  }

}
