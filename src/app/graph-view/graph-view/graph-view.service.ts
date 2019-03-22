import {Injectable} from '@angular/core';
import {Question} from '../../shared/rest-data-model/question';
import {Relation} from '../../shared/rest-data-model/relation';
import {QuestionService} from '../../shared/question/question.service';
import {RelationService} from '../../shared/relation/relation.service';
import {Subject, Observable} from 'rxjs';
import {MyspacesService} from '../../shared/myspaces/myspaces.service';
import {Router} from '@angular/router';
import {RelationType} from './graph-data-model/relation-type.enum';
import {QuestionVoteService} from '../../shared/question-vote/question-vote.service';
import {RelationVoteService} from '../../shared/relation-vote/relation-vote.service';
import {QuestionVote} from '../../shared/rest-data-model/question-vote';
import {RelationVote} from '../../shared/rest-data-model/relation-vote';
import {AgentService} from '../../shared/agent/agent.service';
import {UpdateData} from './graph-data-model/update-data';
import {AuthGuardService} from '../../shared/auth-guard/auth-guard.service';

@Injectable()
export class GraphViewService {

  private questions: Question[] = [];
  private relations: Relation[] = [];
  private questionVotes: Map<string, QuestionVote[]> = new Map<string, QuestionVote[]>();
  private relationVotes: Map<string, RelationVote[]> = new Map<string, RelationVote[]>();
  private questionAuthors: Map<string, string> = new Map<string, string>();
  private relationAuthors: Map<string, string> = new Map<string, string>();
  private spaceId = null;
  private isPollScheduled = false;
  private observedQuestionIds: string[] = [];
  private update = new Subject<UpdateData>();

  constructor(private questionService: QuestionService, private relationService: RelationService,
              private questionVoteService: QuestionVoteService, private relationVoteService: RelationVoteService,
              private myspacesService: MyspacesService, private agentService: AgentService,
              private authGuardService: AuthGuardService, private router: Router) {
  }

  public initServiceForSpace(spaceId: string) {
    this.spaceId = spaceId;
    this.observedQuestionIds = [];
  }

  public getUpdateObservable(): Observable<UpdateData> {
    return this.update.asObservable();
  }

  public registerQuestionForUpdate(questionId: string): boolean {
    if (this.observedQuestionIds.indexOf(questionId) === -1) {
      this.observedQuestionIds.push(questionId);
      return true;
    }
    return false;
  }

  public unregisterQuestionForUpdate(questionId: string): boolean {
    const index = this.observedQuestionIds.indexOf(questionId);
    if (index !== -1) {
      this.observedQuestionIds.splice(index, 1);
      return true;
    }
    return false;
  }

  public addQuestionToParentAndRegisterForUpdate(question: Question, parentQuestionId: string) {
    this.questionService.postQuestion(this.spaceId, question).then((q) => {
      const relation = new Relation();
      relation.firstQuestionId = parentQuestionId;
      relation.secondQuestionId = q.questionId;
      relation.name = RelationType[RelationType.FollowUp];
      relation.directed = true;
      this.relationService.postRelation(this.spaceId, relation).then((r) => {
        this.questions.push(q);
        this.relations.push(r);
        // there cannot be votes on the newly created question and relation yet
        this.questionVotes.set(q.questionId, []);
        this.relationVotes.set(r.relationId, []);
        this.questionAuthors.set(q.questionId, this.authGuardService.getUserData().preferred_username);
        this.relationAuthors.set(r.relationId, this.authGuardService.getUserData().preferred_username);
        this.updateSelectionRouteParams(q.questionId, true);
        this.registerQuestionForUpdate(q.questionId);
        this.notifyObservers();
      });
    });
  }

  public updateQuestion(questionId: string, text: string) {
    const question = new Question();
    question.text = text;
    return this.questionService.putQuestion(this.spaceId, questionId, question).then((newQ) => {
      this.questions.splice(this.questions.findIndex((oldQ) => oldQ.questionId === newQ.questionId), 1);
      this.questions.push(newQ);
      this.notifyObservers();
      return newQ;
    });
  }

  public updateRelation(relationId: string, relationType: string) {
    const relation = new Relation();
    relation.name = relationType;
    return this.relationService.putRelation(this.spaceId, relationId, relation).then((newR) => {
      this.relations.splice(this.relations.findIndex((oldR) => oldR.relationId === newR.relationId), 1);
      this.relations.push(newR);
      this.notifyObservers();
      return newR;
    });
  }

  public updateQuestionVote(questionId: string, agentId: string, vote: number) {
    const questionVote = new QuestionVote();
    questionVote.value = vote;
    return this.questionVoteService.putQuestionVote(this.spaceId, questionId, agentId, questionVote)
      .then((newQV) => {
        const qvArr = this.questionVotes.get(questionId);
        const index = qvArr.findIndex((oldQV) => oldQV.voterAgentId === newQV.voterAgentId);
        if (index !== -1) {
          qvArr.splice(index, 1);
        }
        qvArr.push(newQV);
        this.notifyObservers();
        return newQV;
      });
  }

  public updateRelationVote(relationId: string, agentId: string, vote: number) {
    const relationVote = new RelationVote();
    relationVote.value = vote;
    return this.relationVoteService.putRelationVote(this.spaceId, relationId, agentId, relationVote)
      .then((newRV) => {
        const rvArr = this.relationVotes.get(relationId);
        const index = rvArr.findIndex((oldRV) => oldRV.voterAgentId === newRV.voterAgentId);
        if (index !== -1) {
          rvArr.splice(index, 1);
        }
        rvArr.push(newRV);
        this.notifyObservers();
        return newRV;
      });
  }

