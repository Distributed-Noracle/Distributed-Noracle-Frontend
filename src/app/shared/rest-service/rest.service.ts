///<reference path="../../../../node_modules/@types/node/index.d.ts"/>
import {Injectable} from '@angular/core';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import {Headers, Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Question} from '../rest-data-model/question';
import {Space} from '../rest-data-model/space';
import {Relation} from '../rest-data-model/relation';
import {SpaceSubscription} from '../rest-data-model/spacesubscription';

@Injectable()
export class RestService {
  private BASE_URL = 'https://steen.informatik.rwth-aachen.de:9082/distributed-noracle/v0.5.0';

  constructor(private OidcSecurityService: OidcSecurityService, private Http: Http) {
  }

  public postSpace(space: Space): Observable<Response> {
    return this.Http.post(this.BASE_URL + '/spaces/',
      space,
      {headers: this.getHeaders()}
    );
  }

  public getSpace(spaceId): Observable<Response> {
    return this.Http.get(this.BASE_URL + '/spaces/' + spaceId,
      {headers: this.getMockHeaders()}
    );
  }

  public postQuestion(spaceId, question: Question): Observable<Response> {
    return this.Http.post(this.BASE_URL + '/spaces/' + spaceId + '/questions',
      question,
      {headers: this.getHeaders()}
    );
  }

  public getQuestions(spaceId): Observable<Response> {
    return this.Http.get(this.BASE_URL + '/spaces/' + spaceId + '/questions',
      {headers: this.getMockHeaders()}
    );
  }

  public getQuestion(spaceId, questionId): Observable<Response> {
    return this.Http.get(this.BASE_URL + '/spaces/' + spaceId + '/questions/' + questionId,
      {headers: this.getHeaders()}
    );
  }

  public putQuestion(spaceId, questionId, question: Question): Observable<Response> {
    return this.Http.put(this.BASE_URL + '/spaces/' + spaceId + '/questions/' + questionId,
      question,
      {headers: this.getHeaders()}
    );
  }

  public postRelation(spaceId, relation: Relation): Observable<Response> {
    return this.Http.post(this.BASE_URL + '/spaces/' + spaceId + '/relations',
      relation,
      {headers: this.getHeaders()}
    );
  }

  public getRelations(spaceId): Observable<Response> {
    return this.Http.get(this.BASE_URL + '/spaces/' + spaceId + '/relations',
      {headers: this.getMockHeaders()}
    );
  }

  public getRelation(spaceId, relationId): Observable<Response> {
    return this.Http.get(this.BASE_URL + '/spaces/' + spaceId + '/relations/' + relationId,
      {headers: this.getHeaders()}
    );
  }

  public putRelation(spaceId, relationId, relation: Relation): Observable<Response> {
    return this.Http.put(this.BASE_URL + '/spaces/' + spaceId + '/relations/' + relationId,
      relation,
      {headers: this.getHeaders()}
    );
  }

  public getSpaceSubscriptions(agentId) {
    return this.Http.get(this.BASE_URL + '/agents/' + agentId + '/spacesubscriptions',
      {headers: this.getHeaders()}
    );
  }

  public postSpaceSubscription(agentId, spaceSubscription: SpaceSubscription) {
    return this.Http.post(this.BASE_URL + '/agents/' + agentId + '/spacesubscriptions',
      spaceSubscription,
      {headers: this.getHeaders()}
    );
  }

  private getHeaders() {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    const token = this.OidcSecurityService.getToken();
    if (token !== '') {
      const tokenValue = 'Bearer ' + token;
      headers.append('Authorization', tokenValue);
    }
    return headers;
  }

  private getMockHeaders(){
      const headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
      var user = 'noracle-example-smith';
      var password = 'testtest';
      var base64encodedData = new Buffer(user + ':' + password).toString('base64');
      headers.append('Authorization', 'Basic ' + base64encodedData);
      return headers;
  }
}
