import {Component, Input, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {D3, D3Service} from 'd3-ng2-service';
import {ForceLink, Simulation} from 'd3-force';
import {GraphNode} from './graph-data-model/graph-node';
import {Edge} from './graph-data-model/edge';
import {ZoomTransform} from 'd3-zoom';
import {GraphInteractionMode} from './graph-data-model/graph-interaction-mode.enum';
import {GraphViewService} from './graph-view.service';
import {Network} from './graph-data-model/network';
import {ChangeNodeSelectionBehavior} from './interaction-behaviors/change-node-selection-behavior';
import {NodeInteractionBehavior} from './interaction-behaviors/node-interaction-behavior';
import {AddChildNodeBehavior} from './interaction-behaviors/add-child-node-behavior';
import {EditQuestionBehavior} from './interaction-behaviors/edit-question-behavior';
import {AddRelationBehavior} from './interaction-behaviors/add-relation-behavior';
import {Subscription} from 'rxjs/Subscription';
import {MdDialog} from '@angular/material';
import {AgentService} from '../../shared/agent/agent.service';
import {EdgeInteractionBehavior} from './interaction-behaviors/edge-interaction-behavior';
import {EditRelationBehavior} from './interaction-behaviors/edit-relation-behavior';
import {UpdateData} from './graph-data-model/update-data';

@Component({
  selector: 'dnor-graph-view',
  templateUrl: './graph-view.component.html',
  styleUrls: ['./graph-view.component.css']
})
export class GraphViewComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('d3root') private d3Root;
  @Input('height') private height = 400;
  @Input('width') private width = 400;
  @Input('interactionMode') private interactionMode: GraphInteractionMode;
  @Input('spaceId') private spaceId = 'dummy';
  @Input('selectedQuestions') private selectedQuestions: string[];

  private d3: D3;
  private loadedSpaceId;
  private network: Network;
  private transform: ZoomTransform;
  private hasDragSubject = false;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private d3Sim: Simulation<GraphNode, Edge>;
  private activatedInteractionMode: GraphInteractionMode;
  private updateSubscription: Subscription;


  constructor(private graphViewService: GraphViewService, private agentService: AgentService,
              private d3Service: D3Service, private dialog: MdDialog) {
    this.d3 = d3Service.getD3();
    this.transform = this.d3.zoomIdentity;
  }

  ngOnInit() {
    this.canvas = this.d3Root.nativeElement;
    this.context = this.canvas.getContext('2d');
    this.d3Sim = this.d3.forceSimulation() as Simulation<GraphNode, Edge>;
    this.d3Sim.force('link', this.d3.forceLink<GraphNode, Edge>().id((n, i, d) => n.id.toString()));
    this.d3Sim.force('charge', this.d3.forceManyBody());
    this.d3Sim.force('center', this.d3.forceCenter(this.width / 2, this.height / 2));
    this.d3Sim.force('collide', this.d3.forceCollide((node) => (node as GraphNode).radius * 1.2));

    this.updateSubscription =
      this.graphViewService.getUpdateObservable().subscribe((updateData) => this.processUpdate(updateData));
    this.initData();
    this.initVisualization();
    this.updateInteractionMode();

  }

  ngOnDestroy() {
    this.updateSubscription.unsubscribe();
    this.graphViewService.initServiceForSpace(null);
  }

  ngOnChanges() {
    if (this.d3Sim) {
      if (this.spaceId !== this.loadedSpaceId) {
        this.initData();
        this.initVisualization();
        this.updateInteractionMode();
      }
      this.network.getNodes().forEach((node) => {
        node.isSelected = (this.selectedQuestions.indexOf(node.id) !== -1);
      });
      this.d3Sim.force('center', this.d3.forceCenter(this.width / 2, this.height / 2));
      this.d3Sim.alpha(1).restart();
      this.updateInteractionMode();
    }
  }

  initVisualization() {
    const context = this.context;
    const d3Sim = this.d3Sim;

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
    d3Sim.restart();
  }

  private updateInteractionMode() {
    if (this.activatedInteractionMode === this.interactionMode) {
      // no change
      return;
    }
    if (this.interactionMode === GraphInteractionMode.SelectAndNavigate) {
      // TODO: review: a new behavior every time? maybe use services?
      this.setSelectionBehaviors(new ChangeNodeSelectionBehavior(this.network, this.graphViewService), null);
    } else if (this.interactionMode === GraphInteractionMode.AddQuestion) {
      this.setSelectionBehaviors(new AddChildNodeBehavior(this.graphViewService, this.dialog), null);
    } else if (this.interactionMode === GraphInteractionMode.AddRelation) {
      this.setSelectionBehaviors(new AddRelationBehavior(this.graphViewService, this.dialog), null);
    } else if (this.interactionMode === GraphInteractionMode.EditAndAssess) {
      this.setSelectionBehaviors(
        new EditQuestionBehavior(this.graphViewService, this.agentService, this.dialog),
        new EditRelationBehavior(this.graphViewService, this.agentService, this.dialog)
      );
    } else {
      this.setDragAndZoomBehavior();
    }
  }

  private  setDragAndZoomBehavior() {
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

  private updateSimulation() {
    this.d3Sim.nodes(this.network.getNodes());
    this.d3Sim.force<ForceLink<GraphNode, Edge>>('link').links(this.network.getEdges())
      .distance((link, i, links) => (link as Edge).getDistance());
    this.d3Sim.alpha(1).restart();
  }

  private setSelectionBehaviors(nodeInteractionBehavior: NodeInteractionBehavior,
                                edgeInteractionBehavior: EdgeInteractionBehavior) {
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
          if (nodeInteractionBehavior !== undefined && nodeInteractionBehavior !== null) {
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
          }
          if (edgeInteractionBehavior !== undefined && edgeInteractionBehavior !== null) {
            const edges = this.network.getEdges();
            let index = -1;
            let d_sqr_min = squaredDistanceThreshold;
            for (let i = edges.length - 1; i >= 0; i--) {
              const edge = edges[i];
              const d_sqr = this.getPointToLineSegmentSquaredDistance(
                (edge.source as GraphNode).x, (edge.source as GraphNode).y,
                (edge.target as GraphNode).x, (edge.target as GraphNode).y,
                this.transform.invertX(this.d3.event.x), this.transform.invertY(this.d3.event.y)
              );
              if (d_sqr < d_sqr_min) {
                d_sqr_min = d_sqr;
                index = i;
              }
            }
            if (index !== -1) {
              return edges[index];
            }
          }
        })
        .on('start', () => false)
        .on('drag', () => false)
        .on('end', () => {
          if (this.d3.event.subject !== undefined && this.d3.event.subject.question !== undefined) {
            const n = this.d3.event.subject as GraphNode;
            const dx = this.transform.invertX(this.d3.event.x) - n.x;
            const dy = this.transform.invertY(this.d3.event.y) - n.y;
            if (Math.pow(n.radius, 2) > Math.pow(dx, 2) + Math.pow(dy, 2)) {
              nodeInteractionBehavior.interactWith(n).then(() => {
                this.updateSimulation();
              });
            }
          } else if (this.d3.event.subject !== undefined && this.d3.event.subject.relation !== undefined) {
            const edge = this.d3.event.subject as Edge;
            const d_sqr = this.getPointToLineSegmentSquaredDistance(
              (edge.source as GraphNode).x, (edge.source as GraphNode).y,
              (edge.target as GraphNode).x, (edge.target as GraphNode).y,
              this.transform.invertX(this.d3.event.x), this.transform.invertY(this.d3.event.y)
            );
            if (d_sqr <= squaredDistanceThreshold) {
              edgeInteractionBehavior.interactWith(edge).then(() => {
                this.updateSimulation();
              });
            }
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
    this.network = new Network();
    let initialSelection = this.selectedQuestions;
    if (initialSelection === undefined || initialSelection.length === 0) {
      initialSelection = ['seed'];
    }
    this.graphViewService.initServiceForSpace(this.spaceId);
    initialSelection.forEach((id) => this.graphViewService.registerQuestionForUpdate(id));
    this.graphViewService.requestUpdate();
    this.loadedSpaceId = this.spaceId;
  }

  private processUpdate(updateData: UpdateData) {
    const context = this.d3Root.nativeElement.getContext('2d');
    const isSelected = this.selectedQuestions !== undefined &&
      this.selectedQuestions.findIndex((id) => id === updateData.question.questionId) !== -1;
    if (this.network.addOrUpdateNode(
        new GraphNode(context, updateData.question.questionId,
          updateData.question, updateData.questionAuthor, updateData.questionVotes,
          updateData.relations, updateData.relationAuthors, updateData.relationVotes, isSelected))) {
      this.updateSimulation();
    }
    if (isSelected) {
      let updateRequired = false;
      updateData.relations.forEach((rel) => {
        if (this.graphViewService.registerQuestionForUpdate(updateData.question.questionId === rel.firstQuestionId ?
            rel.secondQuestionId : rel.firstQuestionId)) {
          updateRequired = true;
        }
      });
      if (updateRequired) {
        this.graphViewService.requestUpdate();
      }
    }
  }
}
