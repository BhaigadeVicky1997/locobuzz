import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { TicketsService } from './tickets.service';


@Injectable({
  providedIn: 'root'
})
export class catefilterData {

  // public postRequestData = {"Source":{"ID":0,"SocialID":"m_th7W6cdTFlJN5HsXFErBEkAiz4cAoV0uMo4F78HJrZpihP9RJezHpGIGr9mWFyms8SGwrEgFBzlBKED3mG7Dlg","ParentSocialID":"","ParentID":0,"Title":"","IsActionable":0,"ChannelType":"40","ChannelGroup":"2","LikeCount":0,"CommentCount":"0","Url":1,"TagID":277415,"IsDeleted":0,"MediaType":0,"Status":0,"IsBrandPost":0,"UpdatedDateTime":null,"Location":0,"LikeStatus":0,"BrandInfo":{"BrandID":"7121","BrandName":"wrong","BrandFriendlyName":"","CategoryID":0,"CategoryName":"","BrandGroupName":"","BColor":"","CampaignName":""},"Author":{ID:0,"SocialID":" 4987188741353989",Name:"","URL":"","PicUrl":"","Location":"","Screenname":"","IsVerified":false,"IsMute":false,"IsBlock":false,"IsUserFollowing":false,"IsBrandFollowing":false,"UserTags":[],"MarkInfluencer":{},"ConnectedUsers":[],"LocoBuzzCRMDetails":{ID:0,Name:null,"EmailID":null,"AlternativeEmailID":null,"PhoneNumber":null,"AlternatePhoneNumber":null,"Link":null,"Address1":null,"Address2":null,"Notes":null,"City":null,"State":null,"Country":null,"ZIPCode":null,"SSN":null},"type":""},"TicketInfo":{"TicketID":223797,"AssignedBy":0,"AssignedTo":0,"EscalatedTo":0,"EscalatedBy":0,"Status":0,"NumberOfMentions":0,"TicketPriority":0,"LastNote":"","AutoClose":false,"PreviousAssignedTo":0,"TagID":277415},"CategoryMap":[{ID:"33773",Name:"miscellaneous","Sentiment":null,"SubCategories":[{ID:"32531",Name:"Q1","Sentiment":null,"SubSubCategories":[{ID:"42406",Name:"Q2","Sentiment":"1"}]}]}],"UpperCategory":{ID: null,Name:"none","UserID":null},"type":"TicketTwitter","TaggedUsersJson":"","Description":"","Caption":"","CanReply":"true","ReplyScheduledDateTime":null,"WorkflowStatus":0,"IsTakeOver":null,"InReplyToStatusId":0,"ContentID":"32963","RetweetedStatusID":"","ShareCount":"0"},"TagAlltagIds":true,"isAllMentionUnderTicketId":false,"isTicketCategoryEnabled":"0","IsTicket":"false"};


  public categoryData;

  constructor(
    public httpClient: HttpClient,
    private _ticketService: TicketsService) {

  }

  onParentClick(event, data, categoryCards, savedparent, savedsubCategory, savedsubsubCategory,
    parentRadio): void {
    if (event._checked) {
      categoryCards.push({ id: data.categoryID, name: data.category, sentiment: '0', subCategories: [] });
      savedparent.set(data.category, data.category);
      data.sentiment = '0';
      parentRadio.set(data.category, '0');

    }
    else {
      data.sentiment = null;
      savedparent.delete(data.category);
      for (let i = 0; i < categoryCards.length; i += 1) {
        if (categoryCards[i].name === data.category) {

          for (const item of categoryCards[i].subCategories) {
            savedsubCategory.delete(item.name);
            for (const subItem of item.subSubCategories) {
              savedsubsubCategory.delete(subItem.name);
            }
          }

          categoryCards.splice(i, 1);
          break;
        }
      }
    }

  }

