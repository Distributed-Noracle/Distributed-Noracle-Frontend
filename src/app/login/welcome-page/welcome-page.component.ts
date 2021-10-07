import { Component, OnDestroy, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import { Subscription } from 'rxjs';

const MOBSOS_URL = environment.mobsosUrl;
const REGEX: RegExp = new RegExp(/<h3>Use<\/h3>\n<h4>No Factors or Measures yet<\/h4>([\s\S]*)<\/div>\n<div id = 'UserSatisfaction'>/);

@Component({
  selector: 'dnor-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit, OnDestroy {

  public statsLoaded: boolean = false;

  private successModelSubscription: Subscription = new Subscription();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // this.loadStats()
  }

  ngOnDestroy() {
    this.successModelSubscription.unsubscribe();
  }

  /**
   * Load the raw html from the MobSOS API and append it to the page.
   * This is a very hacky solution and should be redone as soon as
   * a MobSOS API for non pre-formatted data is available
   */
  loadStats() {
    let body: Object = {
      catalog: 'measure_catalogs/measure_catalog-mysql.xml',
      modelName: 'Noracle Service Success Model',
      updateMeasures: 'true',
      updateModels: 'true'
    };

    const requestOptions: Object = {
      headers: new HttpHeaders().append('Content-Type', 'application/json'),
      responseType: 'text'
    }

    this.successModelSubscription = this.http.post<string>(MOBSOS_URL + '/mobsos-success-modeling/visualize/serviceSuccessModel', JSON.stringify(body), requestOptions)
      .subscribe(response => {
        const filtered = REGEX.exec(response);
        if (!filtered || !filtered[1]) {
          throw new Error('malformatted response');
        }

        const statsNode = document.getElementById('stats');
        statsNode.innerHTML = filtered[1];
        const scripts = statsNode.getElementsByTagName('script');
        for (let ix = 0; ix < scripts.length; ix++) {
          eval.call(window, scripts[ix].text);
        }
      });
  }

}
