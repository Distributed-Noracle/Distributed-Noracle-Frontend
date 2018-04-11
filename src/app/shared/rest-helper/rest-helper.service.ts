import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import {environment} from '../../../environments/environment';

const HOST_URLS = environment.hostUrls;

@Injectable()
export class RestHelperService {
  private CORE_BASE_URL = '/las2peer';
  private BASE_URL = '/distributed-noracle/v0.6.0';
  private isMock = false;
  private oidcName = '';

  constructor(private OidcSecurityService: OidcSecurityService, private http: Http) {
    OidcSecurityService.getUserData().subscribe((userData: any) => {
      this.oidcName = userData.email;
    });
  }

  public get(path: string): Promise<Response> {
    return this.http.get(this.getBaseURL() + path,
      {headers: this.getHeaders()}
    ).retry(3).toPromise();
  }

  public getAbsoulte(absolutePath: string): Promise<Response> {
    return this.http.get(absolutePath,
      {headers: this.getHeaders()}
    ).retry(3).toPromise();
  }

  public put(path: string, body: any): Promise<Response> {
    return this.http.put(this.getBaseURL() + path,
      body,
      {headers: this.getHeaders()}
    ).retry(3).toPromise();
  }

  public post(path: string, body: any): Promise<Response> {
    return this.http.post(this.getBaseURL() + path,
      body,
      {headers: this.getHeaders()}
    ).retry(3).toPromise();
  }

  public getCurrentAgent(): Promise<Response> {
    return this.http.get(this.getCoreBaseURL() + '/currentagent', {headers: this.getHeaders()}).retry(3).toPromise();
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

  private getBaseURL(): string {
    return this.getHostURL() + this.BASE_URL;
  }

  private getCoreBaseURL(): string {
    return this.getHostURL() + this.CORE_BASE_URL;
  }

  private getHostURL(): string {
    return HOST_URLS[Math.abs(this.hash(this.oidcName) % HOST_URLS.length)];
  }

  private hash(str): number {
    let hash = 0, i, chr;
    if (!str || str.length === 0) {
      return hash;
    }
    for (i = 0; i < str.length; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
}