  onChildClick(subdata, child, data, category, categoryCards, savedsubCategory,
    savedparent, savedsubsubCategory, subRadio): void {
    if (child._checked) {

      savedsubCategory.set(subdata.departmentName, subdata.departmentName)
      savedparent.set(data.category, data.category);
      subRadio.set(subdata.departmentName, '0');

      if (categoryCards.length === 0) {
        categoryCards.push({
          id: data.categoryID, name: data.category, sentiment: null,
          subCategories: [{ id: subdata.departmentID, name: subdata.departmentName, sentiment: '0', subSubCategories: [] }]
        })
        data.sentiment = null;
        subdata.departmentSentiment = '0';
      }
      else {
        let found = false;
        for (const item of categoryCards) {
          if (item.name === data.category) {
            item.sentiment = null;
            found = true;
            item.subCategories.push({ id: subdata.departmentID, name: subdata.departmentName, sentiment: '0', subSubCategories: [] })
            data.sentiment = null;
            subdata.departmentSentiment = '0';
            break;
          }
        }
        if (!found) {
          categoryCards.push({
            id: data.categoryID, name: data.category, sentiment: null,
            subCategories: [{ id: subdata.departmentID, name: subdata.departmentName, sentiment: '0', subSubCategories: [] }]
          })
          data.sentiment = null;
          subdata.departmentSentiment = '0';
        }
      }
    }
    else {
      savedsubCategory.delete(subdata.departmentName);
      for (let i = 0; i < categoryCards.length; i += 1) {
        for (let j = 0; j < categoryCards[i].subCategories.length; j += 1) {
          if (categoryCards[i].subCategories[j].name === subdata.departmentName) {
            for (const item of categoryCards[i].subCategories[j].subSubCategories) {
              console.log(item.name);
              savedsubsubCategory.delete(item.name);
            }
            if (categoryCards.length >= 1) {

              categoryCards[i].subCategories.splice(j, 1);
              break;
            }
            else {
              categoryCards[i].subCategories.splice(j, 1);
              categoryCards.splice(i, 1);
              break;
            }

          }
        }
      }
      for (const item of subdata.subCategories) {
        item.departmentSentiment = null;
      }
      subdata.departmentSentiment = null;
    }

    let isAllSelected = true;
    let isAllparentSelected = false;
    console.log(data);
    for (const item of data.depatments) {

      if (item.subCategories.length > 0) {
        for (const subItem of item.subCategories) {
          if (subItem.subCategorySentiment != null) {
            isAllSelected = false;
            break;
          }
        }
      }

    }
    for (const item of data.depatments) {

      if (item.departmentSentiment != null) {
        isAllparentSelected = true;
        break;
      }
    }

    // if (!isAllSelected) {
    //  subdata.departmentSentiment = null;

    // }

    if (!isAllparentSelected && isAllSelected) {

      data.sentiment = '0';


    }
    else {
      data.sentiment = null;

    }

  }

  ondnested(dsubdata, child, data, name, parentdata, categoryCards, savedsubsubCategory,
    savedsubCategory, savedparent, subsubRadio): void {


    if (child._checked) {

      savedparent.set(parentdata.category, parentdata.category);
      savedsubCategory.set(data.departmentName, data.departmentName);
      savedsubsubCategory.set(name, name);
      subsubRadio.set(name, '0');

      if (categoryCards.length === 0) {


        categoryCards.push({
          id: parentdata.categoryID, name: parentdata.category, sentiment: null,
          subCategories: [{
            id: data.departmentID, name: data.departmentName, sentiment: null,
            subSubCategories: [{ id: dsubdata.subCategoryID, name: dsubdata.subCategoryName, sentiment: '0' }]
          }]
        })

        parentdata.sentiment = null;
        data.departmentSentiment = null;
        dsubdata.subCategorySentiment = '0';



      }
      else {

        let parentFound = false;
        for (const item of categoryCards) {
          if (item.name === parentdata.category) {
            parentFound = true;
            let found = false;

            for (const subItem of item.subCategories) {
              if (subItem.name === data.departmentName) {
                subItem.sentiment = null;
                found = true;
                subItem.subSubCategories.push({ id: dsubdata.subCategoryID, name: dsubdata.subCategoryName, sentiment: '0' });
                parentdata.sentiment = null;
                data.departmentSentiment = null;
                dsubdata.subCategorySentiment = '0';
                break;
              }
            }

            if (!found) {

              item.subCategories.push({
                id: data.departmentID, name: data.departmentName, sentiment: null,
                subSubCategories: [{ id: dsubdata.subCategoryID, name: dsubdata.subCategoryName, sentiment: '0' }]
              });

              dsubdata.subCategorySentiment = '0';

            }

          }
        }

        if (!parentFound) {

          categoryCards.push({
            id: parentdata.categoryID, name: parentdata.category, sentiment: null,
            subCategories: [{
              id: data.departmentID, name: data.departmentName, sentiment: null,
              subSubCategories: [{ id: dsubdata.subCategoryID, name: dsubdata.subCategoryName, sentiment: '0' }]
            }]
          })
          parentdata.sentiment = null;
          data.departmentSentiment = null;
          dsubdata.subCategorySentiment = '0';

        }


      }
    }
    else {

      savedsubsubCategory.delete(name);


      for (const item of categoryCards) {
        for (const subItem of item.subCategories) {
          for (let k = 0; k < subItem.subSubCategories.length; k += 1) {
            if (subItem.subSubCategories[k].name === dsubdata.subCategoryName) {
              subItem.subSubCategories.splice(k, 1);
            }
          }
        }
      }

      // data.departmentSentiment = '';
      dsubdata.subCategorySentiment = null;
    }

    let isAllSelected = true;
    for (const item of data.subCategories) {
      console.log(item.subCategorySentiment)
      if (item.subCategorySentiment !== null) {

        isAllSelected = false;
        break;
      }

    }

    if (isAllSelected) {
      data.departmentSentiment = '0';
    }
    else {
      data.departmentSentiment = null;

    }


  }


