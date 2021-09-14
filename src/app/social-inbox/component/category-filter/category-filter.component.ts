import { Component, OnInit, QueryList, ViewChildren, ChangeDetectorRef, ValueSansProvider } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { categoryFilterItem } from 'app/core/interfaces/locobuzz-navigation';
import { take } from 'rxjs/operators';
import { TicketsService, } from '../../services/tickets.service';
import { catefilterData } from '../../services/category.service';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { PostDetailService } from 'app/social-inbox/services/post-detail.service';
import { TaggingRequestParameters } from 'app/core/models/viewmodel/TaggingRequestParameters';
import { post } from 'app/app-data/post';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { MaplocobuzzentitiesService } from 'app/core/services/maplocobuzzentities.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostsType } from 'app/core/models/viewmodel/GenericFilter';
import { CategoryTagDetails } from 'app/core/models/dbmodel/TagsInformation';
import { ReplyService } from 'app/social-inbox/services/reply.service';
import { NavigationService } from 'app/core/services/navigation.service';






@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss'],
  providers: [TicketsService],
})



export class CategoryFilterComponent implements OnInit, categoryFilterItem {

  selectedUpper;
  nullSentiment = true;
  dataSource = [];
  savedparent = new Map();
  savedsubCategory = new Map();
  savedsubsubCategory = new Map();
  temp;
  categoryCards = [];
  upperCategories = [];
  inputValue;
  treeData = [];
  categoryType;
  checkBoxes;
  DefaultSelected;
  parentRadio = new Map();
  subchildRadio = new Map();
  subsubRadio = new Map();
  taggingParameters: TaggingRequestParameters = {};

  @ViewChildren('checkBox') parentCheckboxes: QueryList<MatCheckbox>;
  @ViewChildren('nestCheckbox') nestedCheckboxes: QueryList<MatCheckbox>;
  @ViewChildren('dnestedCheck') dnestedCheckboxes: QueryList<MatCheckbox>;
  @ViewChildren('parentradio') parentRadios: QueryList<MatRadioButton>;
  @ViewChildren('subRadio') subRadios: QueryList<MatRadioButton>;
  @ViewChildren('subsubRadios') subsubRadios: QueryList<MatRadioButton>;




  constructor(public data: catefilterData,
    private _postDetailService: PostDetailService,
    public dialog: MatDialog,
    public cdr: ChangeDetectorRef,
    private httpClient: HttpClient,
    private mapLocobuzzEntity: MaplocobuzzentitiesService,
    private filterService: TicketsService,
    private _replyService: ReplyService, private _navigationService: NavigationService,
    private _snackBar: MatSnackBar,
    private _ticketService: TicketsService) {


  }
  postRequestData: object;

  ngOnInit(): void {

    this.data.getCategoryList().pipe(take(1)).subscribe((apiData) => {
      this.data.categoryData = apiData["data"];
      this.treeData = this.data.categoryData;
      this.DefaultSelected = 'default';
      this.dataSource = this.data.categoryData;
      this.fillCategoryMap();

    });


    this.data.getUpperCategoryList().subscribe((apiData) => {

      this.upperCategories = apiData["data"];

    });
    this.selectedUpper = '';
    console.log(this._postDetailService.postObj);
    console.log('Ticket Priority');
    this.filterService.hideUnhideMention().subscribe((data) => {
      console.log(data);
      console.log('DeleteData');
    });
  }

  /*-------------------------Search/Filter ---------------------------------*/

