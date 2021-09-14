import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaplocobuzzentitiesService } from 'app/core/services/maplocobuzzentities.service';
import { PostDetailService } from 'app/social-inbox/services/post-detail.service';
import { TicketsService } from 'app/social-inbox/services/tickets.service';

@Component({
  selector: 'app-add-associate-channels',
  templateUrl: './add-associate-channels.component.html',
  styleUrls: ['./add-associate-channels.component.scss']
})
export class AddAssociateChannelsComponent implements OnInit {

  searchedUsers: Array<object> = [];
  isSelected: string;
  channelID: string;
  authorSocialID: string;

  constructor(private _postDetailService: PostDetailService,
              private _ticketService: TicketsService,
              private mapLocobuzz: MaplocobuzzentitiesService,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }


  searchUser(text, channel): void
  {
    if (text.value)
    {
      console.log('Search Text', text.value);
      console.log(channel.value);

      const object = {
        BrandInfo: this._postDetailService.postObj.brandInfo,
        ChannelGroup : channel.value,
        SearchText : text.value,
        Offset : 0,
        NoOfRows : 10

      };


      this._ticketService.searchByNameUsers(object).subscribe((data) =>
      {
        this.searchedUsers = data['data'];
        console.log('SearchUser', this.searchedUsers);
      });

    }
    else
    {
      this.searchedUsers = [];
    }

  }

  onSelect(event): void
  {
    console.log(event);
    this.isSelected = event.screenname;
    this.channelID = event.channelGroup;
    this.authorSocialID = event.socialId;
  }

  saveUsers(): void
  {
    if (this.isSelected)
    {
      const source = this.mapLocobuzz.mapMention(this._postDetailService.postObj);
      const object = {
        BrandInfo: source.brandInfo,
        Author: source.author,
        MapAuthorSocialID : this.authorSocialID,
        Mapchannelgroupid : this.channelID
      };

      console.log(object);

      this._ticketService.SaveMapSocialUsers(object).subscribe((data) => {
        if ( JSON.parse(JSON.stringify(data)).success)
        {
          console.log(data)
          this.snackBar.open('User Added Successfully', '', {
            duration: 1500
          });
        }
        else
        {
          this.snackBar.open('Error Occured', '', {
            duration: 1500
          });

        }
      });
    }
    else
    {
      this.snackBar.open('Please Select The User', 'Ok', {
        duration: 1500
      });
    }
  }

}
