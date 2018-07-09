/**
 * Created by bgoeschlberger on 11.09.2017.
 */
import {QuestionVote} from './question-vote';

export class Question {
  questionId: string;
  text: string;
  spaceId: string;
  authorId: string;
  timestampCreated: string;
  timestampLastModified: string;

  followUps: number;

  /**
   * Don't store state here. This is only for communication with the API.
   * For modifying votes use the [question vote service]{@link '../question-vote'}
   */
  votes?: QuestionVote[];

  constructor() {
  }
}