  filter(value): void {
    if (!value) {

      this.treeData.forEach((data) => {

        let found = false;
        console.log(this.savedparent.get(data.category));
        if (!this.savedparent.get(data.category)) {
          data.sentiment = null;
        }


        data.depatments.forEach(subData => {

          if (this.savedsubCategory.get(subData.departmentName) && !found) {
            found = true;
            data.sentiment = null;
            subData.departmentSentiment = '0';
          }

          subData.subCategories.forEach(subsubData => {

            if (this.savedsubsubCategory.get(subsubData.subCategoryName) && found) {
              found = true;
              data.sentiment = null;
              subData.departmentSentiment = null;
              subsubData.subCategorySentiment = '0';

            }
          });
        });
      });

      this.dataSource = this.treeData;
      if (this.categoryCards.length !== 0) {
        this.parentCheckboxes.changes.pipe(take(1)).subscribe(data => {
          data._results.forEach(element => {

            if (this.savedparent.get(element.name) === element.name) {
              element._checked = true;
              this.cdr.detectChanges();
            }

          });

        });
        this.nestedCheckboxes.changes.pipe(take(1)).subscribe(data => {
          setTimeout(() => {

            data._results.forEach(element => {
              if (this.savedsubCategory.get(element.name) === element.name) {
                element._checked = true;
                this.cdr.detectChanges();
              }

            });

          });
        });

        this.dnestedCheckboxes.changes.pipe(take(1)).subscribe(data => {
          setTimeout(() => {

            data._results.forEach(element => {
              if (this.savedsubsubCategory.get(element.name) === element.name) {
                element._checked = true;
                this.cdr.detectChanges();
              }

            });

          });

        });

        this.parentRadios.changes.pipe(take(1)).subscribe((data) => {
          setTimeout(() => {

            data._results.forEach(button => {

              if (this.parentRadio.get(button.name) === button.value) {
                button._checked = true;
              }
              this.cdr.detectChanges();
            });

          });

        });


        this.subRadios.changes.pipe(take(1)).subscribe((data) => {
          setTimeout(() => {

            data._results.forEach(button => {

              if (this.subchildRadio.get(button.name) === button.value) {

                button._checked = true;

              }
              this.cdr.detectChanges();

            });

          });
        });



        this.subsubRadios.changes.pipe(take(1)).subscribe((data) => {
          setTimeout(() => {

            data._results.forEach(button => {

              if (this.subsubRadio.get(button.name) === button.value) {
                button.checked = true;
              }
              this.cdr.detectChanges();

            });

          });
        });


      }

    }
    else {

      this.temp = [];

      this.treeData.forEach(data => {
        if (data.category.includes(value)) {
          this.temp.push(data);
        }
      });

      if (this.temp.length !== 0) {
        this.dataSource = this.temp;
        this.parentCheckboxes.changes.pipe(take(1)).subscribe(data => {

          data._results.forEach(element => {
            if (this.savedparent.get(element.name) === element.name) {
              element._checked = true;
              this.nestedCheckboxes.changes.pipe(take(1)).subscribe(nestdata => {

                nestdata._results.forEach(nestelement => {

                  if (this.savedsubCategory.get(nestelement.name) === nestelement.name) {
                    nestelement._checked = true;
                    this.cdr.detectChanges();
                  }

                });
              });
              this.cdr.detectChanges();
            }

          });

        });

        this.dnestedCheckboxes.changes.pipe(take(1)).subscribe(data => {
          setTimeout(() => {

            data._results.forEach(element => {
              if (this.savedsubsubCategory.get(element.name) === element.name) {
                element._checked = true;
                this.cdr.detectChanges();
              }

            });

          });

        });

        this.parentRadios.changes.pipe(take(1)).subscribe((data) => {
          setTimeout(() => {

            data._results.forEach(button => {

              if (this.parentRadio.get(button.name) === button.value) {
                button._checked = true;
              }
              this.cdr.detectChanges();
            });

          });

        });


        this.subRadios.changes.pipe(take(1)).subscribe((data) => {
          setTimeout(() => {

            data._results.forEach(button => {

              if (this.subchildRadio.get(button.name) === button.value) {

                button._checked = true;

              }
              this.cdr.detectChanges();

            });

          });
        });


        this.subsubRadios.changes.pipe(take(1)).subscribe((data) => {
          setTimeout(() => {

            data._results.forEach(button => {

              if (this.subsubRadio.get(button.name) === button.value) {
                button.checked = true;
              }
              this.cdr.detectChanges();

            });

          });
        });



        return;
      }


      this.treeData.forEach(data => {
        let found = false;
        data.depatments.forEach(nestedData => {

          if (nestedData.departmentName.includes(value) && value !== '') {
            if (this.temp.length === 0) {

              console.log(this.savedparent.get(data.category));
              if (this.savedparent.get(data.category)) {
                data.sentiment = null;

              }

              this.temp.push({
                categoryID: data.categoryID,
                category: data.category,
                sentiment: data.sentiment,
                depatments: [nestedData]
              });
            }
            else {
              found = false;

              this.temp.forEach(element => {

                if (element.category === data.category) {

                  if (this.savedparent.get(data.category)) {
                    data.sentiment = null;

                  }
                  // else {
                  //   data.sentiment = null;

                  // }

                  found = true;
                  element.categoryID = data.categoryID;
                  element.sentiment = data.sentiment;
                  element.depatments.push(nestedData);
                }
              });

              if (!found) {

                if (this.savedparent.get(data.category)) {
                  data.sentiment = null;

                }
                // else {
                //   data.sentiment = null;

                // }

                this.temp.push({
                  categoryID: data.categoryID,
                  category: data.category,
                  sentiment: data.sentiment,
                  depatments: [nestedData]
                });
              }
            }

          }

        });
      });

      let done = false;
      if (this.temp.length !== 0) {


        this.temp.forEach((data) => {

          let found = false;

          if (this.savedparent.get(data.category)) {
            data.sentiment = null;
          }
          // else {
          //   data.sentiment = '';
          // }

          data.depatments.forEach(subData => {

            if (this.savedsubCategory.get(subData.departmentName) && !found) {
              found = true;
              data.sentiment = null;
              subData.departmentSentiment = '0';
            }

            subData.subCategories.forEach(subsubData => {

              if (this.savedsubsubCategory.get(subsubData.subCategoryName) && found) {
                found = true;
                data.sentiment = null;
                subData.departmentSentiment = null;

              }
            });
          });
        });


        this.dataSource = this.temp;
        this.parentCheckboxes.changes.pipe(take(1)).subscribe((data) => {
          data._results.forEach(element => {
            element._checked = true;
            this.cdr.detectChanges();
          });

        });

        this.nestedCheckboxes.changes.pipe(take(1)).subscribe(data => {

          setTimeout(() => {

            data._results.forEach(element => {

              if (this.savedsubCategory.get(element.name) === element.name) {
                element._checked = true;
                this.cdr.detectChanges();
              }

            });
          });

        });

        this.dnestedCheckboxes.changes.pipe(take(1)).subscribe(data => {
          setTimeout(() => {

            data._results.forEach(element => {
              if (this.savedsubsubCategory.get(element.name) === element.name) {

                element._checked = true;
                this.cdr.detectChanges();
              }

            });

          });

        });


        this.parentRadios.changes.pipe(take(1)).subscribe((data) => {
          setTimeout(() => {

            data._results.forEach(button => {

              if (this.parentRadio.get(button.name) === button.value) {
                button._checked = true;
              }
              this.cdr.detectChanges();
            });

          });

        });


        this.subRadios.changes.pipe(take(1)).subscribe((data) => {
          setTimeout(() => {

            data._results.forEach(button => {

              if (this.subchildRadio.get(button.name) === button.value) {

                button._checked = true;

              }
              this.cdr.detectChanges();

            });

          });
        });


        this.subsubRadios.changes.pipe(take(1)).subscribe((data) => {
          setTimeout(() => {

            data._results.forEach(button => {

              if (this.subsubRadio.get(button.name) === button.value) {
                button.checked = true;
              }
              this.cdr.detectChanges();

            });

          });
        });

        done = true;
        return;
      }

      // ------------------------ Deep Search In Tree-------------------------------

      this.treeData.forEach(data => {
        let found = false;
        data.depatments.forEach(nestedData => {
          nestedData.subCategories.forEach(subNestedData => {



            const say = subNestedData.subCategoryName;
            if (say && say.includes(value)) {

              if (this.temp.length === 0) {
                data.sentiment = null;
                this.temp.push({

                  categoryID: data.categoryID,
                  category: data.category,
                  sentiment: null,
                  depatments: [
                    {
                      departmentID: nestedData.departmentID,
                      departmentName: nestedData.departmentName,
                      labelID: nestedData.labelID,
                      departmentSentiment: nestedData.departmentSentiment,
                      subCategories: [subNestedData]
                    }
                  ]
                });
              }
              else {
                found = false;
                this.temp.forEach(element => {

                  element.depatments.forEach(subelement => {

                    if (subelement.departmentName === nestedData.departmentName) {
                      found = true;
                      subelement.subCategories.push(subNestedData);
                    }

                  });

                  if (!found) {
                    let got = false;
                    this.temp.forEach(_element => {

                      if (_element.category === data.category) {
                        got = true;

                        element.depatments.push(
                          {
                            departmentID: nestedData.departmentID,
                            departmentName: nestedData.departmentName,
                            labelID: nestedData.labelID,
                            departmentSentiment: nestedData.departmentSentiment,
                            subCategories: [subNestedData]
                          }
                        );

                      }

                    });

                    if (!got) {
                      data.sentiment = null;

                      this.temp.push({

                        categoryID: data.categoryID,
                        category: data.category,
                        sentiment: null,
                        depatments: [
                          {
                            departmentID: nestedData.departmentID,
                            departmentName: nestedData.departmentName,
                            labelID: nestedData.labelID,
                            departmentSentiment: nestedData.departmentSentiment,
                            subCategories: [subNestedData]
                          }
                        ]
                      });

                    }

                  }



                });


              }
            }



          });
        });

      });

      this.dataSource = this.temp;

      if (this.temp.length !== 0) {

        this.parentCheckboxes.changes.pipe(take(1)).subscribe((data) => {

          data._results.forEach(element => {
            element._checked = true;

            this.cdr.detectChanges();

          });

        });

        this.nestedCheckboxes.changes.pipe(take(1)).subscribe((nestdata) => {

          nestdata._results.forEach(nestelement => {

            nestelement._checked = true;
            this.cdr.detectChanges();
          });


        });


        this.dnestedCheckboxes.changes.pipe(take(1)).subscribe(data => {

          setTimeout(() => {

            data._results.forEach(element => {

              if (this.savedsubsubCategory.get(element.name) === element.name) {
                element._checked = true;
                this.cdr.detectChanges();
              }

            });

          });


        });


        this.parentRadios.changes.pipe(take(1)).subscribe((data) => {
          setTimeout(() => {

            data._results.forEach(button => {

              if (this.parentRadio.get(button.name) === button.value) {
                button._checked = true;
              }
              this.cdr.detectChanges();
            });

          });

        });


        this.subRadios.changes.pipe(take(1)).subscribe((data) => {
          setTimeout(() => {

            data._results.forEach(button => {

              if (this.subchildRadio.get(button.name) === button.value) {

                button._checked = true;

              }
              this.cdr.detectChanges();

            });

          });
        });


        this.subsubRadios.changes.pipe(take(1)).subscribe((data) => {
          setTimeout(() => {

            data._results.forEach(button => {

              if (this.subsubRadio.get(button.name) === button.value) {
                button.checked = true;
              }
              this.cdr.detectChanges();

            });

          });
        });

      }


    }

  }

