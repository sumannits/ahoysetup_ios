import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FriendlistPage } from './friendlist';

@NgModule({
  declarations: [
    FriendlistPage,
  ],
  imports: [
    IonicPageModule.forChild(FriendlistPage),
  ],
})
export class FriendlistPageModule {}
