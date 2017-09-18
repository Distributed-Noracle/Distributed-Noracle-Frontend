import { Injectable } from '@angular/core';

@Injectable()
export class TextlayoutService {

  constructor() { }

  public wrapTextCircular(text) {
    let result = '';
    let i = 0;
    const len = this.measureTextLength(text);
    let t = this.getTextHeight();
    while (i < len) {
      let line = this.getTextOfLengthFrom(text.substr(i), t > 0 ? 2 * t : Number.MAX_VALUE);
      if (line.length + i < text.length) {
        line = line.substr(line, line.search('\\s[^\\s]*$'));
      }
      i += this.measureTextLength(line);
      result += line.trim();
      if (i < len && line.length !== 0) {
        result += '\n';
      }
      if (i < len / 2 - t / 2) {
        t += this.getTextHeight();
      } else if (i > len / 2 + t / 2) {
        t -= this.getTextHeight();
      } else {
        console.log('same length line ' + text);
      }
    }
    return result;
  }

  private getTextHeight () {
    return 4;
  };
  private measureTextLength(text) {
    return text.length;
  };
  private getTextOfLengthFrom(text, length) {
    return text.substr(0, length);
  };
}
