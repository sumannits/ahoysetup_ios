import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AuthServiceProvider,ResponseMessage } from '../providers';
import { MyApp } from './app.component';
//import { GoogleMapsProvider } from '../providers/google-maps/google-maps';
//import { Connectivity } from '../providers/connectivity-service/connectivity-service';
import { Geolocation } from '@ionic-native/geolocation';
//import { GoogleMapProvider } from '../providers/google-map/google-map';
//import { Network } from '@ionic-native/network';
//import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


// const cloudSettings: CloudSettings = {
//   'core': {
//     'app_id': '8e999b9b'
//   }
// };

// export function provideSettings(storage: Storage) {
//   /**
//    * The Settings provider takes a set of default settings for your app.
//    *
//    * You can add new settings options at any time. Once the settings are saved,
//    * these values will not overwrite the saved values (this can be done manually if desired).
//    */
//   return new Settings(storage, {
//     option1: true,
//     option2: 'Ionitron J. Framework',
//     option3: '3',
//     option4: 'Hello'
//   });
// }

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    //SelectSearchableModule
    //CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    AuthServiceProvider,
    ResponseMessage,
    Camera,
    FileTransfer,
    FilePath,
    File,
    SplashScreen,
    
    //{ provide: Settings, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    // GoogleMapsProvider,
    //Connectivity,
    Geolocation,
    //GoogleMapProvider,
    //Network
  ]
})
export class AppModule { }
