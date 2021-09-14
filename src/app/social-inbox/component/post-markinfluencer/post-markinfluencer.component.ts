import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChannelGroup } from 'app/core/enums/ChannelGroup';
import { PostDetailService } from 'app/social-inbox/services/post-detail.service';
import { TicketsService } from 'app/social-inbox/services/tickets.service';

@Component({
  selector: 'app-post-markinfluencer',
  templateUrl: './post-markinfluencer.component.html',
  styleUrls: ['./post-markinfluencer.component.scss']
})
export class PostMarkinfluencerComponent implements OnInit {


  influencer: object;
  selectedInfluencer: number;
  influencerList: Array<string> = [];

  constructor(private _ticketService: TicketsService,
              private _postDetailService: PostDetailService,
              private snackBar: MatSnackBar,
              public dialogRef: MatDialogRef<PostMarkinfluencerComponent>) { }

  ngOnInit(): void {

    this.generateInfluencerList();
    this.selectedInfluencer = this._postDetailService.postObj.author.markedInfluencerCategoryID;
    console.log(this.selectedInfluencer)

  }


  private generateInfluencerList(): void
  {

    console.log(this._postDetailService.postObj);
    const object = {
      BrandID : this._postDetailService.postObj.brandInfo.brandID,
      BrandName : this._postDetailService.postObj.brandInfo.brandName,
      BrandFriendlyName : this._postDetailService.postObj.brandInfo.brandFriendlyName,
      CategoryID : this._postDetailService.postObj.brandInfo.categoryID,
      CategoryName : '',
      BrandGroupName : '',
      BColor : '',
      CampaignName : '',
    };

    console.log(JSON.stringify(object));

    this._ticketService.getBrandInfluencerList(object).subscribe((data) =>
    {
      this.influencerList = data['data'];
      console.log('Influencer', this.influencerList);
    });

  }

  updateInfluencer(event): void
  {
    this.influencer = event;
  }


  updateAPI(): void
  {
      console.log(this.influencer['source'].triggerValue);
      const object = {
        InfluencerCategoryID : this.influencer['value'],
        InfluencerCategoryName : this.influencer['source'].triggerValue,
        ChannelType : ChannelGroup[this._postDetailService.postObj.channelGroup],
        AuthorSocialID : this._postDetailService.postObj.author.socialId,
        ScreenName : this._postDetailService.postObj.author.screenname || '',
        BrandName : this._postDetailService.postObj.brandInfo.brandName,
        BrandID : this._postDetailService.postObj.brandInfo.brandID,
      };

      // if (object.ScreenName === null)
      // {
      //   object.ScreenName = '';
      // }

      // console.log(JSON.stringify(object));

      this._ticketService.insertUpdateInfluencer(object).subscribe((data) =>
      {
      if (JSON.parse(JSON.stringify(data)).success)
      {
        this._postDetailService.postObj.author.markedInfluencerCategoryID =  object.InfluencerCategoryID;
        this._postDetailService.postObj.author.markedInfluencerCategoryName = object.InfluencerCategoryName;
        this._postDetailService.setMarkInfluencer.next(this._postDetailService.postObj);
        this.dialogRef.close(true);
        this.snackBar.open('Influencer Marked', '', {
          duration: 1000
        });
      }
      else
         {
          this.snackBar.open('Error Occured', '', {
            duration: 1000
          });
         }

      });
  }


  inActiveInfluencer(): void{

    const object = {
      InfluencerCategoryID : this._postDetailService.postObj.author.markedInfluencerCategoryID,
      InfluencerCategoryName : this._postDetailService.postObj.author.markedInfluencerCategoryName,
      ChannelType : ChannelGroup[this._postDetailService.postObj.channelGroup],
      AuthorSocialID : this._postDetailService.postObj.author.socialId,
      ScreenName : this._postDetailService.postObj.author.screenname || '',
      BrandName : this._postDetailService.postObj.brandInfo.brandName,
      BrandID : this._postDetailService.postObj.brandInfo.brandID,
      IsInactive : 1,
    };

    console.log(JSON.stringify(object));


    this._ticketService.inActiveInfluencer(object).subscribe((data) =>
    {
      if (JSON.parse(JSON.stringify(data)).success)
      {
        console.log('Influencer Removed', data);
        this._postDetailService.postObj.author.markedInfluencerCategoryID = null;
        this._postDetailService.setMarkInfluencer.next(this._postDetailService.postObj);
        this.selectedInfluencer = null;
        this.dialogRef.close(true);
        this.snackBar.open('Influencer Removed', '', {
          duration: 1000
        });
      }
      else
         {
          this.snackBar.open('Error Occured', '', {
            duration: 1000
          });
         }

    });

  }

}
