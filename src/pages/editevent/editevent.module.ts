import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditeventPage } from './editevent';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
@NgModule({
  declarations: [
    EditeventPage,
  ],
  imports: [
    IonicPageModule.forChild(EditeventPage),
    Ng4GeoautocompleteModule.forRoot(),
  ],
})
export class EditeventPageModule {}
