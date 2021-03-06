import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController} from 'ionic-angular';
import { AuthServiceProvider, ResponseMessage } from '../../providers';
/**
 * Generated class for the GrouplistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-grouplist',
  templateUrl: 'grouplist.html',
})
export class GrouplistPage {

  public loading: Loading;
  public userData:any;
  public allMyGroup = [];
  public getimageURI:any;
  public pet:string = 'group';

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
    this.getMyGroupList();
  }

  getMyGroupList(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
    });
    this.loading.present();
    //let filterUserData = '{"where":{"is_active":true, "id":{"neq":1,"neq":'+this.userData.id+'}}}';
    let filterData = '{"where":{"user_id":'+this.userData.id+',"is_active":true}, "order" : "id desc"}';
    this.dataService.getData('UserGroups?filter='+filterData).then((res:any)=>{
      if(res.length>0){
        res.forEach((datafilter : any, key: any) => {
          let filterData34 = '{"group_id":'+datafilter.id+'}';
          this.dataService.getData('GroupUsers/count?where='+filterData34).then((resct:any)=>{
              res[key].countgrp=resct.count;
          },err=>{

          })
          let grpImg = '';
          if(datafilter.image != null){
            grpImg = this.getimageURI+'group/'+datafilter.image;
          }else{
            grpImg = './assets/img/default.jpeg';
          }
          res[key].image_url=grpImg;
        });
        //this.allMyGroup= res;
      }
      let filterJoinData = '{"where":{"customerId":'+this.userData.id+'}, "order" : "id desc", "include":["groupdet"]}';
      this.dataService.getData('GroupUsers?filter='+filterJoinData).then((res1:any)=>{
        if(res1.length>0){
          let newGrpCnt = res.length;
          res1.forEach((datafilter : any, key: any) => {
            let filterData345 = '{"group_id":'+datafilter.id+'}';
            this.dataService.getData('GroupUsers/count?where='+filterData345).then((resct1:any)=>{
              datafilter.groupdet.countgrp =resct1.count;
            },err=>{

            })
            let grpImg = '';
            if(datafilter.groupdet.image != null){
              grpImg = this.getimageURI+'group/'+datafilter.groupdet.image;
            }else{
              grpImg = './assets/img/default.jpeg';
            }
            res[newGrpCnt]=datafilter.groupdet;
            res[newGrpCnt].image_url=grpImg;
            newGrpCnt++;
          });
          //
        }
        this.allMyGroup= res;
      },err=>{
        
      })
      this.loading.dismissAll()
    },err=>{
      this.loading.dismissAll()
    })
  }

  gotoGroupDetails(gid:any){
    this.navCtrl.setRoot('GroupdetailsPage',{'group_id':gid});
  }
  
  gotoEditGroup(gid:any){
    this.navCtrl.push('EditgroupPage',{'group_id':gid});
  }

  createGroup(){
    this.navCtrl.push('CreategroupPage');
  }

  search(){
    this.navCtrl.push('GroupserachPage');
  }
}