  // --------------------------- When Parent Checkbox is clicked ---------------------------------------

  onParentClick(event, data): void {

    this.data.onParentClick(event, data, this.categoryCards, this.savedparent,
      this.savedsubCategory, this.savedsubsubCategory,
      this.parentRadio);

    this.parentRadios.changes.pipe(take(1)).subscribe((data1) => {
      setTimeout(() => {

        data1._results.forEach(button => {

          if (this.parentRadio.get(button.name) === button.value) {
            button._checked = true;
          }
          this.cdr.detectChanges();
        });

      });

    });


  }

  /*----------------------- When NestedCheckbox is clicked-----------------------*/

  onchildClick(subdata, child, data, category): void {

    this.data.onChildClick(subdata, child, data, category, this.categoryCards, this.savedsubCategory,
      this.savedparent, this.savedsubsubCategory, this.subchildRadio);

    this.parentRadios.changes.pipe(take(1)).subscribe((data1) => {
      setTimeout(() => {

        data1._results.forEach(button => {

          if (this.parentRadio.get(button.name) === button.value) {
            button._checked = true;
          }
          this.cdr.detectChanges();
        });

      });

    });


    this.subRadios.changes.pipe(take(1)).subscribe((data1) => {
      setTimeout(() => {

        data1._results.forEach(button => {

          if (this.subchildRadio.get(button.name) === button.value) {

            button._checked = true;

          }
          this.cdr.detectChanges();

        });

      });
    });


  }

