import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupchatlistPage } from './groupchatlist';

@NgModule({
  declarations: [
    GroupchatlistPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupchatlistPage),
  ],
})
export class GroupchatlistPageModule {}
