import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import {environment} from '../../../environments/environment';

const HOST_URL = environment.hostUrl;

@Injectable()
export class RestHelperService {
  private CORE_BASE_URL = HOST_URL + '/las2peer';
  private BASE_URL = HOST_URL + '/distributed-noracle/v0.6.0';
  private isMock = false;

  constructor(private OidcSecurityService: OidcSecurityService, private http: Http) {
  }

  public get(path: string): Promise<Response> {
    return this.http.get(this.BASE_URL + path,
      {headers: this.getHeaders()}
    ).retry(3).toPromise();
  }

  public getAbsoulte(absolutePath: string): Promise<Response> {
    return this.http.get(absolutePath,
      {headers: this.getHeaders()}
    ).retry(3).toPromise();
  }

  public put(path: string, body: any): Promise<Response> {
    return this.http.put(this.BASE_URL + path,
      body,
      {headers: this.getHeaders()}
    ).retry(3).toPromise();
  }

  public post(path: string, body: any): Promise<Response> {
    return this.http.post(this.BASE_URL + path,
      body,
      {headers: this.getHeaders()}
    ).retry(3).toPromise();
  }

  public getCurrentAgent(): Promise<Response> {
    return this.http.get(this.CORE_BASE_URL + '/currentagent', {headers: this.getHeaders()}).retry(3).toPromise();
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
    headers.append('location', '');
    return headers;
  }

}
