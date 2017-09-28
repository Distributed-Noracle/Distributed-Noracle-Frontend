/**
 * Created by bgoeschlberger on 11.09.2017.
 */
export class Relation {
  relationId: string;
  spaceId: string;
  name: string;
  firstQuestionId: string;
  secondQuestionId: string;
  directed: boolean;
  timestampCreated: string;
  timestampLastModified: string;

  constructor() {
  }
}