  radio(event, event1, type, categoryCards, data, savedparent, parentRadio, subchildRadio, subsubRadio): void {
    console.log(event)

    console.log(event1)
    if (type === 'parent') {

      parentRadio.set(event1, event);
      savedparent.set(data.category, data.category);
      let found = false;
      for (const item of categoryCards) {
        if (item.name === data.category) {
          found = true;
          break;
        }
      }
      if (!found) {
        categoryCards.push({ name: data.category, sentiment: event, subCategories: [] });
      }

      data.sentiment = event;


      // const last = event[event.length - 1];
      for (const item of categoryCards) {
        if (item.name === event1) {

          if (event === '0') {

            item.sentiment = 0;

          }

          if (event === '1') {
            item.sentiment = 1;
          }

          if (event === '2') {
            item.sentiment = 2;
          }

        }
      }

    }


    if (type === 'child') {

      subchildRadio.set(event1, event);

      for (let i = 0; i < categoryCards.length; i += 1) {
        for (let j = 0; j < categoryCards[i]["subCategories"].length; j += 1) {
          if (categoryCards[i]["subCategories"][j].name == event1) {

            const last = event[event.length - 1];

            if (event === '0') {

              categoryCards[i]["subCategories"][j]['sentiment'] = 0;


            }

            if (event === '1') {

              categoryCards[i]["subCategories"][j]['sentiment'] = 1;


            }

            if (event === '2') {

              categoryCards[i]["subCategories"][j]['sentiment'] = 2;


            }

          }
        }
      }

    }

    if (type === 'subchild') {

      subsubRadio.set(event1, event);

      for (let i = 0; i < categoryCards.length; i += 1) {
        for (let j = 0; j < categoryCards[i]["subCategories"].length; j += 1) {
          for (let k = 0; k < categoryCards[i]["subCategories"][j]["subSubCategories"].length; k += 1) {
            if (categoryCards[i]["subCategories"][j]["subSubCategories"][k].name == event1) {


              const last = event[event.length - 1];

              if (event === '0') {

                categoryCards[i]["subCategories"][j]["subSubCategories"][k]['sentiment'] = 0;


              }

              if (event === '1') {

                categoryCards[i]["subCategories"][j]["subSubCategories"][k]['sentiment'] = 1;


              }

              if (event === '2') {

                categoryCards[i]["subCategories"][j]["subSubCategories"][k]['sentiment'] = 2;


              }


            }
          }
        }
      }


    }
  }