  public addRelation(relation: Relation) {
    this.relationService.postRelation(this.spaceId, relation).then((r) => {
      this.relations.push(r);
      this.relationVotes.set(r.relationId, []);
      this.relationAuthors.set(r.relationId, this.authGuardService.getUserData().preferred_username);
      this.notifyObservers();
    });
  }

  public requestUpdate() {
    if (this.spaceId !== null) {
      this.fetchAll(this.spaceId);
      this.fetchSubscribers(this.spaceId);
    }
  }

  public updateSelectionRouteParams(id: string, isSelected: boolean) {
    let sq = this.router.routerState.snapshot.root.queryParams['sq'];
    if (sq === undefined) {
      sq = [];
    } else {
      sq = JSON.parse(sq);
    }
    const i = sq.indexOf(id);
    if (isSelected && i === -1) {
      sq.push(id);
    } else if (!isSelected && i !== -1) {
      sq.splice(i, 1);
    }
    this.myspacesService.updateSelectionOfSubscription(this.spaceId, sq);
    this.router.navigate([], {
      queryParams: {
        sq: JSON.stringify(sq)
      }
    });
  }

  public getSeedQuestion(): Question {
    return this.questions.length > 0 ? this.questions[0] : null;
  }

  private getQuestion(questionId: string): Question {
    return this.questions.find((q) => q.questionId === questionId);
  }

  private getRelationsForQuestion(questionId: string): Relation[] {
    return this.relations.filter((r) => r.firstQuestionId === questionId || r.secondQuestionId === questionId);
  }

  private getVotesForQuestion(questionId: string): QuestionVote[] {
    return this.questionVotes.get(questionId);
  }

  private getAuthorForQuestion(questionId: string): string {
    return this.questionAuthors.get(questionId);
  }

  private getVotesForRelation(relationId: string): RelationVote[] {
    return this.relationVotes.get(relationId);
  }

  private getAuthorForRelation(relationId: string): string {
    return this.relationAuthors.get(relationId);
  }

  private fetchAll(spaceId: string) {
    // load all questions and all relations of the space
    const questionsAndRelationsPromise = Promise.all([
      this.questionService.getQuestionsOfSpace(spaceId).then((res) => {
        this.questions = res;
        this.questions.forEach(q => this.questionVotes.set(q.questionId, q.votes));
        const seedIndex = this.observedQuestionIds.indexOf('seed');
        if (seedIndex !== -1 && this.questions.length > 0) {
          this.observedQuestionIds.splice(seedIndex, 1);
          this.observedQuestionIds.push(this.questions[0].questionId);
        }
        return this.questions;
      }),
      this.relationService.getRelationsOfSpace(spaceId).then((res) => {
        this.relations = res;
        this.relations.forEach(r => this.relationVotes.set(r.relationId, r.votes));
      })
    ]);

    // when all questions and relations are loaded
    questionsAndRelationsPromise.then(() => {
      if (this.spaceId === spaceId) {
        // load all related data for observed questions and relations
        const allRelatedDataPromise = Promise.all(this.questions.filter(
          q => this.observedQuestionIds.indexOf(q.questionId) !== -1)
          .map(q => this.loadQuestionRelatedData(spaceId, q))
          .concat(
            this.relations.filter(r => this.observedQuestionIds.indexOf(r.firstQuestionId) !== -1
            && this.observedQuestionIds.indexOf(r.secondQuestionId) !== -1)
              .map(r => this.loadRelationRelatedData(spaceId, r))));

        // when all related data is fetched
        allRelatedDataPromise.then(() => {
          this.notifyObservers();
          this.schedulePolling();
        });
      }
    });
  }

  private fetchSubscribers(spaceId: string) {
    this.myspacesService.getSpaceSubscribers(this.spaceId);
  }

  private loadRelationRelatedData(spaceId: string, r: Relation): Promise<any> {
    return Promise.all([
      this.agentService.getAgentName(r.authorId)
        .then(ra => this.relationAuthors.set(r.relationId, ra))
    ]);
  }

  private loadQuestionRelatedData(spaceId: string, q: Question): Promise<any> {
    return Promise.all([
      this.agentService.getAgentName(q.authorId)
        .then(qa => this.questionAuthors.set(q.questionId, qa))
    ]);
  }

  private notifyObservers() {
    this.observedQuestionIds.forEach((qId) => {
      if (qId === 'seed' && this.questions.length > 0) {
        // trick that allows seed-question subscription without knowing the id
        qId = this.questions[0].questionId;
      }
      const question = this.getQuestion(qId);
      const questionAuthor = this.questionAuthors.get(qId);
      const votesForQuestion = this.getVotesForQuestion(qId);
      const relationsForQuestion = this.getRelationsForQuestion(qId);
      const votesForRelations = relationsForQuestion.map(r => this.getVotesForRelation(r.relationId));
      const authorsForRelations = relationsForQuestion.map(r => this.getAuthorForRelation(r.relationId));
      if (question !== undefined && relationsForQuestion !== undefined) {
        this.update.next({
          question: question,
          questionAuthor: questionAuthor,
          questionVotes: votesForQuestion !== undefined ? votesForQuestion : [],
          relations: relationsForQuestion,
          relationAuthors: authorsForRelations,
          relationVotes: votesForRelations !== undefined ? votesForRelations : []
        });
      }
    });
  }

  private schedulePolling() {
    if (!this.isPollScheduled) {
      this.isPollScheduled = true;
      window.setTimeout(() => this.poll(), 5000);
    }
  }

  private poll() {
    this.isPollScheduled = false;
    this.requestUpdate();
  }

}
