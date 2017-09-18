import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {DataSet, Network} from 'vis';
import {TextlayoutService} from '../textlayout.service';
import {SpaceService} from '../space.service';
import {QuestionService} from '../question.service';
import {RelationService} from '../relation.service';

@Component({
  selector: 'app-graph-view',
  templateUrl: './graph-view.component.html',
  styleUrls: ['./graph-view.component.css']
})
export class GraphViewComponent implements OnInit, AfterViewInit {
  @ViewChild('graphview') private graphView;
  private networkData;
  private networkOptions;
  private network;

  constructor(private TextlayoutService: TextlayoutService, private SpaceService: SpaceService,
              private QuestionService: QuestionService, private RelationService: RelationService) {
  }

  ngOnInit() {
    this.initData();
  }

  ngAfterViewInit() {
    // initialize your network!
    this.network = new Network(this.graphView.nativeElement, this.networkData, this.networkOptions);
    this.network.on('stabilizationIterationsDone', () => {
      this.network.setOptions({physics: false});
    });
    this.network.setSelection({nodes: [1]});
  }

  initData() {
    this.SpaceService.getSpace().then((resp) => {
      console.log(resp);
    });
    const nodes = new DataSet([
      {
        id: 1,
        label: this.TextlayoutService.wrapTextCircular('What is the most imporatant challenge for European Youth Workers?'),
        title: 'asked by Bernhard'
      },
      {
        id: 11,
        label: this.TextlayoutService.wrapTextCircular('How do we finance our work'),
        title: 'asked by Bernhard'
      },
      {
        id: 111,
        label: this.TextlayoutService.wrapTextCircular('Are we administrators or pedagogues?'),
        title: 'asked by Bernhard'
      },
      {
        id: 112,
        label: this.TextlayoutService.wrapTextCircular('How do we finance our lives?'),
        title: 'asked by Bernhard'
      },
      {
        id: 12,
        label: this.TextlayoutService.wrapTextCircular('Do our intentions match our actions?'),
        title: 'asked by Bernhard'
      },
      {
        id: 121,
        label: this.TextlayoutService.wrapTextCircular('Do we have the same intentions?'),
        title: 'asked by Bernhard'
      },
      {
        id: 122,
        label: this.TextlayoutService.wrapTextCircular('How can you evaluate the connection between ideology and practice?'),
        title: 'asked by Bernhard'
      },
      {
        id: 13,
        label: this.TextlayoutService.wrapTextCircular(
          'If you have an answer, what question have you asked yourself to arrive at that answer?'),
        title: 'asked by Bernhard'
      },
      {
        id: 131,
        label: this.TextlayoutService.wrapTextCircular('What are the barriers to participation?'),
        title: 'asked by Bernhard'
      },
      {
        id: 1311,
        label: this.TextlayoutService.wrapTextCircular('Which barriers do we think we can address?'),
        title: 'asked by Bernhard'
      },
      {
        id: 1312,
        label: this.TextlayoutService.wrapTextCircular('Do we even know who we are serving?'),
        title: 'asked by Bernhard'
      },
      {
        id: 14,
        label: this.TextlayoutService.wrapTextCircular('Why am I doing this'),
        title: 'asked by Bernhard'
      },
      {
        id: 15,
        label: this.TextlayoutService.wrapTextCircular('How do I know what I do is effective?'),
        title: 'asked by Bernhard'
      },
      {
        id: 16,
        label: this.TextlayoutService.wrapTextCircular('Who is actually benefiting from our work'),
        title: 'asked by Bernhard'
      }
    ]);

    // create an array with edges
    const edges = new DataSet([
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
    ]);

    // create a network
    const container = this.graphView.nativeElement;

    // provide the data in the vis format
    this.networkData = {
      nodes: nodes,
      edges: edges
    };
    this.networkOptions = {
      width: (window.innerWidth - 25) + 'px',
      height: (window.innerHeight - 100) + 'px',
      manipulation: {
        enabled: true,
        addNode: (nodeData, callback) => {
          nodeData.label = this.TextlayoutService.wrapTextCircular(prompt('Please enter the name of the node', 'new node'));
          callback(nodeData);
        },
        addEdge: (edgeData, callback) => {
          if (edgeData.from === edgeData.to) {
            return alert('Self relations are not supported');
          } else {
            edgeData.label = this.TextlayoutService.wrapTextCircular(prompt('Please enter the name of the edge', 'new relation'));
            callback(edgeData);
          }
        },
        editNode: (nodeData, callback) => {
          nodeData.label = this.TextlayoutService.wrapTextCircular(prompt('Please enter the name of the node', nodeData.label));
          callback(nodeData);
        },
        editEdge: {
          editWithoutDrag: (edgeData, callback) => {
            edgeData.label = this.TextlayoutService.wrapTextCircular(prompt('Please enter the name of the edge', edgeData.label));
            edgeData.to = edgeData.to.id;
            edgeData.from = edgeData.from.id;
            callback(edgeData);
          }
        }
      },
      physics: {
        forceAtlas2Based: {
          avoidOverlap: 1
        },
        solver: 'forceAtlas2Based'
      }
    };
  }

  autolayout() {
    this.network.setOptions({physics: true});
    this.network.stabilize();
  }

}
