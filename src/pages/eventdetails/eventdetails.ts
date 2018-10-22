import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController,ToastController} from 'ionic-angular';
import { AuthServiceProvider } from '../../providers';

/**
 * Generated class for the EventdetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-eventdetails',
  templateUrl: 'eventdetails.html',
})
export class EventdetailsPage {
  public groupId : any;
  public pet:string = 'group';
  public loading: Loading;
  public getimageURI:any;
  public userData:any;
  public groupDetails:any;
  public message:string = '';
  public allCommentList = [];
  public groupTag = [];
  public responseData:any;
  constructor(public navCtrl: NavController, 
    public dataService: AuthServiceProvider,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public toastCtrl:ToastController) {
    this.groupId = this.navParams.get('event_id');
    const loguserDet = JSON.parse(localStorage.getItem('userPrfDet'));
    this.userData=loguserDet;
    this.getimageURI= this.dataService.apiImgUrl();
  }

  ionViewDidLoad() {
    this.getGroupDetails();
    this.getAllComment();
    this.getGroupTagList();
  }

  getGroupDetails(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
    });
    this.loading.present();
    this.dataService.getData('events/'+this.groupId).then((res:any)=>{
        res.ismember=false;
        let filterJoinData = '{"where":{"event_id":'+this.groupId+',"customerId":'+this.userData.id+'}}';
        this.dataService.getData('EventUsers?filter='+filterJoinData).then((res1:any)=>{
          if(res1.length>0){
            res.ismember=true;
          }
        },err=>{
        
        });
        let filterJoinDatacount = '{"where":{"event_id":'+this.groupId+'}}';
        this.dataService.getData('EventUsers/count?filter='+filterJoinDatacount).then((res2:any)=>{
            res.countevent=res2.count;
        },err=>{
        
        })
        let grpImg = '';
        if(res.image != null){
          grpImg = this.getimageURI+'event/'+res.image;
        }else{
          grpImg = './assets/img/default512.png';
        }
        res.image_url=grpImg;
        this.groupDetails= res;
        //console.log('this.groupDetails',this.groupDetails);
        this.loading.dismissAll();
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
        let userDataMsg = {message: inputMsg, is_delete: false, type: 2, customerId: this.userData.id, is_parent: parentId, typepid:this.groupId};
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
    let filterData = '{"where":{"event_id":'+this.groupId+'}, "include":["interest"], "order" : "id desc"}';
    this.dataService.getData('EventInterests?filter='+filterData).then((result:any) => {
      this.groupTag = result;
      //console.log(result);
    }, (err) => {
      
    }); 
    
  }
  
  getAllComment(){
    let filterData = '{"where":{"typepid":'+this.groupId+',"type":2}, "include":["customer"], "order" : "id desc"}';
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
      console.log('allCommentList',result);
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
        "event_id": id,
        "customerId": this.userData.id
      };
      this.dataService.postData(JsonData,'EventUsers').then((result) => {
        this.responseData = result;
        if(this.responseData.id){
          let toast = this.toastCtrl.create({
            message: 'You have successfully joined the event.',
            duration: 4000,
            position: 'top'
          });
          toast.present();
        }
        this.getGroupDetails();
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

  leave(id){
    if(id != ''){
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...',
      });
      this.loading.present();
      let JsonData={
        "event_id": id,
        "customerId": this.userData.id
      };
      this.dataService.postData(JsonData,'EventUsers/deletegrpc').then((result) => {
          this.responseData = result;
          if(this.responseData.response.type == "success"){
            let toast = this.toastCtrl.create({
              message: 'You have successfully leaved the event.',
              duration: 4000,
              position: 'top'
            });
            toast.present();
            this.getGroupDetails();
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

}
