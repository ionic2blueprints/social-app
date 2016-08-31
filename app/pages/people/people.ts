import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {UserProvider} from '../../providers/user-provider/user-provider';
import {SocialProvider} from '../../providers/social-provider/social-provider';
import {UtilProvider} from '../../providers/utils';
import {FirebaseListObservable} from 'angularfire2';
import {UserProfilePage} from '../user-profile/user-profile';


@Component({
  templateUrl: 'build/pages/people/people.html'
})
export class PeoplePage {
  users;
  uid;
  followersObservable:FirebaseListObservable<any>;
  followers;
  constructor(private navController: NavController, 
              private userProvider:UserProvider,
              private socialProvider: SocialProvider,
              private util: UtilProvider) {
    this.userProvider.getUid()
    .then(uid => {
      this.uid = uid;
    });
    this.users = this.userProvider.searchUser("");
  }

  getUser(ev) {
    let username = ev.target.value;
    this.users = this.userProvider.searchUser(username);
  }

  followUser(user) {
    this.socialProvider.followUser(user)
    .then(()=> {
      let toast = this.util.getToast("You are now following " + user.name);
      this.navController.present(toast);
    });
  }
  userProfile(user) {
    console.log(user);
    this.navController.push(UserProfilePage, {uid:user.$key});
  }
}
