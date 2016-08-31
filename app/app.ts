import {Component} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import { FIREBASE_PROVIDERS, 
  defaultFirebase, 
  firebaseAuthConfig,
  AuthProviders,
  AuthMethods } from 'angularfire2';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {LoginPage} from './pages/login/login';
import {AuthProvider} from './providers/auth-provider/auth-provider';
import {UtilProvider} from './providers/utils';
import {UserProvider} from './providers/user-provider/user-provider';
import {SocialProvider} from './providers/social-provider/social-provider';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {

  private rootPage:any;

  constructor(private platform:Platform, authProvider: AuthProvider) {
    platform.ready().then(() => {
      StatusBar.styleDefault();
      let auth = authProvider.getAuth();
        auth.subscribe((result) => {
            if(result) {
            	this.rootPage = TabsPage;
            } else {
            	this.rootPage = LoginPage;
            }
        });
    });
  }
}

ionicBootstrap(MyApp, [FIREBASE_PROVIDERS,
  // Initialize Firebase app  
  defaultFirebase({
    apiKey: "AIzaSyDugmwEYhnPFuy2mYT1xcTC8oINXv__540",
    authDomain: "social-app-545ef.firebaseapp.com",
    databaseURL: "https://social-app-545ef.firebaseio.com",
    storageBucket: "social-app-545ef.appspot.com",
  }), AuthProvider, UtilProvider, UserProvider, SocialProvider,
  firebaseAuthConfig({
    provider: AuthProviders.Password,
    method: AuthMethods.Password,
    remember: 'default',
    scope: ['email']
  })
])
