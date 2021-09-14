import { postDetail } from './../../app-data/post-detail';
import { Injectable } from '@angular/core';
import { BaseMention } from 'app/core/models/mentions/locobuzz/BaseMention';
import { BehaviorSubject } from 'rxjs';
import { CommunicationLog } from 'app/core/models/viewmodel/CommunicationLog';
import { PostsType } from 'app/core/models/viewmodel/GenericFilter';

@Injectable({
    providedIn: 'root'
})
export class PostDetailService {
    postDetailData: {};
    postObj: BaseMention;
    tabIndex: number = 0;
    categoryType: string;
    openInNewTab = false;
    currentPostObject = new BehaviorSubject<number>(0);
    setMarkInfluencer = new BehaviorSubject<BaseMention>(null);
    isBulk = false;
    pagetype: PostsType;
    refreshNewTab = true;
    ticketOpenDetail: BaseMention;
    constructor() {
        this.postDetailData = postDetail;
    }
}
