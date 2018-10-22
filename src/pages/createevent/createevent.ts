import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController,  LoadingController, Loading, ActionSheetController, Platform} from 'ionic-angular';
import { AuthServiceProvider, ResponseMessage } from '../../providers';
import { FormControl, FormBuilder, Validators, FormGroup, AbstractControl, FormArray } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder,  NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import * as _ from 'lodash';

/**
 * Generated class for the CreateeventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var cordova: any;
@IonicPage()
@Component({
  selector: 'page-createevent',
  templateUrl: 'createevent.html',
})
export class CreateeventPage {
  public loading: Loading;
  private form: FormGroup;
  public userData:any;
  public interestList = [];
  public InterestDropdownList = [];
  public activeUser = [];
  public allActiveUser = [];
  public myInputStr:string = '';
  public myInputUseStr:string = '';
  public lastImage: string = null;
  public getimageURI:any;
  public interestNameTest: string = '';
  public userSettings: any = {
    //inputPlaceholderText: 'Type anything and you will get a location'
    inputPlaceholderText: 'Location'
  };
  public locJsonData:any;
  public getApiUrl:any;
  public insertDataId:any;

  constructor(
    public navCtrl: NavController,
    public dataService: AuthServiceProvider, 
    private fbuilder: FormBuilder,
    public alertCtrl: AlertController,
    public jsonErrMsg: ResponseMessage,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public toastCtrl: ToastController,
    private camera: Camera,
    private actionSheetCtrl: ActionSheetController,
    private transfer: FileTransfer,
    private file: File, 
    private filePath: FilePath,
    public navParams: NavParams) {
      const loguserDet = JSON.parse(localStorage.getItem('userPrfDet'));
      this.userData=loguserDet;
      this.form = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
        location: new FormControl('', [Validators.required]),
        latitude: new FormControl(''),
        longitude: new FormControl(''),
        description: new FormControl(''),
        is_active: new FormControl(''),
        selectedUser: new FormControl(''),
        //interested    : fbuilder.array([ ])
        selectedInterest: new FormControl(''),
        event_date:new FormControl('', [Validators.required])
      });
      this.getimageURI= this.dataService.apiImgUrl();
      this.getApiUrl= this.dataService.apiUrlFun();
    }

  ionViewDidLoad() {
    this.getInterestList();
    this.getActiveUserList();
  }

  public getActiveUserList(){  
    let filterUserData = '{"where":{"is_active":true, "id":{"neq":1,"neq":'+this.userData.id+'}}}';
    this.dataService.getData('Customers?filter='+filterUserData).then((res:any)=>{
      if(res.length>0){
        res.forEach((color: { name: string, id: number, image:string }) => {
          let userPrfImg = '';
          let checkedVal:boolean = false;
          if(color.image != null){
            userPrfImg = this.getimageURI+'users/'+color.image;
          }else{
            userPrfImg = './assets/img/default.jpeg';
          }
          this.activeUser.push({
            id: color.id,
            name: color.name,
            prfImg:userPrfImg,
            checked:checkedVal
          });
        });
        this.allActiveUser= this.activeUser;
      }
    },err=>{
      
    })
  }

  public getInterestList(){
    let filterUserData = '{"where":{"is_active":true, "or":[{"is_hidden":0},{"is_hidden":null}]}}';
    this.dataService.getData('interests?filter=' + filterUserData).then((result:any) => {
      //console.log(this.mySelectedIntList);
      if (result.length > 0) {
        result.forEach((color: { name: string, id: number, description: string }) => {
          let checkedVal:boolean = false;
          this.InterestDropdownList.push({
            id: color.id,
            name: color.name,
            description: color.description,
            checked:checkedVal
          });
        });
        this.interestList = this.InterestDropdownList;
      }
    }, (err) => {
      let emailErrMsg= this.jsonErrMsg.messageData(err);
      let alert = this.alertCtrl.create({
        title: 'Error!',
        subTitle: this.jsonErrMsg.messageData(err),
        buttons: ['Ok']
      });
      alert.present();
    });
  }

  public searchItems(ev: any) {
    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.myInputStr =val;
      let trimVal =val.trim();
      this.interestNameTest= trimVal;
      this.InterestDropdownList=this.searchPipe(this.interestList, trimVal);
    }else{
      this.InterestDropdownList = this.interestList;
      this.interestNameTest='';
      this.myInputStr = '';
    }
    //console.log(this.interestNameTest);
  }
  
  public searchUserItems(ev: any) {
    // set val to the value of the searchbar
    const val1 = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val1 && val1.trim() != '') {
      this.myInputStr =val1;
      let trimVal =val1.trim();
      //this.interestNameTest= trimVal;
      this.activeUser=this.searchPipe(this.allActiveUser, trimVal);
    }else{
      this.activeUser = this.allActiveUser;
      //this.interestNameTest='';
      this.myInputUseStr = '';
    }
    //console.log(this.interestNameTest);
  }

  public searchPipe(items, sdata){
      const /** @type {?} */ toCompare = sdata.toLowerCase();
      return items.filter(function (item) {
          for (let /** @type {?} */ property in item) {
            //console.log(item);
              if (item[property] === null) {
                  continue;
              }
              if (item[property].toString().toLowerCase().includes(toCompare)) {
                  return true;
              }
          }
          return false;
      });
  }
  
  public autoCompleteCallback1(selectedData:any) {
    this.locJsonData=JSON.parse(JSON.stringify(selectedData));
    if(this.locJsonData.data.formatted_address!=''){
      this.form.controls['location'].setValue(this.locJsonData.data.formatted_address);
      this.form.controls['latitude'].setValue(this.locJsonData.data.geometry.location.lat);
      this.form.controls['longitude'].setValue(this.locJsonData.data.geometry.location.lng);
    }
    //this.isLocationSelect = true;
  }

  public addDetails(data:any){
    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });
    this.loading.present();

    data.is_active = true;
    data.user_id = this.userData.id;
    let filterIntData = _.map(this.InterestDropdownList, function(item) {
        if (item.checked == true) return item;
    });
    //console.log(filterIntData);
    filterIntData = _.without(filterIntData, undefined);

    let filterUserData = _.map(this.activeUser, function(item1) {
        if (item1.checked == true) return item1;
    });
    filterUserData = _.without(filterUserData, undefined);

    this.dataService.postData(data,'events').then((result:any) => {
      let lastGrpId=result.id;
      if(lastGrpId){
        this.insertDataId = lastGrpId;
        
        // insert event interest
        if(filterIntData.length>0){
          let selectInterestUser = [];
          filterIntData.forEach(element => {
            if(element.id!=''){
              selectInterestUser.push(element.id);
            }
          });  
          if(selectInterestUser.length>0){
            let IntjsonData = {"event_id":lastGrpId,"selectinterest":selectInterestUser};
            this.dataService.postData(IntjsonData,'EventInterests/insertData').then(res=>{
            
            },err=>{
              
            })
          }
        }

        // insert event user
        if(filterUserData.length>0){
          let selectGrpUser = [];
          filterUserData.forEach(element => {
            if(element.id!=''){
              selectGrpUser.push(element.id);
            }
          });  
          if(selectGrpUser.length>0){
            let UsrjsonData = {"event_id":lastGrpId,"selectuser":selectGrpUser};
            this.dataService.postData(UsrjsonData,'EventUsers/insertData').then(res=>{
            
            },err=>{
              
            })
          }
        }
        this.uploadImage(lastGrpId);

        // insert event activity
        let IntReportData = {"type":4,"description":' has create a event "'+data.name+'"',"is_delete":0,"customerId":this.userData.id,"notification_pid":this.insertDataId};
        this.dataService.postData(IntReportData,'reports').then(res=>{
        
        },err=>{
          
        })

        this.loading.dismissAll()
        this.presentToast('Event created successfully.');       
        this.navCtrl.setRoot('EventlistPage');
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


  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      enableBackdropDismiss: true,
      buttons: [
        {
          text: 'Take a picture',
          icon: 'camera',
          handler: () => {
            this.uploadFromCamera(this.camera.PictureSourceType.CAMERA);
          }
        }, {
          text: 'From gallery',
          icon: 'images',
          handler: () => {
            this.uploadFromCamera(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        }
      ]
    });
    actionSheet.present();
  }
  
  uploadFromCamera(sourceType){
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
   
    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName(currentName));
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName(currentName));
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  private copyFileToLocalDir(namePath, currentName, newFileName) {
    //console.log("CURRENTFILENAME",currentName);
     this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
       this.lastImage = newFileName;
       //console.log("NEWFILENAMEEEEEE",this.lastImage);
       //this.uploadImage();
     }, error => {
        this.presentToast('Error while storing file.');
     });
  }

  private createFileName(currentName) {
    var d = new Date(),
    //n = d.getTime(),
   // newFileName=n+".jpg";
    newFileName;
    //console.log(currentName);
    newFileName = Date.now()+'_'+currentName;
    return newFileName;
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadImage(uId) {
    // Destination URL
    var url = this.getApiUrl+'events/uploadimg/'+uId;
   
    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);
   
    // File name only
    var filename = this.lastImage;
   //console.log(filename);
    var options = {
      fileKey: "photo",
      photo: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {
      'image':filename,
      'upload_id':uId
       }
     // params : {'fileName': filename}
    };
    const fileTransfer:FileTransferObject = this.transfer.create();
   
    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(data => {
      
    }, err => {
      //console.log("Error",err);
      //this.loading.dismissAll()
      this.presentToast('Error while uploading file.');
    });
  }

}
