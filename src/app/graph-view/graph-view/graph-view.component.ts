import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
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
import {BehaviorSubject, Subscription} from 'rxjs';
import {AgentService} from '../../shared/agent/agent.service';
import {QuestionVoteService} from '../../shared/question-vote/question-vote.service';
import {EdgeInteractionBehavior} from './interaction-behaviors/edge-interaction-behavior';
import {EditRelationBehavior} from './interaction-behaviors/edit-relation-behavior';
import {UpdateData} from './graph-data-model/update-data';
import {MatDialog} from '@angular/material/dialog';

import * as d3 from "d3";
import { D3DragEvent, D3ZoomEvent } from 'd3';

@Component({
  selector: 'dnor-graph-view',
  templateUrl: './graph-view.component.html',
  styleUrls: ['./graph-view.component.css']
})
export class GraphViewComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @ViewChild('d3root') private d3Root: ElementRef;
  @Input() height = 800;
  @Input() width = 1100;
  @Input() private interactionMode: GraphInteractionMode;
  @Input() private spaceId = 'dummy';
  @Input() private selectedQuestions: string[];

  private loadedSpaceId;
  private network: Network;
  private transform: ZoomTransform;
  private hasDragSubject = false;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private d3Sim: Simulation<GraphNode, Edge>;
  private activatedInteractionMode: GraphInteractionMode;
  private updateSubscription: Subscription;
  private recommendingSubscription: Subscription;


  constructor(private graphViewService: GraphViewService, private agentService: AgentService, private dialog: MatDialog) {
    this.transform = d3.zoomIdentity;
  }

  ngOnInit(): void {
    this.recommendingSubscription = this.graphViewService.recommending.subscribe(questions => {
      if (questions !== undefined && questions.length > 0) {
        this.selectedQuestions = questions;
        this.initData();
        this.initVisualization();
      }
    });
  }

  ngAfterViewInit(): void {
    this.canvas = this.d3Root.nativeElement;
    this.context = this.canvas.getContext('2d');

    this.d3Sim = d3.forceSimulation() as Simulation<GraphNode, Edge>;
    this.d3Sim.force('link', d3.forceLink<GraphNode, Edge>().id((n, i, d) => n.id));
    this.d3Sim.force('charge', d3.forceManyBody());

    this.d3Sim.force('center', d3.forceCenter(this.width / 2, this.height / 2));
    this.d3Sim.force('collide', d3.forceCollide((node: GraphNode) => (node as GraphNode).radius * 1.2));

    this.updateSubscription = this.graphViewService.update.subscribe(updateData => this.processUpdate(updateData));
    this.initData();
    this.initVisualization();
    this.updateInteractionMode();
  }

  ngOnDestroy(): void {
    this.updateSubscription.unsubscribe();
    this.recommendingSubscription.unsubscribe();
    this.graphViewService.initServiceForSpace(null);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.d3Sim) {
      if (changes['selectedQuestions']) {
        this.selectedQuestions = changes['selectedQuestions'].currentValue;
      }

      if (this.spaceId !== this.loadedSpaceId) {
        this.initData();
        this.initVisualization();
        this.updateInteractionMode();
      }

      this.network.getNodes().forEach((node) => {
        node.isSelected = (this.selectedQuestions.indexOf(node.id) !== -1);
      });
      // visual update of selection
      this.updateInteractionMode();
    }
  }

  initVisualization(): void {
    const context = this.context;
    const d3Sim = this.d3Sim;

    d3Sim.nodes(this.network.getNodes()).on('tick', () => {
        context.save();
        context.clearRect(0, 0, this.width, this.height);

        const seedQuestion = this.graphViewService.getSeedQuestion();
        if (seedQuestion !== null) {
          context.fillStyle = '#bbb';
          context.font = 'bold italic 25px sans-serif';
          context.textAlign = 'center';
          context.textBaseline = 'top';

          context.fillText(seedQuestion.text, this.width / 2, 20);
        }

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

  private updateInteractionMode(): void {
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
    } else if (this.interactionMode === GraphInteractionMode.Inspect) {
      this.setSelectionBehaviors(
        new EditQuestionBehavior(this.graphViewService, this.agentService, this.dialog),
        new EditRelationBehavior(this.graphViewService, this.agentService, this.dialog)
      );
    } else {
      this.setDragAndZoomBehavior();
    }

    this.activatedInteractionMode = this.interactionMode;
  }

  private setDragAndZoomBehavior() {
    const canvas = this.canvas;
    const d3Sim = this.d3Sim;

    // drag behavior
    d3.select(canvas)
      .call(d3.drag()
        .container(canvas)
        .subject((event: D3DragEvent<any, any, any>) => {
          this.hasDragSubject = false;
          const nodes = this.network.getNodes();
          for (let i = nodes.length - 1; i >= 0; i--) {
            const n = nodes[i];
            const dx = this.transform.invertX(event.x) - n.x;
            const dy = this.transform.invertY(event.y) - n.y;
            if (Math.pow(n.radius, 2) > Math.pow(dx, 2) + Math.pow(dy, 2)) {
              n.x = this.transform.applyX(n.x);
              n.y = this.transform.applyY(n.y);
              this.hasDragSubject = true;
              return n;
            }
          }
        })
        .on('start', (event: D3DragEvent<any, any, any>) => {
          if (!event.active) {
            d3Sim.alphaTarget(0.3).restart();
          }
          event.subject.fx = this.transform.invertX(event.x);
          event.subject.fy = this.transform.invertY(event.y);
        })
        .on('drag', (event: D3DragEvent<any, any, any>) => {
          event.subject.fx = this.transform.invertX(event.x);
          event.subject.fy = this.transform.invertY(event.y);
        })
        .on('end', (event: D3DragEvent<any, any, any>) => {
          if (!event.active) {
            d3Sim.alphaTarget(0);
          }
          event.subject.fx = null;
          event.subject.fy = null;
          this.updateSimulation();
        })
      )
      .call(d3.zoom()
        .scaleExtent([1 / 4, 4])
        .filter((event: D3ZoomEvent<any, any>) => {
          if (event.type === 'mousedown' || event.type === 'touchstart') {
            if (this.hasDragSubject) {
              return false;
            }
          }
          return true;
        }).on('zoom', (event: D3ZoomEvent<any, any>) => {
          this.transform = event.transform;
          this.d3Sim.restart();
        }));
  }

  private updateSimulation() {
    this.d3Sim.nodes(this.network.getNodes());
    this.d3Sim.force<ForceLink<GraphNode, Edge>>('link').links(this.network.getEdges())
      .distance((link, i, links) => (link as Edge).getDistance());
    this.d3Sim.alpha(1).restart();
    this.network.getNodes().forEach(node => {
      node.question.followUps = this.network.countInvisibleNeighbors(node);
    });
  }

  private setSelectionBehaviors(nodeInteractionBehavior: NodeInteractionBehavior,
                                edgeInteractionBehavior: EdgeInteractionBehavior) {
    const canvas = this.canvas;
    const squaredDistanceThreshold = 100;

    // drag behavior
    d3.select(canvas)
      .call(d3.drag()
        .container(canvas)
        .subject((event: D3DragEvent<any, any, any>) => {
          this.hasDragSubject = false;
          if (nodeInteractionBehavior !== undefined && nodeInteractionBehavior !== null) {
            const nodes = this.network.getNodes();
            for (let i = nodes.length - 1; i >= 0; i--) {
              const n = nodes[i];
              const dx = this.transform.invertX(event.x) - n.x;
              const dy = this.transform.invertY(event.y) - n.y;
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
                this.transform.invertX(event.x), this.transform.invertY(event.y)
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
        //.on('start', (event: D3DragEvent<any, any, any>) => {})
        //.on('drag', (event: D3DragEvent<any, any, any>) => {})
        .on('end', (event: D3DragEvent<any, any, any>) => {
          if (event.subject !== undefined && event.subject.question !== undefined) {
            const n = event.subject as GraphNode;
            const dx = event.dx;
            const dy = event.dy;
            if (Math.pow(n.radius, 2) > Math.pow(dx, 2) + Math.pow(dy, 2)) {
              nodeInteractionBehavior.interactWith(n).then(() => {
                this.updateSimulation();
              });
            }
          } else if (event.subject !== undefined && event.subject.relation !== undefined) {
            const edge = event.subject as Edge;
            const d_sqr = this.getPointToLineSegmentSquaredDistance(
              (edge.source as GraphNode).x, (edge.source as GraphNode).y,
              (edge.target as GraphNode).x, (edge.target as GraphNode).y,
              this.transform.invertX(event.x), this.transform.invertY(event.y)
            );
            if (d_sqr <= squaredDistanceThreshold) {
              edgeInteractionBehavior.interactWith(edge).then(() => {
                this.updateSimulation();
              });
            }
          }
        }))
      .call(d3.zoom().filter(() => false));
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
    const seedQuestion = this.graphViewService.getSeedQuestion();
    const isSeed = (seedQuestion ? seedQuestion.questionId : null) === updateData.question.questionId;
    const node = new GraphNode(context, updateData.question.questionId,
      updateData.question, updateData.questionAuthor, updateData.questionVotes,
      updateData.relations, updateData.relationAuthors, updateData.relationVotes,
      isSelected, isSeed);
    if (this.network.addOrUpdateNode(node)) {
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