  remove(event, cdr, parentCheckboxes, nested, categoryCards, savedparent, savedsubCategory, savedsubsubCategory): void {
    console.log(event);
    for (let i = 0; i < categoryCards.length; i += 1) {
      for (let j = 0; j < categoryCards[i].subCategories.length; j += 1) {
        if (event.name === categoryCards[i].subCategories[j].name) {

          savedsubCategory.delete(event.name);
          savedparent.delete(categoryCards[i].name);
          nested.changes.pipe(take(1)).subscribe(data => {
            data._results.forEach(element => {

              if (element.name === event.name) {
                element._checked = false;
                cdr.detectChanges();
              }

            });

          });

          for (let k = 0; k < categoryCards[i].subCategories[j].subSubCategories.length; k += 1) {
            const temp = categoryCards[i].subCategories[j].subSubCategories[k].name;
            savedsubsubCategory.delete(temp);
          }

          categoryCards[i].subCategories.splice(j, 1);
          if (categoryCards[i].subCategories.length === 0) {
            parentCheckboxes.changes.pipe(take(1)).subscribe(data => {
              data._results.forEach(element => {

                if (element.name === categoryCards[i].name) {
                  console.log(element.name);
                  element._checked = false;
                  setTimeout(() => {

                    categoryCards.splice(i, 1);
                  }, 200);
                  cdr.detectChanges();
                }
              });
            });
          }
          return;
        }
      }

    }
    for (let i = 0; i < categoryCards.length; i += 1) {
      if (event.name === categoryCards[i].name) {
        savedparent.delete(event.name);
        parentCheckboxes.changes.pipe(take(1)).subscribe(data => {

          data._results.forEach(element => {

            if (element.name === event.name) {
              element._checked = false;
              cdr.detectChanges();

            }

          });

        });
        categoryCards.splice(i, 1);
        break;
      }
    }

    if (categoryCards.length === 0) {
    }

  }


  getCategoryList(): Observable<object> {
    const key = {
      categoryID: 0,
      categoryName: 'string',
      brands: [
        {
          brandID: 7121,
          brandName: '\"wrong\"',
          categoryGroupID: 7,
          mainBrandID: 0,
          compititionBrandIDs: [
            0
          ],
          brandFriendlyName: 'string',
          brandLogo: 'string',
          isBrandworkFlowEnabled: true,
          brandGroupName: 'string'
        }
      ],
      startDateEpoch: 1605033000,
      endDateEpoch: 1608229798,
      userID: 0,
      filters: [

      ],
      notFilters: [],
      isAdvance: false,
      query: 'string',
      orderBY: ' \nORDER BY TicketPriority Desc, ModifiedDate desc\n',
      offset: 0,
      noOfRows: 1
    };

    return this.httpClient.post(environment.baseUrl + '/Tickets/GetCategoriesList', key);

  }



  getUpperCategoryList(): Observable<object> {
    const key = {
      categoryID: 0,
      categoryName: 'string',
      brands: [
        {
          brandID: 7121,
          brandName: '\"wrong\"',
          categoryGroupID: 7,
          mainBrandID: 0,
          compititionBrandIDs: [
            0
          ],
          brandFriendlyName: 'string',
          brandLogo: 'string',
          isBrandworkFlowEnabled: true,
          brandGroupName: 'string'
        }
      ],
      startDateEpoch: 1605033000,
      endDateEpoch: 1608229798,
      userID: 0,
      filters: [

      ],
      notFilters: [],
      isAdvance: false,
      query: 'string',
      orderBY: ' \nORDER BY TicketPriority Desc, ModifiedDate desc\n',
      offset: 0,
      noOfRows: 1
    };

    return this.httpClient.post(environment.baseUrl + '/Tickets/GetUpperCategoriesList', key);

  }

