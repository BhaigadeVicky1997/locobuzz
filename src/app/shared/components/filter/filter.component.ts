import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component, ComponentFactoryResolver,
  ComponentRef, ElementRef, Inject,
  Injector, Input, OnDestroy, OnInit,
  Optional, ViewChild,
  ViewContainerRef
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatOption } from '@angular/material/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { allFilterReply } from 'app/app-data/allFilterReply';
import { filterData, notToPass, notToShowInExclude, ticketMentionDropdown } from 'app/app-data/filter';
import { FilterEvents } from 'app/core/enums/FilterEvents';
import { UserRoleEnum } from 'app/core/enums/userRoleEnum';
import { Filter, FilterComponentStructure } from 'app/core/interfaces/locobuzz-navigation';
import { Menu, Tab, TabEvent } from 'app/core/models/menu/Menu';
import { BrandInfo } from 'app/core/models/viewmodel/BrandInfo';
import { GenericFilter } from 'app/core/models/viewmodel/GenericFilter';
import { GenericRequestParameters } from 'app/core/models/viewmodel/GenericRequestParameters';
import { CommonService } from 'app/core/services/common.service';
import { NavigationService } from 'app/core/services/navigation.service';
import { TreeChecklistComponent } from 'app/shared/components';
import { PostOptionService } from 'app/shared/services/post-options.service';
import { MainService } from 'app/social-inbox/services/main.service';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { MyTicketsCount } from '../../../core/models/viewmodel/TicketsCount';
import { FilterService } from '../../../social-inbox/services/filter.service';
import { AdvanceFilterComponent } from './advance-filter/advance-filter.component';
import { FilterGroupComponent } from './filter-group/filter-group.component';
import { ActionStatus } from './filter-models/actionstatus.model';
import { AssignToList } from './filter-models/assign-to.model';
import { ApiReply, Brand } from './filter-models/brand-reply.model';
import { BrandList } from './filter-models/brandlist.model';
import { CategoryList } from './filter-models/categorylist.model';
import { ChannelList } from './filter-models/channelList.model';
import { Campaign } from './filter-models/compaign.model';
import { CountryList } from './filter-models/country-list.model';
import { CrmColumns } from './filter-models/crm-coloum.model';
import { EachFilters } from './filter-models/each-filter.model';
import { EachOptions, ExcludeDisplay } from './filter-models/excludeDisplay.model';
import { FilterData } from './filter-models/filterData.model';
import { FilterFilledData } from './filter-models/filterFilledData.model';
import { InfluencerCategory } from './filter-models/influence-category.model';
import { LangaugeList } from './filter-models/language-list.model';
import { SocialProfile } from './filter-models/social-profile.model';
import { SocialProfileValue } from './filter-models/socialProfile.model';
import { SsreStatus } from './filter-models/ssrestatus.model';
import { UpperCategory } from './filter-models/upper-category.model';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit, FilterComponentStructure, OnDestroy {
  @Input() additionalData?: any;
  @Input() tab?: Tab;
  @ViewChild('excludeChannel', { read: ViewContainerRef, static: false }) excludeChannel: ViewContainerRef;
  @ViewChild('allSelectedBrand') private allSelectedBrand: MatOption;
  @ViewChild('allSelectedProfile') private allSelectedProfile: MatOption;
  @ViewChild('allSelectedActionStatus') private allSelectedActionStatus: MatOption;
  @ViewChild('allSelectedSsreStatus') private allSelectedSsreStatus: MatOption;
  @ViewChild('excludeAllSelectedProfile') private excludeAllSelectedProfile: MatOption;
  @ViewChild('excludeAllSelectedActionStatus') private excludeAllSelectedActionStatus: MatOption;
  @ViewChild('excludeAllSelectedSsreStatus') private excludeAllSelectedSsreStatus: MatOption;
  @ViewChild('andChipInput') input: MatInput;
  @ViewChild('excludeInput') excludeInput: ElementRef;
  @ViewChild(AdvanceFilterComponent) AdvanceFilterComponent: AdvanceFilterComponent;

  minDate: Date;
  maxDate: Date;

  filterObservable: any;

  excludefilterObservable: any;

  disableAnimation = true;

  filtercountTime: boolean = true;
  excludefiltercountTime: boolean = true;
  // Filter Form Data
  filterData: FilterData = filterData;
  filterForm: any;
  Object = Object;
  filterCount: MyTicketsCount;
  saveAndApplyLabel: string;
  addNewTab = false;
  // This is Flag To start TreeCheckList
  startTreelist = false;
  channelDisplayData: {};
  ticketsFlag = false;
  brandTouchedDone = false;
  durationTouchedDone = false;

  // Form Values
  durationlabel: string;
  customDurationToggle: boolean = false;
  selectedTabIndex: number = 0;
  // Data For AND Chips with Radio
  andSelectable = true;
  andRemovable = true;
  andAddOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  andArray: Filter[] = [];

  // follower Count sider
  followerCountRange: [number, number] = [0, 300];
  followerCountMin: number = this.followerCountRange[0];
  followerCountMax: number = this.followerCountRange[1];
  followerValue: string = '';

  // Data for OR Chips
  orSelectable = true;
  orRemovable = true;
  orAddOnBlur = true;
  orArray: Filter[] = [];

  // Data for DONOT chips
  donotSelectable = true;
  donotRemovable = true;
  donotAddOnBlur = true;
  donotArray: Filter[] = [];

  // For Exclude Filters
  excludeFilterForm = new FormControl();
  excludeFilterOption: string[];
  filteredOptions: Observable<string[]>;
  excludeDisplay: ExcludeDisplay;
  excludeFiltersForm: FormGroup;
  excludeChannelInstance: ComponentRef<TreeChecklistComponent>;

  // tab description
  HeaderTabDescription = true;

  // refactoring filter
    notToPass: string[];
    notToShowInExclude: string[];

    // selectedTabIndex: number = 0;
    // Exclude Filter Options and data:
    excludeOptions: Array<any>;
    allAttribute: any;
    allAttributeForAdvance: any;
    displayNameToOgName: {};

    public _filterFilledData: FilterFilledData;
    FilterFilledDataReply: ApiReply;
    selectedBrands: FormGroup;

    // For Channel
    fetchedChannelData: ChannelList[];
    fetchedChannelDisplayData: {};
    fetchedChannelgroupnameid: {};
    fetchedChannelgroupidname: {};
    fetchedChanneltypenameid: {};
    fetchedChanneltypeidname: {};


    fetchedBrandData: BrandList[];
    brandOptions: EachOptions[];
    durationsOptions: EachOptions[];
    fetchedCategoryData: CategoryList[];
    fetchedCategoryDatacategory: {};
    fetchedCategoryDatadepartment: {};
    fetchedCategoryDatasubCategory: {};
    fetchedCategoryDatacategoryidname: {};
    fetchedCategoryDatadepartmentidname: {};
    fetchedCategoryDatasubCategoryidname: {};
    fetchedUpperCategoryData: UpperCategory[];
    fetchedSocialProfile: SocialProfile[];
    fetchedAssignTo: AssignToList[];
    fetchedInfluencerCategory: InfluencerCategory[];
    fetchedCrmColums: CrmColumns;
    fetchedActionStatus: ActionStatus[];
    fetchedSsreStatuses: SsreStatus[];
    fetchedLangaugeList: LangaugeList[];
    fetchedCountryList: CountryList[];
    fetchedCampaigns: Campaign[];
    genericFilter: GenericFilter;
    genericRequestParameter: GenericRequestParameters;

    brandreplyAll: Brand[];

    filterUniqueId: number;
    subs = new SubSink();

    // End of refactoring

  /**
   * Constructor
   *
   * @param {MatDialog} dialog
   * @param {FilterService} _filterService
   * @Inject {MAT_DIALOG_DATA} whoCalled
   * @param {ComponentFactoryResolver} _componentFactoryResolver
   */
  constructor(
    public dialog: MatDialog,
    private _filterService: FilterService,
    private _snackBar: MatSnackBar,
    private injector: Injector,
    private _postOptionService: PostOptionService,
    private _mainService: MainService,
    private _navigationService: NavigationService,
    @Optional() @Inject(MAT_DIALOG_DATA) public whoCalled: { requiredFor: string, submit: string },
  ) {
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
    if (!this.additionalData && !whoCalled)
    {
      whoCalled = {requiredFor: '', submit: '' };
      whoCalled.requiredFor = 'Filter';
      whoCalled.submit = 'Apply';
      this.whoCalled = whoCalled;
    }
    if (whoCalled && whoCalled.requiredFor === 'Add New Tab')
    {
      this.addNewTab = true;
      this.saveAndApplyLabel = 'Save it to use again in future';
    }
    else{
      this.addNewTab = false;
      this.saveAndApplyLabel = 'Save and apply';
    }
    // setTimeout(() => this._commonService = injector.get(CommonService), 100);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------


  /**
   * On init
   */
  ngOnInit(): void {
    // this.filterUniqueId = this._filterService.filtersUniqueData;
    this.notToPass = notToPass;
    this.notToShowInExclude = notToShowInExclude;
    setTimeout(() => this.disableAnimation = false);

    this.subs.add(this._filterService.filterTab.subscribe(
      (tabevent) =>
      {
        if (tabevent)
        {
          if (tabevent.tab.guid === this.tab.guid)
          {
            this.callTabEvent(tabevent);
          }
        }
      }
    ));

    // this._filterService.populateFilter();
    // Flag Subscribe for data fetch.
    this.subs.add(this._filterService.getValue().subscribe(
      (value) => {
        this.startTreelist = value;
        if (value && this.filterForm) {
          this.reInitialize();
        }
      }
    ));
    this.selectedTabIndex = this._filterService.selectedTabIndex;
    // Filter data frm Service
    this.filterData = JSON.parse(JSON.stringify(this._filterService.filterData));
    this.filterData.brandDateDuration.selectBrand.options.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : -1);
    // Filter Form from Service
    // this.filterForm = this._filterService.filterForm;
    this.filterForm = this.generateForms();

    this.filterCount = this._filterService.filterCount;

    // exclude filter
    this.excludeFilterOption = this._filterService.excludeOptions;

    // Exclude filter pipe
    this.filteredOptions = this.excludeFilterForm.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );


    // Add data to exclueFilter
    this.excludeDisplay = this._filterService.excludeDisplay;
    this.excludeFiltersForm = this._filterService.excludeFiltersForm;
    this.excludeFilterForm.valueChanges.subscribe(
      (value) => {
        this.addExcludeFilter(value);
      }
    );

    this.filterForm.controls.ticketsMentions.controls.ticketsYouWantToSee.valueChanges.subscribe(
      (value) => {
        if (value === 1)
        {
          this.filterForm.controls.teamcharacteristics.controls.assigendTo.patchValue([]);
        }
        else
        {
          this.filterForm.controls.teamcharacteristics.controls.assigendTo.patchValue([value]);
        }
        console.log(this.filterForm);
      }
    );

    // make all brands selected
    if (this.filterForm.controls.brandDateDuration.controls.selectBrand.value === null) {
      this.filterForm.controls.brandDateDuration.controls.selectBrand
        .patchValue([...this.filterData.brandDateDuration.selectBrand.options.map(item => item.id), 'All']);
    }

    this.durationlabel = this._filterService.durationlabel;

    // Fill  All the keywords selected Previously
    // tslint:disable-next-line: forin
    for (const each in this.filterForm.controls.Keywords.controls.AND.value.array) {
      const fill = { name: this.filterForm.controls.Keywords.controls.AND.value.array[each] };
      this.andArray.push(fill);
    }

    // tslint:disable-next-line: forin
    for (const each in this.filterForm.controls.Keywords.controls.Or.value) {
      const fill = { name: this.filterForm.controls.Keywords.controls.Or.value[each] };
      this.orArray.push(fill);
    }
    // tslint:disable-next-line: forin
    for (const each in this.filterForm.controls.Keywords.controls.Donot.value) {
      const fill = { name: this.filterForm.controls.Keywords.controls.Donot.value[each] };
      this.donotArray.push(fill);
    }
    if (this.filterForm.controls.ticketsMentions.controls.whatToMonitor.value === 1) {
      this.switchTicketsAndMentions('All Mentions');
    }
    else {
      ((this.filterForm.get('ticketsMentions') as FormGroup).get('whatToMonitor') as FormControl).patchValue(0);
      this.switchTicketsAndMentions('Tickets');
    }


    this.filterObservable = this.filterForm.valueChanges.subscribe((val) => {
      if (this.filtercountTime)
      {
        this.filtercountTime = false;
        setTimeout(() => {
          this.filterFormSubmited(true);
          this.filtercountTime = true;
        }, 1000);
      }
    });

    this.excludefilterObservable = this.excludeFiltersForm.valueChanges.subscribe((val) => {
      if (this.excludefiltercountTime)
      {
        this.excludefiltercountTime = false;
        setTimeout(() => {
          this.filterFormSubmited(true);
          this.excludefiltercountTime = true;
        }, 1000);
      }
    });

    // AssignTO dissable
    const currentUser = JSON.parse(localStorage.getItem('user')).data;
    const currentUserRole = currentUser.user.role;
    const show = currentUser.user.userRole.isSelfAssigned;

    (this.filterForm.get('ticketsMentions').get('ticketsYouWantToSee') as FormControl).valueChanges.subscribe(
      (val) => {
        if (val !== 1)
        {
          (this.filterForm.get('teamcharacteristics').get('assigendTo') as FormControl).patchValue([val]);
        }
        else{
          (this.filterForm.get('teamcharacteristics').get('assigendTo') as FormControl).patchValue([]);
        }
      });

    if (UserRoleEnum.CustomerCare === currentUserRole || UserRoleEnum.BrandAccount === currentUserRole)
    {
      if (show)
      {
        this.filterForm.get('teamcharacteristics').get('assigendTo').patchValue([currentUser.user.userId]);
        this.filterForm.get('teamcharacteristics').get('assigendTo').disable();
      }
    }

    if (this.durationlabel === '-1')
    {
      this.filledCustomDuration();
    }

    this.subs.add(this._filterService.currentBrandListFirstCall.subscribe(obj => {
      if (obj)
      {
        this.readyForFilterStartApi(this._filterService.brandreplyAll, this.filterForm.controls.brandDateDuration.value.Duration.StartDate,
          this.filterForm.controls.brandDateDuration.value.Duration.EndDate, false);
      }
    }));

  }

  generateForms(): FormGroup
    {
        // initializing for exclude filter
        this.excludeOptions = [];
        this.allAttribute = {};
        this.allAttributeForAdvance = {};
        this.displayNameToOgName = {};
        this.excludeDisplay = {};
        const filterForm = new FormGroup({});

        /// Dynamically creating forms according to data
        for (const key of Object.keys(this.filterData)) {
            const value = this.filterData[key];
            const formGroup = new FormGroup({});
            // filling form group
            for (const key1 of Object.keys(value)) {
                const value1 = value[key1];
                if (key1 === 'displayName') {
                    continue;
                }
                // exclude Options in same forloop for time saving
                if (key !== 'brandDateDuration') {
                    if (key !== 'excludeFilters') {
                        if (value1.type !== 'radio') {
                                if (value1.type !== 'chips-radio') {
                                    if (value1.type !== 'chips') {
                                        if (value1.type !== 'chips1') {
                                            if (this.notToShowInExclude.indexOf(key1) === -1)
                                            {
                                                this.excludeOptions.push(value1.displayName);
                                            }
                                            this.allAttribute[value1.displayName] = value[key1];
                                            this.allAttributeForAdvance[key1] = value[key1];
                                            this.displayNameToOgName[value1.displayName] = key1;
                                        }
                                    }
                                }
                        }
                    }
                }
                if (value1.type === 'checkbox') {
                    const innerFormGroup = new FormGroup({});
                    for (const ele of value1.options) {
                        innerFormGroup.addControl(ele.label, new FormControl(value1.default));
                    }
                    formGroup.addControl(key1, innerFormGroup);
                }
                else if (value1.type === 'chips' || value1.type === 'chips1') {
                    const formArray = new FormArray([]);
                    formGroup.addControl(key1, formArray);
                }
                else if (value1.type === 'chips-radio') {
                    const innerFormGroup = new FormGroup({});
                    const formArray = new FormArray([]);
                    innerFormGroup.addControl('category', new FormControl('AND'));
                    innerFormGroup.addControl('array', formArray);

                    formGroup.addControl(key1, innerFormGroup);
                }
                else if (value1.type === 'Duration') {
                    const innerFormGroup = new FormGroup({});
                    const formcon = new FormControl(moment().subtract(2, 'days').startOf('day').utc().unix());
                    const formcon1 = new FormControl(moment().endOf('day').utc().unix());
                    innerFormGroup.addControl('StartDate', formcon);
                    innerFormGroup.addControl('EndDate', formcon1);
                    innerFormGroup.addControl('isCustom', new FormControl(2));
                    innerFormGroup.addControl('Duration', new FormControl(value1.default));
                    formGroup.addControl(value1.type, innerFormGroup);
                }
                else {
                    if (value1.displayName === 'Upper Category' || value1.displayName === 'Category')
                    {
                        formGroup.addControl(key1 + 'condition', new FormControl(true));
                    }
                    formGroup.addControl(key1, new FormControl(value1.default));
                }
            }
            filterForm.addControl(key, formGroup);
        }
        return filterForm;
    }

  ngOnDestroy(): void {
    this.filterObservable.unsubscribe();
    this._filterService.durationlabel = this.durationlabel;
    this._filterService.excludeFiltersForm = this.excludeFiltersForm;
    this._filterService.excludeDisplay = this.excludeDisplay;
    this.subs.unsubscribe();
  }


  // -----------------------------------------------------------------------------------------------------
  // @ Filter Chips Functions
  // -----------------------------------------------------------------------------------------------------


  /**
   * Add Keywords to AND/OR with Radio
   */
  ANDChipAdd(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our keyword
    if ((value || '').trim()) {
      this.andArray.push({ name: value.trim() });
      // filling it in Form
      const control = this.filterForm.controls.Keywords.controls.AND.controls.array as FormArray;
      control.push(new FormControl(value.trim()));
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }


  /**
   * Add Keywords to OR chip
   */
  ORChipAdd(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our keyword
    if ((value || '').trim()) {
      this.orArray.push({ name: value.trim() });
      // filling it in Form
      const control = this.filterForm.controls.Keywords.controls.Or as FormArray;
      control.push(new FormControl(value.trim()));
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }


  /**
   * Add Keywords to DoNot chip
   */
  DoNotChipadd(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our keyword
    if ((value || '').trim()) {
      this.donotArray.push({ name: value.trim() });
      // filling it in Form
      const control = this.filterForm.controls.Keywords.controls.Donot as FormArray;
      control.push(new FormControl(value.trim()));
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }


  /**
   * Remove Keywords From AND/OR chip
   */
  ANDChipRemove(fruit: Filter): void {
    const index = this.andArray.indexOf(fruit);

    if (index >= 0) {
      this.andArray.splice(index, 1);
      this.filterForm.controls.Keywords.controls.AND.controls.array.removeAt(index);
    }

  }


  /**
   * Remove Keywords From OR chip
   */
  ORChipRemove(fruit: Filter): void {
    const index = this.orArray.indexOf(fruit);

    if (index >= 0) {
      this.orArray.splice(index, 1);
      this.filterForm.controls.Keywords.controls.Or.removeAt(index);
    }

  }


  /**
   * Remove Keywords From DoNot chip
   */
  DoNotChipRemove(fruit: Filter): void {
    const index = this.donotArray.indexOf(fruit);

    if (index >= 0) {
      this.donotArray.splice(index, 1);
      this.filterForm.controls.Keywords.controls.Donot.removeAt(index);
    }
  }


  // -----------------------------------------------------------------------------------------------------
  // @ Filter Dialog Functions
  // -----------------------------------------------------------------------------------------------------

  /**
   * IF Need To Open New Tab(Next FilterGroupForm)
   */
  private _openFilterGroup(tabindex): void {
    const dialogRef = this.dialog.open
      (
        FilterGroupComponent,
        {
          width: '600px',
          disableClose: true,
          data: {TabIndex: tabindex}
        }
      );
  }

  /**
   * Close This Current Dialog
   */
  closeDialog(): void {
    this._filterService.closeFilterModal.next(false);
    this.dialog.closeAll();
  }

  /**
   * Close This Current Dialog
   */
  onNoClick(): void {
    this._filterService.closeFilterModal.next(false);
    this.dialog.closeAll();
    // const chatbotIcon = document.querySelector('.chatbot__bubble');
    // const customOverlay = document.querySelector('.custom-overlay');
    // customOverlay.classList.remove('display-flex');
    // chatbotIcon.classList.remove('z-index-inherit');
  }


  // -----------------------------------------------------------------------------------------------------
  // @ Exclude Filter Function
  // -----------------------------------------------------------------------------------------------------



  /**
   * Exclude Filter Pipe uses it to autoComplete
   */
  private _filter(value: string): string[] {
    let filterValue = '';
    if (value) {
      filterValue = value.toLowerCase();
    }
    for (const each of Object.keys(this.excludeDisplay)) {
      this.excludeFilterOption = this.excludeFilterOption.filter(option => option !== each);
    }
    return this.excludeFilterOption.filter(option => option.toLowerCase().includes(filterValue));
  }



  /**
   * Adding new Data + Form Control to Exclude Filter
   */
  addExcludeFilter(value: string): void {
    if (value in this._filterService.allAttribute) {
      this.excludeDisplay[value] = this._filterService.allAttribute[value];
      // creating Form for it
      // tslint:disable-next-line: triple-equals
      if (this.excludeDisplay[value].type === 'checkbox') {
        const innerFormGroup = new FormGroup({});
        for (const ele of this.excludeDisplay[value].options) {
          innerFormGroup.addControl(ele, new FormControl(null));
        }
        this.excludeFiltersForm.addControl(value, innerFormGroup);
      }
      // this if for select and input
      else {
        if (value === 'Upper Category' || value === 'Category')
        {
          this.excludeFiltersForm.addControl(value + 'condition', new FormControl(true));
        }
        this.excludeFiltersForm.addControl(value, new FormControl(this.excludeDisplay[value].default));
      }
      this.excludeFilterForm.reset();
      delete this.excludeFilterOption[value];
      // Exclude filter pipe
      this.filteredOptions = this.excludeFilterForm.valueChanges
        .pipe(
          startWith(''),
          map(value1 => this._filter(value1))
        );
    }
  }


  /**
   * select all when all option got checked in Exclude Profile
   */
  // toggleExcludeAllProfileSelection(): void {
  //   if (this.excludeAllSelectedProfile.selected) {
  //     this.excludeFiltersForm.controls.socialProfile
  //       .patchValue([...this.excludeDisplay.socialProfile.options.map(item => item.id), 'All']);
  //   } else {
  //     this.excludeFiltersForm.controls.socialProfile.patchValue([]);
  //   }
  // }



  /**
   * select all when every option got checked in Exclude Profile
   */
  // tosslePerOneExcludeProfile(): void {
  //   if (this.excludeAllSelectedProfile.selected) {
  //     this.excludeAllSelectedProfile.deselect();
  //   }
  //   else if
  //     (
  //     this.excludeFiltersForm.controls.socialProfile.value.length === this.excludeDisplay.socialProfile.options.length
  //   ) {
  //     this.excludeAllSelectedProfile.select();
  //   }
  // }


  /**
   * select all when all option got checked in Exclude Action Statuses
   */
  toggleAllExcludeActionStatus(): void {
    if (this.excludeAllSelectedActionStatus.selected) {
      this.excludeFiltersForm.controls.actionStatuses
        .patchValue([...this.excludeDisplay.actionStatuses.options.map(item => item.id), 'All']);
    } else {
      this.excludeFiltersForm.controls.actionStatuses.patchValue([]);
    }
  }

  /**
   * select all when every option got checked in Exclude Action Statuses
   */
  tosslePerExcludeActionStatus(): void {
    if (this.excludeAllSelectedActionStatus.selected) {
      this.excludeAllSelectedActionStatus.deselect();
    }
    else if
      (
      this.excludeFiltersForm.controls.actionStatuses.value.length === this.excludeDisplay.actionStatuses.options.length
    ) {
      this.excludeAllSelectedActionStatus.select();
    }
  }



  /**
   * select all when all option got checked in Exclude Action Statuses
   */
  toggleAllExcludeSsreStatus(): void {
    if (this.excludeAllSelectedSsreStatus.selected) {
      this.excludeFiltersForm.controls.SsreStatuses
        .patchValue([...this.excludeDisplay.SsreStatuses.options.map(item => item.id), 'All']);
    } else {
      this.excludeFiltersForm.controls.SsreStatuses.patchValue([]);
    }
  }

  /**
   * select all when every option got checked in Exclude Action Statuses
   */
  tosslePerOneExcludeSsreStatus(): void {
    if (this.excludeAllSelectedSsreStatus.selected) {
      this.excludeAllSelectedSsreStatus.deselect();
    }
    else if
      (
      this.excludeFiltersForm.controls.SsreStatuses.value.length === this.excludeDisplay.SsreStatuses.options.length
    ) {
      this.excludeAllSelectedSsreStatus.select();
    }
  }


  /**
   * Remove Filters From Exclude(From Form and Data both).
   */
  removeExcludeFilter(name: string): void {
    this.excludeFiltersForm.removeControl(name);
    delete this.excludeDisplay[name];
    this.excludeFilterOption = this._filterService.excludeOptions;
    // console.log(this.excludeDisplay);
  }



  /**
   * Fill exclude Channel Data From Child checklist
   */
  assignExcludeChannelData(selected: []): void {
    this.excludeFiltersForm.value.Channel = selected;
    // console.log(this.excludeFiltersForm);
  }

  excludeFilterSelection(): void {
    this.excludeInput.nativeElement.blur();
  }

  /**
   * Fill exclude Category Data From Child checklist
   */
  assignExcludeCategoryData(selected: []): void {
    this.excludeFiltersForm.value.Category = selected;
    // console.log(this.excludeFiltersForm);
  }



  // -----------------------------------------------------------------------------------------------------
  // @ Filter Basic Function
  // -----------------------------------------------------------------------------------------------------


  /**
   * Switch between Tickets and all Mension.
   */
  switchTicketsAndMentions(name: string): void {
    switch (name) {
      case 'Tickets':
        {
          this.ticketsFlag = true;
          this.filterForm.controls.ticketsMentions.controls.Mentions.reset();
          this.filterForm.controls.ticketsMentions.controls.Mentions.disable();
          this.filterForm.controls.ticketsMentions.controls.userActivity.reset();
          this.filterForm.controls.ticketsMentions.controls.userActivity.disable();
          this.filterForm.controls.ticketsMentions.controls.brandActivity.reset();
          this.filterForm.controls.ticketsMentions.controls.brandActivity.disable();
          this.filterForm.controls.ticketsMentions.controls.ticketsYouWantToSee.enable();
          this.filterForm.controls.ticketsMentions.controls.myTickets.enable();
          this.filterForm.controls.ticketsMentions.controls.TAT.enable();
          this.filterForm.controls.ticketsMentions.controls.autocloserEnable.enable();
          this.filterForm.controls.ticketsMentions.controls.subscribeTicket.enable();
          // this.filterForm.controls.ticketsMentions.controls.ticketStatus.enable();
          // this.filterForm.controls.ticketsMentions.controls.TATBranchTime.enable();
          this.filterForm.controls.Others.controls.actionStatuses.enable();
          this.filterForm.controls.Others.controls.feedbackRequested.enable();
          this.filterForm.controls.Others.controls.FeedbackRating.enable();
          this.filterForm.controls.ticketsMentions.controls.Categorycondition.enable();
          this.filterForm.controls.ticketsMentions.controls.upperCategorycondition.enable();
          break;
        }
      case 'All Mentions':
        {
          this.ticketsFlag = false;
          this.filterForm.controls.ticketsMentions.controls.Mentions.enable();
          // this.filterForm.controls.ticketsMentions.controls.Mentions.get('User Activity').patchValue(true);
          this.filterForm.controls.ticketsMentions.controls.ticketsYouWantToSee.reset();
          this.filterForm.controls.ticketsMentions.controls.ticketsYouWantToSee.disable();
          this.filterForm.controls.ticketsMentions.controls.myTickets.disable();
          this.filterForm.controls.ticketsMentions.controls.TAT.reset();
          this.filterForm.controls.ticketsMentions.controls.TAT.disable();
          this.filterForm.controls.ticketsMentions.controls.autocloserEnable.reset();
          this.filterForm.controls.ticketsMentions.controls.autocloserEnable.disable();
          this.filterForm.controls.ticketsMentions.controls.subscribeTicket.reset();
          this.filterForm.controls.ticketsMentions.controls.subscribeTicket.disable();
          this.filterForm.controls.Others.controls.actionStatuses.reset();
          this.filterForm.controls.Others.controls.actionStatuses.disable();
          this.filterForm.controls.Others.controls.feedbackRequested.reset();
          this.filterForm.controls.Others.controls.feedbackRequested.disable();
          this.filterForm.controls.Others.controls.FeedbackRating.reset();
          this.filterForm.controls.Others.controls.FeedbackRating.disable();
          this.filterForm.controls.ticketsMentions.controls.Categorycondition.patchValue(false);
          this.filterForm.controls.ticketsMentions.controls.Categorycondition.disable();
          this.filterForm.controls.ticketsMentions.controls.upperCategorycondition.patchValue(false);
          this.filterForm.controls.ticketsMentions.controls.upperCategorycondition.disable();
          // this.filterForm.controls.ticketsMentions.controls.ticketStatus.reset();
          // this.filterForm.controls.ticketsMentions.controls.ticketStatus.disable();
          // this.filterForm.controls.ticketsMentions.controls.TATBranchTime.reset();
          // this.filterForm.controls.ticketsMentions.controls.TATBranchTime.disable();
          break;
        }
      case 'User Activity':
        {
          this.filterForm.controls.ticketsMentions.controls.userActivity.reset();
          this.filterForm.controls.ticketsMentions.controls.userActivity.enable();
          break;
        }
      case 'Brand Activity':
        {
          this.filterForm.controls.ticketsMentions.controls.brandActivity.reset();
          this.filterForm.controls.ticketsMentions.controls.brandActivity.enable();
          break;
        }
      default:
        {
          break;
        }
    }
  }



  /**
   * Fill Category Data From Child checklist
   */
  assignCategoryData(selected: []): void {
    this.filterForm.value.ticketsMentions.Category = selected;
    this.filterForm.controls.ticketsMentions.controls.Category.value = selected;
  }



  /**
   * Fill Channel Data From Child checklist
   */
  assignChannelData(selected: []): void {
    this.filterForm.value.ticketsMentions.Channel = selected;
    this.filterForm.controls.ticketsMentions.controls.Channel.value = selected;
  }



  /**
   * select all when all option got checked in Brand
   */
  toggleAllBrandSelection(): void {
    if (this.allSelectedBrand.selected) {
      this.filterForm.controls.brandDateDuration.controls.selectBrand
        .patchValue([...this.filterData.brandDateDuration.selectBrand.options.map(item => item.id), 'All']);
    } else {
      this.filterForm.controls.brandDateDuration.controls.selectBrand.patchValue([]);
      this._snackBar.open('Brand cannot be empty, Default brands will be selected', 'Close', {
        duration: 3000,
      });
    }
  }



  /**
   * select all when every option got checked in Brand
   */
  tosslePerOneBrand(): void {
    if (this.allSelectedBrand.selected) {
      this.allSelectedBrand.deselect();
    }
    else if
      (
      this.filterForm.controls.brandDateDuration.controls.selectBrand.value.length
      === this.filterData.brandDateDuration.selectBrand.options.length
    ) {
      this.allSelectedBrand.select();
    }
  }



  /**
   * select all when all option got checked in Profile
   */
  // toggleAllProfileSelection(): void {
  //   if (this.allSelectedProfile.selected) {
  //     // optionvalue = optionvalue.filter((val) => val !== 'All');
  //     this.filterForm.controls.ticketsMentions.controls.socialProfile
  //       .patchValue([...this.filterData.ticketsMentions.socialProfile.options.map(item => item.id)]);
  //     this.allSelectedProfile.select();
  //   } else {
  //     this.filterForm.controls.ticketsMentions.controls.socialProfile.patchValue([]);
  //   }
  // }



  /**
   * select all when every option got checked in Profile
   */
  // tosslePerOneProfile(): void {
  //   if (this.allSelectedProfile.selected) {
  //     this.allSelectedProfile.deselect();
  //   }
  //   else if
  //     (
  //     this.filterForm.controls.ticketsMentions.controls.socialProfile.value.length
  //     === this.filterData.ticketsMentions.socialProfile.options.length
  //   ) {
  //     this.allSelectedProfile.select();
  //   }
  // }

  /**
   * select all when all option got checked in Action Statuses
   */
  toggleAllActionStatus(): void {
    if (this.allSelectedActionStatus.selected) {
      this.filterForm.controls.Others.controls.actionStatuses
        .patchValue([...this.filterData.Others.actionStatuses.options.map(item => item.id), 'All']);
    } else {
      this.filterForm.controls.Others.controls.actionStatuses.patchValue([]);
    }

  }


  /**
   * select all when every option got checked in Action Statuses
   */
  tosslePerActionStatus(): void {
    if (this.allSelectedActionStatus.selected) {
      this.allSelectedActionStatus.deselect();
    }
    else if
      (
      this.filterForm.controls.Others.controls.actionStatuses.value.length
      === this.filterData.Others.actionStatuses.options.length
    ) {
      this.allSelectedActionStatus.select();
    }
  }

  /**
   * select all when all option got checked in Ssre Statuses
   */
  toggleAllSsreStatus(): void {
    if (this.allSelectedSsreStatus.selected) {
      this.filterForm.controls.Others.controls.SsreStatuses
        .patchValue([...this.filterData.Others.SsreStatuses.options.map(item => item.id), 'All']);
    } else {
      this.filterForm.controls.Others.controls.SsreStatuses.patchValue([]);
    }

  }


  /**
   * select all when every option got checked in Ssre Statuses
   */
  tosslePerOneSsreStatus(): void {
    if (this.allSelectedSsreStatus.selected) {
      this.allSelectedSsreStatus.deselect();
    }
    else if
      (
      this.filterForm.controls.Others.controls.SsreStatuses.value.length
      === this.filterData.Others.SsreStatuses.options.length
    ) {
      this.allSelectedSsreStatus.select();
    }
  }



  /**
   * brand Selected then call Other API's
   */
  brandTouched(value: boolean): void {
    if (!value) {
      this.brandTouchedDone = true;
      if (this.filterForm.controls.brandDateDuration.controls.selectBrand.value.length === 0) {
        this.filterForm.controls.brandDateDuration.controls.selectBrand
          .patchValue([...this.filterData.brandDateDuration.selectBrand.options.map(item => item.id), 'All']);
      }
      this.fillBrandSelected(this.filterForm.controls.brandDateDuration);
      this._snackBar.open('All selected value has been reseted', 'Close', {
        duration: 3000,
      });
    }
  }



  /**
   * brand Selected then call Other API's
   */
  durationTouched(value: boolean): void {
    if (!value) {
      this.durationTouchedDone = true;
      if (this.brandTouchedDone && this.durationTouchedDone) {
        if (this.filterForm.controls.brandDateDuration.controls.selectBrand.value.length === 0) {
          this.filterForm.controls.brandDateDuration.controls.selectBrand
            .patchValue([...this.filterData.brandDateDuration.selectBrand.options.map(item => item.id), 'All']);
        }
        this.fillBrandSelected(this.filterForm.controls.brandDateDuration);
        this._snackBar.open('All selected value has been reseted', 'Close', {
          duration: 3000,
        });
      }
      else {
        this.onlyDurationSelected(this.filterForm.controls.brandDateDuration.controls.Duration.controls.StartDate.value,
          this.filterForm.controls.brandDateDuration.controls.Duration.controls.EndDate.value);
        this._snackBar.open('All selected value has been reseted', 'Close', {
          duration: 3000,
        });
      }
    }
  }


  setDurationValue(item, event): void {
    this.filterForm.get('brandDateDuration').get('Duration').get('StartDate').
      patchValue(moment().subtract(item.id, 'days').startOf('day').utc().unix());
    this.filterForm.controls.brandDateDuration.controls.Duration.controls.EndDate.value = moment().endOf('day').utc().unix();
    this.filterForm.get('brandDateDuration').get('Duration').get('isCustom').patchValue(item.id);
    this.durationlabel = item.label;
    if (item?.label !== 'Custom') {
      this.customDurationToggle = false;
    }
    if (item?.label !== 'Custom') {
      this.customDurationToggle = false;
    }
  }

  setMultiSelectValue(group, items, event: FormArray): void {
    if (event.length > 1)
    {
      const condition = event[1];
      if (((this.filterForm.get(group) as FormGroup).get(items + 'condition') as FormControl))
      {
        ((this.filterForm.get(group) as FormGroup).get(items + 'condition') as FormControl)
          .patchValue(condition.value);
      }
    }
    if (event) {
      let optionvalue = event[0].value;
      optionvalue = optionvalue.filter((val) => val !== 'All');
      ((this.filterForm.get(group) as FormGroup).get(items) as FormControl)
        .patchValue([...optionvalue.map(item => item)]);
    }
    else {
      ((this.filterForm.get(group) as FormGroup).get(items) as FormControl)
        .patchValue([]);
    }
  }

  setRatingValue(group, items, event): void {
    if (event) {
      let optionvalue = event.value;
      optionvalue = optionvalue.filter((val) => val !== 'All');
      ((this.filterForm.get(group) as FormGroup).get(items) as FormControl)
        .patchValue([...optionvalue.map(item => item)]);
    }
    else {
      ((this.filterForm.get(group) as FormGroup).get(items) as FormControl)
        .patchValue([]);
    }

  }

  setSlidderValue(group, items, event: FormArray): void {
    if (event) {
      const optionvalue = event;
      ((this.filterForm.get(group) as FormGroup).get(items) as FormControl)
        .patchValue(
          {
            from: optionvalue[0],
            to: optionvalue[1]
          });
    }
    else {
      ((this.filterForm.get(group) as FormGroup).get(items) as FormControl)
        .patchValue(null);
    }
  }
  setAutoCompleteValue(group,items,event): void
  {
    ((this.filterForm.get(group) as FormGroup).get(items) as FormControl)
        .patchValue(event);
  }

  setExcludeAutoCompleteValue(exclude,event): void
  {
    (this.excludeFiltersForm.get(exclude) as FormControl)
    .patchValue(event);
  }

  setExcludeSlidderValue(exclude, event: FormArray): void {
    if (event) {
      const optionvalue = event;
      (this.excludeFiltersForm.get(exclude) as FormControl)
        .patchValue(
          {
            from: optionvalue[0],
            to: optionvalue[1]
          });
    }
    else {
      (this.excludeFiltersForm.get(exclude) as FormControl)
        .patchValue(null);
    }
  }

  setExcludeMultiSelectValue(exclude, event: FormArray): void {
    if (event) {
      let optionvalue = event[0].value;
      optionvalue = optionvalue.filter((val) => val !== 'All');
      (this.excludeFiltersForm.get(exclude) as FormArray).patchValue([...optionvalue.map(item => item)]);
    }
    else {
      (this.excludeFiltersForm.get(exclude) as FormArray).patchValue([]);
    }
  }

  customDurationStartdate(event): void {
    this.filterForm.get('brandDateDuration').get('Duration').get('isCustom').patchValue(-1);
    if (event.value) {
      const date = event.value.getDate();
      const month = event.value.getMonth();
      const year = event.value.getFullYear();
      this.filterForm.controls.brandDateDuration.controls.Duration.controls.StartDate.value = moment([year, month, date]).unix();
    }
  }

  customDurationEnddate(event): void {
    this.filterForm.get('brandDateDuration').get('Duration').get('isCustom').patchValue(-1);
    if (event.value) {
      const date = event.value.getDate();
      const month = event.value.getMonth();
      const year = event.value.getFullYear();
      this.filterForm.controls.brandDateDuration.controls.Duration.controls.EndDate.value = moment([year, month, date]).endOf('day').unix();
    }
  }

  filledCustomDuration(): void {
    const start = new Date(this.filterForm.controls.brandDateDuration.controls.Duration.controls.StartDate.value * 1000)
      .toLocaleDateString('en-US');
    const end = new Date(this.filterForm.controls.brandDateDuration.controls.Duration.controls.EndDate.value * 1000)
      .toLocaleDateString('en-US');
    const label = start + ' - ' + end;
    this.durationlabel = label;
    this.customDurationToggle = false;
    this.durationTouched(false);
  }

  reInitialize(): void {
    // this._filterService.generateForms();
    this.filterForm = this.generateForms();
    // Filter data frm Service
    this.filterData = this._filterService.filterData;

    // Filter Form from Service
    // this.filterForm = this._filterService.filterForm;

    this.filterCount = this._filterService.filterCount;


    // exclude filter
    this.excludeFilterOption = this._filterService.excludeOptions;
    if (this.filterForm.controls.ticketsMentions.controls.whatToMonitor.value === 1) {
      this.switchTicketsAndMentions('All Mentions');
    }
    else {
      ((this.filterForm.get('ticketsMentions') as FormGroup).get('whatToMonitor') as FormControl).patchValue(0);
      this.switchTicketsAndMentions('Tickets');
    }

    // make all brands selected
    if (this.filterForm.controls.brandDateDuration.controls.selectBrand.value === null) {
      this.filterForm.controls.brandDateDuration.controls.selectBrand
        .patchValue([...this.filterData.brandDateDuration.selectBrand.options.map(item => item.id), 'All']);
    }
  }

  /**
   * Submit Filter Form
   */
  filterFormSubmited(isForCount: boolean): void {
    // Get raw value from Form
    if (this.whoCalled.requiredFor === 'Add New Tab' && !isForCount)
      {
        if (this.selectedTabIndex === 1)
        {
          this.AdvanceFilterComponent.advanceFilterFormSubmit(false);
        }
        if (this.selectedTabIndex === 0)
        {
          const filterFromObject = this.filterForm.value;
          // Exclude Filter Form
          const excludeForm = this.excludeFiltersForm.value;
          filterFromObject.excludeFilters = excludeForm;
          this.getFilled(filterFromObject, isForCount, false);
        }
        this._openFilterGroup(this.selectedTabIndex);
      }
      else{
        const _commonService = this.injector.get<CommonService>(CommonService);
        if (this.selectedTabIndex === 1 && !isForCount) {
          this._filterService.selectedTabIndex = 1;
          this.AdvanceFilterComponent.advanceFilterFormSubmit();
          if (this._filterService.saveAndApply)
          {
            _commonService.changeTabFilterJson();
          }
          else
          {
            _commonService.changeTabFilterJson();
          }
          this._filterService.closeFilterModal.next(false);
          this.closeDialog();
        }
        else {
          this._filterService.selectedTabIndex = 0;
          const filterFromObject = this.filterForm.value;

          // let serializedForm = JSON.stringify(filterFromObject)

          // Exclude Filter Form
          const excludeForm = this.excludeFiltersForm.value;
          filterFromObject.excludeFilters = excludeForm;
          if (isForCount)
          {
            this.getFilled(filterFromObject, isForCount);
          }
          else
          {

            // When Used as normal Filter
            // if (this.whoCalled.requiredFor === 'Filter') {
              // Passing data to service back
              this.getFilled(filterFromObject, isForCount);
              if (this._filterService.saveAndApply)
              {
                _commonService.changeTabFilterJson(true);
              }
              else
              {
                _commonService.changeTabFilterJson();
              }
              this._filterService.closeFilterModal.next(false);
              this.closeDialog();
              // }

            // When Used as newTab Filter
            // if (this.whoCalled.requiredFor === 'Add New Tab') {
            //   // this.closeDialog();
            //   this._openFilterGroup(filterFromObject, excludeForm);
            // }

          }
        }
      }


  }
  resetBothFilter(): void
  {
    // this.reInitialize();
    // get filterJson from LocalStorage
    // change localStorage
    const _navService = this.injector.get<NavigationService>(NavigationService);
    const _commonService = this.injector.get<CommonService>(CommonService);
    const currentUserMenus = localStorage.getItem('userMenu');
    const menuObj: Menu[] = JSON.parse(currentUserMenus);
    const menuindex = menuObj.findIndex((obj) => obj.menuId === _navService.currentSelectedTab.menuId);
    if (menuindex > -1) {
      const tabindex = menuObj[menuindex].tabs.findIndex(
        (obj) => obj.guid === _navService.currentSelectedTab.guid
      );
      if (tabindex > -1) {
        _navService.currentSelectedTab.filterJson = menuObj[menuindex].tabs[tabindex].filterJson;
        _commonService.changeTabFilterJson();
        this._filterService.reverseApply(JSON.parse(_navService.currentSelectedTab.filterJson));
        this._snackBar.open('Filter reset successfull', 'Close', {
          duration: 3000,
        });
      }
    }
  }


  // Dropdown Width
  getWidth(element: HTMLElement): string {
    return `${element.clientWidth}px`;
  }

  onSaveFilterChecked(event): void{
    this._filterService.saveAndApply = event.checked ? true : false;
  }

  // refactoring filter
  // get form filled data.
  getFilled(filterFilledData: FilterFilledData, isForCount: boolean, callextraapi = true): void {
    this._filterFilledData = filterFilledData;
    this.fillAllFilterReply();
    if (!isForCount && callextraapi)
    {
      this._filterService.currentBrandSource.next(true);
      this._filterService.filterTabSource.next(this._navigationService.currentSelectedTab);
    }

}
// takes Brand Date Duration FormGroup
fillBrandSelected(brandData: FormGroup): void {
    this.selectedBrands = brandData;
    if (this.selectedBrands.value.selectBrand[this.selectedBrands.value.selectBrand.length - 1] === 'All') {
        this.onlyDurationSelected(this.selectedBrands.value.Duration.StartDate.value, this.selectedBrands.value.Duration.EndDate.value);
        return;
    }
    else {
        const brandreply = [];
        // tslint:disable-next-line: forin
        for (const each in this.selectedBrands.value.selectBrand) {
            const value = this.selectedBrands.value.selectBrand[each];
            const eachbrand = new Brand();
            const brandAllData = this._filterService.fetchedBrandData.find(b => b.brandID === value);
            eachbrand.brandID = Number(brandAllData.brandID);
            eachbrand.brandName = brandAllData.brandName;
            eachbrand.categoryGroupID = Number(brandAllData.categoryGroupID);
            eachbrand.mainBrandID = Number(brandAllData.brandID);
            eachbrand.compititionBrandIDs = [];
            eachbrand.brandFriendlyName = brandAllData.brandFriendlyName;
            eachbrand.brandLogo = '';
            eachbrand.isBrandworkFlowEnabled = brandAllData.isBrandworkFlowEnabled;
            eachbrand.brandGroupName = '';
            brandreply.push(eachbrand);
        }
        this.FilterFilledDataReply = new ApiReply();
        this.FilterFilledDataReply.brands = brandreply;
        this.FilterFilledDataReply.categoryID = 0;
        this.FilterFilledDataReply.categoryName = 'string';
        this.FilterFilledDataReply.startDateEpoch = this.selectedBrands.value.Duration.StartDate,
        this.FilterFilledDataReply.endDateEpoch = this.selectedBrands.value.Duration.EndDate,
        this.FilterFilledDataReply.userID = 0;
        this.FilterFilledDataReply.filters = [];
        this.FilterFilledDataReply.notFilters = [];
        this.FilterFilledDataReply.isAdvance = false;
        this.FilterFilledDataReply.query = 'string';
        if (((this.filterForm.get('ticketsMentions') as FormGroup).get('whatToMonitor') as FormControl).value === 1)
        {
            this.FilterFilledDataReply.orderBYColumn =
                ticketMentionDropdown.sortBy[this._postOptionService.optionForm.controls.sortBy.value].mention;
        }
        else
        {
            this.FilterFilledDataReply.orderBYColumn =
            ticketMentionDropdown.sortBy[this._postOptionService.optionForm.controls.sortBy.value].ticket;
        }
        this.FilterFilledDataReply.orderBY =
            ticketMentionDropdown.sortOrder.value[+this._postOptionService.optionForm.controls.sortOrder.value];
        this.FilterFilledDataReply.IsRawOrderBy = false;
        this.FilterFilledDataReply.offset = 0;
        this.FilterFilledDataReply.noOfRows = 1;
        this.fillCategoryList(this.FilterFilledDataReply);
        this.fillFilterBasicList(this.FilterFilledDataReply,false);
        this.callFilterCountAPI(this.FilterFilledDataReply);
    }
}


onlyDurationSelected(startDate, endDate): void {
    this.readyForFilterStartApi(this._filterService.brandreplyAll, startDate, endDate);
}

// Fetch data From Http and store it in ChannelData
fillChannelData(chData): void {
    // Get Channel Data
    this.fetchedChannelData = chData;
    // Convert to Tree Structure
    const ChannelData = {};
    this.fetchedChannelgroupnameid = {};
    this.fetchedChanneltypenameid = {};
    this.fetchedChannelgroupidname = {};
    this.fetchedChanneltypeidname = {};
    for (const each in this.fetchedChannelData) {
        if (!(this.fetchedChannelData[each].channelGroupName in ChannelData)) {
            ChannelData[this.fetchedChannelData[each].channelGroupName] = [this.fetchedChannelData[each].channelName];
            this.fetchedChannelgroupnameid[this.fetchedChannelData[each].channelGroupName]
            = this.fetchedChannelData[each].channelGroupType;
            this.fetchedChannelgroupidname[this.fetchedChannelData[each].channelGroupType]
            = this.fetchedChannelData[each].channelGroupName;
            this.fetchedChanneltypenameid[this.fetchedChannelData[each].channelName]
            = this.fetchedChannelData[each].channelType;
            this.fetchedChanneltypeidname[this.fetchedChannelData[each].channelType]
            = this.fetchedChannelData[each].channelName;
        }
        else {
            ChannelData[this.fetchedChannelData[each].channelGroupName].push(this.fetchedChannelData[each].channelName);
            this.fetchedChanneltypenameid[this.fetchedChannelData[each].channelName]
            = this.fetchedChannelData[each].channelType;
            this.fetchedChanneltypeidname[this.fetchedChannelData[each].channelType]
            = this.fetchedChannelData[each].channelName;
        }
    }
    this.fetchedChannelDisplayData = ChannelData;
    this.filterData.ticketsMentions.Channel.options = ChannelData;
    // this.setValue(true);
}

// fillBrandList(firstcall = false): void {
//     this._filterConfig.postData(this.brandConfigUrl, {}).subscribe(resData => {
//         this._LoaderService.toggleMainLoader(false);
//         const data = JSON.stringify(resData);
//         this.fetchedBrandData = JSON.parse(data).data;
//         const options = [];
//         const brandreply = [];
//         for (const each in this.fetchedBrandData) {
//             options.push({ id: this.fetchedBrandData[each].brandID, label: this.fetchedBrandData[each].brandName });
//             const brand = new Brand();
//             brand.brandID = Number(this.fetchedBrandData[each].brandID);
//             brand.brandName = this.fetchedBrandData[each].brandName;
//             brand.categoryGroupID = Number(this.fetchedBrandData[each].categoryGroupID);
//             brand.mainBrandID = Number(this.fetchedBrandData[each].brandID),
//             brand.compititionBrandIDs = [];
//             brand.brandFriendlyName = this.fetchedBrandData[each].brandFriendlyName,
//             brand.brandLogo = '';
//             brand.isBrandworkFlowEnabled = this.fetchedBrandData[each].isBrandworkFlowEnabled;
//             brand.brandGroupName = '';
//             brandreply.push(brand);
//         }
//         this.filterData.brandDateDuration.selectBrand.options = options;
//         this.durationsOptions = this.filterData.brandDateDuration.Duration.options;



//         if ((this.filterForm.get('brandDateDuration') as FormGroup).get('selectBrand').value === null)
//         {
//             (this.filterForm.get('brandDateDuration') as FormGroup).get('selectBrand')
//                 .patchValue([...this.filterData.brandDateDuration.selectBrand.options.map(item => item.id), 'All']);
//         }

//         this.brandOptions = options;
//         this.brandreplyAll = brandreply;
//         this.readyForFilterStartApi(brandreply, this.filterForm.controls.brandDateDuration.value.Duration.StartDate,
//             this.filterForm.controls.brandDateDuration.value.Duration.EndDate, firstcall);
//         this.currentBrandSource.next(true);
//         this.currentBrandListFirstCall.next(true);
//     });
// }

readyForFilterStartApi(brandreply: Brand[], startDate, endDate, firstcall= false): void {
    this.FilterFilledDataReply = new ApiReply();
    this.FilterFilledDataReply.brands = brandreply;
    this.FilterFilledDataReply.categoryID = 0;
    this.FilterFilledDataReply.categoryName = 'string';
    this.FilterFilledDataReply.startDateEpoch = startDate;
    this.FilterFilledDataReply.endDateEpoch = endDate;
    this.FilterFilledDataReply.userID = 0;
    this.FilterFilledDataReply.filters = [];
    this.FilterFilledDataReply.notFilters = [];
    this.FilterFilledDataReply.isAdvance = false;
    this.FilterFilledDataReply.query = 'string';
    if (((this.filterForm.get('ticketsMentions') as FormGroup).get('whatToMonitor') as FormControl).value === 1)
    {
        this.FilterFilledDataReply.orderBYColumn =
            ticketMentionDropdown.sortBy[this._postOptionService.optionForm.controls.sortBy.value].mention;
    }
    else
    {
        this.FilterFilledDataReply.orderBYColumn =
        ticketMentionDropdown.sortBy[this._postOptionService.optionForm.controls.sortBy.value].ticket;
    }
    this.FilterFilledDataReply.orderBY =
        ticketMentionDropdown.sortOrder.value[+this._postOptionService.optionForm.controls.sortOrder.value];
    this.FilterFilledDataReply.IsRawOrderBy = false;
    this.FilterFilledDataReply.offset = 0;
    this.FilterFilledDataReply.noOfRows = 1;
    this.fillFilterBasicList(this.FilterFilledDataReply, firstcall);
    this.fillCategoryList(this.FilterFilledDataReply);
    this.callFilterCountAPI(this.FilterFilledDataReply);
}


// readyForCategoryList(brandreply: Brand[], startDate, endDate): void {
//     const bodyreply = new ApiReply();
//     bodyreply.brands = brandreply;
//     bodyreply.categoryID = 0;
//     bodyreply.categoryName = 'string';
//     bodyreply.startDateEpoch = startDate;
//     bodyreply.endDateEpoch = endDate;
//     bodyreply.userID = 0;
//     bodyreply.filters = [];
//     bodyreply.notFilters = [];
//     bodyreply.isAdvance = false;
//     bodyreply.query = 'string';
//     bodyreply.orderBYColumn = 'DateCreated',
//     bodyreply.orderBY = 'desc';
//     bodyreply.IsRawOrderBy = false;
//     bodyreply.offset = 0;
//     bodyreply.noOfRows = 1;
//     this.fillCategoryList(bodyreply);
// }

fillFilterBasicList(body: ApiReply, firstcall = false): void {
    let data = JSON.stringify(body);

    this._filterService.getBasicFiltersList(body).subscribe(resData => {
      data = JSON.stringify(resData);
      const featchData = JSON.parse(data).data;
      this.fillUpperCategory(featchData.upperCategories);
      this.fillSocialProfile(featchData.socialAccounts);
      this.fillActionStatuses(featchData.actionStatuses);
      this.fillAssignTo(featchData.assignToList);
      this.fillInfluencerCategory(featchData.influencerCategories);
      this.fillCrmColumns(featchData.crmColumns);
      this.fillSsreStatuses(featchData.ssreStatuses);
      this.fillLangaugeList(featchData.langaugeList);
      this.fillcountryList(featchData.countryList);
      this.fillCampaigns(featchData.campaigns);
      this.fillChannelData(featchData.channels);
      if (firstcall)
      {
          this._filterService.filterTabSource.next(this._navigationService.currentSelectedTab);
      }
    });
}

fillUpperCategory(upperCategory): void {
    this.fetchedUpperCategoryData = upperCategory;
    const options = [];
    // tslint:disable-next-line: forin
    for (const each in this.fetchedUpperCategoryData) {
        options.push({ id: this.fetchedUpperCategoryData[each].id, label: this.fetchedUpperCategoryData[each].name });
    }
    this.filterData.ticketsMentions.upperCategory.options = options;
}

fillSocialProfile(socialProfile): void {
    this.fetchedSocialProfile = socialProfile;
    const options = [];
    // tslint:disable-next-line: forin
    for (const each in this.fetchedSocialProfile) {
        options.push({
            authorID: this.fetchedSocialProfile[each].authorID, label: this.fetchedSocialProfile[each].authorName,
            brandID: this.fetchedSocialProfile[each].brandID, id: this.fetchedSocialProfile[each].btaid,
            channelGroupID: this.fetchedSocialProfile[each].channelGroupID, ImageUrl: this.fetchedSocialProfile[each].profileImageUrl
        });
    }
    this.filterData.ticketsMentions.socialProfile.options = options;
}

fillAssignTo(assignTo): void {
    this.fetchedAssignTo = assignTo;
    const options = [];
    // tslint:disable-next-line: forin
    for (const each in this.fetchedAssignTo) {
        options.push({ id: this.fetchedAssignTo[each].agentID, label: this.fetchedAssignTo[each].agentName });
    }
    this.filterData.teamcharacteristics.assigendTo.options = options;
}

fillInfluencerCategory(influencerCategory): void {
    this.fetchedInfluencerCategory = influencerCategory;
    const options = [];
    // tslint:disable-next-line: forin
    for (const each in this.fetchedInfluencerCategory) {
        options.push({ id: this.fetchedInfluencerCategory[each].name, label: this.fetchedInfluencerCategory[each].name });
    }
    this.filterData.usercharacteristics.influencerCategory.options = options;
}

fillCrmColumns(crmColums): void {
    this.fetchedCrmColums = crmColums;
    const options = [];
    if (this.fetchedCrmColums) {
        // tslint:disable-next-line: forin
        for (const each in this.fetchedCrmColums.existingColumns) {
            if (this.fetchedCrmColums.existingColumns[each].showInFilter) {
                options.push({
                    id: this.fetchedCrmColums.existingColumns[each].orderID,
                    label: this.fetchedCrmColums.existingColumns[each].columnlabel
                });
            }
        }
    }
    this.filterData.usercharacteristics.userWith.options.concat(options);
}

fillActionStatuses(actionStatus): void {
    this.fetchedActionStatus = actionStatus;
    const options = [];
    // tslint:disable-next-line: forin
    for (const each in this.fetchedActionStatus) {
        options.push({ id: this.fetchedActionStatus[each].key, label: this.fetchedActionStatus[each].value });
    }
    this.filterData.Others.actionStatuses.options = options;
}

fillSsreStatuses(ssreStatuses): void {
    this.fetchedSsreStatuses = ssreStatuses;
    const options = [];
    // tslint:disable-next-line: forin
    for (const each in this.fetchedSsreStatuses) {
        options.push({ id: this.fetchedSsreStatuses[each].key, label: this.fetchedSsreStatuses[each].value });
    }
    this.filterData.Others.SsreStatuses.options = options;
}

fillLangaugeList(langaugeList): void {
    this.fetchedLangaugeList = langaugeList;
    const options = [];
    // tslint:disable-next-line: forin
    for (const each in this.fetchedLangaugeList) {
        options.push({ id: this.fetchedLangaugeList[each].value, label: this.fetchedLangaugeList[each].key });
    }
    this.filterData.Others.Language.options = options;
}

fillcountryList(countryList): void {
    this.fetchedCountryList = countryList;
    const options = [];
    // tslint:disable-next-line: forin
    for (const each in this.fetchedCountryList) {
        options.push({ id: this.fetchedCountryList[each].value, label: this.fetchedCountryList[each].key });
    }
    this.filterData.Others.Countries.options = options;
}


fillCampaigns(campaigns): void {
    this.fetchedCampaigns = campaigns;
    const options = [];
    // tslint:disable-next-line: forin
    for (const each in this.fetchedCampaigns) {
        options.push({ id: this.fetchedCampaigns[each].campaignID, label: this.fetchedCampaigns[each].campaignName });
    }
    this.filterData.Others.Campaign.options = options;
}

fillCategoryList(body: {}): void {
    this._filterService.getCategoryList(body).subscribe(resData => {
      const data = JSON.stringify(resData);
      this.fetchedCategoryData = JSON.parse(data).data;
      const categoryData = {};
      this.fetchedCategoryDatacategory = {};
      this.fetchedCategoryDatadepartment = {};
      this.fetchedCategoryDatasubCategory = {};
      this.fetchedCategoryDatacategoryidname = {};
      this.fetchedCategoryDatadepartmentidname = {};
      this.fetchedCategoryDatasubCategoryidname = {};
      if (this.fetchedCategoryData) {
          for (const category of Object.keys(this.fetchedCategoryData)) {
              categoryData[this.fetchedCategoryData[category].category] = {};
              this.fetchedCategoryDatacategory[this.fetchedCategoryData[category].category]
                  = this.fetchedCategoryData[category].categoryID;
              this.fetchedCategoryDatacategoryidname[this.fetchedCategoryData[category].categoryID]
                  = this.fetchedCategoryData[category].category;
              for (const dept of Object.keys(this.fetchedCategoryData[category].depatments)) {
                  categoryData[this.fetchedCategoryData[category].category]
                      [this.fetchedCategoryData[category].depatments[dept].departmentName] = {};
                  this.fetchedCategoryDatadepartment[this.fetchedCategoryData[category].depatments[dept].departmentName]
                      = this.fetchedCategoryData[category].depatments[dept].departmentID;
                  this.fetchedCategoryDatadepartmentidname[this.fetchedCategoryData[category].depatments[dept].departmentID]
                      = this.fetchedCategoryData[category].depatments[dept].departmentName;
                  for (const subCat of Object.keys(this.fetchedCategoryData[category].depatments[dept].subCategories)) {
                      categoryData[this.fetchedCategoryData[category].category]
                          [this.fetchedCategoryData[category].depatments[dept].departmentName]
                          [this.fetchedCategoryData[category].depatments[dept].subCategories[subCat].subCategoryName] = {};
                      this.fetchedCategoryDatasubCategory
                          [this.fetchedCategoryData[category].depatments[dept].subCategories[subCat].subCategoryName]
                          = this.fetchedCategoryData[category].depatments[dept].subCategories[subCat].subCategoryID;
                      this.fetchedCategoryDatasubCategoryidname
                          [this.fetchedCategoryData[category].depatments[dept].subCategories[subCat].subCategoryID]
                          = this.fetchedCategoryData[category].depatments[dept].subCategories[subCat].subCategoryName;
                  }
              }
          }
      }
      this.filterData.ticketsMentions.Category.options = categoryData;
      // this.filterData = this.filterData;
    });
}

fillAllFilterReply(): void {
  this.FilterFilledDataReply = new ApiReply();
  const brandInfo: BrandInfo[] = [];
  for (const value of this._filterFilledData.brandDateDuration.selectBrand) {
      const searchedBrand = this._filterService.fetchedBrandData.find(b => b.brandID === value);
      if (!searchedBrand) {
          continue;
      }
      const eachbrand: BrandInfo = {
          brandID: +searchedBrand.brandID,
          brandName: searchedBrand.brandName,
          categoryGroupID: +searchedBrand.categoryGroupID,
          mainBrandID: 0,
          categoryID: +searchedBrand.categoryID,
          categoryName: searchedBrand.categoryName,
          compititionBrandIDs: [0],
          brandFriendlyName: searchedBrand.brandFriendlyName,
          brandLogo: 'string',
          isBrandworkFlowEnabled: searchedBrand.isBrandworkFlowEnabled,
          brandGroupName: 'string'
      };
      brandInfo.push(eachbrand);
  }
  const startDateEpcoh1: number = this._filterFilledData.brandDateDuration.Duration.StartDate;
  const endDateEpoch1: number = this._filterFilledData.brandDateDuration.Duration.EndDate;
  const isCustom: number = this._filterFilledData.brandDateDuration.Duration.isCustom;
  const myFilter = [];
  const  excludeFilter = [];
  for (const group of Object.keys(this._filterFilledData)) {
      if (group === 'brandDateDuration') {
          continue;
      }
      else if (group === 'Keywords')
      {
          if ((this._filterFilledData[group].AND.array.length > 0
              && this._filterFilledData[group].AND.category !== null) || this._filterFilledData[group].Donot.length > 0
              || this._filterFilledData[group].Or.length > 0)
          {
              const eachFilters = new EachFilters();
              eachFilters.name = 'keywordsearch';
              eachFilters.type = 0;
              eachFilters.value = {};
              if (this._filterFilledData[group].AND.array.length > 0 && this._filterFilledData[group].AND.category !== null)
              {
                  eachFilters.value.ShouldContain = this._filterFilledData[group].AND.array;
                  eachFilters.value.ShouldContainCondition = this._filterFilledData[group].AND.category;
              }
              if (this._filterFilledData[group].Donot.length > 0)
              {
                  eachFilters.value.ShouldNotContain = this._filterFilledData[group].Donot;
              }
              if (this._filterFilledData[group].Or.length > 0)
              {
                  eachFilters.value.MayContain = this._filterFilledData[group].Or;
              }
              myFilter.push(eachFilters);
          }
          continue;

      }
      else if (group === 'excludeFilters')
      {
          for (const each of Object.keys(this._filterFilledData[group]))
          {
              if (each === 'myTickets' && this._filterFilledData[group][each] !== this.allAttribute[each].default
                  && this._filterFilledData[group][each] !== null) {
                  this.FilterFilledDataReply.ticketType = [this._filterFilledData[group][each]];
              }
              else if (each.indexOf('condition') !== -1)
              {
                  continue;
              }
              else if (this.notToPass.indexOf(each) > -1)
              {
                  continue;
              }
              else if (each === 'Mentions')
              {
                  const mention =
                  {
                      name: allFilterReply[this.displayNameToOgName[each]].name,
                      type: allFilterReply[this.displayNameToOgName[each]].type,
                      value: []
                  };
                  let count = 0;
                  for (const every of filterData[group][each].options)
                  {
                      if (this._filterFilledData[group][each][every.label])
                      {
                          mention.value.push(every.id);
                          count+=1;
                      }
                  }
                  if (count === 0)
                  {
                      mention.value.push(0);
                      mention.value.push(1);
                  }
                  if (mention.value.length > 0)
                  {
                      excludeFilter.push(mention);
                  }
                  continue;
              }
              else if (each === 'userActivity')
              {
                  const userActivity = {
                      name: allFilterReply[this.displayNameToOgName[each]].name,
                      type: allFilterReply[this.displayNameToOgName[each]].type,
                      value: []
                  };
                  let count = 0;
                  for (const every of filterData[group][each].options)
                  {
                      if (this._filterFilledData[group][each][every.label])
                      {
                          userActivity.value.push(every.id);
                          count+=1;
                      }
                  }
                  if (count === 0)
                  {
                      userActivity.value.push(0);
                      userActivity.value.push(1);
                  }
                  if (userActivity.value.length > 0)
                  {
                      excludeFilter.push(userActivity);
                  }
                  continue;
              }
              else if (each === 'brandActivity')
              {
                  const brandActivity = {
                      name: allFilterReply[this.displayNameToOgName[each]].name,
                      type: allFilterReply[this.displayNameToOgName[each]].type,
                      value: []
                  };
                  for (const every of filterData[group][each].options)
                  {
                      if (this._filterFilledData[group][each][every.label])
                      {
                          brandActivity.value.push(every.id);
                      }
                  }
                  if (brandActivity.value.length > 0)
                  {
                      excludeFilter.push(brandActivity);
                  }
                  continue;
              }
              else if (each === 'Channel')
              {
                  if (this._filterFilledData[group][each]?.length > 0)
                  {
                      const channelgroup = {
                          name: allFilterReply[this.displayNameToOgName[each]].gname,
                          type: allFilterReply[this.displayNameToOgName[each]].type,
                          value: []
                      };
                      const channeltype = {
                          name: allFilterReply[this.displayNameToOgName[each]].tname,
                          type: allFilterReply[this.displayNameToOgName[each]].type,
                          value: []
                      };
                      for (const each1 of Object.keys(this._filterFilledData[group][each]))
                      {
                          if (this._filterFilledData[group][each][each1].level === 0)
                          {
                              channelgroup.value.push(this.fetchedChannelgroupnameid
                                  [this._filterFilledData[group][each][each1].item]);
                          }
                          if (this._filterFilledData[group][each][each1].level === 1)
                          {
                              channeltype.value.push(this.fetchedChanneltypenameid[this._filterFilledData[group][each][each1].item]);
                          }
                      }
                      excludeFilter.push(channelgroup);
                      excludeFilter.push(channeltype);
                  }
                  continue;
              }
              else if (each === 'Category')
              {
                  if (this._filterFilledData[group][each]?.length > 0)
                  {
                      const category = {
                          name: allFilterReply[this.displayNameToOgName[each]].TicketsCname,
                          type: allFilterReply[this.displayNameToOgName[each]].type,
                          value: []
                      };
                      const department = {
                          name: allFilterReply[this.displayNameToOgName[each]].TicketsDname,
                          type: allFilterReply[this.displayNameToOgName[each]].type,
                          value: []
                      };
                      const subCategory = {
                          name: allFilterReply[this.displayNameToOgName[each]].TicketsSname,
                          type: allFilterReply[this.displayNameToOgName[each]].type,
                          value: []
                      };
                      if (this._filterFilledData[group][each + 'condition'])
                      {
                          category.name = allFilterReply[this.displayNameToOgName[each]].TicketsCname;
                          department.name = allFilterReply[this.displayNameToOgName[each]].TicketsDname;
                          subCategory.name = allFilterReply[this.displayNameToOgName[each]].TicketsSname;
                      }
                      else
                      {
                          category.name = allFilterReply[this.displayNameToOgName[each]].MentionCname;
                          department.name = allFilterReply[this.displayNameToOgName[each]].MentionDname;
                          subCategory.name = allFilterReply[this.displayNameToOgName[each]].MentionSname;
                      }
                      for (const each1 of Object.keys(this._filterFilledData[group][each]))
                      {
                          if (this._filterFilledData[group][each][each1].level === 0)
                          {
                              category.value.push(this.fetchedCategoryDatacategory[this._filterFilledData[group][each][each1].item]);
                          }
                          if (this._filterFilledData[group][each][each1].level === 1)
                          {
                              department.value.push(
                                  this.fetchedCategoryDatadepartment[this._filterFilledData[group][each][each1].item]);
                          }
                          if (this._filterFilledData[group][each][each1].level === 2)
                          {
                              subCategory.value.push(this.fetchedChanneltypenameid[this._filterFilledData[group][each][each1].item]);
                          }
                      }
                      if (category.value.length > 0)
                      {
                          excludeFilter.push(category);
                      }
                      if (department.value.length > 0)
                      {
                          excludeFilter.push(department);
                      }
                      if (subCategory.value.length > 0)
                      {
                          excludeFilter.push(subCategory);
                      }
                  }
                  continue;
              }
              else if (each === 'Upper Category')
              {
                  if (this._filterFilledData[group][each] && this._filterFilledData[group][each]
                      !== this.allAttribute[each].default
                      && this._filterFilledData[group][each] !== null)
                  {
                      const upperCategory = {
                          name: allFilterReply[this.displayNameToOgName[each]].Ticketsname,
                          type: allFilterReply[this.displayNameToOgName[each]].type,
                          value: this._filterFilledData[group][each]
                      };
                      if (this._filterFilledData[group][each + 'condition'])
                      {
                          upperCategory.name = allFilterReply[this.displayNameToOgName[each]].Ticketsname;
                      }
                      else
                      {
                          upperCategory.name = allFilterReply[this.displayNameToOgName[each]].Mentionname;
                      }
                      excludeFilter.push(upperCategory);
                  }
                  continue;
              }
              else if (this._filterFilledData[group][each]
                  !== this.allAttribute[each].default && this._filterFilledData[group][each]
                  !== null)
              {
                  if (Array.isArray(this._filterFilledData[group][each]))
                  {
                      if (this._filterFilledData[group][each].length < 1 ||  this._filterFilledData[group][each][0] == null)
                      {
                          continue;
                      }
                  }
                  const eachFilters = new EachFilters();
                  eachFilters.name = allFilterReply[this.displayNameToOgName[each]].name;
                  eachFilters.type = allFilterReply[this.displayNameToOgName[each]].type;
                  if (each === 'Social Profile') {
                      const value = [];
                      for (const eachbtaid of this._filterFilledData[group][each]) {
                          if (eachbtaid === 'All')
                          {
                              continue;
                          }
                          const eachval = this.fetchedSocialProfile.find(b => b.btaid === eachbtaid);
                          const eachSocialProfile = new SocialProfileValue();
                          eachSocialProfile.BrandID = eachval.brandID;
                          eachSocialProfile.ChannelGroupID = eachval.channelGroupID;
                          eachSocialProfile.BTAID = eachval.btaid;
                          value.push(eachSocialProfile);
                      }
                      eachFilters.value = value;
                  }
                  else
                  {
                      eachFilters.value = this._filterFilledData[group][each];
                  }
                  excludeFilter.push(eachFilters);
              }
          }
      }
      else
      {
          // Basic Filter
          for (const each of Object.keys(this._filterFilledData[group]))
          {
              if (each === 'myTickets'
                  && this._filterFilledData[group][each] !== null) {
                  this.FilterFilledDataReply.ticketType = [this._filterFilledData[group][each]];
              }
              else if (each === 'whatToMonitor')
              {
                  this.FilterFilledDataReply.postsType = this._filterFilledData[group][each];
              }
              else if (each === 'refreshTime')
              {
                  if (isNaN(+this._filterFilledData[group][each]))
                  {
                      // Still not decided how to do
                  }
                  else
                  {
                      setTimeout(() => {
                          // this.ApplyFilter();
                      }, +this._filterFilledData[group][each]);
                  }
              }
              else if (this.notToPass.indexOf(each) > -1)
              {
                  continue;
              }
              else if (each === 'Mentions')
              {
                  const mention =
                  {
                      name: allFilterReply[each].name,
                      type: allFilterReply[each].type,
                      value: []
                  };
                  for (const every of filterData[group][each].options)
                  {
                      if (this._filterFilledData[group][each][every.label])
                      {
                          mention.value.push(every.id);
                      }
                  }
                  if (mention.value.length > 0)
                  {
                      myFilter.push(mention);
                  }
                  continue;
              }
              else if (each === 'userActivity')
              {
                  const userActivity = {
                      name: allFilterReply[each].name,
                      type: allFilterReply[each].type,
                      value: []
                  };
                  for (const every of filterData[group][each].options)
                  {
                      if (this._filterFilledData[group][each][every.label])
                      {
                          userActivity.value.push(every.id);
                      }
                  }
                  if (userActivity.value.length > 0)
                  {
                      myFilter.push(userActivity);
                  }
                  continue;
              }
              else if (each === 'brandActivity')
              {
                  const brandActivity = {
                      name: allFilterReply[each].name,
                      type: allFilterReply[each].type,
                      value: []
                  };
                  for (const every of filterData[group][each].options)
                  {
                      if (this._filterFilledData[group][each][every.label])
                      {
                          brandActivity.value.push(every.id);
                      }
                  }
                  if (brandActivity.value.length > 0)
                  {
                      myFilter.push(brandActivity);
                  }
                  continue;
              }
              else if (each === 'Channel')
              {
                  if (this._filterFilledData[group][each]?.length > 0)
                  {
                      const channelgroup = {
                          name: allFilterReply[each].gname,
                          type: allFilterReply[each].type,
                          value: []
                      };
                      const channeltype = {
                          name: allFilterReply[each].tname,
                          type: allFilterReply[each].type,
                          value: []
                      };
                      for (const each1 of Object.keys(this._filterFilledData[group][each]))
                      {
                          if (this._filterFilledData[group][each][each1].level === 0)
                          {
                              channelgroup.value.push(this.fetchedChannelgroupnameid
                                  [this._filterFilledData[group][each][each1].item]);
                          }
                          if (this._filterFilledData[group][each][each1].level === 1)
                          {
                              channeltype.value.push(this.fetchedChanneltypenameid[this._filterFilledData[group][each][each1].item]);
                          }
                      }
                      myFilter.push(channelgroup);
                      myFilter.push(channeltype);
                  }
                  continue;
              }
              else if (each === 'Category')
              {
                  if (this._filterFilledData[group][each]?.length > 0)
                  {
                      const category = {
                          name: allFilterReply[each].TicketsCname,
                          type: allFilterReply[each].type,
                          value: []
                      };
                      const department = {
                          name: allFilterReply[each].TicketsDname,
                          type: allFilterReply[each].type,
                          value: []
                      };
                      const subCategory = {
                          name: allFilterReply[each].TicketsSname,
                          type: allFilterReply[each].type,
                          value: []
                      };
                      if (this._filterFilledData[group][each + 'condition'])
                      {
                          category.name = allFilterReply[each].TicketsCname;
                          department.name = allFilterReply[each].TicketsDname;
                          subCategory.name = allFilterReply[each].TicketsSname;
                      }
                      else
                      {
                          category.name = allFilterReply[each].MentionCname;
                          department.name = allFilterReply[each].MentionDname;
                          subCategory.name = allFilterReply[each].MentionSname;
                      }
                      for (const each1 of Object.keys(this._filterFilledData[group][each]))
                      {
                          if (this._filterFilledData[group][each][each1].level === 0)
                          {
                              category.value.push(this.fetchedCategoryDatacategory[this._filterFilledData[group][each][each1].item]);
                          }
                          if (this._filterFilledData[group][each][each1].level === 1)
                          {
                              department.value.push(
                                  this.fetchedCategoryDatadepartment[this._filterFilledData[group][each][each1].item]);
                          }
                          if (this._filterFilledData[group][each][each1].level === 2)
                          {
                              subCategory.value.push
                                  (this.fetchedCategoryDatasubCategory[this._filterFilledData[group][each][each1].item]);
                          }
                      }
                      if (category.value.length > 0)
                      {
                          myFilter.push(category);
                      }
                      if (department.value.length > 0)
                      {
                          myFilter.push(department);
                      }
                      if (subCategory.value.length > 0)
                      {
                          myFilter.push(subCategory);
                      }
                  }
                  continue;
              }
              else if (each === 'upperCategory')
              {

                  if (this._filterFilledData[group][each] && this._filterFilledData[group][each]
                      !== this.filterData[group][each].default
                      && this._filterFilledData[group][each] !== null)
                  {
                      const upperCategory = {
                          name: allFilterReply[each].Ticketsname,
                          type: allFilterReply[each].type,
                          value: this._filterFilledData[group][each]
                      };
                      if (this._filterFilledData[group][each + 'condition'])
                      {
                          upperCategory.name = allFilterReply[each].Ticketsname;
                      }
                      else
                      {
                          upperCategory.name = allFilterReply[each].Mentionname;
                      }
                      myFilter.push(upperCategory);
                  }
                  continue;
              }
              else if (this._filterFilledData[group][each]
                  !== this.filterData[group][each].default && this._filterFilledData[group][each]
                  !== null)
              {
                  if (each in allFilterReply ) {
                      if (Array.isArray(this._filterFilledData[group][each]))
                      {
                          if (this._filterFilledData[group][each].length < 1 || this._filterFilledData[group][each][0] == null)
                          {
                              continue;
                          }
                      }
                      const eachFilters = new EachFilters();
                      eachFilters.name = allFilterReply[each].name;
                      eachFilters.type = allFilterReply[each].type;
                      if (each === 'socialProfile') {
                          const value = [];
                          for (const eachbtaid of this._filterFilledData[group][each]) {
                              if (eachbtaid === 'All')
                              {
                                  continue;
                              }
                              const eachval = this.fetchedSocialProfile.find(b => b.btaid === eachbtaid);
                              const eachSocialProfile = new SocialProfileValue();
                              eachSocialProfile.BrandID = eachval.brandID;
                              eachSocialProfile.ChannelGroupID = eachval.channelGroupID;
                              eachSocialProfile.BTAID = eachval.btaid;
                              value.push(eachSocialProfile);
                          }
                          eachFilters.value = value;
                      }
                      else {
                          eachFilters.value = this._filterFilledData[group][each];
                      }
                      myFilter.push(eachFilters);
                  }
              }
          }
      }
  }
  this.FilterFilledDataReply.categoryID = 0;
  this.FilterFilledDataReply.brands = brandInfo;
  this.FilterFilledDataReply.categoryName = 'string';
  this.FilterFilledDataReply.startDateEpoch = startDateEpcoh1;
  this.FilterFilledDataReply.endDateEpoch = endDateEpoch1;
  this.FilterFilledDataReply.isCustom = isCustom;
  this.FilterFilledDataReply.userID = 0;
  this.FilterFilledDataReply.userRole = 4;
  this.FilterFilledDataReply.filters = myFilter,
  this.FilterFilledDataReply.notFilters = excludeFilter;
  this.FilterFilledDataReply.isAdvance = false;
  this.FilterFilledDataReply.query = 'string';

  if (((this.filterForm.get('ticketsMentions') as FormGroup).get('whatToMonitor') as FormControl).value === 1)
  {
      this.FilterFilledDataReply.orderBYColumn =
          ticketMentionDropdown.sortBy[this._postOptionService.optionForm.controls.sortBy.value].mention;
  }
  else
  {
      this.FilterFilledDataReply.orderBYColumn =
      ticketMentionDropdown.sortBy[this._postOptionService.optionForm.controls.sortBy.value].ticket;
  }
  this.FilterFilledDataReply.orderBY =
      ticketMentionDropdown.sortOrder.value[+this._postOptionService.optionForm.controls.sortOrder.value];
  this.FilterFilledDataReply.isRawOrderBy = false;
  this.FilterFilledDataReply.oFFSET = 0;
  this.FilterFilledDataReply.noOfRows = 10;
  this._filterService.FilterFilledDataReply = this.FilterFilledDataReply;
  this.callFilterCountAPI(this.FilterFilledDataReply);
}

callFilterCountAPI(body): void
{
        this._mainService.GetTicketsCount(body).subscribe
        (
            resData => { this.filterCount = resData; }
        );
}

ApplyFilter(): void
    {
        this._filterService.currentBrandSource.next(true);
        this._filterService.filterTabSource.next(this._navigationService.currentSelectedTab);
    }

    searchInFilter(value: string): void
    {
        this.FilterFilledDataReply.SimpleSearch = value;
        this._filterService.FilterFilledDataReply = this.FilterFilledDataReply;
        this.ApplyFilter();
    }

    togleActionable(value: boolean): void
    {
        ((this.filterForm.get('ticketsMentions') as FormGroup).get('userActivity') as FormControl).get('Actionable').patchValue(value);
        this.getFilled(this.filterForm.value, true);
    }

    togleNonActionable(value: boolean): void
    {
        ((this.filterForm.get('ticketsMentions') as FormGroup).get('userActivity') as FormControl).get('Non Actionable').patchValue(value);
        this.getFilled(this.filterForm.value, true);
    }

    togleBrandPost(value: boolean): void
    {
        ((this.filterForm.get('ticketsMentions') as FormGroup).get('brandActivity') as FormControl).get('Brand Post').patchValue(value);
        this.getFilled(this.filterForm.value, true);
    }

    togleBrandReplies(value: boolean): void
    {
        ((this.filterForm.get('ticketsMentions') as FormGroup).get('brandActivity') as FormControl).get('Brand Replies').patchValue(value);
        this.getFilled(this.filterForm.value, true);
    }

    public applyabouttobreach(): void
    {
        // do it here
        this.generateForms();
        ((this.filterForm.get('ticketsMentions') as FormGroup).get('TAT') as FormControl).patchValue(1);
        this.getFilled(this.filterForm.value, false);
    }

    callTabEvent(tabevent: TabEvent): void {
      if (tabevent.event === FilterEvents.searchInFilter)
      {
        this.searchInFilter(tabevent.value);
      }
      else if (tabevent.event === FilterEvents.togleActionable)
      {
        this.togleActionable(tabevent.value);
      }
      else if (tabevent.event === FilterEvents.togleNonActionable)
      {
        this.togleNonActionable(tabevent.value);
      }
      else if (tabevent.event === FilterEvents.togleBrandPost)
      {
        this.togleBrandPost(tabevent.value);
      }
      else if (tabevent.event === FilterEvents.togleBrandReplies)
      {
        this.togleBrandReplies(tabevent.value);
      }
      else if (tabevent.event === FilterEvents.applyabouttobreach)
      {
        this.applyabouttobreach();
      }

    }


}
