import { Injectable } from '@angular/core';
import {RestService} from '../shared/rest-service/rest.service';
import {Relation} from '../shared/rest-data-model/relation';

@Injectable()
export class RelationService {

  constructor(private restService: RestService) { }

  public getRelationsOfSpace(id): Promise<Relation[]> {
    return this.restService.getRelations(id).toPromise().then((res) => {
      return res.json() as Relation[];
    });

  }

}
