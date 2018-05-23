import { Vote } from './vote';

/**
 * Created by bgoeschlberger on 11.09.2017.
 */
export class QuestionVote extends Vote {
  value: number;
  voterAgentId: string;
}
