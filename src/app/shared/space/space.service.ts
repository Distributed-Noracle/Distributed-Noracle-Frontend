import {Injectable} from '@angular/core';
import {RestHelperService} from '../rest-helper/rest-helper.service';
import {Space} from '../rest-data-model/space';

@Injectable()
export class SpaceService {

  constructor(private restHelperService: RestHelperService) {
  }

  public getSpace(id) {
    return this.restHelperService.get(`/spaces/${id}`)
      .then(res => res.json() as Space);
  }

  public postSpace(space: Space): Promise<Space> {
    return this.restHelperService.post('/spaces', space)
      .then((res) => {
        return this.restHelperService.getAbsoulte(res.headers.get('location'))
          .then((r) => r.json() as Space);
      });
  }

}
