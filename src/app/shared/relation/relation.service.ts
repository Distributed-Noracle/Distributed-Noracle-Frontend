import {Injectable} from '@angular/core';
import {Relation} from '../rest-data-model/relation';
import {RestHelperService} from '../rest-helper/rest-helper.service';

@Injectable()
export class RelationService {

  constructor(private restHelperService: RestHelperService) {
  }

  public getRelationsOfSpace(id): Promise<Relation[]> {
    // TODO: proper pagination
    return this.restHelperService.get(`/spaces/${id}/relations?limit=1000`).toPromise().then((res) => {
      return res.json() as Relation[];
    });
  }

  public putRelation(spaceId: string, relationId: string, relation: Relation): Promise<Relation> {
    return this.restHelperService.put(`/spaces/${spaceId}/relations/${relationId}`, relation).toPromise()
      .then((r) => r.json() as Relation);
  }

  public postRelation(spaceId: string, relation: Relation): Promise<Relation> {
    return this.restHelperService.post(`/spaces/${spaceId}/relations`, relation).toPromise().then((res) => {
      return this.restHelperService.getAbsoulte(res.headers.get('location')).toPromise()
        .then((r) => r.json() as Relation);
    });
  }

}
