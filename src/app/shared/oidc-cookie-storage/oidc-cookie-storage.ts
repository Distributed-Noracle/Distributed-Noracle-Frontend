import {OidcSecurityStorage} from 'angular-auth-oidc-client';
import {Injectable} from '@angular/core';

@Injectable()
export class OidcCookieStorage implements OidcSecurityStorage {

  public read(key: string): any {
    const regEx = new RegExp('(?:(?:^|.*;\\s*)' + key + '\\s*\\=\\s*([^;]*).*$)|^.*$');
    const cookie = document.cookie.replace(regEx, '$1');
    if (cookie !== undefined && cookie !== '') {
      return JSON.parse(cookie.split(';')[0]);
    } else {
      return '';
    }
  }

  public write(key: string, value: any): void {
    if (value !== undefined && value !== '') {
      // set cookie
      document.cookie = key + '=' + JSON.stringify(value) + '; path=/; expires=' + new Date(Date.now() + 3580000).toUTCString();
    } else {
      // clear cookie
      document.cookie = key + '=; expires=' + new Date(0).toUTCString();
    }

  }


}


