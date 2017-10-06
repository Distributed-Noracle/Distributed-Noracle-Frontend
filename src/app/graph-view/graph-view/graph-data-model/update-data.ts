import {RelationVote} from '../../../shared/rest-data-model/relation-vote';
import {QuestionVote} from '../../../shared/rest-data-model/question-vote';
import {Question} from '../../../shared/rest-data-model/question';
import {Relation} from '../../../shared/rest-data-model/relation';

/**
 * Class to inform UI about data changes
 * it contains data for one node and it's edges
 * NOTE: relations, relationAuthors and relationVotes have to be in the same order!
 * (i.e. relation[i], relationAuthors[i] and relationVotes[i] belong together!
 */
export class UpdateData {
  question: Question;
  questionAuthor: string;
  questionVotes: QuestionVote[];
  relations: Relation[];
  relationAuthors: string[];
  relationVotes: RelationVote[][];
}
