import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AutochatPage } from './autochat';

@NgModule({
  declarations: [
    AutochatPage,
  ],
  imports: [
    IonicPageModule.forChild(AutochatPage),
  ],
})
export class AutochatPageModule {}
