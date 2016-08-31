import {Component} from '@angular/core'
import {TimelinePage} from '../timeline/timeline';
import {PeoplePage} from '../people/people';
import {AccountPage} from '../account/account';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

  private tab1Root: any;
  private tab2Root: any;
  private tab3Root: any;

  constructor() {
    this.tab1Root = TimelinePage;
    this.tab2Root = PeoplePage;
    this.tab3Root = AccountPage;
  }
}
