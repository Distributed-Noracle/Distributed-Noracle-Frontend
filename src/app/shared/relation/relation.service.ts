import {Injectable} from '@angular/core';
import { environment } from 'src/environments/environment';
import {Relation} from '../rest-data-model/relation';
import {RestHelperService} from '../rest-helper/rest-helper.service';

@Injectable()
export class RelationService {

  constructor(private restHelperService: RestHelperService) {
  }

  public getRelationsOfSpace(id): Promise<Relation[]> {
    // TODO: proper pagination
    return this.restHelperService.get(`/spaces/${id}/relations?limit=1000`)
      .then((res: Relation[]) => {
      return res;
    });
  }

  public putRelation(spaceId: string, relationId: string, relation: Relation): Promise<Relation> {
    return this.restHelperService.put(`/spaces/${spaceId}/relations/${relationId}`, relation)
      .then((r: Relation) => r);
  }

  public postRelation(spaceId: string, relation: Relation): Promise<Relation> {
    return this.restHelperService.post(`/spaces/${spaceId}/relations`, relation).then((res) => {
      // TODO: Hacky hack, needs to be fixed by the backend!
      let location: string = res.headers.get('location');
      if (environment.production) {
        location = location.replace("http", "https");
      }
      return this.restHelperService.getAbsoulte(location)
        .then((r: Relation) => r);
    });
  }

}
