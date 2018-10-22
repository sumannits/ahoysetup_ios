import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, ActionSheetController, Platform, LoadingController, Loading} from 'ionic-angular';
import { AuthServiceProvider, ResponseMessage } from '../../providers';
import { FormControl, FormBuilder, Validators, FormGroup, AbstractControl, FormArray } from '@angular/forms';

/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
    
  public loading: Loading;
  private form: FormGroup;
  public userData:any;

  constructor(
    public navCtrl: NavController,
    public userService: AuthServiceProvider,
    public toastCtrl: ToastController,
    private fbuilder: FormBuilder,
    public alertCtrl: AlertController,
    public jsonErrMsg: ResponseMessage,
    public loadingCtrl: LoadingController
  ) {
    const loguserDet = JSON.parse(localStorage.getItem('userPrfDet'));
    this.userData=loguserDet;
    this.form = new FormGroup({
      password: new FormControl('', [Validators.required]),
      cpassword: new FormControl('', [Validators.required])
    });
  }


  ngOnChanges() {
    console.log('Ng All Changes');
  }


  changePassword(data:any){
    if(this.form.valid){
      if(data.cpassword != data.password){
        this.presentToast('Your new password and confirm password does not match.');
      }else{
        delete data.cpassword;
        this.userService.patchData(data,'Customers/'+this.userData.id).then((result:any) => {
          //console.log(result);
          if(result.id){
            this.presentToast('You have successfully change your password.');
            this.navCtrl.setRoot('WelcomePage');
          }else{
            let alert = this.alertCtrl.create({
              title: 'Error!',
              subTitle: 'Something wrong.Please try again.' ,
              buttons: ['Ok']
            });
            alert.present();
          }
        }, (err) => {
          let alert = this.alertCtrl.create({
            title: 'Error!',
            subTitle: this.jsonErrMsg.messageData(err),
            buttons: ['Ok']
          });
          alert.present();
        });
      }
    }else{
      this.presentToast('Error something wrong. Please try after sometime.');
    }  
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