  saveCategoryData(taggingParameters, _postDetailService, categoryCards, snackBar): void {

    // const Theaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDBlMTZlOS00NjlhLTRmNjQtYWFmNS1kMGYxZGFkMGQ1NGQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzMzUzNiIsImNhdGVnb3J5aWQiOiIzMzk4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkaXR5YSIsImV4cCI6MTYxMTM5NDA1OCwiaXNzIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIiwiYXVkIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIn0.fBErJVWFaWEv3Dx2kN_PpmxxiKKYevrv9mxF_YxGmMo'  
    // });

    this.httpClient.post(environment.baseUrl + '/Tickets/SaveTaggingCategory', taggingParameters).subscribe(res => {
      const result = JSON.stringify(res);
      const r = JSON.parse(result);
      if (r.success) {
        this._ticketService.selectedPostList = [];
        this._ticketService.postSelectTrigger.next(0);
        this._ticketService.bulkMentionChecked = [];
        console.log(taggingParameters);
        console.log('Done');
        if (_postDetailService.categoryType === 'ticketCategory') {
          _postDetailService.postObj.ticketInfo.ticketCategoryMap = categoryCards;
        }
        else {
          _postDetailService.postObj.categoryMap = categoryCards;
        }

        snackBar.open('Successfully Submitted', '', {
          duration: 2000
        });

      }
    });
  }


  taggingRequestParametres(event, name, taggingParameters): void {
    console.log(event);
    if (!event._checked) {
      console.log('Aaya Re');
      if (taggingParameters.isTicketCategoryEnabled === 2 && name === 'setToAllMention') {
        taggingParameters.isTicketCategoryEnabled = 3;
        taggingParameters.isAllMentionUnderTicketId = true;
      }
      else if (taggingParameters.isTicketCategoryEnabled === 0 && name === 'setToTicket') {
        taggingParameters.isTicketCategoryEnabled = 1;
        taggingParameters.isAllMentionUnderTicketId = false;

      }

      if (name === 'tagTweet') {
        taggingParameters.tagAlltagIds = true;
      }
    }
    else {

      if (name === 'tagTweet') {
        taggingParameters.tagAlltagIds = false;
      }

      if (name === 'setToAllMention') {
        taggingParameters.isTicketCategoryEnabled = 2;
        taggingParameters.isAllMentionUnderTicketId = false;

      }

      if (name === 'setToTicket') {
        taggingParameters.isTicketCategoryEnabled = 0;
        taggingParameters.isTicketCategoryEnabled = 0;
      }


    }

  }


  isAnySentimentNull(categoryCards): boolean {
    let nullSentiment;
    for (const item of categoryCards) {
      nullSentiment = true;
      if (!item.sentiment && item.sentiment !== 0 && !item.subCategories.length) {
        nullSentiment = false;
        break;
      }
      for (const subItem of item.subCategories) {

        if (!subItem.sentiment && subItem.sentiment !== 0 && !subItem.subSubCategories.length) {
          nullSentiment = false;
          break;
        }

        for (const subsubItem of subItem.subSubCategories) {
          if (!subsubItem.sentiment && subsubItem.sentiment !== 0) {
            nullSentiment = false;
            break;
          }

        }

        if (!nullSentiment) {
          break;
        }

      }

      if (!nullSentiment) {
        break;
      }



    }
    return nullSentiment;

  }

  saveBulkCategoryData(taggingParameters, _postDetailService, categoryCards, snackBar): void {

    // const Theaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZDBlMTZlOS00NjlhLTRmNjQtYWFmNS1kMGYxZGFkMGQ1NGQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiIzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzMzUzNiIsImNhdGVnb3J5aWQiOiIzMzk4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImFkaXR5YSIsImV4cCI6MTYxMTM5NDA1OCwiaXNzIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIiwiYXVkIjoiaHR0cHM6Ly93d3cubG9jb2J1enouY29tIn0.fBErJVWFaWEv3Dx2kN_PpmxxiKKYevrv9mxF_YxGmMo'  
    // });

    this.httpClient.post(environment.baseUrl + '/Tickets/SaveBulkTaggingCategory', taggingParameters).subscribe(res => {
      const result = JSON.stringify(res);
      const r = JSON.parse(result);
      if (r.success) {
        this._ticketService.selectedPostList = [];
        this._ticketService.postSelectTrigger.next(0);
        this._ticketService.bulkMentionChecked = [];
        console.log(taggingParameters);
        console.log('Done');
        if (_postDetailService.categoryType === 'ticketCategory') {
          _postDetailService.postObj.ticketInfo.ticketCategoryMap = categoryCards;
        }
        else {
          _postDetailService.postObj.categoryMap = categoryCards;
        }

        snackBar.open('Successfully Submitted', '', {
          duration: 2000
        });

      }
    });
  }



}