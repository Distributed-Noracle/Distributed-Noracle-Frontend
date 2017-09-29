import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {OidcSecurityService} from 'angular-auth-oidc-client';

const HOST_URL = 'https://steen.informatik.rwth-aachen.de:9082';

@Injectable()
export class RestHelperService {
  private CORE_BASE_URL = HOST_URL + '/las2peer';
  private BASE_URL = HOST_URL + '/distributed-noracle/v0.5.0';
  private isMock = true;

  constructor(private OidcSecurityService: OidcSecurityService, private http: Http) {
  }

  public get(path: string) {
    return this.http.get(this.BASE_URL + path,
      {headers: this.getHeaders()}
    );
  }

  public getAbsoulte(absolutePath: string) {
    return this.http.get(absolutePath,
      {headers: this.getHeaders()}
    );
  }

  public put(path: string, body: any) {
    return this.http.put(this.BASE_URL + path,
      body,
      {headers: this.getHeaders()}
    );
  }

  public post(path: string, body: any) {
    return this.http.post(this.BASE_URL + path,
      body,
      {headers: this.getHeaders()}
    );
  }

  public getCurrentAgent() {
    return this.http.get(this.CORE_BASE_URL + '/currentagent', {headers: this.getHeaders()});
  }

  private getHeaders(): Headers {
    if (this.isMock) {
      return this.getMockHeaders();
    }
    const headers = new Headers();
    headers.append('Accept', 'application/json;q=0.9,text/plain;q=0.8,*/*;q=0.5');
    headers.append('Content-Type', 'application/json');
    const token = this.OidcSecurityService.getToken();
    if (token !== '') {
      const tokenValue = 'Bearer ' + token;
      headers.append('Authorization', tokenValue);
    }
    return headers;
  }

  private getMockHeaders(): Headers {
    const headers = new Headers();
    headers.append('Accept', 'application/json;q=0.9,text/plain;q=0.8,*/*;q=0.5');
    headers.append('Content-Type', 'application/json');
    const user = 'noracle-example-smith';
    const password = 'testtest';
    const base64encodedData = btoa(user + ':' + password);
    headers.append('Authorization', 'Basic ' + base64encodedData);
    return headers;
  }

}
