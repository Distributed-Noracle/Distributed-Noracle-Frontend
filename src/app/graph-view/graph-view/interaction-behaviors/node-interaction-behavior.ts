import {GraphNode} from '../graph-data-model/graph-node';

/**
 * Node Interaction Behaviors define a specific reaction or behavior if a user interacts with a Node
 */
export abstract class NodeInteractionBehavior {
  public abstract interactWith(node: GraphNode): Promise<any>;
}
