import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

const MOBSOS_URL = environment.mobsosUrl;
const REGEX = /<h3>Use<\/h3>\n<h4>No Factors or Measures yet<\/h4>([\s\S]*)<\/div>\n<div id = 'UserSatisfaction'>/gm;

@Component({
  selector: 'dnor-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadStats();
  }

  /**
   * Load the raw html from the MobSOS API and append it to the page.
   * This is a very hacky solution and should be redone as soon as
   * a MobSOS API for non pre-formatted data is available
   */
  async loadStats() {

    const response = await this.http.post(MOBSOS_URL + '/mobsos-success-modeling/visualize/serviceSuccessModel',
    {
      catalog: 'measure_catalogs/measure_catalog-mysql.xml',
      modelName: 'Noracle Service Success Model',
      updateMeasures: 'true',
      updateModels: 'true'
    }).toPromise();

    const filtered = REGEX.exec(response.toString());
    if (!filtered || !filtered[1]) {
      console.log(filtered);
      throw new Error('malformatted response');
    }

    const statsNode = document.getElementById('stats');
    statsNode.innerHTML = filtered[1];
    const scripts = statsNode.getElementsByTagName('script');
    for (let ix = 0; ix < scripts.length; ix++) {
       eval.call(window, scripts[ix].text);
    }

  }

}
