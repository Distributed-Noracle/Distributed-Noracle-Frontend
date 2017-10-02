import {Injectable} from '@angular/core';
import {Question} from '../../shared/rest-data-model/question';
import {Relation} from '../../shared/rest-data-model/relation';
import {QuestionService} from '../../shared/question/question.service';
import {RelationService} from '../../shared/relation/relation.service';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class GraphViewService {

  private questions: Question[] = [];
  private relations: Relation[] = [];
  private spaceId = 'dummy';
  private isPollScheduled = false;
  private observedQuestionIds: string[] = [];
  private update = new Subject<{ question: Question, relations: Relation[] }>();

  constructor(private questionService: QuestionService, private relationService: RelationService) {
  }

  public initServiceForSpace(spaceId: string) {
    this.spaceId = spaceId;
    this.observedQuestionIds = [];
  }

  public getUpdateObservable(): Observable<{ question: Question, relations: Relation[] }> {
    return this.update;
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

  public requestUpdate() {
    if (this.spaceId === 'dummy') {
      this.initDummyData(this.spaceId);
    } else {
      this.fetchAll(this.spaceId);
    }
  }

  private getQuestion(questionId: string): Question {
    return this.questions.find((q) => q.questionId === questionId);
  }

  private getRelationsForQuestion(questionId: string): Relation[] {
    return this.relations.filter((r) => r.firstQuestionId === questionId || r.secondQuestionId === questionId);
  }

  private fetchAll(spaceId: string) {
    Promise.all([this.questionService.getQuestionsOfSpace(spaceId).then((res) =>
      this.questions = res),
      this.relationService.getRelationsOfSpace(spaceId).then((res) =>
        this.relations = res)]).then(() => {
      if (this.spaceId === spaceId) {
        this.notifyObservers();
        this.schedulePolling();
      }
    });
  }

  private notifyObservers() {
    this.observedQuestionIds.forEach((qId) => {
      if (qId === 'seed') {
        // trick that allows seed-question subscription without knowing the id
        qId = this.questions[0].questionId;
      }
      this.update.next({question: this.getQuestion(qId), relations: this.getRelationsForQuestion(qId)});
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
    if (this.spaceId !== 'dummy') {
      this.fetchAll(this.spaceId);
    }
  }

  private initDummyData(spaceId: string) {
    this.questions = [
      {
        id: 1,
        label: 'What is the most imporatant challenge for European Youth Workers?',
        title: 'asked by Bernhard'
      },
      {
        id: 11,
        label: 'How do we finance our work',
        title: 'asked by Bernhard'
      },
      {
        id: 111,
        label: 'Are we administrators or pedagogues?',
        title: 'asked by Bernhard'
      },
      {
        id: 112,
        label: 'How do we finance our lives?',
        title: 'asked by Bernhard'
      },
      {
        id: 12,
        label: 'Do our intentions match our actions?',
        title: 'asked by Bernhard'
      },
      {
        id: 121,
        label: 'Do we have the same intentions?',
        title: 'asked by Bernhard'
      },
      {
        id: 122,
        label: 'How can you evaluate the connection between ideology and practice?',
        title: 'asked by Bernhard'
      },
      {
        id: 13,
        label: 'If you have an answer, what question have you asked yourself to arrive at that answer?',
        title: 'asked by Bernhard'
      },
      {
        id: 131,
        label: 'What are the barriers to participation?',
        title: 'asked by Bernhard'
      },
      {
        id: 1311,
        label: 'Which barriers do we think we can address?',
        title: 'asked by Bernhard'
      },
      {
        id: 1312,
        label: 'Do we even know who we are serving?',
        title: 'asked by Bernhard'
      },
      {
        id: 14,
        label: 'Why am I doing this',
        title: 'asked by Bernhard'
      },
      {
        id: 15,
        label: 'How do I know what I do is effective?',
        title: 'asked by Bernhard'
      },
      {
        id: 16,
        label: 'Who is actually benefiting from our work',
        title: 'asked by Bernhard'
      }
    ].map((obj) => {
      const q = new Question();
      q.questionId = obj.id.toString();
      q.text = obj.label;
      return q;
    });
    this.relations = [
      {from: 1, to: 11, label: 'follow up', title: 'related by Bernhard', arrows: 'to'},
      {from: 1, to: 12, label: 'follow up', title: 'related by Bernhard', arrows: 'to'},
      {from: 1, to: 13, label: 'follow up', title: 'related by Bernhard', arrows: 'to'},
      {from: 1, to: 14, label: 'follow up', title: 'related by Bernhard', arrows: 'to'},
      {from: 1, to: 15, label: 'follow up', title: 'related by Bernhard', arrows: 'to'},
      {from: 1, to: 16, label: 'follow up', title: 'related by Bernhard', arrows: 'to'},
      {from: 11, to: 111, label: 'follow up', title: 'related by Bernhard', arrows: 'to'},
      {from: 11, to: 112, label: 'follow up', title: 'related by Bernhard', arrows: 'to'},
      {from: 12, to: 121, label: 'follow up', title: 'related by Bernhard', arrows: 'to'},
      {from: 12, to: 122, label: 'follow up', title: 'related by Bernhard', arrows: 'to'},
      {from: 13, to: 131, label: 'follow up', title: 'related by Bernhard', arrows: 'to'},
      {from: 131, to: 1311, label: 'follow up', title: 'related by Bernhard', arrows: 'to'},
      {from: 131, to: 1312, label: 'follow up', title: 'related by Bernhard', arrows: 'to'},
    ].map((obj) => {
      const r = new Relation();
      r.relationId = '[' + obj.from + '][' + obj.to + ']';
      r.firstQuestionId = obj.from.toString();
      r.secondQuestionId = obj.to.toString();
      r.name = obj.label;
      r.directed = obj.arrows !== undefined;
      return r;
    });
    this.notifyObservers();
  }
}