  // ------------------------ When subNestedCheckbox is clicked-------------------------------------

  ondNestedChildClick(dsubdata, child, data, name, parentdata): void {

    this.data.ondnested(dsubdata, child, data, name, parentdata, this.categoryCards, this.savedsubsubCategory,
      this.savedsubCategory, this.savedparent, this.subsubRadio);

    this.subsubRadios.changes.pipe(take(1)).subscribe((data1) => {
      setTimeout(() => {

        data1._results.forEach(button => {

          if (this.subsubRadio.get(button.name) === button.value) {
            button.checked = true;
          }
          this.cdr.detectChanges();

        });

      });
    });

  }


  // -------------------------------- When radio buttons are clicked ----------------------------------
  radio(event, event1, type, Data): void {

    this.data.radio(event, event1, type, this.categoryCards, Data, this.savedparent, this.parentRadio,
      this.subchildRadio, this.subsubRadio);

  }

  // ------------------------------------Select the default categories--------------------------------------------

  fillCategoryMap(): void {

    let categoryData;
    if (this._postDetailService.categoryType === 'ticketCategory') {
      this.taggingParameters.isTicketCategoryEnabled = 2;
      this.taggingParameters.isTicket = true;
      this.taggingParameters.isAllMentionUnderTicketId = false;
      this.taggingParameters.tagAlltagIds = false;
      this.categoryType = this._postDetailService.categoryType;
      categoryData = this._postDetailService.postObj.ticketInfo.ticketCategoryMap;
      console.log('postObject', categoryData);

      if (this._postDetailService.postObj.ticketInfo.ticketUpperCategory.name !== null) {
        this.selectedUpper = this._postDetailService.postObj.ticketInfo.ticketUpperCategory.name;
        this.DefaultSelected = this._postDetailService.postObj.ticketInfo.ticketUpperCategory.name;
        this._postDetailService.postObj.upperCategory = this._postDetailService.postObj.ticketInfo.ticketUpperCategory;

      }

    }
    else {
      this.taggingParameters.isAllMentionUnderTicketId = false;
      this.taggingParameters.tagAlltagIds = false;
      this.taggingParameters.isTicketCategoryEnabled = 0;
      this.taggingParameters.isTicket = false;
      this.categoryType = this._postDetailService.categoryType;
      categoryData = this._postDetailService.postObj.categoryMap;
    }

    categoryData.forEach((data) => {
      this.savedparent.set(data.name, data.name);
      let Sentiment;
      if (data.sentiment === 0) {
        this.parentRadio.set(data.name, '0');
        Sentiment = 0;
      }
      if (data.sentiment === 1) {
        this.parentRadio.set(data.name, '1');
        Sentiment = 1;
      }
      if (data.sentiment === 2) {
        this.parentRadio.set(data.name, '2');
        Sentiment = 2;
      }

      this.categoryCards.push({ id: data.id, name: data.name, sentiment: Sentiment, subCategories: [] });
      Sentiment = '';

      const pLength = this.categoryCards.length;
      data.subCategories.forEach((subData) => {

        this.savedsubCategory.set(subData.name, subData.name);
        this.parentRadio.delete(data.name);
        if (subData.sentiment === 0) {
          this.subchildRadio.set(subData.name, '0');
          Sentiment = 0;
        }
        if (subData.sentiment === 1) {
          this.subchildRadio.set(subData.name, '1');
          Sentiment = 1;
        }
        if (subData.sentiment === 2) {
          this.subchildRadio.set(subData.name, '2');
          Sentiment = 2;
        }

        this.categoryCards[pLength - 1].subCategories.push({
          id: subData.id, name: subData.name, sentiment: Sentiment,
          subSubCategories: []
        })

        const Length = this.categoryCards[pLength - 1].subCategories.length;

        Sentiment = '';

        subData.subSubCategories.forEach((subsubData) => {
          this.savedsubsubCategory.set(subsubData.name, subsubData.name);
          this.subchildRadio.delete(subData.name);

          if (subsubData.sentiment === 0) {
            this.subsubRadio.set(subsubData.name, '0');
            Sentiment = 0;
          }
          if (subsubData.sentiment === 1) {
            this.subsubRadio.set(subsubData.name, '1');
            Sentiment = 1;
          }
          if (subsubData.sentiment === 2) {
            this.subsubRadio.set(subsubData.name, '2');
            Sentiment = 2;
          }


          console.log(this._postDetailService.postObj.ticketInfo);
          this.categoryCards[pLength - 1].subCategories[Length - 1].subSubCategories.push({
            id: subsubData.id, name: subsubData.name,
            sentiment: Sentiment
          });

        });

      });

    });

    this.treeData.forEach((data) => {

      let found = false;

      if (this.savedparent.get(data.category)) {
        data.sentiment = '';
      }
      else {
        data.sentiment = null;
      }

      data.depatments.forEach(subData => {

        if (this.savedsubCategory.get(subData.departmentName) && !found) {
          found = true;
          data.sentiment = null;
          subData.departmentSentiment = '';
        }

        subData.subCategories.forEach(subsubData => {

          if (this.savedsubsubCategory.get(subsubData.subCategoryName) && found) {
            found = true;
            data.sentiment = '';
            subData.departmentSentiment = null;
            subsubData.subCategorySentiment = null;
          }
        });

        found = false;
      });
    });

    this.parentCheckboxes.changes.pipe(take(1)).subscribe(data => {
      data._results.forEach(element => {
        if (this.savedparent.get(element.name) === element.name) {
          element._checked = true;
          this.cdr.detectChanges();
        }

      });

    });
    this.nestedCheckboxes.changes.pipe(take(1)).subscribe(data => {
      setTimeout(() => {

        data._results.forEach(element => {
          if (this.savedsubCategory.get(element.name) === element.name) {
            element._checked = true;
            this.cdr.detectChanges();
          }

        });

      });
    });

    this.dnestedCheckboxes.changes.pipe(take(1)).subscribe(data => {
      setTimeout(() => {

        data._results.forEach(element => {
          if (this.savedsubsubCategory.get(element.name) === element.name) {
            element._checked = true;
            this.cdr.detectChanges();
          }

        });

      });

    });

    this.parentRadios.changes.pipe(take(1)).subscribe((data) => {
      setTimeout(() => {

        data._results.forEach(button => {
          if (this.parentRadio.get(button.name) === button.value) {
            button._checked = true;
          }
          this.cdr.detectChanges();
        });

      });

    });


    this.subRadios.changes.pipe(take(1)).subscribe((data) => {
      setTimeout(() => {

        data._results.forEach(button => {

          if (this.subchildRadio.get(button.name) === button.value) {

            button._checked = true;

          }
          this.cdr.detectChanges();

        });

      });
    });



    this.subsubRadios.changes.pipe(take(1)).subscribe((data) => {
      setTimeout(() => {

        data._results.forEach(button => {

          if (this.subsubRadio.get(button.name) === button.value) {
            button.checked = true;
          }
          this.cdr.detectChanges();

        });

      });
    });


  }

