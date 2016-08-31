import { Component } from '@angular/core';
import { NavController, Modal } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { PostPageModal } from '../post/post';
import { SocialProvider } from '../../providers/social-provider/social-provider';
import { UserProvider } from '../../providers/user-provider/user-provider';
import { PostCmp } from '../../component/post/post';
import * as firebase from 'firebase';

@Component({
  templateUrl: 'build/pages/timeline/timeline.html',
  directives: [PostCmp]
})
export class TimelinePage {
  posts:any;
  userInput;
  feeds:any = [];
  constructor(private navController: NavController, private socialProvider: SocialProvider, private userProvider: UserProvider,private af: AngularFire) {
    this.userProvider.getUid()
    .then(uid => {
       firebase.database().ref(`/users/${uid}/feed`)
       .on('child_added', (snapshot) => {
         this.feeds.unshift({$key:snapshot.key, $value: snapshot.val()});
       });
    });
  }

  openPost() {
    let modal = Modal.create(PostPageModal);
    this.navController.present(modal);
  }
}
