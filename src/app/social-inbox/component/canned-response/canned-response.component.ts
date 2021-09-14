import { LoaderService } from './../../../shared/services/loader.service';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostDetailService } from 'app/social-inbox/services/post-detail.service';
import { ReplyService } from 'app/social-inbox/services/reply.service';
import { TicketsService } from 'app/social-inbox/services/tickets.service';

@Component({
  selector: 'app-canned-response',
  templateUrl: './canned-response.component.html',
  styleUrls: ['./canned-response.component.scss']
})
export class CannedResponseComponent implements OnInit {

  cannedCategoryList: Array<object> = [];
  selectedCannedCategory: number;
  cannedResponseList: Array<object> = [];
  selectedCannedResponse: number;
  responseText: string;

  constructor(private ticketService: TicketsService,
              private _postDetailService: PostDetailService,
              private _replyService: ReplyService,
              private _snackBar: MatSnackBar,
              private _loaderService: LoaderService,
              public dialogRef: MatDialogRef<CannedResponseComponent>) { }

  ngOnInit(): void {
    this.getCannedList();
  }

  private getCannedList(): void{

    this._loaderService.togglComponentLoader({
      status: true,
      section: 'canned-response'
    });
    // const object = {
    //   brandID : this._postDetailService.postObj.brandInfo.brandID,
    //   brandName : this._postDetailService.postObj.brandInfo.brandName,
    //   categoryGroupID : this._postDetailService.postObj.brandInfo.categoryGroupID,
    //   categoryID : this._postDetailService.postObj.brandInfo.categoryID,
    //   categoryName : this._postDetailService.postObj.brandInfo.categoryName,
    //   mainBrandID : this._postDetailService.postObj.brandInfo.mainBrandID,
    //   compititionBrandIDs : this._postDetailService.postObj.brandInfo.compititionBrandIDs,
    //   brandFriendlyName : this._postDetailService.postObj.brandInfo.brandFriendlyName,
    //   brandLogo : this._postDetailService.postObj.brandInfo.brandLogo,
    //   isBrandworkFlowEnabled : this._postDetailService.postObj.brandInfo.isBrandworkFlowEnabled,
    //   brandGroupName : this._postDetailService.postObj.brandInfo.brandGroupName
    // }
    const brandInfo = this._postDetailService.postObj.brandInfo;
    const cannedresp = {
      Brand: brandInfo,
      SearchCategory: null
    };

    this.ticketService.getCannedResponseCategories(cannedresp).subscribe((data: {data: Array<any>, message: string, success: boolean}) =>
    {
      if (data.data.length > 0){
        this.cannedCategoryList = data.data;
        console.log('Canned Category List', this.cannedCategoryList);
        this.selectedCannedCategory = this.cannedCategoryList[0]['responseCategoryID'];
        this.getCannedName(this.selectedCannedCategory);
      }
      this._loaderService.togglComponentLoader({
        status: false,
        section: 'canned-response'
      });


    });
  }

  selectCanned(event): void{
    this.selectedCannedCategory = event.value;
    this.getCannedName(this.selectedCannedCategory);
  }

  private getCannedName(event): void{

    const object = {
      Brand : this._postDetailService.postObj.brandInfo,
      CannedCategoryID : event
    };

    this.ticketService.getCannedResponse(object).subscribe((data) =>
    {
      this.cannedResponseList = data['data'];
      console.log('Canned Response List', this.cannedResponseList);
      this.selectedCannedResponse = this.cannedResponseList[0]['id'];
      this.responseText = this.cannedResponseList[0]['responseText'];
    });


  }


  selectCannedResponse(name, text): void{
    this.selectedCannedResponse = name;
    this.responseText = text;
  }

  setCannedResponse(): void{
    if (this.responseText)
    {
      this._replyService.selectedCannedResponse.next(this.responseText);
      this.dialogRef.close(true);
    }else{
      this._snackBar.open('Canned response is empty', 'Ok', {
        duration: 2000
      });
    }
  }
}
