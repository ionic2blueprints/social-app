import {Injectable, Inject} from '@angular/core';
import {FirebaseAuth, FirebaseApp, FirebaseRef, AngularFire} from 'angularfire2';
import {LocalStorage, Storage} from 'ionic-angular';

@Injectable()
export class AuthProvider {
  constructor(public af:AngularFire, private fbAuth: FirebaseAuth) {
    this.fbAuth = fbAuth;
  }
  
  getAuth() {
    return this.af.auth; 
  };
  
  signin(credentails) {   
    return this.fbAuth.login(credentails);
  }
  
  createAccount(credentails) {
   return this.fbAuth.createUser(credentails);
  };
  
  logout() {
     this.fbAuth.logout();
  }
}

