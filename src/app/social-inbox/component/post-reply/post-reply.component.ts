import {
  Component,
  Input,
  OnInit,
  NgZone,
  ElementRef,
  ChangeDetectorRef,
  Optional,
  Inject,
  OnDestroy,
  Output,
  EventEmitter,
  Renderer2,
  ViewChild,
  ViewChildren,
  QueryList,
} from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import { MediaGalleryComponent } from './../media-gallery/media-gallery.component';
import { MAT_CHECKBOX_DEFAULT_OPTIONS_FACTORY } from '@angular/material/checkbox';
import { BaseMention } from 'app/core/models/mentions/locobuzz/BaseMention';
import { PostDetailService } from 'app/social-inbox/services/post-detail.service';
import { ChannelGroup } from 'app/core/enums/ChannelGroup';
import { UserRoleEnum } from 'app/core/enums/userRoleEnum';
import { AccountService } from 'app/core/services/account.service';
import { AuthUser } from 'app/core/interfaces/User';
import { map, startWith, take } from 'rxjs/operators';
import { ChannelType } from 'app/core/enums/ChannelType';
import {
  ReplyLinkCheckbox,
  Replylinks,
  ReplyOptions,
  TextAreaCount,
  TicketReplyDto,
  TicketsCommunicationLog,
} from 'app/core/models/dbmodel/TicketReplyDTO';
import { TicketStatus } from 'app/core/enums/ticketStatusEnum';
import { BrandList } from '../../../shared/components/filter/filter-models/brandlist.model';
import { FilterService } from 'app/social-inbox/services/filter.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { ReplyService } from 'app/social-inbox/services/reply.service';
import { BaseSocialAccountConfiguration } from 'app/core/models/accountconfigurations/BaseSocialAccountConfiguration';
import { TicketsService } from 'app/social-inbox/services/tickets.service';
import * as moment from 'moment';
import { TaggedUser } from 'app/core/models/viewmodel/TaggedUser';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  BaseReply,
  PerformActionParameters,
} from 'app/core/models/viewmodel/PerformActionParameters';
import { MaplocobuzzentitiesService } from 'app/core/services/maplocobuzzentities.service';
import { ActionTaken } from 'app/core/enums/ActionTakenEnum';
import { Reply } from 'app/core/models/viewmodel/Reply';
import {
  ActionStatusEnum,
  ClientStatusEnum,
} from 'app/core/enums/ActionStatus';
import { MakerCheckerEnum } from 'app/core/enums/MakerCheckerEnum';
import { SSREMode } from 'app/core/enums/ssreLogStatusEnum';
import { SsreIntent } from 'app/core/enums/ssreIntentEnum';
import { JsonPipe } from '@angular/common';
import { CannedResponseComponent } from '../canned-response/canned-response.component';
import { SmartSuggestionComponent } from '../smart-suggestion/smart-suggestion.component';
import { LocoBuzzAgent } from 'app/core/models/viewmodel/LocoBuzzAgent';
import { UgcMention } from 'app/core/models/viewmodel/UgcMention';
import { MediagalleryService } from 'app/core/services/mediagallery.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GroupEmailList } from 'app/core/models/viewmodel/GroupEmailList';
import { LocobuzzIntentDetectedResult } from 'app/core/models/viewmodel/LocobuzzIntentDetectResult';
import { smartSuggestion } from 'app/app-data/smartSuggestion';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { MakerChecker } from 'app/core/models/dbmodel/MakerCheckerDB';
import { PostsType } from 'app/core/models/viewmodel/GenericFilter';
import { PerformedAction } from 'app/core/enums/PerformedAction';
import { NavigationService } from 'app/core/services/navigation.service';
import {
  AlertDialogModel,
  AlertPopupComponent,
} from 'app/shared/components/alert-popup/alert-popup.component';
import { TicketsignalrService } from 'app/core/services/signalrservices/ticketsignalr.service';
import { ReplyInputParams } from 'app/core/models/viewmodel/ReplyInputParams';
import { SubSink } from 'subsink';
import { ForwardEmailRequestParameters } from 'app/core/models/viewmodel/ForwardEmailRequestParameters';

