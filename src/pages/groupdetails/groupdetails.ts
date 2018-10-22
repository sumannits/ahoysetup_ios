import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController,ToastController} from 'ionic-angular';
import { AuthServiceProvider } from '../../providers';
/**
 * Generated class for the GroupdetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-groupdetails',
  templateUrl: 'groupdetails.html',
})
export class GroupdetailsPage {
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

  constructor(
    public navCtrl: NavController, 
    public dataService: AuthServiceProvider,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public toastCtrl:ToastController
  ) {
    this.groupId = this.navParams.get('group_id');
    const loguserDet = JSON.parse(localStorage.getItem('userPrfDet'));
    this.userData=loguserDet;
    this.getimageURI= this.dataService.apiImgUrl();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad GroupdetailsPage');
    this.getGroupDetails();
    this.getAllComment();
    this.getGroupTagList();
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
        this.loading.dismissAll()
    },err=>{
      this.loading.dismissAll()
    })
  }
  
  sendMsg(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
    });
    this.loading.present();
    //console.log(this.message.trim());
    let inputMsg = this.message;
    let parentId = 0;
    if(inputMsg!=''){
        let userDataMsg = {message: inputMsg, is_delete: false, type: 1, customerId: this.userData.id, is_parent: parentId, typepid:this.groupId};
        this.dataService.postData(userDataMsg,'comments').then((res:any)=>{
            this.message = '';
            this.getAllComment();
            this.loading.dismissAll()
        },err=>{
          this.loading.dismissAll()
        })
    }else{
      this.loading.dismissAll();
    }
    
  }

  getGroupTagList(){
    let filterData = '{"where":{"group_id":'+this.groupId+'}, "include":["interest"], "order" : "id desc"}';
    this.dataService.getData('GroupInterests?filter='+filterData).then((result:any) => {
      this.groupTag = result;
      //console.log(result);
    }, (err) => {
      
    }); 
    
  }
  
  getAllComment(){
    let filterData = '{"where":{"typepid":'+this.groupId+',"type":1}, "include":["customer"], "order" : "id desc"}';
    this.dataService.getData('comments?filter='+filterData).then((result:any) => {
      result.forEach((datafilter : any, key: any) => {
        result[key].is_like = false;
        let filterData111 = '{"customerId":'+this.userData.id+',"commentId":'+datafilter.id+'}';
        this.dataService.getData('comment_likes/count?where='+filterData111).then((res:any) => {
          if(res.count >0){
            result[key].is_like = true;
          }
        }, (err) => {
          
        });
      });
      this.allCommentList=result;
      //console.log(result);
      
    }, (err) => {
      
    }); 
  }
  
  likeComment(data, indexdata){
    let userDataMsg = {customerId: this.userData.id, commentId: data.id};
    this.dataService.postData(userDataMsg,'comment_likes').then((res:any)=>{
      this.allCommentList[indexdata].is_like = true;
    },err=>{
      
    })
  }

  unlikeComment(data, indexdata){
    let userDataMsg = {customerId: this.userData.id, commentId: data.id};
    this.dataService.postData(userDataMsg,'comment_likes/deleteAllData').then((res:any)=>{
      this.allCommentList[indexdata].is_like = false;
    },err=>{
      
    })
  }

  join(id){
    if(id != ''){
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...',
      });
      this.loading.present();
      let JsonData={
        "group_id": id,
        "customerId": this.userData.id
      };
      this.dataService.postData(JsonData,'GroupUsers').then((result) => {
        this.responseData = result;
        if(this.responseData.id){
          let toast = this.toastCtrl.create({
            message: 'You have successfully joined the group.',
            duration: 4000,
            position: 'top'
          });
          toast.present();
        }
        this.loading.dismissAll();
      }, (err) => {
        let toast = this.toastCtrl.create({
          message: 'Something Went wrong.Please try again.',
          duration: 4000,
          position: 'top'
        });
        toast.present();
        this.loading.dismissAll();
      });
    } else {
      let toast = this.toastCtrl.create({
        message: 'Please provide id.',
        duration: 4000,
        position: 'top'
      });
      toast.present();
    }
  }

  cevent(){
    this.navCtrl.push('CreateeventPage');
  }
  createChat(){
    this.navCtrl.push('GroupchatPage',{'group_id':this.groupId});
  }

  leave(id){
    if(id != ''){
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...',
      });
      this.loading.present();
      let JsonData={
        "group_id": id,
        "customerId": this.userData.id
      };
      this.dataService.postData(JsonData,'GroupUsers/deletegrpc').then((result) => {
          this.responseData = result;
          if(this.responseData.response.type == "success"){
            let toast = this.toastCtrl.create({
              message: 'You have successfully leaved the group.',
              duration: 4000,
              position: 'top'
            });
            toast.present();
            this.navCtrl.setRoot('GroupdetailsPage',{'group_id':this.groupId});
          }
          this.loading.dismissAll();
      }, (err) => {
        let toast = this.toastCtrl.create({
          message: 'Something Went wrong.Please try again.',
          duration: 4000,
          position: 'top'
        });
        toast.present();
        this.loading.dismissAll();
      });
    } else {
      let toast = this.toastCtrl.create({
        message: 'Please provide group id.',
        duration: 4000,
        position: 'top'
      });
      toast.present();
    }
  }

  goToEvents(){
    this.navCtrl.setRoot('EventlistPage');
  }
}
