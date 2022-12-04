import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'naxter-frontend';

  constructor(private translateService: TranslateService) {
    this.translateService.addLangs(['es', 'en']);
    this.translateService.setDefaultLang('es');
  }
}