  // ----------------------------------------------Tagging Request Parameters-------------------------------

  TaggingRequestParameters(event, name): void {
    this.data.taggingRequestParametres(event, name, this.taggingParameters);
  }

  /*-------------------------For closing the popup ---------------------------------*/

  onNoClick(): void {
    this.dialog.closeAll();
  }


  // ------------------------- When upper category is selected ------------------------------

  upperSelect(event): void {
    console.log(event);
    this.selectedUpper = event.name;
    this._postDetailService.postObj.upperCategory = event;
  }


  // ---------------------------Clearing All Data--------------------------------------------------

  uncheckAll(): void {

    this.parentCheckboxes.changes.pipe(take(1)).subscribe((data) => {
      data._results.forEach(element => {

        element._checked = false;
        this.cdr.detectChanges();
      });
    });



    this.nestedCheckboxes.changes.pipe(take(1)).subscribe(data => {
      data._results.forEach(element => {
        element._checked = false;
        this.cdr.detectChanges();

      });
    });
    this.dnestedCheckboxes.changes.pipe(take(1)).subscribe(data => {
      data._results.forEach(element => {
        element._checked = false;
        this.cdr.detectChanges();

      });

    });

  }



  // ---------------------------------- For removing the cards---------------------------------

  removeCard(event): void {

    this.data.remove(event, this.cdr, this.parentCheckboxes, this.nestedCheckboxes, this.categoryCards,
      this.savedparent, this.savedsubCategory, this.savedsubsubCategory);

  }

