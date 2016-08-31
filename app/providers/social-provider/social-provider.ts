import {Injectable} from '@angular/core';
import {UserProvider} from '../user-provider/user-provider';
import {AngularFire} from 'angularfire2';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class SocialProvider {
    constructor(private userProvider: UserProvider, private af: AngularFire) {}
    
    // // Get Logged In User's Feed
    // getAllPosts(uid) {
    //     let url:string = `/users/${uid}/feed`;
    //     let observable = Observable.create((observer)=>{
    //         let postRef = firebase.database().ref(url);
    //         postRef.on('child_added', (data) => {
    //             observer.next(data);
    //         });
    //     });
    //     let once = this.af.database.list(url).take(1);
    //     return {once:once, listen: observable};
    // }

    // Follow the user
    followUser(userData) {
        return this.userProvider.getUid()
        .then((uid:string) => {
            let otherUserID = userData.$key;
            let followingList = this.af.database.object(`/users/${uid}/following`);
            followingList.update({[otherUserID]: true});
            let followerList = this.af.database.object(`/users/${otherUserID}/followers`);
            return followerList.update({[uid]: true});
        });
    }

    // Get the Post Data given in postID
    getPost(postID) {
        return this.af.database.object(`/posts/${postID}`);
    }

    // Post Image for a given post via postID
    postImage(postID, imageData) {
        let promise = new Promise((res,rej) => {
            let fileName = postID + ".jpg";
            let uploadTask = firebase.storage().ref(`/posts/${fileName}`).put(imageData);
            uploadTask.on('state_changed', function(snapshot) {
            }, function(error) {
                rej(error);
            }, function() {
            var downloadURL = uploadTask.snapshot.downloadURL;
                res(downloadURL);
            });
        });
        return promise;
     }
    
    // Update Post given via postID with given object value
    updatePost(postID, obj) {
        return this.af.database.object(`/posts/${postID}`).update(obj);
    }
  
    // Upload Post
    createPost(postData) {
        let uid;
        let posts = this.af.database.list('/posts');
        return this.userProvider.getUid()
        .then(userid => {
            uid = userid;
            postData.from = uid;
            postData.timestamp = firebase.database['ServerValue'].TIMESTAMP;
            return posts.push(postData).key;
        })
        .then(postKey => {
            let userFeed = this.af.database.object(`/users/${uid}/feed`);
            userFeed.update({[postKey]: true});

            this.af.database.list(`/users/${uid}/followers`)
            .subscribe(followers => {
               followers.forEach(follower => {
                   this.af.database.object(`/users/${follower.$key}/feed`).update({[postKey]: true});
               });
            });

            return Promise.resolve(postKey);
        });
    }

    // Get User via uid
    getUser(uid) {
        return this.af.database.object(`/users/${uid}`);
    }  
}