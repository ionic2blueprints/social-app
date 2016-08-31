import {Component} from '@angular/core';
import {NavController, Storage, LocalStorage} from 'ionic-angular';
import {TabsPage} from '../tabs/tabs';
import {FormBuilder, Validators, Control} from '@angular/common';
import {validateEmail} from '../../validators/email';
import {AuthProvider} from '../../providers/auth-provider/auth-provider';
import {UserProvider} from '../../providers/user-provider/user-provider';
import {UtilProvider} from '../../providers/utils';
import {FirebaseAuth} from 'angularfire2';
import {Inject} from '@angular/core';

@Component({
    templateUrl: 'build/pages/create-account/create-account.html'
})

export class CreateAccount {
	createForm;
    auth;
    password:Control;
    storage = new Storage(LocalStorage);
    constructor(public nav:NavController, 
      form:FormBuilder, 
      auth: AuthProvider, 
      @Inject(FirebaseAuth) public fbAuth: FirebaseAuth, 
      public userProvider: UserProvider,
      public util: UtilProvider) {
        this.password = new Control("",Validators.compose([Validators.required, Validators.minLength(6)]));
        this.createForm = form.group({
            username: ["", Validators.required],
            name: ["", Validators.required],
            email: ["",Validators.compose([Validators.required, validateEmail])],
            password:this.password,
            repass: ["", Validators.required]
        });
        this.auth = auth;
    }

    createAccount() {
        let {password, repass, username, name, email} = this.createForm.value;
        username = username.toLowerCase();
        if(password !== repass) {
            let alert = this.util.doAlert("Error", "Password doesn't matched", "Ok");
            this.nav.present(alert);
        } else {
            this.userProvider.isUsernameFree(username)
            .then(value => {
                if(value === false) {
                    let alert = this.util.doAlert("Error", "Username not available", "Ok");
                    this.nav.present(alert);
                } else {
                    // Create Account
                    this.auth.createUser({email: email, password: password})
                    .then(value => {
                        this.userProvider.saveUser(value);
                        this.userProvider.createUser({email: email, username: username, name: name});
                    });
                }
            });
        }
    }
}
    