  // ---------------------------------- For removing the upper category-----------------------------------

  removeUpperCate(): void {
    this.selectedUpper = '';
    this.DefaultSelected = 'default';
  }


  // -------------------------Delete All the saved data--------------------------------------------------

  deleteAllData(): void {
    this.savedsubsubCategory.clear();
    this.savedparent.clear();
    this.savedsubCategory.clear();
    this.parentRadio.clear();
    this.subchildRadio.clear();
    this.subsubRadio.clear();
    this.categoryCards = [];
    this.selectedUpper = '';
    this.DefaultSelected = 'default';
  }

  // ---------------------------------------Clear/Refresh all the data------------------------------------

  clearall(): void {
    this.deleteAllData();
    this.uncheckAll();
  }

  // -------------------------------------Submit data to Api-------------------------------------------

  Submit(): void {
    if (!this.data.isAnySentimentNull(this.categoryCards)) {
      this._snackBar.open('Please Select The Sentiments', 'Close',
        {
          duration: 2000
        });

      return;
    }

    // if (!this.selectedUpper) {
    //   this._snackBar.open('Please Add Upper Category', 'Close',
    //     {
    //       duration: 2000
    //     });
    //   return;
    // }
    
    let isTicket = false;
    if (this._postDetailService.pagetype === PostsType.Tickets) {
      isTicket = true;
    }
    if (this._postDetailService.isBulk) {

      const categoryTagDetails = [];
      const chkTicket = this._ticketService.bulkMentionChecked.filter(obj =>
        obj.guid === this._navigationService.currentSelectedTab.guid);

      for (const checkedticket of chkTicket) {
        let commentcount = 0;
        let shareCount = 0;
        if (checkedticket.mention.mentionMetadata.commentCount) {
          commentcount = checkedticket.mention.mentionMetadata.commentCount;
        }
        if(checkedticket.mention.mentionMetadata.shareCount)
        {
          shareCount = checkedticket.mention.mentionMetadata.shareCount;
        }
        const properties: CategoryTagDetails = {
          tagID: checkedticket.mention.tagID,
          channelGroup: checkedticket.mention.channelGroup,
          shareCount: shareCount,
          commentCount: commentcount,
          socialID: checkedticket.mention.socialID,
          retweetedStatusID: checkedticket.mention.retweetedStatusID,
          brandID: checkedticket.mention.brandInfo.brandID,
          caseID: checkedticket.mention.ticketInfo.ticketID,
          mentionID: checkedticket.mention.mentionID
        };

        categoryTagDetails.push(properties);
      }
      
      let postObjectcopy = JSON.parse(JSON.stringify(this._postDetailService.postObj));
      postObjectcopy.categoryMap = this.categoryCards;
      postObjectcopy = this.mapLocobuzzEntity.mapMention(postObjectcopy);
      this.taggingParameters.source = postObjectcopy;
     
      this.taggingParameters.tagIDs = categoryTagDetails;
      this.data.saveBulkCategoryData(this.taggingParameters, this._postDetailService, this.categoryCards, this._snackBar);
      this.dialog.closeAll();
    }
    else {
      let postObjectcopy = JSON.parse(JSON.stringify(this._postDetailService.postObj));
      postObjectcopy.categoryMap = this.categoryCards;
      postObjectcopy = this.mapLocobuzzEntity.mapMention(postObjectcopy);

      this.taggingParameters.source = postObjectcopy;

      this.data.saveCategoryData(this.taggingParameters, this._postDetailService, this.categoryCards, this._snackBar);
      this.dialog.closeAll();
    }
  }


  ngDestroy(): void {
    this.deleteAllData();
  }


}
