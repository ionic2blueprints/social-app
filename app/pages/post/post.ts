import {Component} from '@angular/core';
import {ViewController, NavController, ActionSheet} from 'ionic-angular';
import {SocialProvider} from '../../providers/social-provider/social-provider';
import {UtilProvider} from '../../providers/utils';
@Component({
    templateUrl: 'build/pages/post/post.html'
})
export class PostPageModal {
    postContent:string;
    image = null;
    blobImage;
    constructor(
        private viewController:ViewController, 
        private navController: NavController, 
        private socialProvider: SocialProvider, 
        private util:UtilProvider) {
    }

    dismiss() {
        this.viewController.dismiss();
    }

    sendPost() {
        let obj = {content: this.postContent, image:this.image};
        this.socialProvider.createPost(obj)
        .then((postKey) => {
            console.log(postKey);
            // if Image is Added
            if(this.blobImage) {
                this.socialProvider.postImage(postKey, this.blobImage)
                .then(url => {
                    this.socialProvider.updatePost(postKey,{image:url});
                });
            }
            this.reset();
            this.dismiss();
        });
    }

    addImage() {
        this.presentPictureSource()
        .then(source => {
            let sourceType:number = Number(source);
            return this.util.getPicture(sourceType, false);
        })
        .then(imageData => {
            this.blobImage = this.util.dataURItoBlob(imageData);
        });
    }

    presentPictureSource() {
        let promise = new Promise((res, rej) => {
            let actionSheet = ActionSheet.create({
            title: 'Select Picture Source',
            buttons: [
                { text: 'Camera', handler: () => { res(1); } },
                { text: 'Gallery', handler: () => { res(0); } },
                { text: 'Cancel', role: 'cancel', handler: () => { rej('cancel'); } }
            ]
            });
            this.navController.present(actionSheet);
        });
        return promise;
    }

    reset() {
        this.postContent = "";
        this.image = null;
        this.blobImage = null;
    }
}