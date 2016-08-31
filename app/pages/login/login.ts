import {Component} from '@angular/core';
import {NavController, Storage, LocalStorage} from 'ionic-angular';
import {TabsPage} from '../tabs/tabs';
import {FormBuilder, Validators} from '@angular/common';
import {validateEmail} from '../../validators/email';
import {AuthProvider} from '../../providers/auth-provider/auth-provider';
import {UserProvider} from '../../providers/user-provider/user-provider';
import {UtilProvider} from '../../providers/utils';
import {FirebaseAuth} from 'angularfire2';
import {Inject} from '@angular/core';
import {CreateAccount} from '../create-account/create-account';

@Component({
	templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {
	loginForm;
    auth;
    storage = new Storage(LocalStorage);
    constructor(public nav:NavController, 
      form:FormBuilder, 
      auth: AuthProvider, 
      @Inject(FirebaseAuth) public fbAuth: FirebaseAuth, 
      public userProvider: UserProvider,
      public util: UtilProvider) {
        
        this.loginForm = form.group({
            email: ["",Validators.compose([Validators.required, validateEmail])],
            password:["",Validators.required]
        });
        this.auth = auth;
    }
    
	signin() {
      this.auth.signin(this.loginForm.value)
      .then((data) => {
          this.storage.set('userInfo', JSON.stringify(data));
          this.nav.push(TabsPage);
      }, (error) => {
          console.log(error);
          let errorMessage = "Enter Correct Email and Password";
          let alert = this.util.doAlert("Error",errorMessage,"Ok");
          this.nav.present(alert);
      });
    };
    
    createAccount() {
        this.nav.push(CreateAccount);
    };
}