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
  authorId: string;
  timestampCreated: string;
  timestampLastModified: string;

  constructor() {
  }

  public equals(r: Relation) {
    return this.relationId === r.relationId &&
    this.spaceId === r.spaceId &&
    this.name === r.name &&
    this.firstQuestionId === r.firstQuestionId &&
    this.secondQuestionId === r.secondQuestionId &&
    this.directed === r.directed &&
    this.authorId === r.authorId &&
    this.timestampCreated === r.timestampCreated &&
    this.timestampLastModified === r.timestampLastModified;
  }
}
