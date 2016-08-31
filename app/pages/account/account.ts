import {Component} from '@angular/core';
import {NavController, ActionSheet} from 'ionic-angular';
import {FirebaseAuth} from 'angularfire2';
import {UtilProvider} from '../../providers/utils';
import {UserProvider} from '../../providers/user-provider/user-provider';
import {SocialProvider} from '../../providers/social-provider/social-provider';

@Component({
  templateUrl: 'build/pages/account/account.html'
})
export class AccountPage {
  user = {};
  profile:Object = {};
  constructor(private navController: NavController, private afAuth:FirebaseAuth, private util: UtilProvider, private userProvider: UserProvider, private socialProvider: SocialProvider) {
    this.userProvider.getUid()
    .then(uid => {
      this.socialProvider.getUser(uid)
      .subscribe(user => {
        this.user = user;
      });
    });
  }

  logout() {
    this.afAuth.logout();
  }

  updatePicture() {
    this.presentPictureSource()
    .then(source => {
      let sourceType:number = Number(source);
      return this.util.getPicture(sourceType);
    })
    .then(imageData => {
      var blobImage = this.util.dataURItoBlob(imageData);
      return this.userProvider.uploadPicture(blobImage);
    })
    .then(imageURL => {
      return this.userProvider.updateProfile({avatar: imageURL});
    })
    .then(()=> {
      let toast = this.util.getToast('Your Picture is updated');
      this.navController.present(toast);
    });
  }

  presentPictureSource() {
    let promise = new Promise((res, rej) => {
        let actionSheet = ActionSheet.create({
          title: 'Select Picture Source',
          buttons: [
            { text: 'Camera', handler: () => { res(1); } },
            { text: 'Gallery', handler: () => { res(0); } },
            { text: 'Cancel', role: 'cancel', handler: () => { rej('cancel'); } }
          ]
        });
        this.navController.present(actionSheet);
    });
    return promise;
  }

  updateProfile() {
    let toast = this.util.getToast("Your Profile is updated");
    this.userProvider.updateProfile({name: this.user['name'], about: this.user['about']})
    .then(()=> {
      this.navController.present(toast);
    });
  }
}
