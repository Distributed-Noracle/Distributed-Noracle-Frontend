import {Injectable} from '@angular/core';
import {Relation} from '../rest-data-model/relation';
import {RestHelperService} from '../rest-helper/rest-helper.service';

@Injectable()
export class RelationService {

  constructor(private restHelperService: RestHelperService) {
  }

  public getRelationsOfSpace(id): Promise<Relation[]> {
    return this.restHelperService.get(`/spaces/${id}/relations`).toPromise().then((res) => {
      return res.json() as Relation[];
    });
  }

}
