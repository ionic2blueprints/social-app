import {Injectable, Inject} from '@angular/core';
import {Alert, Toast,Platform} from 'ionic-angular';
import {Camera} from 'ionic-native';

@Injectable()
export class UtilProvider {
    constructor(private platform: Platform) {}
    doAlert(title, message, buttonText) {
      let alert = Alert.create({
          title: title,
          subTitle: message,
          buttons: [buttonText]
      });
      return alert; 
    };

    getToast(message) {
        let toast = Toast.create({
            message: message,
            duration: 1000
        });
        return toast;
    }

    dataURItoBlob(dataURI) {
        // convert base64 to raw binary data held in a string
        var byteString = atob(dataURI.split(',')[1]);
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        // write the ArrayBuffer to a blob, and you're done
        var bb = new Blob([ab], {type: mimeString});
        return bb;
    }

  // Get Picture
  getPicture(sourceType = 0, allowEdit = true) {
      let base64Picture;
      let options = {
          destinationType:0,
          sourceType: sourceType,
          encodingType:0 ,
          mediaType:0,
          allowEdit: allowEdit
      };
      
      let promise = new Promise((resolve, reject) => {
        Camera.getPicture(options).then((imageData) => {
            base64Picture = "data:image/jpeg;base64," + imageData;
            resolve(base64Picture);
        }, (error) => {
            reject(error);
        });
      });
      return promise;
  }
}