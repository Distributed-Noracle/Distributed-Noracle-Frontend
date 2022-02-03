import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {retry} from 'rxjs/operators';
import {KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';

const HOST_URLS = environment.hostUrls;

@Injectable()
export class RestHelperService {
  private CORE_BASE_URL = '/las2peer';
  private BASE_URL = '/distributed-noracle';
  private isMock = false;
  private userName = '';

  constructor(private http: HttpClient,
    protected readonly keycloak: KeycloakService,
    private router: Router) {
  }

  public async get(path: string): Promise<any> {
    try {
      const res = await this.http.get(this.getBaseURL() + path,
        { headers: this.getHeaders() }
      )
      //.pipe(retry(3))
      .toPromise();
      return res;
    } catch (error) {
      if (error.status === 401) {
        this.router.navigate(['/login'], {replaceUrl: true});
      }
      throw error;
    }
  }

  public getAbsoulte(absolutePath: string): Promise<any> {
    return this.http.get(absolutePath, {headers: this.getHeaders()})
      //.pipe(retry(3))
      .toPromise();
  }

  public put(path: string, body: any): Promise<any> {
    return this.http.put(this.getBaseURL() + path,
      body,
      {headers: this.getHeaders()}
    )
    .toPromise();
  }

  public post(path: string, body: any): Promise<any> {
    return this.http.post(this.getBaseURL() + path, body, { headers: this.getHeaders(), observe: 'response' })
      .toPromise();
  }

  public getCurrentAgent(): Observable<any> {
    return this.http.get(this.getCoreBaseURL() + '/currentagent', {headers: this.getHeaders()});
    //return this.http.get(this.getCoreBaseURL() + '/auth/login', {headers: this.getHeaders()});
  }

  public getCurrentAgentLocal(): Observable<any> {
    return this.http.get<any>(this.getBaseURL() + '/mainAgent', {headers: this.getHeaders()})
  }

  private getHeaders(): HttpHeaders {
    if (this.isMock) {
      return this.getMockHeaders();
    }
  }

  private getMockHeaders(): HttpHeaders {
    const headers = new HttpHeaders();
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

  /**
   * Determines the API URL to be used by mapping the username of the
   * logged in user to one of the provided URLs using a hash function.
   * This was introduced to simulate a distributed setting with users who can't
   * host a node themselves.
   */
  public getHostURL(): string {
    return HOST_URLS[Math.abs(this.hash(this.userName) % HOST_URLS.length)];
  }

  /**
   * Maps the input string to a 32bit signed integer
   * @param str The string to be hashed
   */
  private hash(str: string): number {
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
