import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController} from 'ionic-angular';
import { AuthServiceProvider } from '../../providers';

/**
 * Generated class for the EventlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-eventlist',
  templateUrl: 'eventlist.html',
})
export class EventlistPage {

  public loading: Loading;
  public userData:any;
  public allMyGroup = [];
  public getimageURI:any;
  public pet:string = 'event';

  constructor(
    public navCtrl: NavController, 
    public dataService: AuthServiceProvider,
    public loadingCtrl: LoadingController,
    public navParams: NavParams
  ) {
    const loguserDet = JSON.parse(localStorage.getItem('userPrfDet'));
    this.userData=loguserDet;
    this.getimageURI= this.dataService.apiImgUrl();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad EventlistPage');
    this.getMyEventList();
  }

  getMyEventList(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
    });
    this.loading.present();
    let filterData = '{"where":{"user_id":'+this.userData.id+',"is_active":true}, "order" : "id desc"}';
    this.dataService.getData('events?filter='+filterData).then((res:any)=>{
      if(res.length>0){
        res.forEach((datafilter : any, key: any) => {
          let filterData34 = '{"event_id":'+datafilter.id+'}';
          this.dataService.getData('EventUsers/count?where='+filterData34).then((resct:any)=>{
              res[key].countgrp=resct.count;
          },err=>{

          })
          let grpImg = '';
          if(datafilter.image != null){
            grpImg = this.getimageURI+'event/'+datafilter.image;
          }else{
            grpImg = './assets/img/default.jpeg';
          }
          res[key].image_url=grpImg;
        });
        //this.allMyGroup= res;
      }
      let filterJoinData = '{"where":{"customerId":'+this.userData.id+'}, "order" : "id desc", "include":["eventdet"]}';
      this.dataService.getData('EventUsers?filter='+filterJoinData).then((res1:any)=>{
        if(res1.length>0){
          //console.log('res1',res1);
          let newGrpCnt = res.length;
          res1.forEach((datafilter : any, key: any) => {
            let filterData345 = '{"event_id":'+datafilter.id+'}';
            this.dataService.getData('EventUsers/count?where='+filterData345).then((resct1:any)=>{
              datafilter.eventdet.countgrp =resct1.count;
            },err=>{

            })
            let grpImg = '';
            if(datafilter.eventdet.image != null){
              grpImg = this.getimageURI+'event/'+datafilter.eventdet.image;
            }else{
              grpImg = './assets/img/default.jpeg';
            }
            res[newGrpCnt]=datafilter.eventdet;
            res[newGrpCnt].image_url=grpImg;
            newGrpCnt++;
          });
          
        }
        this.allMyGroup= res;
      },err=>{
        
      })
      this.loading.dismissAll()
    },err=>{
      this.loading.dismissAll()
    })
  }

  createEvent(){
    this.navCtrl.push('CreateeventPage');
  }

  gotoEditGroup(id){
    this.navCtrl.push('EditeventPage',{'group_id':id});
  }

  gotoGroupDetails(id){
    this.navCtrl.push('EventdetailsPage',{'event_id':id});
  }

  search(){
    this.navCtrl.push('EventserachPage');
  }

}
