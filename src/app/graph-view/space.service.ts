import {Injectable} from '@angular/core';
import {RestService} from '../shared/rest-service/rest.service';

@Injectable()
export class SpaceService {

  constructor(private RestService: RestService) {
  }

  public getSpace() {
    // XXX: hardcoded for now
    return this.RestService.getSpace(7367518275).toPromise();
  }

}
