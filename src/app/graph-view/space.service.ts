import {Injectable} from '@angular/core';
import {RestService} from '../shared/rest-service/rest.service';

@Injectable()
export class SpaceService {

  constructor(private RestService: RestService) {
  }

  public getSpace(id) {
    return this.RestService.getSpace(id).toPromise();
  }

}
