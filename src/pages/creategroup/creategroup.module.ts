import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreategroupPage } from './creategroup';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';

@NgModule({
  declarations: [
    CreategroupPage,
  ],
  imports: [
    IonicPageModule.forChild(CreategroupPage),
    Ng4GeoautocompleteModule.forRoot(),
  ],
})
export class CreategroupPageModule {}
