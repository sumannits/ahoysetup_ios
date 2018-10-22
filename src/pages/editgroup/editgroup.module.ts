import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditgroupPage } from './editgroup';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';

@NgModule({
  declarations: [
    EditgroupPage,
  ],
  imports: [
    IonicPageModule.forChild(EditgroupPage),
    Ng4GeoautocompleteModule.forRoot(),
  ],
})
export class EditgroupPageModule {}
