import {GraphNode} from '../graph-data-model/graph-node';
import { Space } from '../../../shared/rest-data-model/space';

/**
 * Node Interaction Behaviors define a specific reaction or behavior if a user interacts with a Node
 */
export abstract class NodeInteractionBehavior {
  public abstract interactWith(node: GraphNode, spaceId?: string ): Promise<any>;
}
