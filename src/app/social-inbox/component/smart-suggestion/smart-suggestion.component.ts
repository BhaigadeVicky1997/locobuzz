import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { smartSuggestion } from 'app/app-data/smartSuggestion';
import {
  AllCategoriesObject,
  AllResponseObject,
  LocobuzzIntentDetectedResult,
} from 'app/core/models/viewmodel/LocobuzzIntentDetectResult';
import { MaplocobuzzentitiesService } from 'app/core/services/maplocobuzzentities.service';
import { PostDetailService } from 'app/social-inbox/services/post-detail.service';
import { ReplyService } from 'app/social-inbox/services/reply.service';
import { TicketsService } from 'app/social-inbox/services/tickets.service';

@Component({
  selector: 'app-smart-suggestion',
  templateUrl: './smart-suggestion.component.html',
  styleUrls: ['./smart-suggestion.component.scss'],
})
export class SmartSuggestionComponent implements OnInit {
  locobuzzIntentDetectedResult: LocobuzzIntentDetectedResult[] = [];
  allCategories: AllCategoriesObject[] = [];
  allResponseObject: AllResponseObject[];
  recommendedCategorySelect: boolean = true;
  suggestionText: string;
  categories: {}[] = [
    {
      id: 1,
      name: 'Banking Issue',
    },
    {
      id: 2,
      name: 'Credit Card Deduction',
    },
    {
      id: 3,
      name: 'Card Deduction',
    },
    {
      id: 4,
      name: 'Network issue',
    },
    {
      id: 5,
      name: 'transaction failed issue',
    },
  ];

  categoryListItem = [
    {
      id: 1,
      name: 'Banking Issue',
      responses: [
        {
          id: 1,
          message:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris scelerisque tellus neque,',
        },
        {
          id: 2,
          message:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris scelerisque tellus neque,',
        },
        {
          id: 3,
          message:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris scelerisque tellus neque,',
        },
      ],
    },
    {
      id: 2,
      name: 'Credit Card Deduction',
      responses: [
        {
          id: 1,
          message:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris scelerisque tellus neque,',
        },
        {
          id: 2,
          message:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris scelerisque tellus neque,',
        },
        {
          id: 3,
          message:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris scelerisque tellus neque,',
        },
      ],
    },
    {
      id: 3,
      name: 'Card Deduction',
      responses: [
        {
          id: 1,
          message:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris scelerisque tellus neque,',
        },
        {
          id: 2,
          message:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris scelerisque tellus neque,',
        },
        {
          id: 3,
          message:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris scelerisque tellus neque,',
        },
      ],
    },
    {
      id: 4,
      name: 'Network issue',
      responses: [
        {
          id: 1,
          message:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris scelerisque tellus neque,',
        },
        {
          id: 2,
          message:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris scelerisque tellus neque,',
        },
        {
          id: 3,
          message:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris scelerisque tellus neque,',
        },
      ],
    },
    {
      id: 5,
      name: 'transaction failed issue',
      responses: [
        {
          id: 1,
          message:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris scelerisque tellus neque,',
        },
        {
          id: 2,
          message:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris scelerisque tellus neque,',
        },
        {
          id: 3,
          message:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris scelerisque tellus neque,',
        },
      ],
    },
  ];
  categoryIsActive: number = 0;

  categoryList: Array<object> = [];
  constructor(
    private ticketService: TicketsService,
    private postDetailService: PostDetailService,
    private MapLocobuzzMentionService: MaplocobuzzentitiesService,
    private _replyService: ReplyService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SmartSuggestionComponent>
  ) {}

  ngOnInit(): void {
      if (this._replyService.locobuzzIntentDetectedResult
        && this._replyService.locobuzzIntentDetectedResult.length > 0)
      {
        this.locobuzzIntentDetectedResult = this._replyService.locobuzzIntentDetectedResult;
        this.allCategories = this.locobuzzIntentDetectedResult.map((obj) => {
          return { id: obj.category_id, name: obj.category_name };
        });
      }

    // const object = this.MapLocobuzzMentionService.mapMention(
    //   this.postDetailService.postObj
    // );
    // if (!object.title) {
    //   object.title = object.description;
    // }
    // this.ticketService.replyAutoSuggest(object).subscribe((data) => {
    //   /* tslint:disable:no-string-literal */
    //   this.categoryList = smartSuggestion['data'].localIntentSuggestion;
    //   /* tslint:disable:no-string-literal */
    //   this.locobuzzIntentDetectedResult =
    //     smartSuggestion['data'].localIntentSuggestion;
    //   this.allCategories = this.locobuzzIntentDetectedResult.map((obj) => {
    //     return { id: obj.category_id, name: obj.category_name };
    //   });

    //   this.allResponseObject = this.locobuzzIntentDetectedResult.map((obj) => {
    //     return {
    //       id: obj.category_id,
    //       name: obj.category_name,
    //       responses: obj.responses,
    //     };
    //   });

    //   console.log(this.locobuzzIntentDetectedResult);
    // });
  }

  scrollToResponses(categoryid, index): void {
    // const categoryID = category.name.toString().replace(/\s+/g, '');
    document
      .querySelector(`#smart_${categoryid}`)
      .scrollIntoView({ behavior: 'smooth' });
    this.categoryIsActive = index;
    if (categoryid === 0) {
      this.recommendedCategorySelect = false;
    } else {
      this.recommendedCategorySelect = false;
    }
  }

  clickOnCard(categoryid, response, event): void {
    if (+categoryid !== 0 )
    {
      this.recommendedCategorySelect = false;
    }
    let activeClasses = document.querySelectorAll(
      '.smart-response__content--listitem'
    );
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < activeClasses.length; i++) {
      activeClasses[i].classList.remove('active');
    }
    this.suggestionText = response;
    event.srcElement.classList.add('active');

  }

  setSmartSuggestion(): void{
    if (this.suggestionText)
    {
      this._replyService.selectedSmartSuggestion.next(this.suggestionText);
      this.dialogRef.close(true);
    }else{
      this._snackBar.open('Smart response not selected', 'Ok', {
        duration: 2000
      });
    }
  }

}
