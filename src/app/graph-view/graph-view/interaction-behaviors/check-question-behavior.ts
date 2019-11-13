import { NodeInteractionBehavior } from './node-interaction-behavior';
import { Network } from '../graph-data-model/network';
import { AgentService } from 'app/shared/agent/agent.service';
import { GraphNode } from '../graph-data-model/graph-node';
import { longStackSupport } from 'q';

export class CheckQuestionsBehaviour extends NodeInteractionBehavior {

    async interactWith(node: import("../graph-data-model/graph-node").GraphNode, spaceId?: string): Promise<any> {
        

        const agentId = (await this.agentService.getAgent()).agentid;
        var agentName = (await this.agentService.getAgentName(agentId));
        var nodes = this.network.getNodes();
        var numberOfSuitableQuestions = 0;
        nodes.forEach(node => {
            if(node.questionAuthor == agentName && this.isSuitable(node))
                numberOfSuitableQuestions++;
        });

        var code_part = 'CODE_PART_1'; // Enter code from MTurk here!
        var numberOfNeccesaryQuestions = 10; // Enter number of questions the Turkers have to ask here

        var appendix = numberOfSuitableQuestions < numberOfNeccesaryQuestions? //
            "Please ask " +(numberOfNeccesaryQuestions- numberOfSuitableQuestions)+ ' more questions.' : //
            "You have reached the min. number of asked questions.\nThank you!\nHere is the first code part: "+code_part;

        window.alert('The current User (' + agentName +")\n"+ 'asked ' + numberOfSuitableQuestions+ ' suitable questions.\n' + appendix);
        return null;
    }

    constructor(private network: Network, private agentService: AgentService){
        super();
    }

    isSuitable(node : GraphNode): boolean{
        var acceptable = true;

        const text = node.question.text;
        const textlength = text.length;
        acceptable = acceptable && textlength >= 5;
        acceptable = acceptable && textlength <= 100;
        acceptable = acceptable && text.includes('?');

        return acceptable;
    }
}