@Component({
  selector: 'app-post-reply',
  templateUrl: './post-reply.component.html',
  styleUrls: ['./post-reply.component.scss'],
})
export class PostReplyComponent implements OnInit, OnDestroy {
  @Input() postMessage: any;
  @Input() replyInputParams?: ReplyInputParams;
  @Output() replyEvent = new EventEmitter<boolean>();
  replyForm: FormGroup;
  makercheckerticketId: number;
  SsreMode: SSREMode;
  SsreIntent: SsreIntent;
  simulationCheck = false;
  // Ssre Simulation check
  ssreSimulationRight = false;
  ssreSimulationWrong = false;
  sendEmailSubject = '';
  @ViewChild('newTextArea')
  private animateThis: ElementRef;
  @ViewChildren('txtArea') textAreas: QueryList<ElementRef>;
  @ViewChild("txtArea") inputElement: ElementRef;

  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = ['Lemon'];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  
  TicketList: BaseMention[] = [];
  constructor(
    private zone: NgZone,
    private _bottomSheet: MatBottomSheet,
    private dialog: MatDialog,
    private _postDetailService: PostDetailService,
    private accountService: AccountService,
    private _filterService: FilterService,
    private fb: FormBuilder,
    private replyService: ReplyService,
    private _ticketService: TicketsService,
    private _mapLocobuzzEntity: MaplocobuzzentitiesService,
    private elementRef: ElementRef,
    private mediaGalleryService: MediagalleryService,
    private _snackBar: MatSnackBar,
    public cdr: ChangeDetectorRef,
    private _ticketSignalrService: TicketsignalrService,
    private renderer: Renderer2,
    private _replyService: ReplyService,
    private _navigationService: NavigationService,
    @Optional()
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: {
      makerchticketId?: number;
      SSREMode?: SSREMode;
      SsreIntent?: SsreIntent;
      onlyEscalation?: boolean;
    } // public dialogRef: MatDialogRef<PostReplyComponent>
  ) {

    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));

    if (data && data.makerchticketId) {
      this.makercheckerticketId = data.makerchticketId;
    }
    if (data && data.SSREMode && data.SsreIntent) {
      this.SsreMode = data.SSREMode;
      this.SsreIntent = data.SsreIntent;
      this.simulationCheck = true;
      if (data.SsreIntent === SsreIntent.Right) {
        this.ssreSimulationRight = true;
      }
    }
    if (data && data.onlyEscalation) {
      // this.showReplySection = false;
      this.IsreplyAndEscalate = true;
      this.showEscalateview = true;
      this.showEmailView = false;
      this.onlyEscalation = true;
    }
    this.checkReplyInputParams();
  }

  add(event: MatChipInputEvent): void {
    const value :any= (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.customGroupEmailList.push(value);
    }

    // Clear the input value
    // event.chipInput.clear();
    // event.value.clear();

    this.fruitCtrl.setValue(null);
  }

  remove(id: any): void {
    const index = this.customGroupEmailList.indexOf(id);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
 //   this.customGroupEmailList.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  currentUser: AuthUser;
  ticketReplyDTO: TicketReplyDto;
  maxLengthInput: number;
  brandList: BrandList[];
  IsreplyAndEscalate = false;
  showEscalateview = false;
  textResponse: string = '';
  selectedReplyType: number;
  sendtoGroupsClicked = false;
  showGroupsView = false;
  showReplySection = true;
  isEmailChannel = false;
  sendEmailChannelClicked = false;
  showEmailView = false;
  onlyEscalation = false;
  onlySendMail = false;
  currentReplyLink: number;
  taggedUsersAsync = new Subject<TaggedUser[]>();
  taggedUsersAsync$ = this.taggedUsersAsync.asObservable();
  subs = new SubSink();

  escalateUsers: number;
  splittedTweets = new Array();
  taggedUsers: TaggedUser[];
  selectedTagUsers: TaggedUser[];
  replyLinkCheckbox: ReplyLinkCheckbox[];
  currentBrand: BrandList;
  baseMentionObj: BaseMention;
  customAgentList: LocoBuzzAgent[] = [];
  modAgentList?: LocoBuzzAgent[] = [];
  locobuzzIntentDetectedResult: LocobuzzIntentDetectedResult[] = [];

  mediaSelectedAsync = new Subject<UgcMention[]>();
  mediaSelectedAsync$ = this.mediaSelectedAsync.asObservable();

  cannedResponse = new Subject<string>();
  cannedResponseAsync$ = this.cannedResponse.asObservable();

  smartSuggestion = new BehaviorSubject<string>('');
  smartSuggestionAsync$ = this.smartSuggestion.asObservable();

  groupEmailList = new Subject<GroupEmailList[]>();
  groupEmailListAsync$ = this.groupEmailList.asObservable();

  customGroupEmailList: GroupEmailList[];
  selectedMedia: UgcMention[] = [];
  objBrandSocialAcount: BaseSocialAccountConfiguration[];
  objBrandFBInstaAcount: BaseSocialAccountConfiguration[];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  emails: { id: string }[] = [{ id: 'john.doe@example.com' }];
  // demo tags for pill
  groupToEmails: string[] = [];
  groupCCEmails: string[] = [];
  groupBCCEmails: string[] = [];

  emailToEmail: string[] = [];
  emailCCEmails: string[] = [];
  emailBCCEmails: string[] = [];

  groupIDs: string[] = [];
  sendEmailcc: boolean = false;
  sendEmailBcc: boolean = false;
  replyEmailcc: boolean = false;
  replyEmailBcc: boolean = false;
  replyTextInitialValue: string = '';
  emailReplyText = '';
  textAreaCount: TextAreaCount[] = [];
  toDos: string[] = ['', ''];
  inputTextArea = {};
  // Reply Modified Values
  IsReplyModified = false;
  eligibleForAutoclosure = false;
  isReplyScheduled = false;
  emojiSet: string = 'facebook';
  public Editor = ClassicEditor;
  CKEditorConfig = {
    toolbar: ['heading', '|', 'bold', 'italic', 'link', 'Undo', 'Redo'],
  };
  foulKeywordArr: { emailID: string; id: string; name: string }[];
  FoulKeywordData = { ContainFoulKeywords: [], replyText: '', Status: '' };
  allowFoul: boolean = false;
  specificTwitterReply = true;
  showMediaButton = false;
  editorConfig = {
    toolbar: {
      items: [
        'bold',
        'italic',
        'underline',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'indent',
        'outdent',
        '|',
        'imageUpload',
        'blockQuote',
        'insertTable',
        'undo',
        'redo',
      ],
    },
    image: {
      toolbar: [
        'imageStyle:full',
        'imageStyle:side',
        '|',
        'imageTextAlternative',
      ],
    },
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
    },
    // This value must be kept in sync with the language defined in webpack.config.js.
    language: 'en',
  };
  ngOnInit(): void {
    this.replyForm = this.fb.group({
      replyType: [
        { value: '', disabled: this.ssreSimulationRight },
        [Validators.required],
      ],
      replyHandler: [''],
      // TeamLeader: [''],
      // replyText: [{ value: '', disabled: this.ssreSimulationRight }, [Validators.required]],
      replyEscalateNote: [{ value: '', disabled: this.ssreSimulationRight }],
      escalateUsers: [
        { value: '', disabled: this.ssreSimulationRight },
        [Validators.required],
      ],
      ckeditorText: [{ value: '', disabled: this.ssreSimulationRight }],
    });

    this.clearInputs();
    this.ticketReplyDTO = {};
    this.ticketReplyDTO.handleNames = [];
    this.ticketReplyDTO.taggedUsers = [];
    this.ticketReplyDTO.replyOptions = [];
    this.ticketReplyDTO.groupEmailList = [];
    this.ticketReplyDTO.agentUsersList = [];
    this.customGroupEmailList = [];
    this.maxLengthInput = 0;
    this.replyLinkCheckbox = [];
    console.log('ReplyMessage');
    this.baseMentionObj = this._postDetailService.postObj;
    this.setMaxLengthInput();
    const textareaObj = new TextAreaCount();
    this.textAreaCount.push(textareaObj);
    console.log(this.postMessage);
    this.accountService.currentUser$
      .pipe(take(1))
      .subscribe((user) => (this.currentUser = user));
    this.buildCustomInputBySource(this._postDetailService.postObj);
    this.GetBrandAccountInformation(this._postDetailService.postObj);
    if (
      !this.makercheckerticketId &&
      !this.simulationCheck &&
      !this.onlyEscalation
    ) {
      this.getSmartSuggestion(this._postDetailService.postObj);
    }
    if (this.baseMentionObj.channelGroup === ChannelGroup.Email) {
      this.showReplySection = false;
      this.isEmailChannel = true;
      this.showEmailView = true;
      if (this.baseMentionObj.fromMail) {
        this.emailToEmail.push(this.baseMentionObj.fromMail);
      }
      if (this.baseMentionObj.ccList) {
        this.emailCCEmails = this.baseMentionObj.ccList.split(',');
      }
      if (this.baseMentionObj.bccList) {
        this.emailBCCEmails = this.baseMentionObj.fromMail.split(',');
      }
    }
    if (this.onlyEscalation) {
      this.showReplySection = true;
      this.isEmailChannel = false;
      this.showEmailView = false;
    }
    const channeltype = this._postDetailService.postObj.channelType;
    if (
      channeltype === 8 ||
      channeltype === 61 ||
      channeltype === 11 ||
      channeltype === 12 ||
      channeltype === 2 ||
      channeltype === 49
    ) {
      this.emojiSet = 'facebook';
    } else if (channeltype === 1 || channeltype === 7) {
      this.emojiSet = 'twitter';
    }

    this._replyService.getFoulKeywords(this.baseMentionObj).subscribe((res) => {
      this.foulKeywordArr = res.foulEmailIDsKeyWords;
    });
    this.subscribeToObservables();
    if (
      this.baseMentionObj.channelType === ChannelType.PublicTweets ||
      this.baseMentionObj.channelType === ChannelType.Twitterbrandmention
    ) {
      this.textAreaCount[0].postCharacters = 280;
      this.textAreaCount[0].showAddNewReply = true;
      this.textAreaCount[0].totalCharacters = this.maxLengthInput;
      this.textAreaCount[0].showPost = true;
      this.textAreaCount[0].showTotal = true;
      // const testarea = new TextAreaCount();
      // testarea.id = 1;
      // this.textAreaCount.push(testarea);
    } else {
      this.textAreaCount[0].postCharacters = this.maxLengthInput;
      this.textAreaCount[0].showAddNewReply = false;
      this.textAreaCount[0].totalCharacters = this.maxLengthInput;
      this.textAreaCount[0].showPost = false;
      this.textAreaCount[0].showTotal = true;
      this.textAreaCount[0].maxPostCharacters = this.maxLengthInput;
    }

    // showMedia Gallery
    if (this.baseMentionObj.channelGroup === ChannelGroup.Twitter
      || this.baseMentionObj.channelGroup === ChannelGroup.Facebook
      || this.baseMentionObj.channelGroup === ChannelGroup.WhatsApp
      || this.baseMentionObj.channelGroup === ChannelGroup.Email)
      {
        this.showMediaButton = true;
      }

    if (this.onlySendMail)
      {
        this.showEmailView = false;
        this.emailToEmail = [];
        this.emailCCEmails = [];
        this.emailBCCEmails = [];
        this.sendEmailSubject = `Locobuzz Alert: ${this.baseMentionObj.brandInfo.brandName} : ${ChannelGroup[this.baseMentionObj.channelGroup]} : ${this.baseMentionObj.ticketInfo.ticketID} : ${this.baseMentionObj.author.name} `;
        this.getTicketHtmlForEmail();
        this.replyLinkCheckbox = this.replyLinkCheckbox.filter(obj => {
          if (obj.replyLinkId === Replylinks.SendToGroups)
          {
            return obj;
          };
        });
      }
      setTimeout(()=> { this.inputElement.nativeElement.focus();},50);
  }
  checkReplyInputParams(): void {
    this.subs.add(
      this.replyService.checkReplyInputParams.subscribe((paramObj) => {
        if (
          paramObj &&
          paramObj.postObj &&
          paramObj.postObj.ticketInfo.ticketID ===
            this._postDetailService.postObj.ticketInfo.ticketID
        ) {
          if (paramObj && paramObj.makerchticketId) {
            this.makercheckerticketId = paramObj.makerchticketId;
          }
          if (paramObj && paramObj.SSREMode && paramObj.SsreIntent) {
            this.SsreMode = paramObj.SSREMode;
            this.SsreIntent = paramObj.SsreIntent;
            this.simulationCheck = true;
            if (this.replyInputParams.SsreIntent === SsreIntent.Right) {
              this.ssreSimulationRight = true;
            }
          }
          if (paramObj && paramObj.onlyEscalation) {
            // this.showReplySection = false;
            this.IsreplyAndEscalate = true;
            this.showEscalateview = true;
            this.showEmailView = false;
            this.onlyEscalation = true;
          }
          if (paramObj && paramObj.onlySendMail) {
            this.showReplySection = false;
            this.onlySendMail = true;
          }
        }
      })
    );
  }

  getTicketHtmlForEmail(): void {
    const keyObj = {
      brandInfo: this.baseMentionObj.brandInfo,
      ticketId: this.baseMentionObj.ticketInfo.ticketID,
      to: 1,
      from: 10,
      authorId: this.baseMentionObj.author.socialId,
      channel: this.baseMentionObj.channelGroup
  };

    this.replyService.GetTagAlerEmails(this.baseMentionObj.brandInfo).subscribe((data) => {
    if (data)
    {
      for (const mailObj of data)
      {
        if (mailObj.email)
        {
          if (+mailObj.recipientsType === 0)
          {
            this.emailToEmail.push(mailObj.email);
          }
          if (+mailObj.recipientsType === 1)
          {
            this.emailCCEmails.push(mailObj.email);
          }
          if (+mailObj.recipientsType === 2)
          {
            this.emailBCCEmails.push(mailObj.email);
          }
        }
      }
    }
});

    this.replyService.getTicketHtmlForEmail(keyObj).subscribe((data) => {
      this.emailReplyText = String(data.data);
  });
  }
  setEscalateUsers(event: FormControl): void {
    (this.replyForm.get('escalateUsers') as FormControl).patchValue(
      event.value
    );
    console.log(this.replyForm);
  }

  setMaxLengthInput(): void {
    this.ticketReplyDTO.maxlength = 8000;
    if (
      ChannelType.PublicTweets === this.baseMentionObj.channelType ||
      ChannelType.Twitterbrandmention === this.baseMentionObj.channelType
    ) {
      this.ticketReplyDTO.maxlength = 1500;
    } else if (ChannelGroup.Instagram === this.baseMentionObj.channelGroup) {
      this.ticketReplyDTO.maxlength = 1000;
    } else if (
      ChannelGroup.GooglePlayStore === this.baseMentionObj.channelGroup
    ) {
      this.ticketReplyDTO.maxlength = 350;
    } else if (ChannelGroup.Email === this.baseMentionObj.channelGroup) {
      this.ticketReplyDTO.maxlength = 350;
    } else if (
      ChannelGroup.GoogleMyReview === this.baseMentionObj.channelGroup
    ) {
      this.ticketReplyDTO.maxlength = 350;
    } else if (ChannelGroup.WhatsApp === this.baseMentionObj.channelGroup) {
      this.ticketReplyDTO.maxlength = 4000;
    }
    this.maxLengthInput = this.ticketReplyDTO.maxlength;
  }

  clearInputs(): void {
    // this.replyForm.patchValue({
    //   replyText: '',
    // });
    this.clearAllTextBoxes();
    this.replyTextInitialValue = '';
    this.mediaGalleryService.selectedMedia = [];
    this.replyService.locobuzzIntentDetectedResult = [];
  }

  clearAllTextBoxes(): void {
    this.textAreaCount = [];
  }

  getSmartSuggestion(mention: BaseMention): void {
    const object = this._mapLocobuzzEntity.mapMention(mention);
    if (!object.title) {
      object.title = object.description;
    }
    this._ticketService.replyAutoSuggest(object).subscribe((data) => {
      this.locobuzzIntentDetectedResult =
        smartSuggestion.data.localIntentSuggestion;
      if (
        this.locobuzzIntentDetectedResult &&
        this.locobuzzIntentDetectedResult.length > 0
      ) {
        this.replyService.locobuzzIntentDetectedResult = this.locobuzzIntentDetectedResult;
        if (
          this.locobuzzIntentDetectedResult[0].recommended_response &&
          this.locobuzzIntentDetectedResult[0].category_name === 'Recommended'
        ) {
          // this.replyForm.patchValue({
          //   replyText: this.locobuzzIntentDetectedResult[0].recommended_response,
          // });
          // this.ReplyInputChangesCopy(this.locobuzzIntentDetectedResult[0].recommended_response);
          // this.textAreaCount[0].text = this.locobuzzIntentDetectedResult[0].recommended_response;
          // this.ReplyInputChangesModifiedCopy(this.locobuzzIntentDetectedResult[0].recommended_response, 0);
        }
      } else {
        this.replyService.locobuzzIntentDetectedResult = [];
      }
    });
  }

  subscribeToObservables(): void {
    this.replyService.selectedMedia.subscribe((ugcarray) => {
      if (ugcarray && ugcarray.length > 0) {
        this.mediaSelectedAsync.next(ugcarray);
        this.selectedMedia = ugcarray;
      }
    });

    this.replyService.selectedCannedResponse.subscribe((obj) => {
      if (obj && obj.trim() !== '') {
        const activetextBox = this.textAreaCount.findIndex(
          (object) => object.isSelected === true
        );
        if (activetextBox > -1) {
          this.cannedResponse.next(
            this.textAreaCount[activetextBox].text + obj
          );
          this.textAreaCount[activetextBox].text =
            this.textAreaCount[activetextBox].text + ' ' + obj;
          // this.changeTextArea(this.textAreaCount);
          this.ReplyInputChangesModifiedCopy(
            this.textAreaCount[activetextBox].text,
            activetextBox
          );
        }
      }
      // this.cannedResponse.next(this.textResponse + obj);
      // this.textResponse = this.textResponse + ' ' + obj;
      // this.replyForm.patchValue({
      //   replyText: this.textResponse,
      // });
      // this.ReplyInputChangesCopy(this.textResponse);
    });

    this.replyService.selectedSmartSuggestion.subscribe((obj) => {
      if (obj && obj.trim() !== '') {
        const activetextBox = this.textAreaCount.findIndex(
          (object) => object.isSelected === true
        );
        if (activetextBox > -1) {
          this.smartSuggestion.next(obj);
          this.textAreaCount[activetextBox].text = obj;
          this.ReplyInputChangesModifiedCopy(
            this.textAreaCount[activetextBox].text,
            activetextBox
          );
          // this.changeTextArea(this.textAreaCount);
        }
      }
      // this.smartSuggestion.next(obj);
      // this.textResponse = obj;
      // this.replyForm.patchValue({
      //   replyText: this.textResponse,
      // });
      // this.ReplyInputChangesCopy(this.textResponse);
    });
  }

  removeSelectedMedia(ugcMention: UgcMention): void {
    if (ugcMention) {
      this.selectedMedia = this.selectedMedia.filter((obj) => {
        return obj.mediaID !== ugcMention.mediaID;
      });
      this.mediaSelectedAsync.next(this.selectedMedia);
      this.mediaGalleryService.selectedMedia = this.selectedMedia;
    }
  }

  buildCustomInputBySource(basemention: BaseMention): void {
    if (
      basemention.channelGroup === ChannelGroup.Facebook ||
      basemention.channelGroup === ChannelGroup.Twitter
    ) {
      if (
        basemention.ssreMode === SSREMode.Simulation &&
        basemention.ssreIntent === SsreIntent.Right
      ) {
        this.replyLinkCheckbox.push({
          name: 'Send Feedback',
          socialId: basemention.socialID,
          replyLinkId: Replylinks.SendFeedback,
          checked: false,
          disabled: false,
        });
      } else {
        this.replyLinkCheckbox.push({
          name: 'Send Feedback',
          socialId: basemention.socialID,
          channelType: basemention.channelType,
          replyLinkId: Replylinks.SendFeedback,
          checked: false,
          disabled: false,
        });
      }
    }

    if (
      basemention.channelType === ChannelType.Twitterbrandmention ||
      basemention.channelType === ChannelType.PublicTweets
    ) {
      this.replyLinkCheckbox.push({
        name: 'Send as DM',
        socialId: basemention.socialID,
        channelType: basemention.channelType,
        replyScreenName: basemention.author.screenname,
        replyLinkId: Replylinks.SendAsDM,
        checked: false,
        disabled: false,
      });

      this.replyLinkCheckbox.push({
        name: 'Send DM Link',
        socialId: basemention.socialID,
        channelType: basemention.channelType,
        replyScreenName: basemention.author.screenname,
        replyLinkId: Replylinks.SendDMLink,
        checked: false,
        disabled: false,
      });
    }

    this.replyLinkCheckbox.push({
      name: 'Send to Groups',
      socialId: basemention.socialID,
      replyLinkId: Replylinks.SendToGroups,
      checked: false,
      disabled: false,
    });

    if (basemention.channelGroup === ChannelGroup.Email) {
      this.isEmailChannel = true;
      this.replyLinkCheckbox.push({
        name: 'Add previous mail trail',
        socialId: basemention.socialID,
        replyLinkId: Replylinks.PreviousMailTrail,
        checked: false,
        disabled: false,
      });
    }

    this.brandList = this._filterService.fetchedBrandData;
    let isEnableReplyApprovalWorkFlow = false;
    if (this.brandList) {
      const currentBrandObj = this.brandList.filter((obj) => {
        return +obj.brandID === +basemention.brandInfo.brandID;
      });
      this.currentBrand =
        currentBrandObj[0] !== null ? currentBrandObj[0] : undefined;

      if (this.currentBrand) {
        if (this.currentBrand.isEnableReplyApprovalWorkFlow) {
          isEnableReplyApprovalWorkFlow = true;
        }
      }
    }

    if (
      this.currentUser.data.user.role === UserRoleEnum.AGENT &&
      isEnableReplyApprovalWorkFlow &&
      !this.currentUser.data.user.agentWorkFlowEnabled &&
      !basemention.ticketInfo.ticketAgentWorkFlowEnabled
    ) {
      this.replyLinkCheckbox.push({
        name: 'Send For Approval',
        socialId: basemention.socialID,
        replyLinkId: Replylinks.SendForApproval,
        checked: false,
        disabled: false,
      });
    }
  }

  GetBrandAccountInformation(basemention: BaseMention): void {
    const obj = {
      Brand: basemention.brandInfo,
      ChannelGroup: basemention.channelGroup,
    };

    // call api to get socialaccountlist

    this.replyService.GetBrandAccountInformation(obj).subscribe((data) => {
      console.log(data);
      // this.zone.run(() => {
      this.objBrandSocialAcount = data;
      this.checkOptions(this._postDetailService.postObj);
    });
    // Get AgentListwith ticket Count
    this.replyService.GetUsersWithTicketCount(obj.Brand).subscribe((data) => {
      console.log(data);
      this.modAgentList = data;
      this.ticketReplyDTO.agentUsersList = data;
      this.getAutoQueueConfig(obj.Brand);
    });

    // Get Mail Group
    obj.Brand.categoryGroupID = +this._filterService.fetchedBrandData.find(
      (object) => {
        return +object.brandID === obj.Brand.brandID;
      }
    ).categoryGroupID;
    this.replyService.GetMailGroup(obj.Brand).subscribe((data) => {
      console.log(data);
      this.ticketReplyDTO.groupEmailList = [];
      this.customGroupEmailList = data;
      this.ticketReplyDTO.groupEmailList = data;
      // this.getAutoQueueConfig(obj.Brand);
    });
  }

  getAutoQueueConfig(obj): void {
    this.replyService.getAutoQueueingConfig(obj.Brand).subscribe((data) => {
      console.log(data);
      this.ticketReplyDTO.autoQueueConfig = data;
      this.buildAgentUserList();
      // call maker checker data if ticket id present in dialogue data
      if (this.makercheckerticketId) {
        this.getMakerCheckerData();
      }
      if (this.simulationCheck) {
        this.fillSSRELiveData();
      }
    });
  }

  getMakerCheckerData(): void {
    const makercheckerObj = {
      BrandInfo: {
        BrandId: this.baseMentionObj.brandInfo.brandID,
        BrandName: this.baseMentionObj.brandInfo.brandName,
      },
      TicketId: this.makercheckerticketId,
    };

    this.replyService.GetMakerCheckerData(makercheckerObj).subscribe((data) => {
      console.log(data);
      this.ticketReplyDTO.makerCheckerData = data;
      setTimeout(() => this.setReplyWindow(), 0);
      // call maker checker data if ticket id present in dialogue data
    });
  }

  buildAgentUserList(): void {
    this.ticketReplyDTO.agentUsersList = [];
    this.ticketReplyDTO.agentUsersList = this.modAgentList;
    this.customAgentList = [];
    if (+this.currentUser.data.user.role === UserRoleEnum.CustomerCare) {
      this.customAgentList = this.ticketReplyDTO.agentUsersList.filter(
        (obj) => {
          return obj.userRole === UserRoleEnum.BrandAccount;
        }
      );
    } else if (+this.currentUser.data.user.role === UserRoleEnum.BrandAccount) {
      this.customAgentList = this.ticketReplyDTO.agentUsersList.filter(
        (obj) => {
          return obj.userRole === UserRoleEnum.BrandAccount;
        }
      );
    } else {
      if (
        this.ticketReplyDTO.agentUsersList &&
        this.ticketReplyDTO.agentUsersList.length > 0
      ) {
        this.customAgentList = this.ticketReplyDTO.agentUsersList.filter(
          (obj) => {
            return (
              obj.userRole === UserRoleEnum.BrandAccount ||
              obj.userRole === UserRoleEnum.CustomerCare
            );
          }
        );
      }
    }
    this.ticketReplyDTO.agentUsersList = this.customAgentList;
  }

  checkOptions(basemention: BaseMention): void {
    setTimeout(() => {}, 200);
    this.ticketReplyDTO = {};
    this.ticketReplyDTO.isCSDUser = false;
    this.ticketReplyDTO.isBrandUser = false;
    this.ticketReplyDTO.isBrandworkFlowEnabled = false;
    this.ticketReplyDTO.showCannedResponse = true;

    if (
      basemention.channelGroup === ChannelGroup.WhatsApp ||
      basemention.channelType === ChannelType.FBMessages
    ) {
      const utcMoment = moment.utc().subtract(-24, 'hours');
      const mentiondate = new Date(basemention.mentionTime);
      const mentiontime = moment(mentiondate);
      if (basemention.channelGroup === ChannelGroup.WhatsApp) {
        // let LastmentionTime = this._ticketService.calculateTicketTimes(this._postDetailService.postObj);
        // LastmentionTime = AccountWrapper.GetWhatsappLastMentionTime(Model.BrandInfo, objsocialauthor.SocialID);
        // if (LastmentionTime < DateTime.UtcNow.AddHours(-24))
        // {
        //     disableReplyTextBox = "style=pointer-events:none;";
        //     NoReplyTextStyle = "display:block;";
        //     hideCannedResponse = "display:none;";
        // }
        if (mentiontime < utcMoment) {
          this.ticketReplyDTO.showCannedResponse = false;
        }

        this.ticketReplyDTO.apiWarningMessage =
          'Last Message from this user was received more than 24 hours ago so as per whatsapp API restriction we can only reply to users with predefined whatsapp template based messages.';
      } else if (basemention.channelType === ChannelType.FBMessages) {
        // if (LastmentionTime < DateTime.UtcNow.AddHours(-24))
        // {
        //     disableReplyTextBox = "style=pointer-events:none;";
        //     NoReplyTextStyle = "display:block;";
        //     hideCannedResponse = "display:none;";
        // }
        if (mentiontime < utcMoment) {
          this.ticketReplyDTO.showCannedResponse = false;
        }

        this.ticketReplyDTO.apiWarningMessage =
          'Last Message from this user was received more than 24 hours ago hence as per Facebook guidelines you cannot send a reply from here.';
      }
    }

    if (basemention.channelType === ChannelType.DirectMessages) {
      if (this.objBrandSocialAcount && this.objBrandSocialAcount.length > 0) {
        this.objBrandSocialAcount = this.objBrandSocialAcount.filter((obj) => {
          return (
            obj.channelGroup === basemention.channelGroup &&
            obj.active &&
            obj.isPrimary &&
            obj.socialID === basemention.inReplyToUserID
          );
        });
      }
    } else if (basemention.channelGroup === ChannelGroup.Instagram) {
      // TicketInstagram ticketInstagram = (TicketInstagram)Model;
      if (this.objBrandSocialAcount && this.objBrandSocialAcount.length > 0) {
        this.objBrandFBInstaAcount = this.objBrandSocialAcount.filter((obj) => {
          return (
            obj.channelGroup === basemention.channelGroup &&
            obj.active &&
            (obj.isPrimary || obj.isFacebookMigration)
          );
        });
      }

      if (
        basemention.instaAccountID > 0 &&
        this.objBrandSocialAcount !== null &&
        this.objBrandSocialAcount.length > 0
      ) {
        this.objBrandSocialAcount = this.objBrandSocialAcount.filter((obj) => {
          return obj.accountID === basemention.instaAccountID;
        });
      }
    } else if (basemention.channelGroup === ChannelGroup.WhatsApp) {
      this.objBrandFBInstaAcount = this.objBrandSocialAcount;
      if (
        basemention.whatsAppAccountID > 0 &&
        this.objBrandSocialAcount !== null &&
        this.objBrandSocialAcount.length > 0
      ) {
        this.objBrandSocialAcount = this.objBrandSocialAcount.filter((obj) => {
          return obj.accountID === basemention.whatsAppAccountID;
        });
      }
    } else if (basemention.channelGroup === ChannelGroup.GooglePlayStore) {
      if (this.objBrandSocialAcount && this.objBrandSocialAcount.length > 0) {
        this.objBrandSocialAcount = this.objBrandSocialAcount.filter((obj) => {
          return (
            obj.channelGroup === basemention.channelGroup &&
            obj.active &&
            obj.isPrimary
          );
        });

        this.objBrandSocialAcount = this.objBrandSocialAcount.filter((obj) => {
          return obj.accountID === +basemention.appID;
        });
      }
    } else if (basemention.channelGroup === ChannelGroup.Facebook) {
      if (this.objBrandSocialAcount && this.objBrandSocialAcount.length > 0) {
        this.objBrandSocialAcount = this.objBrandSocialAcount.filter((obj) => {
          return (
            obj.channelGroup === basemention.channelGroup &&
            obj.active &&
            obj.isPrimary
          );
        });
      }

      if (
        basemention.fbPageID > 0 &&
        this.objBrandSocialAcount != null &&
        this.objBrandSocialAcount.length > 0
      ) {
        this.objBrandSocialAcount = this.objBrandSocialAcount.filter(
          (x) => x.socialID === String(basemention.fbPageID)
        );
        if (
          this.objBrandSocialAcount == null ||
          this.objBrandSocialAcount.length === 0
        ) {
          // this.objBrandSocialAcount = BrandAccountWrapper.GetBrandAccountInformationForFBLocation(Model.BrandInfo,
          // ticketFaceboook.FBPageID).Where(n => n.ChannelGroup == Model.ChannelGroup && n.Active == true
          // && n.IsPrimary == true && n.SocialID == Convert.ToString(ticketFaceboook.FBPageID)).ToList();
        }
      }
    } else if (basemention.channelGroup === ChannelGroup.WebsiteChatBot) {
      this.objBrandFBInstaAcount = this.objBrandSocialAcount;
      if (this.objBrandSocialAcount && this.objBrandSocialAcount.length > 0) {
        this.objBrandSocialAcount = this.objBrandFBInstaAcount.filter((obj) => {
          return (
            obj.channelGroup === basemention.channelGroup &&
            obj.active &&
            (obj.isPrimary || obj.isFacebookMigration)
          );
        });
      }
    } else if (basemention.channelGroup === ChannelGroup.LinkedIn) {
      this.objBrandFBInstaAcount = this.objBrandSocialAcount;
      if (this.objBrandSocialAcount && this.objBrandSocialAcount.length > 0) {
        this.objBrandSocialAcount = this.objBrandFBInstaAcount.filter((obj) => {
          return (
            obj.channelGroup === basemention.channelGroup &&
            obj.accountID === +basemention.inReplyToUserID
          );
        });
      }
    } else {
      if (this.objBrandSocialAcount && this.objBrandSocialAcount.length > 0) {
        this.objBrandSocialAcount = this.objBrandSocialAcount.filter((obj) => {
          return (
            obj.channelGroup === basemention.channelGroup &&
            obj.active &&
            obj.isPrimary
          );
        });
      }
    }

    if (+this.currentUser.data.user.role === UserRoleEnum.CustomerCare) {
      this.ticketReplyDTO.isCSDUser = true;
    } else if (+this.currentUser.data.user.role === UserRoleEnum.BrandAccount) {
      this.ticketReplyDTO.isBrandUser = true;
    }
    this.ticketReplyDTO.maxlength = 8000;
    if (
      ChannelType.PublicTweets === basemention.channelType ||
      ChannelType.Twitterbrandmention === basemention.channelType
    ) {
      this.ticketReplyDTO.maxlength = 1500;
    } else if (ChannelGroup.Instagram === basemention.channelGroup) {
      this.ticketReplyDTO.maxlength = 1000;
    } else if (ChannelGroup.GooglePlayStore === basemention.channelGroup) {
      this.ticketReplyDTO.maxlength = 350;
    } else if (ChannelGroup.Email === basemention.channelGroup) {
      this.ticketReplyDTO.maxlength = 350;
    } else if (ChannelGroup.GoogleMyReview === basemention.channelGroup) {
      this.ticketReplyDTO.maxlength = 350;
    } else if (ChannelGroup.WhatsApp === basemention.channelGroup) {
      this.ticketReplyDTO.maxlength = 4000;
    }
    this.maxLengthInput = this.ticketReplyDTO.maxlength;
    this.brandList = this._filterService.fetchedBrandData;

    if (this.brandList) {
      const currentBrandObj = this.brandList.filter((obj) => {
        return +obj.brandID === +basemention.brandInfo.brandID;
      });
      this.currentBrand =
        currentBrandObj[0] !== null ? currentBrandObj[0] : undefined;

      if (this.currentBrand) {
        if (this.currentBrand.isBrandworkFlowEnabled) {
          this.ticketReplyDTO.isBrandworkFlowEnabled = true;
        }
        if (this.currentBrand.isEnableReplyApprovalWorkFlow) {
          this.ticketReplyDTO.isEnableReplyApprovalWorkFlow = true;
        }

        if (this.currentBrand.isSSREEnable) {
          this.ticketReplyDTO.isSSREEnabled = true;
        }
        if (this.currentBrand.isCSDApprove) {
          this.ticketReplyDTO.isCSDApprove = true;
        }

        if (this.currentBrand.isCSDReject) {
          this.ticketReplyDTO.isCSDReject = true;
        }
      }
    }
    const replyOptions = new ReplyOptions();

    if (!this.ticketReplyDTO.isCSDUser && !this.ticketReplyDTO.isBrandUser) {
      if (
        basemention.ticketInfo.status ===
          TicketStatus.PendingwithCSDWithNewMention ||
        basemention.ticketInfo.status ===
          TicketStatus.OnHoldCSDWithNewMention ||
        basemention.ticketInfo.status ===
          TicketStatus.PendingWithBrandWithNewMention ||
        basemention.ticketInfo.status ===
          TicketStatus.RejectedByBrandWithNewMention ||
        basemention.ticketInfo.status === TicketStatus.OnHoldBrandWithNewMention
      ) {
        // <option value="15" data-id="15">Reply</option>
        // <option value="16" data-id="16">Acknowledge</option>
        // <option value="6" data-id="6">Create Ticket</option>
      } else if (
        basemention.ticketInfo.status !== TicketStatus.PendingwithCSD &&
        basemention.ticketInfo.status !== TicketStatus.PendingWithBrand &&
        basemention.ticketInfo.status !== TicketStatus.OnHoldCSD &&
        basemention.ticketInfo.status !== TicketStatus.OnHoldBrand
      ) {
        if (
          basemention.ticketInfo.status === TicketStatus.RejectedByBrand &&
          this.ticketReplyDTO.isBrandworkFlowEnabled
        ) {
        } else {
          if (
            basemention.channelGroup === ChannelGroup.Facebook ||
            basemention.channelGroup === ChannelGroup.Twitter ||
            basemention.channelGroup === ChannelGroup.Instagram ||
            basemention.channelGroup === ChannelGroup.LinkedIn ||
            basemention.channelGroup === ChannelGroup.GooglePlayStore ||
            basemention.channelGroup === ChannelGroup.Youtube ||
            basemention.channelGroup === ChannelGroup.Email ||
            basemention.channelGroup === ChannelGroup.GoogleMyReview ||
            basemention.channelGroup === ChannelGroup.WhatsApp ||
            basemention.channelGroup === ChannelGroup.WebsiteChatBot
          ) {
            const dropdown = replyOptions.replyOption.filter((obj) => {
              return (
                obj.id === 3 || obj.id === 5 || obj.id === 13 || obj.id === 14
              );
            });
            this.ticketReplyDTO.replyOptions = [];
            this.ticketReplyDTO.replyOptions = dropdown;
            // setTimeout(() => {
            //   this.selectedReplyType = 3;
            // }, 1000);
            this.replyForm.get('replyType').setValue(3);

            // <optgroup label="Reply">
            //     <option value="3" data-id="3" selected="selected">Reply & Close</option>
            //     <option value="5" data-id="5">Reply & Escalate</option>
            //     <option value="13" data-id="13">Reply & On Hold</option>
            //     <option value="14" data-id="14">Reply & Awaiting response from Customer</option>
            // </optgroup>
            // <option value="6" data-id="6">Create Ticket</option>
            // <option value="9" data-id="9">Attach Ticket</option>
          }

          // <option value="4" data-id="4">Escalate</option>
        }
      }
    } else if (this.ticketReplyDTO.isCSDUser) {
      if (this.ticketReplyDTO.isBrandworkFlowEnabled) {
        if (this.ticketReplyDTO.isCSDApprove) {
          // <option value;='7' data - id;='7'> Approve < /option>;
        }
        if (this.ticketReplyDTO.isCSDReject) {
          // <option value;='8' data - id;='8'> Reject < /option>;
        }
        // <option value;='10' data - id;='10'> Escalate < /option>;
      } else {
        // <option value="7" data-id="7">Approve</option>
        // <option value="8" data-id="8">Reject</option>
      }
    } else {
      const dropdown = replyOptions.replyOption.filter((obj) => {
        return obj.id === 3 || obj.id === 13;
      });
      this.ticketReplyDTO.replyOptions = [];
      this.ticketReplyDTO.replyOptions = dropdown;

      // <optgroup label="Reply">
      //     <option value="3" data-id="3" selected="selected">Reply & Close</option>
      //     <option value="13" data-id="13">Reply & On Hold</option>
      // </optgroup>
      // <option value="11" data-id="11">Approve</option>
      if (this.ticketReplyDTO.isBrandworkFlowEnabled) {
        // <option value="12" data-id="12">Reject</option>
      }
    }

    if (basemention.channelGroup === ChannelGroup.Twitter) {
      if (
        basemention.channelType === ChannelType.PublicTweets ||
        basemention.channelType === ChannelType.Twitterbrandmention
      ) {
        if (basemention.taggedUsersJson) {
          this.taggedUsers = JSON.parse(basemention.taggedUsersJson);
          if (this.taggedUsers && this.taggedUsers.length > 0) {
            this.taggedUsers = this.taggedUsers.filter(
              (x) =>
                x.Name.toLowerCase() !==
                basemention.author.screenname.toLowerCase()
            );
            if (
              this.objBrandSocialAcount &&
              this.objBrandSocialAcount.length > 0
            ) {
              // string SocialIDs = string.Join(",", objBrandSocialAcount.Select(x => x.SocialID).ToList());
              // TaggedUsers = TaggedUsers.Where(x => !SocialIDs.Contains(x.Userid)).ToList();
              this.ticketReplyDTO.brandUserIds = this.objBrandSocialAcount.map(
                (obj) => obj.socialID
              );
            }
          }
        }
      }
    }

    if (
      basemention.channelType === ChannelType.PublicTweets ||
      basemention.channelType === ChannelType.Twitterbrandmention
    ) {
      if (this.taggedUsers && this.taggedUsers.length > 0) {
        this.ticketReplyDTO.taggedUsers = [];
        this.ticketReplyDTO.taggedUsers.push({
          Userid: basemention.author.socialId,
          Name: basemention.author.screenname,
          Checked: true,
          Disabled: true,
        });

        for (const item of this.taggedUsers) {
          if (
            this.ticketReplyDTO.brandUserIds &&
            this.ticketReplyDTO.brandUserIds.length > 0 &&
            this.ticketReplyDTO.brandUserIds.includes(item.Userid)
          ) {
            this.ticketReplyDTO.taggedUsers.push({
              Userid: item.Userid,
              Name: item.Name,
              Checked: false,
              Disabled: false,
            });
          } else {
            this.ticketReplyDTO.taggedUsers.push({
              Userid: item.Userid,
              Name: item.Name,
              Checked: false,
              Disabled: false,
            });
          }
        }
        this.taggedUsersAsync.next(this.ticketReplyDTO.taggedUsers);
        if (
          this.ticketReplyDTO.taggedUsers &&
          this.ticketReplyDTO.taggedUsers.length > 0
        ) {
          this.selectedTagUsers = this.ticketReplyDTO.taggedUsers.filter(
            (obj) => {
              return obj.Checked === true;
            }
          );
        }
      }
    }

    if (basemention.channelGroup === ChannelGroup.WhatsApp) {
      this.ticketReplyDTO.showTemplateMessage = true;
      // <a onclick="WhatsAppChannel.WhatsAppTemplatePopup(this)" id="btnWhatsappTemplat">Template Messages</a>
    }
    if (
      basemention.channelGroup === ChannelGroup.Facebook ||
      basemention.channelGroup === ChannelGroup.Twitter
    ) {
      this.ticketReplyDTO.showUGC = true;
    }

    this.ticketReplyDTO.handleNames = [];
    if (this.objBrandSocialAcount && this.objBrandSocialAcount.length > 0) {
      for (const item of this.objBrandSocialAcount) {
        if (basemention.channelGroup === ChannelGroup.LinkedIn) {
          this.ticketReplyDTO.handleNames.push({
            handleId: item.companyId,
            handleName: item.companyName,
            accountId: item.accountID,
            socialId: item.socialID,
          });
        } else if (
          basemention.channelGroup === ChannelGroup.Instagram &&
          basemention.instaAccountID > 0
        ) {
          this.ticketReplyDTO.handleNames.push({
            handleId: item.socialID,
            handleName: item.userName,
            accountId: item.accountID,
            socialId: item.socialID,
          });
        } else if (
          basemention.channelGroup === ChannelGroup.Instagram &&
          basemention.instagramGraphApiID <= 0
        ) {
          const index = this.objBrandFBInstaAcount.findIndex(
            (obj) => obj.channelGroup === ChannelGroup.Facebook && obj.mapId > 0
          );
          const isExist = index ? true : false;
          const accId = isExist ? this.objBrandFBInstaAcount[index].mapId : 0;
          const instaExist = this.objBrandFBInstaAcount.findIndex(
            (obj) => obj.channelGroup === ChannelGroup.Instagram
          );
          if ((isExist && item.accountID !== accId) || !isExist || instaExist) {
            this.ticketReplyDTO.handleNames.push({
              handleId: item.socialID,
              handleName: item.userName,
              accountId: item.accountID,
              socialId: item.socialID,
            });
          }
        } else if (basemention.channelGroup === ChannelGroup.GooglePlayStore) {
          this.ticketReplyDTO.handleNames.push({
            handleId: item.socialID,
            handleName: item.appFriendlyName,
            accountId: item.accountID,
            socialId: item.socialID,
          });
        } else if (basemention.channelGroup === ChannelGroup.Facebook) {
          this.ticketReplyDTO.handleNames.push({
            handleId: item.socialID,
            handleName: item.userName,
            accountId: item.accountID,
            socialId: item.socialID,
          });
        } else {
          this.ticketReplyDTO.handleNames.push({
            handleId: item.socialID,
            handleName: item.userName,
            accountId: item.accountID,
            socialId: item.socialID,
          });
        }
      }
      if (
        this.ticketReplyDTO.handleNames &&
        this.ticketReplyDTO.handleNames.length > 0
      ) {
        this.replyForm
          .get('replyHandler')
          .setValue(this.ticketReplyDTO.handleNames[0].socialId);
      }
    }
  }

  private checkFoulBeforReply(): any {
    const _self = this;
    this.FoulKeywordData.ContainFoulKeywords = [];
    let allresponse = '';
    this.textAreaCount.forEach((obj) => {
      allresponse = allresponse + obj.text + ' ';
    });
    this.foulKeywordArr.forEach((item) => {
      const regx = new RegExp(`\\b${item.name.toLowerCase()}\\b`);
      if (regx.test(allresponse.toLowerCase())) {
        _self.FoulKeywordData.ContainFoulKeywords.push({
          Id: item.id,
          Keyword: item.name,
        });
      }
      if (!/^[a-zA-Z]+$/.test(item.name.toLowerCase())) {
        const megx = new RegExp(
          `(?:^|[^\\p{L}\\p{N}])'${item.name.toLowerCase()}'(?=[^\\p{L}\\p{N}]|$)`
        );
        if (megx.test(allresponse.toLowerCase())) {
          _self.FoulKeywordData.ContainFoulKeywords.push({
            Id: item.id,
            Keyword: item.name,
          });
        }
      }
    });
    if (this.FoulKeywordData.ContainFoulKeywords.length > 0) {
      this.FoulKeywordData.replyText = allresponse;
      const highlighRegx = new RegExp(
        `${this.FoulKeywordData.ContainFoulKeywords.map(
          (keyItem) => keyItem.Keyword
        ).join('|')}`,
        'gi'
      );
      this.FoulKeywordData.replyText = this.FoulKeywordData.replyText.replace(
        highlighRegx,
        '<span class="text__highlight">$&</span>'
      );
      const isworkflowenabled = this._filterService.fetchedBrandData.find(
        (brand: BrandList) =>
          +brand.brandID === this._postDetailService.postObj.brandInfo.brandID
      );
      if (
        isworkflowenabled.isEnableReplyApprovalWorkFlow &&
        this._postDetailService.postObj.isMakerCheckerEnable &&
        (this.currentUser.data.user.role === UserRoleEnum.AGENT ||
          this.currentUser.data.user.role === UserRoleEnum.NewBie)
      ) {
        // for confirmation
        const dialogData = new AlertDialogModel(
          'Your reply message contains following foul keywords. It will be sent for approval to your team lead. Do you want to continue ?',
          this.FoulKeywordData.replyText,
          'Yes',
          'No',
          true
        );
        const dialogRef = this.dialog.open(AlertPopupComponent, {
          disableClose: true,
          autoFocus: false,
          data: dialogData,
        });

        dialogRef.afterClosed().subscribe((dialogResult) => {
          if (dialogResult) {
            this.allowFoul = true;
            this.saveReply();
          }
        });
      } else {
        // just Prompt
        const dialogData = new AlertDialogModel(
          'Your reply message contains following foul keywords ?',
          this.FoulKeywordData.replyText,
          'Yes',
          'No',
          true
        );
        const dialogRef = this.dialog.open(AlertPopupComponent, {
          disableClose: true,
          autoFocus: false,
          data: dialogData,
        });

        dialogRef.afterClosed().subscribe((dialogResult) => {
          if (dialogResult) {
            this.allowFoul = true;
            this.saveReply();
          }
        });
      }
      return false;
    }
    return true;
  }

  saveReply(): void {
    // let replyinputtext = this.replyForm.get('replyText').value;
    if (this.onlySendMail)
    {
      this.forwardEmail();
      return;
    }
    let replyinputtext = this.textAreaCount[0].text;
    if (!this.allowFoul) {
      const nofoul = this.checkFoulBeforReply();
      if (!nofoul) {
        return;
      }
    }
    // else{
    //   replyinputtext = this.textResponse;
    // }
    if (this.isEmailChannel && this.emailReplyText.trim()) {
      replyinputtext = this.emailReplyText.trim();
    }
    if (this.onlyEscalation) {
      // only escalation
      if (this._postDetailService.isBulk) {
        this.bulkEscalateTo();
      } else {
        this.replyEscalateTo();
      }
    } else {
      if (replyinputtext.trim()) {
        if (this._postDetailService.isBulk) {
          this.bulkReplyEscalateTo();
        } else {
          console.log(this.replyForm);
          console.log('Saved: ' + JSON.stringify(this.replyForm.value));
          const replyObj: PerformActionParameters = {};
          const replyArray: Reply[] = [];
          const baseReply = new BaseReply();
          const customReplyObj = baseReply.getReplyClass();
          // map the properties
          replyObj.ActionTaken = ActionTaken.Locobuzz;

          // if (this.splittedTweets.length > 0) {
          //   for (const tweet of this.splittedTweets) {
          //     const customReply = baseReply.getReplyClass();
          //     customReply.replyText = tweet;

          //     replyArray.push(customReply);
          //   }
          // } else {
          //   customReplyObj.replyText = replyinputtext;
          //   replyArray.push(customReplyObj);
          // }
          if (this.textAreaCount.length > 0) {
            for (const tweet of this.textAreaCount) {
              const customReply = baseReply.getReplyClass();
              customReply.replyText = tweet.text;

              replyArray.push(customReply);
            }
          } else {
            customReplyObj.replyText = replyinputtext;
            replyArray.push(customReplyObj);
          }

          replyObj.Tasks = this.BuildComminicationLog(
            this._postDetailService.postObj
          );
          const source = this._mapLocobuzzEntity.mapMention(
            this._postDetailService.postObj
          );
          if (this.simulationCheck) {
            source.ticketInfoSsre.ssreMode = SSREMode.Simulation;
            source.ticketInfoSsre.ssreIntent = this.SsreIntent;
          }
          replyObj.Source = source;

          // tagged user Json
          if (
            this.ticketReplyDTO.taggedUsers &&
            this.ticketReplyDTO.taggedUsers.length > 0
          ) {
            const arrayuser = [];
            let excludedusers = '';
            this.ticketReplyDTO.taggedUsers.forEach((obj) => {
              arrayuser.push({
                Userid: obj.Userid,
                Name: obj.Name,
                UserType: obj.UserType,
                offset: 0,
                length: 10,
              });
              let objectFound = false;
              this.selectedTagUsers.forEach((object) => {
                if (obj.Userid === object.Userid) {
                  // do nothing
                  objectFound = true;
                  return;
                } else {
                  objectFound = false;
                }
              });
              if (!objectFound) {
                excludedusers = excludedusers + obj.Userid + ',';
              }
            });

            if (excludedusers) {
              replyArray[0].excludedReplyUserIds = excludedusers.replace(
                /,\s*$/,
                ''
              );
            }

            replyArray[0].taggedUsersJson = JSON.stringify(arrayuser);
          }

          // replyArray = this._mapLocobuzzEntity.mapReplyObject(replyArray);
          const replyopt = new ReplyOptions();
          replyObj.PerformedActionText = replyopt.replyOption
            .find((obj) => obj.id === +this.replyForm.get('replyType').value)
            .value.trim();
          replyObj.IsReplyModified = this.IsReplyModified;
          replyObj.Replies = replyArray;

          const selectedHandle = this.ticketReplyDTO.handleNames.find(
            (obj) => obj.socialId === this.replyForm.get('replyHandler').value
          );

          replyObj.ReplyFromAccountId = selectedHandle.accountId;
          replyObj.ReplyFromAuthorSocialId = selectedHandle.socialId;

          if (this.replyLinkCheckbox && this.replyLinkCheckbox.length > 0) {
            this.replyLinkCheckbox.forEach((obj) => {
              if (obj.checked && obj.replyLinkId === Replylinks.SendFeedback) {
                replyObj.Replies[0].sendFeedback = true;
              } else if (
                obj.checked &&
                obj.replyLinkId === Replylinks.SendAsDM
              ) {
                replyObj.Replies[0].sendAsPrivate = true;
              } else if (
                obj.checked &&
                obj.replyLinkId === Replylinks.SendDMLink
              ) {
                replyObj.Replies[0].sendPrivateAsLink = true;
              } else if (
                obj.checked &&
                obj.replyLinkId === Replylinks.SendToGroups
              ) {
                replyObj.Replies[0].sendToGroups = true;
              } else if (
                obj.checked &&
                obj.replyLinkId === Replylinks.SendForApproval
              ) {
                // replyObj.replies[0].sen = true;
              }
            });
          }
          // check attachments
          if (
            this.selectedMedia &&
            this.selectedMedia.length > 0 &&
            this.isEmailChannel
          ) {
            this.selectedMedia = this._mapLocobuzzEntity.mapUgcMention(
              this.selectedMedia
            );
            replyObj.Replies[0].attachmentsUgc = this.selectedMedia;
          } else {
            replyObj.Replies.forEach((obj) => {
              obj.attachmentsUgc = null;
            });
          }

          // check send to groups clicked
          if (this.sendtoGroupsClicked) {
            if (this.groupToEmails.length > 0) {
              replyObj.Replies[0].groupEmailList.email_to = this.groupToEmails.toString();
              replyObj.Replies[0].groupEmailList.email_cc = this.groupCCEmails
                ? this.groupCCEmails.toString()
                : '';
              replyObj.Replies[0].groupEmailList.email_bcc = this.groupBCCEmails
                ? this.groupBCCEmails.toString()
                : '';
              replyObj.Replies[0].groupEmailList.groupIDs = this.groupIDs;
            } else {
              this._snackBar.open('Please enter email to forward', 'Ok', {
                duration: 2000,
              });
              return;
            }
          }
          if (this.isEmailChannel) {
            replyObj.ReplyFromAccountId = +this.baseMentionObj.settingID;
            replyObj.Replies[0].toEmails =
              this.emailToEmail.length > 0 ? this.emailToEmail : [];
            replyObj.Replies[0].ccEmails =
              this.emailCCEmails.length > 0 ? this.emailCCEmails : [];
            replyObj.Replies[0].bccEmails =
              this.emailBCCEmails.length > 0 ? this.emailBCCEmails : [];
          }

          // call Reply Api
          console.log(replyObj);
          this.replyService.Reply(replyObj).subscribe((data) => {
            if (data) {
              console.log('reply successfull ', data);
              this._filterService.currentBrandSource.next(true);
              this._ticketSignalrService.removeTicketCall.next(
                this._postDetailService.postObj.ticketInfo.ticketID
              );
              this._replyService.closeReplyBox.next(false);
              this._postDetailService.postObj.ticketInfo.status = +this.replyForm.get('replyType').value;
              this._replyService.setTicktOverview.next(this._postDetailService.postObj);
              // this.dialogRef.close(true);
              this._bottomSheet.dismiss();
              this._snackBar.open('Reply Sent successfully', 'Ok', {
                duration: 2000,
              });
              this.allowFoul = false;
            } else {
              this._snackBar.open('Some error occured', 'Ok', {
                duration: 2000,
              });
            }
            // this.zone.run(() => {
          });
          console.log(replyObj);
        }
      } else {
        this._snackBar.open('Reply cannot be empty', 'Ok', {
          duration: 2000,
        });
      }
    }
  }

  forwardEmail(): void {
    if (this.emailToEmail.length > 0)
    {
      const forwardEmail: ForwardEmailRequestParameters = {};
      forwardEmail.mention = this.baseMentionObj;
      forwardEmail.isSendGroupMail = this.sendtoGroupsClicked;
      forwardEmail.subject = this.sendEmailSubject;
      forwardEmail.emailContent = this.emailReplyText;

      if (forwardEmail.emailContent)
      {
        forwardEmail.toEmailList =
        this.emailToEmail.length > 0 ? this.emailToEmail : [];
        forwardEmail.ccEmailList =
        this.emailCCEmails.length > 0 ? this.emailCCEmails : [];
        forwardEmail.bccEmailList =
        this.emailBCCEmails.length > 0 ? this.emailBCCEmails : [];

        if (this.sendtoGroupsClicked) {
          if (this.groupToEmails.length > 0) {
            forwardEmail.groupEmailList.email_to = this.groupToEmails.toString();
            forwardEmail.groupEmailList.email_cc = this.groupCCEmails
              ? this.groupCCEmails.toString()
              : '';
            forwardEmail.groupEmailList.email_bcc = this.groupBCCEmails
              ? this.groupBCCEmails.toString()
              : '';
            forwardEmail.groupEmailList.groupIDs = this.groupIDs;
          } else {
            this._snackBar.open('Please enter email to forward', 'Ok', {
              duration: 2000,
            });
            return;
          }
        }

        this.replyService.forwardReply(forwardEmail).subscribe((data) => {
          if (data) {
            this.replyService.closeReplyBox.next(false);
            this._snackBar.open('Email sent successfully', 'Ok', {
              duration: 2000,
            });
          }
        });

      }
      else
      {
        this._snackBar.open('Sorry email body is empty', 'Ok', {
          duration: 2000,
        });
      }


    }
    else{
      this._snackBar.open('Please add emailids to send an email', 'Ok', {
        duration: 2000,
      });
    }
  }

  replyEscalateTo(): void {
    const escalationMessage = this.replyForm.get('replyEscalateNote').value;

    if (
      this.ticketReplyDTO.agentUsersList &&
      this.ticketReplyDTO.agentUsersList.length > 0
    ) {
      const escalatetouser = this.ticketReplyDTO.agentUsersList.find((obj) => {
        return obj.agentID === +this.replyForm.get('escalateUsers').value;
      });
      if (escalatetouser) {
        const performActionObj = this.replyService.BuildReply(
          this._postDetailService.postObj,
          ActionStatusEnum.Escalate,
          escalationMessage,
          0,
          escalatetouser
        );

        this.replyService.Reply(performActionObj).subscribe((data) => {
          if (data) {
            console.log('closed successfull ', data);
            this._filterService.currentBrandSource.next(true);
            // this.dialogRef.close(true);
            this._bottomSheet.dismiss();
            this._snackBar.open('Ticket escalated successfully', 'Ok', {
              duration: 2000,
            });
          } else {
            this._snackBar.open('Some error occured', 'Ok', {
              duration: 2000,
            });
          }
          // this.zone.run(() => {
        });
      } else {
        this._snackBar.open('Please select user to escalate the ticket', 'Ok', {
          duration: 2000,
        });
      }
    }
  }

  BuildComminicationLog(baseMention: BaseMention): TicketsCommunicationLog[] {
    const tasks: TicketsCommunicationLog[] = [];
    const actionEnum = ReplyOptions.GetActionEnum();
    const selectedReplyType = this.replyForm.get('replyType').value;
    switch (+selectedReplyType) {
      case ActionStatusEnum.DirectClose: {
        // if ($.trim(formObject.txtNotes) != '') {
        //     let noteLog = CommunicationLogGenerator._getCommunicationLogForNote();
        //     noteLog.Note = $.trim(formObject.txtNotes);
        //     tasks.push(noteLog);
        // }

        const log = new TicketsCommunicationLog(ClientStatusEnum.Closed);

        tasks.push(log);

        baseMention.ticketInfo.makerCheckerStatus =
          MakerCheckerEnum.DirectClose;
        break;
      }
      case ActionStatusEnum.Reply: {
        const logreply = new TicketsCommunicationLog(
          ClientStatusEnum.RepliedToUser
        );
        tasks.push(logreply);
        this.replyLinkCheckbox.forEach((obj) => {
          if (obj.checked && obj.replyLinkId === Replylinks.SendFeedback) {
            const log2 = new TicketsCommunicationLog(
              ClientStatusEnum.FeedbackSent
            );
            tasks.push(log2);
          }
        });
        baseMention.ticketInfo.makerCheckerStatus = MakerCheckerEnum.Reply;
        break;
      }
      case ActionStatusEnum.ReplyAndClose: {
        const log1 = new TicketsCommunicationLog(
          ClientStatusEnum.RepliedToUser
        );
        const log2 = new TicketsCommunicationLog(ClientStatusEnum.Closed);

        tasks.push(log1);
        tasks.push(log2);
        this.replyLinkCheckbox.forEach((obj) => {
          if (obj.checked && obj.replyLinkId === Replylinks.SendFeedback) {
            const log3 = new TicketsCommunicationLog(
              ClientStatusEnum.FeedbackSent
            );
            tasks.push(log3);
          }
        });

        baseMention.ticketInfo.makerCheckerStatus = MakerCheckerEnum.ReplyClose;
        break;
      }
      case ActionStatusEnum.Escalate: {
        const escalationMessage = this.replyForm.get('replyEscalateNote').value;
        if (escalationMessage.trim() !== '') {
          const log1 = new TicketsCommunicationLog(ClientStatusEnum.NotesAdded);
          log1.Note = escalationMessage.trim();
          tasks.push(log1);
        }

        const log3 = new TicketsCommunicationLog(ClientStatusEnum.Escalated);

        if (
          this.ticketReplyDTO.agentUsersList &&
          this.ticketReplyDTO.agentUsersList.length > 0
        ) {
          const escalatetouser = this.ticketReplyDTO.agentUsersList.find(
            (obj) => {
              return obj.agentID === +this.replyForm.get('escalateUsers').value;
            }
          );

          log3.AssignedToUserID = escalatetouser.agentID;
          log3.AssignedToTeam = escalatetouser.teamID;
        }

        tasks.push(log3);
        baseMention.ticketInfo.makerCheckerStatus = MakerCheckerEnum.Escalate;
        break;
      }
      case ActionStatusEnum.ReplyAndEscalate: {
        const log1 = new TicketsCommunicationLog(
          ClientStatusEnum.RepliedToUser
        );
        const log2 = new TicketsCommunicationLog(ClientStatusEnum.NotesAdded);
        const log3 = new TicketsCommunicationLog(ClientStatusEnum.Escalated);
        if (
          this.ticketReplyDTO.agentUsersList &&
          this.ticketReplyDTO.agentUsersList.length > 0
        ) {
          const escalatetouser = this.ticketReplyDTO.agentUsersList.find(
            (obj) => {
              return obj.agentID === +this.replyForm.get('escalateUsers').value;
            }
          );

          log3.AssignedToUserID = escalatetouser.agentID;
          log3.AssignedToTeam = escalatetouser.teamID;
        }

        tasks.push(log1);
        const escalationMessage = this.replyForm.get('replyEscalateNote').value;

        if (escalationMessage.trim() !== '') {
          log2.Note = escalationMessage.trim();
          tasks.push(log2);
        }
        tasks.push(log3);
        this.replyLinkCheckbox.forEach((obj) => {
          if (obj.checked && obj.replyLinkId === Replylinks.SendFeedback) {
            const log4 = new TicketsCommunicationLog(
              ClientStatusEnum.FeedbackSent
            );
            tasks.push(log4);
          }
        });

        baseMention.ticketInfo.makerCheckerStatus =
          MakerCheckerEnum.ReplyEscalate;
        // throw new Error();
        break;
      }
      case ActionStatusEnum.CreateTicket: {
        const log1 = new TicketsCommunicationLog(ClientStatusEnum.CaseDetach);
        const log2 = new TicketsCommunicationLog(ClientStatusEnum.CaseCreated);
        const log3 = new TicketsCommunicationLog(ClientStatusEnum.CaseAttach);
        const log4 = new TicketsCommunicationLog(ClientStatusEnum.Acknowledge);

        tasks.push(log4);
        tasks.push(log1);
        tasks.push(log2);
        tasks.push(log3);

        const escalationMessage = this.replyForm.get('replyEscalateNote').value;
        if (escalationMessage.trim() !== '') {
          const log5 = new TicketsCommunicationLog(ClientStatusEnum.NotesAdded);
          log5.Note = escalationMessage.trim();
          tasks.push(log5);
        }

        break;
      }
      case ActionStatusEnum.AttachTicket: {
        const log1 = new TicketsCommunicationLog(ClientStatusEnum.CaseDetach);
        const log2 = new TicketsCommunicationLog(ClientStatusEnum.CaseAttach);

        // log2.TicketID = formObject.ddlCaseAttachmentList;

        tasks.push(log1);
        tasks.push(log2);

        const escalationMessage = this.replyForm.get('replyEscalateNote').value;
        if (escalationMessage.trim() !== '') {
          const log3 = new TicketsCommunicationLog(ClientStatusEnum.NotesAdded);
          log3.Note = escalationMessage.trim();
          tasks.push(log3);
        }
        baseMention.ticketInfo.makerCheckerStatus = MakerCheckerEnum.CaseAttach;
        break;
      }
      case ActionStatusEnum.Approve: {
        const log1 = new TicketsCommunicationLog(ClientStatusEnum.Approve);

        const escalationMessage = this.replyForm.get('replyEscalateNote').value;
        if (escalationMessage.trim() !== '') {
          const log2 = new TicketsCommunicationLog(ClientStatusEnum.NotesAdded);
          log2.Note = escalationMessage.trim();
          tasks.push(log2);
        }

        tasks.push(log1);
        break;
      }
      case ActionStatusEnum.Reject: {
        const log1 = new TicketsCommunicationLog(ClientStatusEnum.Ignore);

        const escalationMessage = this.replyForm.get('replyEscalateNote').value;
        if (escalationMessage.trim() !== '') {
          const log2 = new TicketsCommunicationLog(ClientStatusEnum.NotesAdded);
          log2.Note = escalationMessage.trim();
          tasks.push(log2);
        }

        tasks.push(log1);
        break;
      }
      case ActionStatusEnum.EscalateToBrand: {
        const escalationMessage = this.replyForm.get('replyEscalateNote').value;
        if (escalationMessage.trim() !== '') {
          const log1 = new TicketsCommunicationLog(ClientStatusEnum.NotesAdded);
          log1.Note = escalationMessage.trim();
          tasks.push(log1);
        }

        const log2 = new TicketsCommunicationLog(ClientStatusEnum.Escalated);
        if (
          this.ticketReplyDTO.agentUsersList &&
          this.ticketReplyDTO.agentUsersList.length > 0
        ) {
          const escalatetouser = this.ticketReplyDTO.agentUsersList.find(
            (obj) => {
              return obj.agentID === +this.replyForm.get('escalateUsers').value;
            }
          );

          log2.AssignedToUserID = escalatetouser.agentID;
          log2.AssignedToTeam = escalatetouser.teamID;
        }
        tasks.push(log2);
        break;
      }
      case ActionStatusEnum.BrandApproved: {
        const log1 = new TicketsCommunicationLog(ClientStatusEnum.Approve);

        const escalationMessage = this.replyForm.get('replyEscalateNote').value;
        if (escalationMessage.trim() !== '') {
          const log2 = new TicketsCommunicationLog(ClientStatusEnum.NotesAdded);
          log2.Note = escalationMessage.trim();
          tasks.push(log2);
        }

        tasks.push(log1);
        break;
      }
      case ActionStatusEnum.BrandReject: {
        const log1 = new TicketsCommunicationLog(ClientStatusEnum.Ignore);

        const escalationMessage = this.replyForm.get('replyEscalateNote').value;
        if (escalationMessage.trim() !== '') {
          const log2 = new TicketsCommunicationLog(ClientStatusEnum.NotesAdded);
          log2.Note = escalationMessage.trim();
          tasks.push(log2);
        }

        tasks.push(log1);
        break;
      }
      case ActionStatusEnum.ReplyAndAwaitingCustomerResponse: {
        const log1 = new TicketsCommunicationLog(
          ClientStatusEnum.RepliedToUser
        );
        const log2 = new TicketsCommunicationLog(
          ClientStatusEnum.CustomerInfoAwaited
        );
        tasks.push(log1);
        tasks.push(log2);
        this.replyLinkCheckbox.forEach((obj) => {
          if (obj.checked && obj.replyLinkId === Replylinks.SendFeedback) {
            const log3 = new TicketsCommunicationLog(
              ClientStatusEnum.FeedbackSent
            );
            tasks.push(log3);
          }
        });

        baseMention.ticketInfo.makerCheckerStatus =
          MakerCheckerEnum.ReplyAwaitingResponse;

        break;
      }
      case ActionStatusEnum.ReplyAndOnHold: {
        const log1 = new TicketsCommunicationLog(
          ClientStatusEnum.RepliedToUser
        );
        const log2 = new TicketsCommunicationLog(ClientStatusEnum.OnHold);
        tasks.push(log1);
        tasks.push(log2);
        this.replyLinkCheckbox.forEach((obj) => {
          if (obj.checked && obj.replyLinkId === Replylinks.SendFeedback) {
            const log3 = new TicketsCommunicationLog(
              ClientStatusEnum.FeedbackSent
            );
            tasks.push(log3);
          }
        });

        baseMention.ticketInfo.makerCheckerStatus = MakerCheckerEnum.ReplyHold;
        break;
      }
      case ActionStatusEnum.ReplyNewMentionCameAfterEsalatedorOnHold: {
        const log1 = new TicketsCommunicationLog(
          ClientStatusEnum.RepliedToUser
        );
        const log2 = new TicketsCommunicationLog(
          ClientStatusEnum.NewMentionCameAfterEsalatedorOnHold
        );

        tasks.push(log1);
        tasks.push(log2);

        this.replyLinkCheckbox.forEach((obj) => {
          if (obj.checked && obj.replyLinkId === Replylinks.SendFeedback) {
            const log3 = new TicketsCommunicationLog(
              ClientStatusEnum.FeedbackSent
            );
            tasks.push(log3);
          }
        });
        baseMention.ticketInfo.makerCheckerStatus = MakerCheckerEnum.Reply;
        break;
      }
      case ActionStatusEnum.Acknowledge: {
        const escalationMessage = this.replyForm.get('replyEscalateNote').value;
        if (escalationMessage.trim() !== '') {
          const log1 = new TicketsCommunicationLog(ClientStatusEnum.NotesAdded);
          log1.Note = escalationMessage.trim();
          tasks.push(log1);
        }

        const log2 = new TicketsCommunicationLog(ClientStatusEnum.Acknowledge);
        tasks.push(log2);
        break;
      }
      default:
        break;
    }
    tasks.forEach((obj) => {
      obj.TagID = String(baseMention.tagID);
    });
    return tasks;
  }

  onTaggedUserChange(event): void {
    if (event.checked) {
      const tagObj = this.ticketReplyDTO.taggedUsers.find(
        (obj) => obj.Userid === event.source.value
      );
      if (tagObj) {
        this.selectedTagUsers.push(tagObj);
      }
    } else {
      this.selectedTagUsers = this.selectedTagUsers.filter((obj) => {
        return obj.Userid !== event.source.value;
      });
    }
    console.log(this.taggedUsers);
    console.log(event);
  }

  replyTypeChange(event): void {
    const replyopt = new ReplyOptions();
    this.IsreplyAndEscalate = +event === 5 ? true : false;
  }

  SetNextClick(): void {
    // const replytext = this.replyForm.get('replyText').value;
    let replytext = this.textAreaCount[0].text;
    if (this.onlySendMail || this.isEmailChannel)
    {
      replytext = this.emailReplyText;
    }

    if (replytext.trim()) {
      if (this.showEscalateview && this.sendtoGroupsClicked) {
        this.showEscalateview = false;
        this.showGroupsView = true;
        this.showReplySection = false;
        this.showEmailView = false;
      }
      if (this.IsreplyAndEscalate && !this.showGroupsView) {
        this.showEscalateview = true;
        this.showEmailView = false;
      }
      if (!this.IsreplyAndEscalate && this.sendtoGroupsClicked) {
        this.showEscalateview = false;
        this.showGroupsView = true;
        this.showReplySection = false;
        this.showEmailView = false;
      }
    } else {
      this._snackBar.open('Reply cannot be empty', 'Ok', {
        duration: 2000,
      });
    }
  }
  SetBackClick(): void {
    if (this.showGroupsView) {
      this.showGroupsView = false;
      this.showReplySection = true;
      if (this.IsreplyAndEscalate) {
        this.showEscalateview = true;
      } else {
        if (this.isEmailChannel) {
          this.showEmailView = true;
          this.showReplySection = false;
        }
      }
    } else if (this.showEscalateview) {
      this.showEscalateview = false;
      if (this.isEmailChannel) {
        this.showEmailView = true;
        this.showReplySection =  false;
      }
    }
    this.mediaSelectedAsync.next(this.selectedMedia);
    // this.ReplyInputChangesCopy(this.replyTextInitialValue);
  }

  ShowEmailGroups(): void {}

  onReplyLinkChange(event): void {
    console.log(event);
    if (event.checked) {
      this.replyLinkCheckbox.forEach((obj) => {
        if (obj.replyLinkId === +event.source.value) {
          obj.checked = true;
        }
        return obj;
      });
      if (+event.source.value === Replylinks.SendAsDM) {
        this.replyLinkCheckbox = this.replyLinkCheckbox.map((obj) => {
          if (obj.replyLinkId === Replylinks.SendDMLink) {
            obj.checked = false;
            obj.disabled = true;
          }
          return obj;
        });
        this.sendDMClicked(true);
      }
      if (+event.source.value === Replylinks.SendToGroups) {
        this.sendtoGroupsClicked = true;
      }
      if (+event.source.value === Replylinks.SendDMLink) {
        this.setDMLink(true);
      }
    } else {
      this.replyLinkCheckbox.forEach((obj) => {
        if (obj.replyLinkId === +event.source.value) {
          obj.checked = false;
        }
        return obj;
      });

      if (+event.source.value === Replylinks.SendAsDM) {
        this.replyLinkCheckbox = this.replyLinkCheckbox.map((obj) => {
          if (obj.replyLinkId === Replylinks.SendDMLink) {
            obj.checked = false;
            obj.disabled = false;
          }
          return obj;
        });
        this.sendDMClicked(false);
      }

      if (+event.source.value === Replylinks.SendToGroups) {
        this.sendtoGroupsClicked = false;
      }
      if (+event.source.value === Replylinks.SendDMLink) {
        this.setDMLink(false);
      }
    }
  }

  setDMLink(checked): void {
    const replylinkObj = this.replyLinkCheckbox.find((obj) => {
      return obj.replyLinkId === Replylinks.SendDMLink;
    });

    if (
      (replylinkObj.channelType === ChannelType.Twitterbrandmention ||
        replylinkObj.channelType === ChannelType.PublicTweets) &&
      replylinkObj.replyScreenName
    ) {
      const selectedHandle = this.ticketReplyDTO.handleNames.find(
        (obj) => obj.socialId === this.replyForm.get('replyHandler').value
      );

      if (checked) {
        if (this.maxLengthInput >= 24) {
          // tslint:disable-next-line: prefer-for-of
          let found = false;
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < this.textAreaCount.length; i++) {
            if (this.textAreaCount[i].postCharacters >= 24) {
              this.textAreaCount[i].text =
                this.textAreaCount[i].text +
                ' ' +
                `https://twitter.com/messages/compose?recipient_id=${selectedHandle.socialId}`;
              this.ReplyInputChangesModifiedCopy(
                this.textAreaCount[i].text,
                this.textAreaCount[i].id
              );
              found = true;
              break;
            }
          }
          if (!found)
          {
            this._snackBar.open('Reply max length reached', 'Ok', {
              duration: 2000,
            });
          }
        }
        else{
          this._snackBar.open('Reply max length reached', 'Ok', {
            duration: 2000,
          });
        }
      } else {
        const url = `https://twitter.com/messages/compose?recipient_id=${selectedHandle.socialId}`;
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.textAreaCount.length; i++) {

          if (this.textAreaCount[i].text.indexOf(url) > -1)
          {
            this.textAreaCount[i].text = this.textAreaCount[i].text.replace(url, '');
            this.ReplyInputChangesModifiedCopy(
              this.textAreaCount[i].text,
              this.textAreaCount[i].id
            );
            break;
          }
          }
        }
      }
    }

    sendDMClicked(checked): void {

      const selectedHandle = this.ticketReplyDTO.handleNames.find(
        (obj) => obj.socialId === this.replyForm.get('replyHandler').value
      );

      if (checked)
      {
        let allresponse = '';
        this.textAreaCount.forEach((obj) => {
          allresponse = allresponse + obj.text + ' ';
        });

        const url = `https://twitter.com/messages/compose?recipient_id=${selectedHandle.socialId}`;

        if (allresponse)
        {
          if (allresponse.indexOf(url) > -1)
          {
            allresponse = allresponse.replace(url, '');
          }
        }

        this.textAreaCount = [];
        const newTextarea = new TextAreaCount();

        newTextarea.postCharacters = this.ticketReplyDTO.maxlength;
        newTextarea.showAddNewReply = false;
        newTextarea.totalCharacters = this.ticketReplyDTO.maxlength;
        newTextarea.showPost = false;
        newTextarea.showTotal = true;
        newTextarea.text = allresponse;
        this.textAreaCount.push(newTextarea);

        this.ReplyInputChangesModifiedCopy(
          newTextarea.text,
          newTextarea.id
        );
      }
      else{
        const allresponse = this.textAreaCount[0].text;
        this.textAreaCount = [];
        const newTextarea = new TextAreaCount();

        newTextarea.postCharacters = newTextarea.maxPostCharacters;
        newTextarea.showAddNewReply = true;
        newTextarea.totalCharacters = this.ticketReplyDTO.maxlength;
        newTextarea.showPost = true;
        newTextarea.showTotal = true;
        newTextarea.text = allresponse;
        this.textAreaCount.push(newTextarea);

        this.ReplyInputChangesModifiedCopy(
          newTextarea.text,
          newTextarea.id
        );

      }
    }

  emailGroupChange(event): void {
    console.log(event.source.value);
    if (this.customGroupEmailList && this.customGroupEmailList.length > 0) {
      const selectedGroup = this.customGroupEmailList.find((obj) => {
        return obj.groupID === +event.source.value;
      });
      if (selectedGroup) {
        this.groupIDs.push(String(event.source.value));
        if (selectedGroup.email_to) {
          const toEmail = selectedGroup.email_to.split(',');
          toEmail.forEach((obj) => {
            this.groupToEmails.push(obj);
          });
        }
        if (selectedGroup.email_cc) {
          const ccEmail = selectedGroup.email_cc.split(',');
          ccEmail.forEach((obj) => {
            this.groupCCEmails.push(obj);
          });
        }
        if (selectedGroup.email_bcc) {
          const bccEmail = selectedGroup.email_bcc.split(',');
          bccEmail.forEach((obj) => {
            this.groupBCCEmails.push(obj);
          });
        }
      }
    }
  }

  addEmail(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.emails.push({ id: value.trim() });
    }

    if (input) {
      input.value = '';
    }
  }

  removeEmail(email): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }

  closePostReply(): void {
    this.replyTextInitialValue = '';
    this.clearInputs();
    this._bottomSheet.dismiss();
    this.replyEvent.emit(false);
  }

  openMediaDialog(): void {
    this.dialog.open(MediaGalleryComponent, {
      autoFocus: false,
      panelClass: ['full-screen-modal'],
    });
  }

  openCannedResponse(): void {
    this.dialog.open(CannedResponseComponent, {
      autoFocus: false,
      width: '50vw',
    });
  }

  openSmartSuggestion(): void {
    this.dialog.open(SmartSuggestionComponent, {
      autoFocus: false,
      width: '73vw',
    });
  }

  ReplyInputChangesModifiedCopy(text, inputid): void {
    const textareacountlength = this.textAreaCount.length - 1;
    if (
      this.textAreaCount[inputid].postCharacters === 0 &&
      textareacountlength !== inputid
    ) {
      this.textAreaCount[inputid].text = this.textAreaCount[
        inputid
      ].text.substring(0, this.textAreaCount[inputid].maxPostCharacters);
      // this.changeTextArea(this.textAreaCount);
      return;
    }
    console.log(text);
    let inputText = text;
    this.textResponse = text;
    // this.textAreaCount[+inputid].text = event.target.value;

    // calculate overall structure

    if (inputText) {
      inputText = inputText
        .replace(new RegExp('<', 'g'), '&lt;')
        .replace(new RegExp('>', 'g'), '&gt;');
      // this.maxLengthInput = this.ticketReplyDTO.maxlength - inputText.length;
      let lengthAllTextBox = 0;
      this.textAreaCount.forEach((element) => {
        lengthAllTextBox = lengthAllTextBox + element.text.length;
      });
      this.maxLengthInput = this.ticketReplyDTO.maxlength - lengthAllTextBox;
      this.maxLengthInput = this.maxLengthInput < 0 ? 0 : this.maxLengthInput;

      // this.textAreaCount[inputid].postCharacters =  this.textAreaCount[inputid].maxPostCharacters - inputText.length;

      // check for twitter channel
      const replylinkObj = this.replyLinkCheckbox.find((obj) => {
        return obj.replyLinkId === Replylinks.SendAsDM;
      });
      const isDmChechecked = replylinkObj ? replylinkObj.checked : false;
      if (
        (this.baseMentionObj.channelType === ChannelType.PublicTweets ||
          this.baseMentionObj.channelType ===
            ChannelType.Twitterbrandmention) &&
        !isDmChechecked
      ) {
        this.BuildReplyModified(text, +inputid);
      } else {
        this.textAreaCount[inputid].postCharacters =
          this.textAreaCount[inputid].maxPostCharacters - inputText.length;
      }
    } else {
      let lengthAllTextBox = 0;
      this.textAreaCount.forEach((element) => {
        lengthAllTextBox = lengthAllTextBox + element.text.length;
      });
      this.maxLengthInput = this.ticketReplyDTO.maxlength - lengthAllTextBox;
      this.maxLengthInput = this.maxLengthInput < 0 ? 0 : this.maxLengthInput;

      this.textAreaCount[inputid].postCharacters = this.textAreaCount[
        inputid
      ].maxPostCharacters;
      // this.maxLengthInput = this.ticketReplyDTO.maxlength;
      // const elemObj = this.elementRef.nativeElement.querySelectorAll(
      //   '.previewTextarea'
      // );
      // if (elemObj) {
      //   for (const elobj of elemObj) {
      //     elobj.remove();
      //   }
      // }
    }
  }

  ReplyInputChangesModified(event, inputid): void {
    const textareacountlength = this.textAreaCount.length - 1;
    if (this.textAreaCount[inputid].postCharacters === 0) {
      const twitterLibrary = require('twitter-text');
      const setText = this.getTwitterRequiredText(
        this.textAreaCount[inputid].text
      );
      this.textAreaCount[inputid].postCharacters =
        280 - twitterLibrary.default.parseTweet(setText).weightedLength;
      event.target.value = setText;
      // this.textAreaCount[inputid].text = this.textAreaCount[inputid].text.substring(0, this.textAreaCount[inputid].maxPostCharacters);
      // this.changeTextArea(this.textAreaCount);
      return;
    }
    console.log(event.target.value);
    let inputText = event.target.value;
    this.textResponse = event.target.value;

    // this.textAreaCount[+inputid].text = event.target.value;

    // calculate overall structure

    if (inputText) {
      inputText = inputText
        .replace(new RegExp('<', 'g'), '&lt;')
        .replace(new RegExp('>', 'g'), '&gt;');
      // this.maxLengthInput = this.ticketReplyDTO.maxlength - inputText.length;
      let lengthAllTextBox = 0;
      this.textAreaCount.forEach((element) => {
        lengthAllTextBox = lengthAllTextBox + element.text.length;
      });
      this.maxLengthInput = this.ticketReplyDTO.maxlength - lengthAllTextBox;
      this.maxLengthInput = this.maxLengthInput < 0 ? 0 : this.maxLengthInput;

      // check for twitter channel
      const replylinkObj = this.replyLinkCheckbox.find((obj) => {
        return obj.replyLinkId === Replylinks.SendAsDM;
      });
      const isDmChechecked = replylinkObj ? replylinkObj.checked : false;
      if (
        (this.baseMentionObj.channelType === ChannelType.PublicTweets ||
          this.baseMentionObj.channelType ===
            ChannelType.Twitterbrandmention) &&
        !isDmChechecked
      ) {
        this.BuildReplyModified(event.target.value, +inputid);
      } else {
        this.textAreaCount[inputid].postCharacters =
          this.textAreaCount[inputid].maxPostCharacters - inputText.length;
      }
    } else {
      let lengthAllTextBox = 0;
      this.textAreaCount.forEach((element) => {
        lengthAllTextBox = lengthAllTextBox + element.text.length;
      });
      this.maxLengthInput = this.ticketReplyDTO.maxlength - lengthAllTextBox;
      this.maxLengthInput = this.maxLengthInput < 0 ? 0 : this.maxLengthInput;

      this.textAreaCount[inputid].postCharacters = this.textAreaCount[
        inputid
      ].maxPostCharacters;
      // this.maxLengthInput = this.ticketReplyDTO.maxlength;
      // const elemObj = this.elementRef.nativeElement.querySelectorAll(
      //   '.previewTextarea'
      // );
      // if (elemObj) {
      //   for (const elobj of elemObj) {
      //     elobj.remove();
      //   }
      // }
    }
  }

  ReplyInputChanges(event, inputid): void {
    console.log(event.target.value);
    let inputText = event.target.value;
    this.textResponse = event.target.value;
    if (inputText) {
      inputText = inputText
        .replace(new RegExp('<', 'g'), '&lt;')
        .replace(new RegExp('>', 'g'), '&gt;');
      this.maxLengthInput = this.ticketReplyDTO.maxlength - inputText.length;
      // check for twitter channel
      const replylinkObj = this.replyLinkCheckbox.find((obj) => {
        return obj.replyLinkId === Replylinks.SendAsDM;
      });
      const isDmChechecked = replylinkObj ? replylinkObj.checked : false;
      if (
        (this.baseMentionObj.channelType === ChannelType.PublicTweets ||
          this.baseMentionObj.channelType ===
            ChannelType.Twitterbrandmention) &&
        !isDmChechecked
      ) {
        this.BuildReply(event.target.value);
      }
    } else {
      this.maxLengthInput = this.ticketReplyDTO.maxlength;
      const elemObj = this.elementRef.nativeElement.querySelectorAll(
        '.previewTextarea'
      );
      if (elemObj) {
        for (const elobj of elemObj) {
          elobj.remove();
        }
      }
    }
  }
  BuildReply(inputText: string): void {
    const MAX_TWEET_LENGTH = 280;
    const EXTRA_CHARACTERS = 8;

    let tweettext = inputText;
    tweettext = tweettext.trim();
    const splittedTweets = new Array();
    const twitterLibrary = require('twitter-text');
    let twitterObj = twitterLibrary.default.parseTweet(tweettext);

    // if (tweettext.length > MAX_TWEET_LENGTH) {
    if (twitterObj.weightedLength > MAX_TWEET_LENGTH) {
      let tempScreenName = ''; // screenName;

      // while (tweettext.length + EXTRA_CHARACTERS > MAX_TWEET_LENGTH) {
      while (twitterObj.weightedLength + EXTRA_CHARACTERS > MAX_TWEET_LENGTH) {
        // let length = tweettext.length;
        const words = tweettext.split(' ');
        let newTweet = tempScreenName; // screenName;
        let oldTweet = newTweet;
        let i = 0;
        let twitObj;
        do {
          newTweet += ' ' + words[i];
          i++;
          twitObj = twitterLibrary.default.parseTweet(newTweet);
          // if (newTweet.length + EXTRA_CHARACTERS <= MAX_TWEET_LENGTH) {
          if (twitObj.weightedLength + EXTRA_CHARACTERS <= MAX_TWEET_LENGTH) {
            oldTweet = newTweet;
          }
        } while (twitObj.weightedLength + EXTRA_CHARACTERS <= MAX_TWEET_LENGTH);
        // while (newTweet.length + EXTRA_CHARACTERS <= MAX_TWEET_LENGTH);

        splittedTweets.push(oldTweet);
        tempScreenName = '';

        tweettext = tweettext.split(oldTweet.trim())[1].trim();
        twitterObj = twitterLibrary.default.parseTweet(tweettext);
      }
    }

    splittedTweets.push(tweettext);
    this.splittedTweets = splittedTweets;
    // remove the previous textarea
    const elemObj = this.elementRef.nativeElement.querySelectorAll(
      '.previewTextarea'
    );
    if (elemObj) {
      for (const elobj of elemObj) {
        elobj.remove();
      }
    }

    if (splittedTweets.length > 1) {
      for (const [i, tweet] of splittedTweets.entries()) {
        const d1 = this.elementRef.nativeElement.querySelector(
          '.textarea-featured__body'
        );
        if (i > 0 && d1) {
          // d1.insertAdjacentHTML(
          //   'beforeend',
          //   `<div class="previewTextarea"><textarea  rows="2" [(ngModel)]="${tweet}" style="background:white;" class="textarea-featured__input previewTextarea" disabled>${tweet}</textarea><span class="previewTextarea__count">${i + 1
          //   }/${splittedTweets.length}</span><div>`
          // );
          d1.insertAdjacentHTML(
            'beforeend',
            `<div class="textarea-featured__block">
            <textarea class="textarea-featured__input customClassReplyText"></textarea>
        <div class="textarea-featured__left">
            <a class="textarea-featured__left--emoji"  [matMenuTriggerFor]="emojiMenu" mat-icon-button href="javacript:void(0)">
                <mat-icon>sentiment_satisfied_alt</mat-icon>
            </a>
            <span class="textarea-featured__left--warn"><mat-icon>error_outline</mat-icon> Attachment will be link with this reply</span>
        </div>
        <div class="textarea-featured__right">
            <span >Add New Reply | </span>
            <span >30 reply characters remaining | </span>
            <span class="textarea-featured__right--character">0 post characters remaining</span>
        </div>
        <mat-menu #emojiMenu="matMenu" class="custom__matmenu"  xPosition="before" yPosition="above">
            <div (click)="$event.stopPropagation();$event.preventDefault();">
                <emoji-mart [set]="emojiSet" [showPreview]="false" (emojiSelect)="selectEmoji($event)"></emoji-mart>
            </div>
        </mat-menu>
        <span class="previewTextarea__count"></span>
        </div>`
          );
        }
      }
      this.cdr.markForCheck();
    }
  }
  BuildReplyModified(inputText: string, inputid: number): void {
    const MAX_TWEET_LENGTH = 280;
    const EXTRA_CHARACTERS = 8;
    const textareacountlength = this.textAreaCount.length - 1;
    if (
      this.textAreaCount[inputid].postCharacters !== 0 ||
      textareacountlength === inputid
    ) {
      let tweettext = inputText;
      tweettext = tweettext.trim();
      const splittedTweets = new Array();
      const twitterLibrary = require('twitter-text');
      let twitterObj = twitterLibrary.default.parseTweet(tweettext);

      // if (tweettext.length > MAX_TWEET_LENGTH) {
      if (twitterObj.weightedLength > MAX_TWEET_LENGTH) {
        let tempScreenName = ''; // screenName;

        // while (tweettext.length + EXTRA_CHARACTERS > MAX_TWEET_LENGTH) {
        // while (twitterObj.weightedLength + EXTRA_CHARACTERS > MAX_TWEET_LENGTH) {
        while (twitterObj.weightedLength > MAX_TWEET_LENGTH) {
          // let length = tweettext.length;
          const words = tweettext.split(' ');
          let newTweet = tempScreenName; // screenName;
          let oldTweet = newTweet;
          let i = 0;
          let twitObj;
          do {
            newTweet += ' ' + words[i];
            i++;
            twitObj = twitterLibrary.default.parseTweet(newTweet);
            // if (newTweet.length + EXTRA_CHARACTERS <= MAX_TWEET_LENGTH) {
            // if (twitObj.weightedLength + EXTRA_CHARACTERS <= MAX_TWEET_LENGTH) {
            if (twitObj.weightedLength <= MAX_TWEET_LENGTH) {
              oldTweet = newTweet;
            }
          } while (twitObj.weightedLength <= MAX_TWEET_LENGTH);
          // while (twitObj.weightedLength + EXTRA_CHARACTERS <= MAX_TWEET_LENGTH);
          // while (newTweet.length + EXTRA_CHARACTERS <= MAX_TWEET_LENGTH);

          splittedTweets.push(oldTweet);
          tempScreenName = '';

          tweettext = tweettext.split(oldTweet.trim())[1].trim();
          twitterObj = twitterLibrary.default.parseTweet(tweettext);
        }
      } else {
        this.textAreaCount[inputid].postCharacters =
          this.textAreaCount[inputid].maxPostCharacters -
          twitterObj.weightedLength;
      }

      splittedTweets.push(tweettext);
      this.splittedTweets = splittedTweets;
      // remove the previous textarea

      if (splittedTweets.length > 1) {
        this.textAreaCount[inputid].postCharacters =
          280 -
          twitterLibrary.default.parseTweet(splittedTweets[0]).weightedLength;
      }
      for (const [i, tweet] of splittedTweets.entries()) {
        if (i > 0) {
          // this.textAreaCount[0].postCharacters = 280 - text.length;
          this.textAreaCount[inputid].showPost = true;
          this.textAreaCount[inputid].showSpan = true;
          this.textAreaCount[inputid].showTotal = true;
          this.textAreaCount[inputid].showAddNewReply = true;
          this.textAreaCount[inputid].showAttachmentText = false;
          // check the maxlength
          let lengthAllTextBox = 0;
          this.textAreaCount.forEach((element) => {
            lengthAllTextBox = lengthAllTextBox + element.text.length;
          });
          if (
            lengthAllTextBox + tweet.length <=
            this.ticketReplyDTO.maxlength
          ) {
            this.addNewTextArea(tweet);
          } else {
            this._snackBar.open('Reply max length reached', 'Ok', {
              duration: 2000,
            });
          }
        } else {
          this.textAreaCount[inputid].text = tweet;
          // this.textAreaCount[inputid].postCharacters = 280 - tweet.length;
          if (
            this.textAreaCount.length > 1 &&
            this.textAreaCount.length - 1 !== inputid
          ) {
            this.textAreaCount[inputid].showPost = true;
            this.textAreaCount[inputid].showSpan = true;
            this.textAreaCount[inputid].showTotal = false;
            this.textAreaCount[inputid].showAddNewReply = false;
            this.textAreaCount[inputid].showAttachmentText = false;
            if (+inputid === 0) {
              this.textAreaCount[inputid].showAttachmentText = true;
            }
          } else {
            this.textAreaCount[inputid].showSpan = false;
            this.textAreaCount[inputid].showTotal = true;
            this.textAreaCount[inputid].showAddNewReply = true;
            this.textAreaCount[inputid].showAttachmentText = false;
          }
        }
      }
      this.setShowSpanCount();
      this.cdr.markForCheck();
    }
  }

  ReplyInputChangesCopy(value): void {
    let inputText = value;
    if (inputText.trim()) {
      inputText = inputText
        .replace(new RegExp('<', 'g'), '&lt;')
        .replace(new RegExp('>', 'g'), '&gt;');
      this.maxLengthInput = this.ticketReplyDTO.maxlength - inputText.length;
      // check for twitter channel
      const replylinkObj = this.replyLinkCheckbox.find((obj) => {
        return obj.replyLinkId === Replylinks.SendAsDM;
      });
      const isDmChechecked = replylinkObj ? replylinkObj.checked : false;
      if (
        (this.baseMentionObj.channelType === ChannelType.PublicTweets ||
          this.baseMentionObj.channelType ===
            ChannelType.Twitterbrandmention) &&
        !isDmChechecked
      ) {
        this.BuildReply(value);
      }
    } else {
      this.maxLengthInput = this.ticketReplyDTO.maxlength;
      const elemObj = this.elementRef.nativeElement.querySelectorAll(
        '.previewTextarea'
      );
      if (elemObj) {
        for (const elobj of elemObj) {
          elobj.remove();
        }
      }
    }
  }

  getTwitterRequiredText(text): string {
    const MAX_TWEET_LENGTH = 280;
    const EXTRA_CHARACTERS = 8;
    let tweettext = text;
    tweettext = tweettext.trim();
    const splittedTweets = new Array();
    const twitterLibrary = require('twitter-text');
    let twitterObj = twitterLibrary.default.parseTweet(tweettext);

    // if (tweettext.length > MAX_TWEET_LENGTH) {
    if (twitterObj.weightedLength > MAX_TWEET_LENGTH) {
      let tempScreenName = ''; // screenName;

      // while (tweettext.length + EXTRA_CHARACTERS > MAX_TWEET_LENGTH) {
      while (twitterObj.weightedLength > MAX_TWEET_LENGTH) {
        // let length = tweettext.length;
        const words = tweettext.split(' ');
        let newTweet = tempScreenName; // screenName;
        let oldTweet = newTweet;
        let i = 0;
        let twitObj;
        do {
          newTweet += ' ' + words[i];
          i++;
          twitObj = twitterLibrary.default.parseTweet(newTweet);
          // if (newTweet.length + EXTRA_CHARACTERS <= MAX_TWEET_LENGTH) {
          if (twitObj.weightedLength <= MAX_TWEET_LENGTH) {
            oldTweet = newTweet;
          }
        } while (twitObj.weightedLength <= MAX_TWEET_LENGTH);
        // while (newTweet.length + EXTRA_CHARACTERS <= MAX_TWEET_LENGTH);

        splittedTweets.push(oldTweet);
        tempScreenName = '';

        tweettext = tweettext.split(oldTweet.trim())[1].trim();
        twitterObj = twitterLibrary.default.parseTweet(tweettext);
      }
    }

    splittedTweets.push(tweettext);
    return splittedTweets[0];
  }

  addPill(event: MatChipInputEvent, type: string): void {
    const input = event.input;
    const value = event.value;

    if (value.trim()) {
      // add to emails
      if (type === 'to') {
        this.groupToEmails.push(value.trim());
      }
      // add cc emails
      if (type === 'cc') {
        this.groupCCEmails.push(value.trim());
      }
      // add bcc emails
      if (type === 'bcc') {
        this.groupBCCEmails.push(value.trim());
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removePill(tag, type: string): void {
    // remove from to emails
    if (type === 'to') {
      const index = this.groupToEmails.indexOf(tag);
      if (index > -1) {
        this.groupToEmails.splice(index, 1);
      }
    }
    // remove from cc emails
    if (type === 'cc') {
      const index = this.groupCCEmails.indexOf(tag);
      if (index > -1) {
        this.groupCCEmails.splice(index, 1);
      }
    }
    // remove from bcc emails
    if (type === 'bcc') {
      const index = this.groupBCCEmails.indexOf(tag);
      if (index > -1) {
        this.groupBCCEmails.splice(index, 1);
      }
    }
  }

  addEmailPill(event: MatChipInputEvent, type: string): void {
    const input = event.input;
    const value = event.value;

    if (value.trim()) {
      if (type === 'to') {
        this.emailToEmail.push(value.trim());
      }
      // add cc emails
      if (type === 'cc') {
        this.emailCCEmails.push(value.trim());
      }
      // add bcc emails
      if (type === 'bcc') {
        this.emailBCCEmails.push(value.trim());
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeEmailPill(tag, type: string): void {
    // remove from to emails
    if (type === 'to') {
      const index = this.emailToEmail.indexOf(tag);
      if (index > -1) {
        this.emailToEmail.splice(index, 1);
      }
    }
    // remove from cc emails
    if (type === 'cc') {
      const index = this.emailCCEmails.indexOf(tag);
      if (index > -1) {
        this.emailCCEmails.splice(index, 1);
      }
    }
    // remove from bcc emails
    if (type === 'bcc') {
      const index = this.emailBCCEmails.indexOf(tag);
      if (index > -1) {
        this.emailBCCEmails.splice(index, 1);
      }
    }
  }

  setReplyWindow(): void {
    if (this.ticketReplyDTO.makerCheckerData) {
      if (
        this.ticketReplyDTO.makerCheckerData.operationType &&
        this.ticketReplyDTO.makerCheckerData.operationType > 0
      ) {
        // this.replyForm.get('replyType').setValue(this.ticketReplyDTO.makerCheckerData.operationType);
        // if (this.ticketReplyDTO.replyOptions.findIndex(obj => +obj.value === +this.ticketReplyDTO.makerCheckerData.operationType) > -1)
        // {
        let replytypeObj = 0;
        switch (Number(this.ticketReplyDTO.makerCheckerData.operationType)) {
          case 7:
            replytypeObj = 1;
            break;
          case 6:
            replytypeObj = 4;
            break;
          case 5:
            replytypeObj = 14;
            break;
          case 4:
            replytypeObj = 13;
            break;
          case 3:
            replytypeObj = 5;
            break;
          case 2:
            replytypeObj = 3;
            break;
        }

        this.replyForm.patchValue({
          replyType: replytypeObj,
        });
        this.replyTypeChange(+replytypeObj);
        // }
        // this.selectedReplyType = +this.ticketReplyDTO.makerCheckerData.operationType;
      }
      if (this.ticketReplyDTO.makerCheckerData.accountSocialID) {
        if (
          this.ticketReplyDTO.handleNames.findIndex(
            (obj) =>
              obj.socialId ===
              this.ticketReplyDTO.makerCheckerData.accountSocialID
          ) > -1
        ) {
          if (this.baseMentionObj.channelGroup !== ChannelGroup.LinkedIn) {
            this.replyForm.patchValue({
              replyHandler: String(
                this.ticketReplyDTO.makerCheckerData.accountSocialID
              ),
            });
            // this.replyForm.get('replyHandler').setValue(this.ticketReplyDTO.makerCheckerData.accountSocialID);
          }
        }
      }
      if (this.ticketReplyDTO.makerCheckerData.replyMessage) {
        const replytext = this.ticketReplyDTO.makerCheckerData.replyMessage;
        // this.replyForm.patchValue({
        //   replyText: replytext,
        // });
        // this.ReplyInputChangesCopy(replytext);
        this.textAreaCount[0].text = replytext;
        this.ReplyInputChangesModifiedCopy(replytext, 0);
        if (this.baseMentionObj.channelGroup === ChannelGroup.Email) {
          this.emailReplyText = replytext;
          this.replyForm.patchValue({
            ckeditorText: replytext,
          });
          this.emailReplyText = replytext;
          if (this.baseMentionObj.fromMail) {
            this.emailToEmail.push(this.baseMentionObj.fromMail);
          }
          this.emailCCEmails = this.baseMentionObj.ccList
            ? this.baseMentionObj.ccList.split(',')
            : [];
          this.emailBCCEmails = this.baseMentionObj.bccList
            ? this.baseMentionObj.bccList.split(',')
            : [];
        }
      }

      // Link Clicked Logic
      this.changeReplyLinkObj(
        Replylinks.SendAsDM,
        this.ticketReplyDTO.makerCheckerData.sendAsPrivate
      );
      this.changeReplyLinkObj(
        Replylinks.SendDMLink,
        this.ticketReplyDTO.makerCheckerData.sendPrivateAsLink
      );
      this.changeReplyLinkObj(
        Replylinks.SendToGroups,
        this.ticketReplyDTO.makerCheckerData.sendToGroups
      );
      this.changeReplyLinkObj(
        Replylinks.SendFeedback,
        this.ticketReplyDTO.makerCheckerData.sendFeedback
      );

      // set escalated user
      if (
        this.ticketReplyDTO.makerCheckerData.escalatedToUserID &&
        +this.ticketReplyDTO.makerCheckerData.escalatedToUserID > 0
      ) {
        if (
          this.customAgentList.findIndex(
            (obj) =>
              obj.agentID ===
              this.ticketReplyDTO.makerCheckerData.escalatedToUserID
          )
        ) {
          this.replyForm.patchValue({
            escalateUsers: this.ticketReplyDTO.makerCheckerData
              .escalatedToUserID,
          });
          this.escalateUsers = this.ticketReplyDTO.makerCheckerData.escalatedToUserID;
        }

        // set escalation note
        if (this.ticketReplyDTO.makerCheckerData.escalatedMessage) {
          this.replyForm.patchValue({
            replyEscalateNote: this.ticketReplyDTO.makerCheckerData
              .escalatedMessage,
          });
        }
      }
      // generate send to groups logic
      if (this.ticketReplyDTO.makerCheckerData.sendToGroups) {
        if (this.ticketReplyDTO.makerCheckerData.groupEmailList) {
          this.groupToEmails = this.ticketReplyDTO.makerCheckerData
            .groupEmailList.email_to
            ? this.ticketReplyDTO.makerCheckerData.groupEmailList.email_to.split(
                ','
              )
            : [];

          this.groupCCEmails = this.ticketReplyDTO.makerCheckerData
            .groupEmailList.email_cc
            ? this.ticketReplyDTO.makerCheckerData.groupEmailList.email_cc.split(
                ','
              )
            : [];

          this.groupBCCEmails = this.ticketReplyDTO.makerCheckerData
            .groupEmailList.email_bcc
            ? this.ticketReplyDTO.makerCheckerData.groupEmailList.email_bcc.split(
                ','
              )
            : [];

          this.groupIDs = this.ticketReplyDTO.makerCheckerData.groupEmailList
            .groupIDs
            ? this.ticketReplyDTO.makerCheckerData.groupEmailList.groupIDs
            : [];
        }
      }

      this.IsReplyModified = true;
      this.eligibleForAutoclosure = this.ticketReplyDTO.makerCheckerData.isEligibleForAutoclosure;
    }
  }

  changeReplyLinkObj(linkId, value): void {
    if (value) {
      this.replyLinkCheckbox.forEach((obj) => {
        if (obj.replyLinkId === linkId) {
          obj.checked = true;
        }
        return obj;
      });
      if (linkId === Replylinks.SendAsDM) {
        this.replyLinkCheckbox = this.replyLinkCheckbox.map((obj) => {
          if (obj.replyLinkId === Replylinks.SendDMLink) {
            obj.checked = false;
            obj.disabled = true;
          }
          return obj;
        });
      }
      if (linkId === Replylinks.SendToGroups) {
        this.sendtoGroupsClicked = true;
      }
    } else {
      this.replyLinkCheckbox.forEach((obj) => {
        if (obj.replyLinkId === linkId) {
          obj.checked = false;
        }
        return obj;
      });

      if (linkId === Replylinks.SendAsDM) {
        this.replyLinkCheckbox = this.replyLinkCheckbox.map((obj) => {
          if (obj.replyLinkId === Replylinks.SendDMLink) {
            obj.checked = false;
            obj.disabled = false;
          }
          return obj;
        });
      }

      if (linkId === Replylinks.SendToGroups) {
        this.sendtoGroupsClicked = false;
      }
    }
  }

  fillSSRELiveData(): void {
    if (this.baseMentionObj) {
      if (this.baseMentionObj.ticketInfoSsre) {
        if (
          this.baseMentionObj.ticketInfoSsre.ssreReplyType &&
          this.baseMentionObj.ticketInfoSsre.ssreReplyType > 0
        ) {
          // this.replyForm.get('replyType').setValue(this.ticketReplyDTO.makerCheckerData.operationType);
          // if (this.ticketReplyDTO.replyOptions.findIndex(obj => +obj.value === +this.ticketReplyDTO.makerCheckerData.operationType) > -1)
          // {
          let replytypeObj = 0;
          switch (Number(this.baseMentionObj.ticketInfoSsre.ssreReplyType)) {
            case 7:
              replytypeObj = 1;
              break;
            case 6:
              replytypeObj = 4;
              break;
            case 5:
              replytypeObj = 14;
              break;
            case 4:
              replytypeObj = 13;
              break;
            case 3:
              replytypeObj = 5;
              break;
            case 2:
              replytypeObj = 3;
              break;
          }
          this.replyForm.patchValue({
            replyType: replytypeObj,
          });
          this.replyTypeChange(+replytypeObj);
          // }
          // this.selectedReplyType = +this.ticketReplyDTO.makerCheckerData.operationType;
        }
        if (this.baseMentionObj.ticketInfoSsre.ssreReply.replymessage) {
          const replytext = this.baseMentionObj.ticketInfoSsre.ssreReply
            .replymessage;
          // this.replyForm.patchValue({
          //   replyText: replytext,
          // });
          // this.ReplyInputChangesCopy(replytext);
          this.textAreaCount[0].text = replytext;
          this.ReplyInputChangesModifiedCopy(replytext, 0);
          if (this.baseMentionObj.channelGroup === ChannelGroup.Email) {
            this.emailReplyText = replytext;
            this.replyForm.patchValue({
              ckeditorText: replytext,
            });
            this.emailReplyText = replytext;
            if (this.baseMentionObj.fromMail) {
              this.emailToEmail.push(this.baseMentionObj.fromMail);
            }
            this.emailCCEmails = this.baseMentionObj.ccList
              ? this.baseMentionObj.ccList.split(',')
              : [];
            this.emailBCCEmails = this.baseMentionObj.bccList
              ? this.baseMentionObj.bccList.split(',')
              : [];
          }
        }

        // Link Clicked Logic
        // this.changeReplyLinkObj(Replylinks.SendAsDM, this.ticketReplyDTO.makerCheckerData.sendAsPrivate);
        // this.changeReplyLinkObj(Replylinks.SendDMLink, this.ticketReplyDTO.makerCheckerData.sendPrivateAsLink);
        // this.changeReplyLinkObj(Replylinks.SendToGroups, this.ticketReplyDTO.makerCheckerData.sendToGroups);
        // this.changeReplyLinkObj(Replylinks.SendFeedback, this.ticketReplyDTO.makerCheckerData.sendFeedback);

        // set escalated user
        if (
          this.baseMentionObj.ticketInfoSsre.ssreReply.escalatedTo &&
          +this.baseMentionObj.ticketInfoSsre.ssreReply.escalatedTo > 0
        ) {
          if (
            this.customAgentList.findIndex(
              (obj) =>
                obj.agentID ===
                this.baseMentionObj.ticketInfoSsre.ssreReply.escalatedTo
            )
          ) {
            this.replyForm.patchValue({
              escalateUsers: this.baseMentionObj.ticketInfoSsre.ssreReply
                .escalatedTo,
            });
            this.escalateUsers = this.baseMentionObj.ticketInfoSsre.ssreReply.escalatedTo;
          }

          // set escalation note
          if (this.baseMentionObj.ticketInfoSsre.ssreReply.escalationMessage) {
            this.replyForm.patchValue({
              replyEscalateNote: this.baseMentionObj.ticketInfoSsre.ssreReply
                .escalationMessage,
            });
          }
        }
      }
    }
  }

  bulkEscalateTo(): void {
    let isTicket = false;
    if (this._postDetailService.pagetype === PostsType.Tickets) {
      isTicket = true;
    }
    const logs = [];
    const log = new TicketsCommunicationLog(ClientStatusEnum.Escalated);
    log.AssignedToUserID = this.replyForm.get('replyEscalateNote').value
      ? this.replyForm.get('replyEscalateNote').value
      : '';

    logs.push(log);

    const log1 = new TicketsCommunicationLog(ClientStatusEnum.NotesAdded);
    if (this.replyForm.get('replyEscalateNote').value.trim()) {
      log1.Note = this.replyForm.get('replyEscalateNote').value
        ? this.replyForm.get('replyEscalateNote').value
        : '';
    }
    const escalatetouser = this.ticketReplyDTO.agentUsersList.find((obj) => {
      return obj.agentID === +this.replyForm.get('escalateUsers').value;
    });
    if (escalatetouser) {
      log1.AssignedToUserID = escalatetouser.agentID;
    }
    logs.push(log1);

    const BulkObject = [];
    const chkTicket = this._ticketService.bulkMentionChecked.filter(
      (obj) => obj.guid === this._navigationService.currentSelectedTab.guid
    );
    for (const checkedticket of chkTicket) {
      const properties = {
        ReplyFromAccountId: 0,
        ReplyFromAuthorSocialId: '',
        TicketID: checkedticket.mention.ticketInfo.ticketID,
        TagID: checkedticket.mention.tagID,
        BrandID: checkedticket.mention.brandInfo.brandID,
        BrandName: checkedticket.mention.brandInfo.brandName,
        ChannelGroup: checkedticket.mention.channelGroup,
        Replies: [],
      };

      BulkObject.push(properties);
    }

    const sourceobj = {
      PerformedAction: PerformedAction.Escalate,
      IsTicket: isTicket,
      IsReplyModified: false,
      ActionTaken: 0,
      Tasks: logs,
      BulkReplyRequests: BulkObject,
    };

    this._replyService.BulkActionAPI(sourceobj, PerformedAction.OnHoldAgent);
  }

  bulkReplyEscalateTo(): void {
    // const replyinputtext = this.replyForm.get('replyText').value;
    const replyinputtext = this.textAreaCount[0].text;
    let isTicket = false;
    if (this._postDetailService.pagetype === PostsType.Tickets) {
      isTicket = true;
    }
    const logs = [];
    const log = new TicketsCommunicationLog(ClientStatusEnum.RepliedToUser);
    logs.push(log);

    const BulkObject = [];
    const chkTicket = this._ticketService.bulkMentionChecked.filter(
      (obj) => obj.guid === this._navigationService.currentSelectedTab.guid
    );

    console.log(this.replyForm);
    console.log('Saved: ' + JSON.stringify(this.replyForm.value));
    const replyObj: PerformActionParameters = {};
    const replyArray: Reply[] = [];
    const baseReply = new BaseReply();
    const customReplyObj = baseReply.getReplyClass();
    // map the properties
    replyObj.ActionTaken = ActionTaken.Locobuzz;

    // if (this.splittedTweets.length > 0) {
    //   for (const tweet of this.splittedTweets) {
    //     const customReply = baseReply.getReplyClass();
    //     customReply.replyText = tweet;

    //     replyArray.push(customReply);
    //   }
    // } else {
    //   customReplyObj.replyText = replyinputtext;
    //   replyArray.push(customReplyObj);
    // }

    if (this.textAreaCount.length > 0) {
      for (const tweet of this.textAreaCount) {
        const customReply = baseReply.getReplyClass();
        customReply.replyText = tweet.text;

        replyArray.push(customReply);
      }
    } else {
      customReplyObj.replyText = replyinputtext;
      replyArray.push(customReplyObj);
    }

    replyObj.Tasks = this.BuildComminicationLog(
      this._postDetailService.postObj
    );
    const source = this._mapLocobuzzEntity.mapMention(
      this._postDetailService.postObj
    );
    if (this.simulationCheck) {
      source.ticketInfoSsre.ssreMode = SSREMode.Simulation;
      source.ticketInfoSsre.ssreIntent = this.SsreIntent;
    }
    replyObj.Source = source;

    // tagged user Json
    if (
      this.ticketReplyDTO.taggedUsers &&
      this.ticketReplyDTO.taggedUsers.length > 0
    ) {
      const arrayuser = [];
      let excludedusers = '';
      this.ticketReplyDTO.taggedUsers.forEach((obj) => {
        arrayuser.push({
          Userid: obj.Userid,
          Name: obj.Name,
          UserType: obj.UserType,
          offset: 0,
          length: 10,
        });
        let objectFound = false;
        this.selectedTagUsers.forEach((object) => {
          if (obj.Userid === object.Userid) {
            // do nothing
            objectFound = true;
            return;
          } else {
            objectFound = false;
          }
        });
        if (!objectFound) {
          excludedusers = excludedusers + obj.Userid + ',';
        }
      });

      if (excludedusers) {
        replyArray[0].excludedReplyUserIds = excludedusers.replace(/,\s*$/, '');
      }

      replyArray[0].taggedUsersJson = JSON.stringify(arrayuser);
    }

    // replyArray = this._mapLocobuzzEntity.mapReplyObject(replyArray);
    const replyopt = new ReplyOptions();
    replyObj.PerformedActionText = replyopt.replyOption
      .find((obj) => obj.id === +this.replyForm.get('replyType').value)
      .value.trim();
    replyObj.IsReplyModified = this.IsReplyModified;
    replyObj.Replies = replyArray;

    const selectedHandle = this.ticketReplyDTO.handleNames.find(
      (obj) => obj.socialId === this.replyForm.get('replyHandler').value
    );

    replyObj.ReplyFromAccountId = selectedHandle.accountId;
    replyObj.ReplyFromAuthorSocialId = selectedHandle.socialId;

    if (this.replyLinkCheckbox && this.replyLinkCheckbox.length > 0) {
      this.replyLinkCheckbox.forEach((obj) => {
        if (obj.checked && obj.replyLinkId === Replylinks.SendFeedback) {
          replyObj.Replies[0].sendFeedback = true;
        } else if (obj.checked && obj.replyLinkId === Replylinks.SendAsDM) {
          replyObj.Replies[0].sendAsPrivate = true;
        } else if (obj.checked && obj.replyLinkId === Replylinks.SendDMLink) {
          replyObj.Replies[0].sendPrivateAsLink = true;
        } else if (obj.checked && obj.replyLinkId === Replylinks.SendToGroups) {
          replyObj.Replies[0].sendToGroups = true;
        } else if (
          obj.checked &&
          obj.replyLinkId === Replylinks.SendForApproval
        ) {
          // replyObj.replies[0].sen = true;
        }
      });
    }
    // check attachments
    if (
      this.selectedMedia &&
      this.selectedMedia.length > 0 &&
      this.isEmailChannel
    ) {
      this.selectedMedia = this._mapLocobuzzEntity.mapUgcMention(
        this.selectedMedia
      );
      replyObj.Replies[0].attachmentsUgc = this.selectedMedia;
    } else {
      replyObj.Replies.forEach((obj) => {
        obj.attachmentsUgc = null;
      });
    }

    // check send to groups clicked
    if (this.sendtoGroupsClicked) {
      if (this.groupToEmails.length > 0) {
        replyObj.Replies[0].groupEmailList.email_to = this.groupToEmails.toString();
        replyObj.Replies[0].groupEmailList.email_cc = this.groupCCEmails
          ? this.groupCCEmails.toString()
          : '';
        replyObj.Replies[0].groupEmailList.email_bcc = this.groupBCCEmails
          ? this.groupBCCEmails.toString()
          : '';
        replyObj.Replies[0].groupEmailList.groupIDs = this.groupIDs;
      } else {
        this._snackBar.open('Please enter email to forward', 'Ok', {
          duration: 2000,
        });
        return;
      }
    }
    if (this.isEmailChannel) {
      replyObj.ReplyFromAccountId = +this.baseMentionObj.settingID;
      replyObj.Replies[0].toEmails =
        this.emailToEmail.length > 0 ? this.emailToEmail : [];
      replyObj.Replies[0].ccEmails =
        this.emailCCEmails.length > 0 ? this.emailCCEmails : [];
      replyObj.Replies[0].bccEmails =
        this.emailCCEmails.length > 0 ? this.emailBCCEmails : [];
    }

    for (const checkedticket of chkTicket) {
      const properties = {
        ReplyFromAccountId: selectedHandle.accountId,
        ReplyFromAuthorSocialId: selectedHandle.socialId,
        TicketID: checkedticket.mention.ticketInfo.ticketID,
        TagID: checkedticket.mention.tagID,
        BrandID: checkedticket.mention.brandInfo.brandID,
        BrandName: checkedticket.mention.brandInfo.brandName,
        ChannelGroup: checkedticket.mention.channelGroup,
        Replies: replyArray,
      };

      BulkObject.push(properties);
    }

    const sourceobj = {
      PerformedAction: PerformedAction.Reply,
      IsTicket: isTicket,
      IsReplyModified: false,
      ActionTaken: 0,
      Tasks: logs,
      BulkReplyRequests: BulkObject,
    };

    this._replyService.BulkActionAPI(sourceobj, PerformedAction.Reply);
  }

  selectEmoji(event, inputid): void {
    this.replyTextInitialValue = this.replyTextInitialValue.concat(
      event.emoji.native
    );
    // this.ReplyInputChangesCopy(this.replyTextInitialValue );
    if (this.textAreaCount[inputid].postCharacters !== 0) {
      this.textAreaCount[+inputid].text = this.textAreaCount[
        +inputid
      ].text.concat(event.emoji.native);
      const twitterLibrary = require('twitter-text');
      const setText = this.getTwitterRequiredText(
        this.textAreaCount[inputid].text
      );
      this.textAreaCount[inputid].postCharacters =
        280 - twitterLibrary.default.parseTweet(setText).weightedLength;
      this.textAreaCount[+inputid].text = setText;

      // set max length
      let lengthAllTextBox = 0;
      this.textAreaCount.forEach((element) => {
        lengthAllTextBox = lengthAllTextBox + element.text.length;
      });
      this.maxLengthInput = this.ticketReplyDTO.maxlength - lengthAllTextBox;
    }
    // this.changeTextArea(this.textAreaCount);
  }
  ngOnDestroy(): void {
    // this._postDetailService.currentPostObject.unsubscribe();
    this.subs.unsubscribe();
    this._replyService.selectedCannedResponse.next('');
    this.replyService.selectedSmartSuggestion.next('');
  }

  addNewElement(inputid): void {
    if (this.maxLengthInput <= 0) {
      this._snackBar.open('Reply max length reached', 'Ok', {
        duration: 2000,
      });
    } else {
      this.textAreaCount[+inputid].showPost = true;
      this.textAreaCount[+inputid].showSpan = false;
      this.textAreaCount[+inputid].showTotal = false;
      this.textAreaCount[+inputid].showAddNewReply = false;
      if (+inputid === 0) {
        this.textAreaCount[+inputid].showAttachmentText = true;
      }
      const textarea = new TextAreaCount();
      textarea.id = this.textAreaCount.length - 1 + 1;

      textarea.postCharacters = 280;
      textarea.showPost = true;
      textarea.showSpan = true;
      textarea.showTotal = true;
      textarea.showAddNewReply = true;
      textarea.showAttachmentText = false;
      this.setTextArea(null, textarea.id);
      this.textAreaCount.push(textarea);
      this.setShowSpanCount();
      // setTimeout(() => {
      //   this.textAreas.find((item, idx) => {
      //   return idx === 1;
      // }).nativeElement.focus(); }, 1);
      // this.textAreaCount[0].text = 'lol are you';
    }
  }

  addNewTextArea(text): void {
    this.setValuesOfAllPreviousTextArea();
    const textarea = new TextAreaCount();
    textarea.id = this.textAreaCount[this.textAreaCount.length - 1].id + 1;
    textarea.text = text;

    textarea.showPost = true;
    textarea.showSpan = true;
    textarea.showTotal = true;
    textarea.showAddNewReply = true;
    textarea.showAttachmentText = false;

    const twitterLibrary = require('twitter-text');
    const twitterObj = twitterLibrary.default.parseTweet(text);
    textarea.postCharacters = 280 - twitterObj.weightedLength;
    this.setTextArea(null, textarea.id);
    // set the first TextReply
    this.textAreaCount.push(textarea);
    this.setShowSpanCount();
    this.changeTextArea(this.textAreaCount);
  }

  setShowSpanCount(): void {
    if (this.textAreaCount.length > 1) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.textAreaCount.length; i++) {
        this.textAreaCount[i].spanCount = `${this.textAreaCount[i].id + 1}/${
          this.textAreaCount.length
        }`;
        this.textAreaCount[i].showSpan = true;
      }
    } else {
      this.textAreaCount[0].showSpan = false;
    }
  }

  setValuesOfAllPreviousTextArea(): void {
    for (let i = 0; i < this.textAreaCount.length; i++) {
      this.textAreaCount[i].showPost = true;
      this.textAreaCount[i].showSpan = true;
      this.textAreaCount[i].showTotal = false;
      this.textAreaCount[i].showAddNewReply = false;
      this.textAreaCount[i].showAttachmentText = false;
      if (i === 0) {
        this.textAreaCount[i].showAttachmentText = true;
      }
    }
  }

  setTextArea(event, id): void {
    const textareaindex = this.textAreaCount.findIndex((obj) => obj.id === +id);
    if (textareaindex > -1) {
      this.textAreaCount.forEach((obj) => (obj.isSelected = false));
      this.textAreaCount[textareaindex].isSelected = true;
    }
  }

  changeTextArea(textareaCount): void {
    this.textAreaCount = [];
    this.textAreaCount = textareaCount;
  }
  trackByIndex(index: number, obj: any): any {
    return index;
  }

  testingTwiiter(event, inputid): void {
    const twitterLibrary = require('twitter-text');
    const twitterObj = twitterLibrary.default.parseTweet(event.target.value);
    console.log(twitterObj);
    // this.textAreaCount[inputid].text = 'Hello';
    if (event.target.value.length > 9) {
      event.target.value = 'wow';
    }
    this.changeTextArea(this.textAreaCount);
  }
}
