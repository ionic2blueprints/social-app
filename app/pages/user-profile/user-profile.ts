import {Component} from '@angular/core';
import {NavController, ActionSheet, NavParams} from 'ionic-angular';
import {UtilProvider} from '../../providers/utils';
import {UserProvider} from '../../providers/user-provider/user-provider';
import {SocialProvider} from '../../providers/social-provider/social-provider';

@Component({
  templateUrl: 'build/pages/user-profile/user-profile.html'
})
export class UserProfilePage {
  user = {};
  profile = {};
  uid:String;
  constructor(private navController: NavController,  private util: UtilProvider, private params: NavParams, private socialProvider: SocialProvider) {
      this.uid = params.get('uid');
      console.log(this.uid);
      this.socialProvider.getUser(this.uid)
      .subscribe(user => {
        this.user = user;
      });
  }

  followUser(user) {
       this.socialProvider.followUser(user);
  }

}
