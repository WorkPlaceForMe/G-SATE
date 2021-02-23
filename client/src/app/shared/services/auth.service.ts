import { Injectable, NgZone } from '@angular/core';
import { User } from "../services/user";
import { Admin } from "../services/admin";
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { Observable } from 'rxjs';
import { NavigationService } from './navigation.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userData: any; // Save logged in user data
  private users: Observable<any[]>;
  public now_user;
  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    public navigationService: NavigationService,
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
        this.users = afs.collection('/users').valueChanges();
        let subscription = this.users.subscribe(
            value => {
              this.now_user = value.find(x => x.uid === user.uid);
              localStorage.setItem('now_user', JSON.stringify(this.now_user));
              if(this.isAdmin){
                this.navigationService.isUserAdmin.next(true);
              } else {
                this.navigationService.isUserAdmin.next(false);
              }
              this.permissionString();
            }
          );
      } else {
        localStorage.setItem('user', null);
        localStorage.setItem('now_user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    })
  }

  permissionString(){
    const now_user = JSON.parse(localStorage.getItem('now_user'));
    if(now_user !== null){
        var service_string = now_user.service_string ? now_user.service_string : "000000";
        var service_number = +service_string;

        var service1 = service_number / 100000 >= 1;
        if(service1) {service_number -= 100000;}
        var service2 = service_number / 10000 >= 1;
        if(service2) {service_number -= 10000;}
        var service3 = service_number / 1000 >= 1;
        if(service3) {service_number -= 1000;}
        var service4 = service_number / 100 >= 1;
        if(service4) {service_number -= 100;}
        var service5 = service_number / 10 >= 1;
        if(service5) {service_number -= 10;}
        var service6 = service_number / 1 >= 1;
        localStorage.setItem('service1', JSON.stringify(service1));
        localStorage.setItem('service2', JSON.stringify(service2));
        localStorage.setItem('service3', JSON.stringify(service3));
        localStorage.setItem('service4', JSON.stringify(service4));
        localStorage.setItem('service5', JSON.stringify(service5));
        localStorage.setItem('service6', JSON.stringify(service6));
        this.navigationService.hasService1.next(service1);
        this.navigationService.hasService2.next(service2);
        this.navigationService.hasService3.next(service3);
        this.navigationService.hasService4.next(service4);
        this.navigationService.hasService5.next(service5);
        this.navigationService.hasService6.next(service6);
    }
  }

  // Sign in with email/password
  SignIn(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
        this.SetUserData(result.user);
        this.navigationService.isUserLoggedIn.next(true);
        if(this.isAdmin){
          this.navigationService.isUserAdmin.next(true);
        } else {
          this.navigationService.isUserAdmin.next(false);
        }
        this.permissionString()
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  // Sign up with email/password
  SignUp(email, password, name, passwordAgain) {
    if(password !== passwordAgain) {
      window.alert("You should confirm with the same password");
    } else {
      return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        result.user.updateProfile({
          displayName: name
        })
        this.SendVerificationMail();
        this.SetUserData_signup(result.user, name);
      }).catch((error) => {
        window.alert(error.message)
      })
    }
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification()
    .then(() => {
      this.router.navigate(['verify-email-address']);
    })
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail) {
    return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      window.alert('Password reset email sent, check your inbox.');
    }).catch((error) => {
      window.alert(error)
    })
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  get isAdmin(): boolean {
    const now_user = JSON.parse(localStorage.getItem('now_user'));
    return this.isLoggedIn && now_user !== null && now_user.admin;
  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  // Auth logic to run auth providers
  AuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
    .then((result) => {
       this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        })
      this.navigationService.isUserLoggedIn.next(true);
      if(this.isAdmin){
          this.navigationService.isUserAdmin.next(true);
        } else {
          this.navigationService.isUserAdmin.next(false);
        }
      this.permissionString()
      this.SetUserData(result.user);
    }).catch((error) => {
      window.alert(error)
    })
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    })
  }

  SetUserData_signup(user,name) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: name,
      admin: false,
      service_string: "000000"
    }
    return userRef.set(userData, {
      merge: true
    })
  }

  SetAdminData(uid) {
    const now_user = JSON.parse(localStorage.getItem('now_user'));
    if(now_user.admin){
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);
      const userData: Admin = {
        admin: true,
        service_string: "111111"
      }
      window.alert("Successfully add " + uid + " to admin!");
      return userRef.set(userData, {
        merge: true
      })
    } else {
      window.alert("Please be an admin account first to set others to admin");
    }

  }

  // Sign out 
  SignOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('normal_user');
      localStorage.removeItem('service1');
      localStorage.removeItem('service2');
      localStorage.removeItem('service3');
      localStorage.removeItem('service4');
      localStorage.removeItem('service5');
      localStorage.removeItem('service6');
      this.navigationService.isUserLoggedIn.next(false);
      this.router.navigate(['sign-in']);
    })
  }

}
