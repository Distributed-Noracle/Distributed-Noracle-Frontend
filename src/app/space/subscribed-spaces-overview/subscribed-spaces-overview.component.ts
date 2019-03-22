import {Component, OnDestroy, OnInit} from '@angular/core';
import {SpaceSubscription} from '../../shared/rest-data-model/spacesubscription';
import {Subscription} from 'rxjs';
import {Space} from '../../shared/rest-data-model/space';
import {MyspacesService} from '../../shared/myspaces/myspaces.service';
import {MatIconRegistry, MatSnackBar} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {environment} from '../../../environments/environment';
import {RestHelperService} from '../../shared/rest-helper/rest-helper.service';

@Component({
  selector: 'dnor-subscribed-spaces-overview',
  templateUrl: './subscribed-spaces-overview.component.html',
  styleUrls: ['./subscribed-spaces-overview.component.css']
})
export class SubscribedSpacesOverviewComponent implements OnInit, OnDestroy {
  public spaces: { space: Space, subscription: SpaceSubscription }[];
  public bots: {name: string, active: boolean, icon: string}[] = [];
  public botWidgetUrl: string;
  private spaceSubscription: Subscription;
  private botUri: string;

  constructor(private myspacesService: MyspacesService, private snackBar: MatSnackBar,
              private matIconRegistry: MatIconRegistry, private sanitizer: DomSanitizer, private rh: RestHelperService) {
  }

  ngOnInit() {
    this.spaceSubscription =
      this.myspacesService.getMySpacesObservable().subscribe((myspaces) => this.spaces = myspaces);
    this.myspacesService.getMySpaces().then((s) => s);
    this.matIconRegistry.addSvgIconInNamespace('img', 'bot',
        this.sanitizer.bypassSecurityTrustResourceUrl('assets/bot.svg'));
    this.matIconRegistry.addSvgIconInNamespace('img', 'add',
        this.sanitizer.bypassSecurityTrustResourceUrl('assets/add.svg'));
    this.matIconRegistry.addSvgIconInNamespace('img', 'train',
        this.sanitizer.bypassSecurityTrustResourceUrl('assets/train.svg'));
    this.matIconRegistry.addSvgIconInNamespace('img', 'play',
        this.sanitizer.bypassSecurityTrustResourceUrl('assets/play.svg'));
    this.matIconRegistry.addSvgIconInNamespace('img', 'pause',
        this.sanitizer.bypassSecurityTrustResourceUrl('assets/pause.svg'));
    this.botWidgetUrl = this.rh.getHostURL() + '/fileservice/v2.2.5/files/sbf';
    this.botUri = this.rh.getHostURL() + '/SBFManager/bots/distributed-noracle';

    const xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    xmlhttp.open('GET', this.botUri);
    xmlhttp.setRequestHeader('Accept', 'application/json');
    xmlhttp.send();
    const bots = this.bots;
    xmlhttp.onreadystatechange = function(){
       if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
          const botj = JSON.parse(this.responseText);
          for (const key of Object.keys(botj)) {
            const bs = botj[key].active === 'true';
            if (bs) {
              const b = {'name': key, 'active': bs, 'icon': 'img:pause'};
              bots.push(b);
            }else {
              const b = {'name': key, 'active': bs, 'icon': 'img:play'};
              bots.push(b);
            }

          }
       }
    };
  }

  ngOnDestroy() {
    this.spaceSubscription.unsubscribe();
  }

  copyInviteUrl(myspace: { space: Space, subscription: SpaceSubscription }) {
    let url = window.location.href;
    url = url.substring(0, url.indexOf('/myspaces')) + `/spaces/${myspace.space.spaceId}?pw=${myspace.space.spaceSecret}`;
    const textArea = document.createElement('textarea');
    // Place in top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = '0';
    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = 'transparent';
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        this.snackBar.open('Copied invitation link to clipboard. Paste to share with friends!', 'hide', {
          duration: 2000,
        });
      } else {
        this.copyFallback(url);
      }
    } catch (err) {
      this.copyFallback(url);
    }
    document.body.removeChild(textArea);
  }



  addBot(myspace: { space: Space, subscription: SpaceSubscription }, bot: String, active: boolean) {
    if (active === false) {
      let url = window.location.href;
      url = url.substring(0, url.indexOf('/myspaces')) + `/spaces/${myspace.space.spaceId}?pw=${myspace.space.spaceSecret}`;
      const textArea = document.createElement('textarea');
      // Place in top-left corner of screen regardless of scroll position.
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      // Ensure it has a small width and height. Setting to 1px / 1em
      // doesn't work as this gives a negative w/h on some browsers.
      textArea.style.width = '2em';
      textArea.style.height = '2em';
      // We don't need padding, reducing the size if it does flash render.
      textArea.style.padding = '0';
      // Clean up any borders.
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';
      // Avoid flash of white box if rendered for any reason.
      textArea.style.background = 'transparent';
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();

      const xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
      xmlhttp.open('POST', this.rh.getHostURL() + '/SBFManager/join/' + bot);
      xmlhttp.setRequestHeader('Content-Type', 'application/json');
      xmlhttp.send(JSON.stringify({basePath: environment.hostUrls[0] + '/distributed-noracle',
        joinPath: 'agents/$botId/spacesubscriptions',
        spaceId: myspace.space.spaceId, spaceSecret: myspace.space.spaceSecret}));
      const snackBar = this.snackBar;
      const bots = this.bots;
      xmlhttp.onreadystatechange = function(){
         if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            snackBar.open('Bot added!', 'hide', {
              duration: 2000,
            });
            bots.forEach(function(element) {
              if (element.name === bot) {
                element.icon = 'img:pause';
                element.active = true;
              }
            });
         }else if (xmlhttp.readyState === 4) {
            snackBar.open('Bot could not be added!', 'hide', {
              duration: 2000,
            });
         }
      };

      document.body.removeChild(textArea);
    }else {
      const botUri = this.botUri;

      const snackBar = this.snackBar;
      this.bots.forEach(function(element) {
        if (element.name === bot) {
          const xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
            xmlhttp.open('DELETE', botUri + '/' + bot);
            xmlhttp.send();
            xmlhttp.onreadystatechange = function(){
               if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                  snackBar.open('Bot paused!', 'hide', {
                    duration: 2000,
                  });
                  element.icon = 'img:play';
                  element.active = false;
               }else if (xmlhttp.readyState === 4) {
                  snackBar.open('Bot could not be paused!', 'hide', {
                    duration: 2000,
                  });
               }
            };
        }
      });
    }
  }

  private copyFallback(url: string) {
    window.prompt('Could not copy to clipboard automatically. Please copy the following invitation link manually:', url);
  }

  getStringifiedParamArray(subscription: SpaceSubscription): string {
    return JSON.stringify(subscription.selectedQuestionIds);
  }

}
