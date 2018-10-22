import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController,ToastController} from 'ionic-angular';
import { AuthServiceProvider } from '../../providers';

/**
 * Generated class for the GroupchatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-groupchat',
  templateUrl: 'groupchat.html',
})
export class GroupchatPage {

  public groupId:any;
  public pet:string = 'group';
  public loading: Loading;
  public getimageURI:any;
  public userData:any;
  public groupDetails:any;
  public message:string = '';
  public allCommentList = [];
  public groupTag = [];
  public responseData:any;
  public chatList:any;

  constructor(public navCtrl: NavController, 
    public dataService: AuthServiceProvider,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public toastCtrl:ToastController) {
      this.groupId = this.navParams.get('group_id');
      const loguserDet = JSON.parse(localStorage.getItem('userPrfDet'));
      this.userData=loguserDet;
      this.getimageURI= this.dataService.apiImgUrl();
  }

  ionViewDidLoad() {
    this.getGroupDetails();
  }

  getGroupDetails(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
    });
    this.loading.present();
    this.dataService.getData('UserGroups/'+this.groupId).then((res:any)=>{
        res.ismember=false;
        let filterJoinData = '{"where":{"group_id":'+this.groupId+',"customerId":'+this.userData.id+'}}';
        this.dataService.getData('GroupUsers?filter='+filterJoinData).then((res1:any)=>{
          if(res1.length>0){
            res.ismember=true;
          }
        },err=>{
        
        })
        let grpImg = '';
        if(res.image != null){
          grpImg = this.getimageURI+'group/'+res.image;
        }else{
          grpImg = './assets/img/default512.png';
        }
        res.image_url=grpImg;
        this.groupDetails= res;
        this.getGroupChat(this.groupId);
        this.loading.dismissAll();
    },err=>{
      this.loading.dismissAll();
    })
  }

  getGroupChat(id){
    let filterUserData = '{"where":{"groupId":'+id+'}, "include":["customer"]}';
    this.dataService.getData('groupchats?filter='+filterUserData).then((res:any)=>{
      //if(res.length>0){
        //console.log('Response Chat',res);
        this.chatList=res;
      //}
    },err=>{
    
    })
  }

  sendChat(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
    });
    this.loading.present();
    let inputMsg = this.message;
    if(inputMsg!=''){
      let chatData={
        "customerId": this.userData.id,
        "groupId": this.groupId,
        "message": inputMsg,
      };
      this.dataService.postData(chatData,'groupchats').then((result) => {
        this.getGroupChat(this.groupId);
        this.message = '';
        this.loading.dismissAll();
      }, (err) => {
        this.loading.dismissAll();
      });
    } else {
      this.loading.dismissAll();
    }
  }

}
