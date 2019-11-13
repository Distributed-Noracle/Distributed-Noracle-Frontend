import { NodeInteractionBehavior } from './node-interaction-behavior';
import { Network } from '../graph-data-model/network';
import { GraphNode } from '../graph-data-model/graph-node';
import { GraphViewService } from '../graph-view.service';
import { ChangeNodeSelectionBehavior } from './change-node-selection-behavior';

export class ExpandWholeGraphBehaviour extends ChangeNodeSelectionBehavior{


    public interactWith(node: import("../graph-data-model/graph-node").GraphNode, spaceId?: string): Promise<any> {
        
        // var hasSelectedMoreNodes = true
        // var count = 0
        // while(hasSelectedMoreNodes == true && count < 10){
        //     count ++;
        //     hasSelectedMoreNodes = false;
        //     this.network.getNodes().forEach( node => {
        //         if(this.network.countInvisibleNeighbors(node) > 0){
        //             hasSelectedMoreNodes = true
        //             this.selectNode(node);            
        //             this.graphViewService.registerQuestionForUpdate(node.question.questionId);               
        //         }                
        //     });            
        // }
        // this.graphViewService.requestUpdate(); 
        // console.log("count = "+ count)


        
        // var questions = this.graphViewService.getAllQuestions()        
        // console.log(questions.length);

        this.graphViewService.selectAllNodes();
        this.network.getNodes().forEach(node => {
            this.selectNode(node);
        });
        

        return Promise.resolve(node);
    }


    constructor (network : Network, graphViewService : GraphViewService){
        super(network, graphViewService);
    }
}