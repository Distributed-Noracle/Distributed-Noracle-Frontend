import {Edge} from '../graph-data-model/edge';

/**
 * Node Interaction Behaviors define a specific reaction or behavior if a user interacts with a Node
 */
export abstract class EdgeInteractionBehavior {
  public abstract interactWith(node: Edge): Promise<any>;
}
