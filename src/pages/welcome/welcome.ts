import { Component } from '@angular/core';
import { IonicPage, NavController ,ToastController} from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { AuthServiceProvider } from '../../providers';
/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  public userData:any;
  public isUserLogin:string=localStorage.getItem("isUserLogedin");
  public loguser:any;
  constructor(public navCtrl: NavController,
    public userService: AuthServiceProvider,
    private myApp:MyApp,public toastCtrl:ToastController) { 
      const loguserDet = JSON.parse(localStorage.getItem('userPrfDet'));
      this.userData=loguserDet;
      console.log(this.userData);
    }

  login() {
    this.navCtrl.push('LoginPage');
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }

  ionViewDidLoad() {
    //this.loguser = JSON.parse(localStorage.getItem('userData'));
    this.myApp.menuOpened();
  }

  public home() {
    //this.navCtrl.push('WelcomePage');
    this.navCtrl.setRoot('WelcomePage');
  }
  
  public grouplist() {
    if(this.userData !=null){
      this.navCtrl.setRoot('GrouplistPage');
    } else {
      let toast = this.toastCtrl.create({
        message: 'Sorry ! you have to login first.',
        duration: 4000,
        position: 'top'
      });
      toast.present();
    }
  }

  public event(){
    if(this.userData !=null){
      this.navCtrl.setRoot('EventlistPage');
    } else {
      let toast = this.toastCtrl.create({
        message: 'Sorry ! you have to login first.',
        duration: 4000,
        position: 'top'
      });
      toast.present();
    }
  }

  public userLogout() {
    this.userService.patchData({is_login:false},'Customers/'+this.userData.id).then((result1:any) => {
    }, (err) => {
      
    });

    localStorage.clear();
    localStorage.removeItem("isUserLogedin");
    localStorage.removeItem("userData");
    localStorage.removeItem("userPrfDet");
    this.navCtrl.push('LoginPage');
  }
}
