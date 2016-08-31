import {Component, Input, OnInit, OnChanges} from '@angular/core';
import {TimeAgoPipe, FromUnixPipe} from 'angular2-moment';
import {SocialProvider} from '../../providers/social-provider/social-provider';
@Component({
    selector: 'post',
    pipes: [TimeAgoPipe, FromUnixPipe],
    templateUrl: 'build/component/post/post.html'
})
export class PostCmp {
    @Input() feed;
    post;
    poster;
    constructor(public socialProvider:SocialProvider) {}

    ngOnInit() {
        let postID = this.feed.$key;
        this.post = this.socialProvider.getPost(postID);
        this.post
        .subscribe(value => {
            this.poster = this.socialProvider.getUser(value.from);
        });
    }
}