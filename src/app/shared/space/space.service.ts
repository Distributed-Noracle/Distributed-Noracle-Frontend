import {Injectable} from '@angular/core';
import {RestHelperService} from '../rest-helper/rest-helper.service';
import {Space} from '../rest-data-model/space';

@Injectable()
export class SpaceService {

  constructor(private restHelperService: RestHelperService) {
  }

  public getSpace(id) {
    return this.restHelperService.get(`/space/${id}`).toPromise()
      .then(res => res.json() as Space);
  }

}
