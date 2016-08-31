import {Injectable, Inject} from '@angular/core';
import {AngularFire} from 'angularfire2';
import {LocalStorage, Storage} from 'ionic-angular';
import * as firebase from 'firebase';

@Injectable()
export class UserProvider {
  storage = new Storage(LocalStorage);
  constructor(public af:AngularFire) {
  }
  
  // Check if username is free
  isUsernameFree(username) {
    let promise = new Promise((res, rej) => {
      this.searchUser(username)
      .subscribe(value => {
        if(value.length === 0) {
          res(true)
        } else {
          res(false);
        }
      });
    });
    return promise;
  }

  // Save logged in user info in LocalStorage at userInfo key
  saveUser(userData) {
    this.storage.setJson("userInfo",userData);
  }

  // Get Current User's UID
  getUid() {
    let promise = new Promise((res, rej) => {
      this.storage.get('userInfo')
      .then(value => {
        let uid = JSON.parse(value).auth.uid;
        res(uid);
      });
    })
    
    return promise;
  }
  
  // Create User in Firebase
  createUser(userData) {
    return this.getUid()
    .then(uid => {
      let url = `/users/${uid}`;
      let user = this.af.database.object(url);
      return user.set(userData);
    });
  }

  updateProfile(obj) {
   return this.getUid()
    .then(uid => {
      return this.af.database.object(`/users/${uid}/`).update(obj);
    });
  }

  // upload profile picture
  uploadPicture(file) {
    return this.getUid()
    .then(uid => {
        let promise = new Promise((res,rej) => {
        let fileName = uid + '.jpg';
        let pictureRef = firebase.storage().ref(`/profile/${fileName}`);
        let uploadTask = pictureRef.put(file);

        uploadTask.on('state_changed', function(snapshot) {
        }, function(error) {
          rej(error);
        }, function() {
          var downloadURL = uploadTask.snapshot.downloadURL;
          res(downloadURL);
        });
      });

      return promise;
    });
  }

  // Search User with given username
  searchUser(username) {
    let query = {
      orderByChild: 'username'
    };
    // username is given
    if(username) {
      query['equalTo'] = username;
    }
    let users = this.af.database.list('/users', {
      query: query
    });
    return users;
  }

  // Get All Followers of a Logged In
  getFollowers() {
    return this.getUid()
    .then(uid => {
      return this.af.database.list(`/users/${uid}/followers`);
    });
  }
}

