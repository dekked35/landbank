import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as env from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'landbank-ui';
  LANDBANK_MAIN_WEB = env.environment.LANDBANK_MAIN_WEB;
  public link = "https://fonts.googleapis.com/css?family=Poppins:400,500,600|Prompt:400,500,600&display=swap"

  constructor(private sanitizer: DomSanitizer) {
    this.sanitizer = sanitizer;
  }

  getFontCSS() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.link);
  }

  getMainWeb(path: string){
    return this.LANDBANK_MAIN_WEB + "/th/" + path
  }

}
