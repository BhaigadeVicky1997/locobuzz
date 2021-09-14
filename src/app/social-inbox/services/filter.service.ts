import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { allFilterReply } from 'app/app-data/allFilterReply';
import { filterData } from 'app/app-data/filter';
import { FilterEvents } from 'app/core/enums/FilterEvents';
import { FilterServiceStructure } from 'app/core/interfaces/locobuzz-navigation';
import { AuthUser } from 'app/core/interfaces/User';
import { BaseMention } from 'app/core/models/mentions/locobuzz/BaseMention';
import { Tab, TabEvent } from 'app/core/models/menu/Menu';
import { BrandInfo } from 'app/core/models/viewmodel/BrandInfo';
import { GenericFilter } from 'app/core/models/viewmodel/GenericFilter';
import { GenericRequestParameters } from 'app/core/models/viewmodel/GenericRequestParameters';
import { MyTicketsCount } from 'app/core/models/viewmodel/TicketsCount';
import { AccountService } from 'app/core/services/account.service';
import { MaplocobuzzentitiesService } from 'app/core/services/maplocobuzzentities.service';
import { NavigationService } from 'app/core/services/navigation.service';
import { environment } from 'environments/environment';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ActionStatus } from '../../shared/components/filter/filter-models/actionstatus.model';
import { AssignToList } from '../../shared/components/filter/filter-models/assign-to.model';
import { ApiReply, Brand } from '../../shared/components/filter/filter-models/brand-reply.model';
import { BrandList } from '../../shared/components/filter/filter-models/brandlist.model';
import { CategoryList } from '../../shared/components/filter/filter-models/categorylist.model';
import { ChannelList } from '../../shared/components/filter/filter-models/channelList.model';
import { Campaign } from '../../shared/components/filter/filter-models/compaign.model';
import { CountryList } from '../../shared/components/filter/filter-models/country-list.model';
import { CrmColumns } from '../../shared/components/filter/filter-models/crm-coloum.model';
import { EachFilters } from '../../shared/components/filter/filter-models/each-filter.model';
import { EachOptions, ExcludeDisplay } from '../../shared/components/filter/filter-models/excludeDisplay.model';
import { FilterData } from '../../shared/components/filter/filter-models/filterData.model';
import { FilterFilledData } from '../../shared/components/filter/filter-models/filterFilledData.model';
import { InfluencerCategory } from '../../shared/components/filter/filter-models/influence-category.model';
import { LangaugeList } from '../../shared/components/filter/filter-models/language-list.model';
import { SocialProfile } from '../../shared/components/filter/filter-models/social-profile.model';
import { SocialProfileValue } from '../../shared/components/filter/filter-models/socialProfile.model';
import { SsreStatus } from '../../shared/components/filter/filter-models/ssrestatus.model';
import { UpperCategory } from '../../shared/components/filter/filter-models/upper-category.model';
import { PostOptionService } from '../../shared/services/post-options.service';
import { notToPass, notToShowInExclude, ticketMentionDropdown } from './../../app-data/filter';
import { PostsType } from './../../core/models/viewmodel/GenericFilter';
import { LoaderService } from './../../shared/services/loader.service';
import { FilterConfig } from './filter.config.service';
import { MainService } from './main.service';





@Injectable({
    providedIn: 'root'
})
export class FilterService implements FilterServiceStructure {

    filterForm = new FormGroup({});
    public _filterFilledData: FilterFilledData;
    filterData: FilterData = filterData;
    filterEmptyForm: FormGroup;


    notToPass: string[];
    notToShowInExclude: string[];

    selectedTabIndex: number = 0;
    // Exclude Filter Options and data:
    excludeOptions: Array<any>;
    allAttribute: any;
    allAttributeForAdvance: any;
    displayNameToOgName: {};

    // For Channel
    fetchedChannelData: ChannelList[];
    fetchedChannelDisplayData: {};
    fetchedChannelgroupnameid: {};
    fetchedChannelgroupidname: {};
    fetchedChanneltypenameid: {};
    fetchedChanneltypeidname: {};

    excludeDisplay: ExcludeDisplay;
    excludeFiltersForm: FormGroup;

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
    durationlabel: string = 'Last Two Days';
    FilterFilledDataReply: ApiReply;
    filterCount: MyTicketsCount;

    brandreplyAll: Brand[];

    filtersUniqueData: [];

    // API LINK
    channelConfigUrl = '/Tickets/GetChannelList';
    categoryListConfigUrl = '/Tickets/GetCategoriesList';
    brandConfigUrl = '/Tickets/GetBrandList';
    filterBasicConfigUrl = '/Tickets/GetFilters';
    filterCountConfigUrl = '/Tickets/GetTicketTabsCount';

    selectedBrands: FormGroup;

    private isFetched: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    currentBrandSource = new BehaviorSubject<boolean>(false);
    currentBrandListFirstCall = new BehaviorSubject<boolean>(false);
    filterTabSource = new BehaviorSubject<Tab>(null);
    saveAndApply  = false;
    currentCountData = new BehaviorSubject<any>(null);
    ascDescFilterOpt = new BehaviorSubject<any>(null);
    setSearch = new BehaviorSubject<any>(null);
    closeFilterModal = new BehaviorSubject<boolean>(true);
    // to indicate which filter to call based on tabs
    filterTab = new BehaviorSubject<TabEvent>(null);
    filterApiSuccessFull = new BehaviorSubject<boolean>(false);

    constructor(private _filterConfig: FilterConfig,
                private _locobuzzEntitiesService: MaplocobuzzentitiesService, private _LoaderService: LoaderService,
                private accountService: AccountService,
                private _mainService: MainService,
                private _postOptionService: PostOptionService,
                private _navigationService: NavigationService,
                private _http: HttpClient) { }


    populateFilter(): void {
        let currentUser: AuthUser;
        this.notToPass = notToPass;
        this.notToShowInExclude = notToShowInExclude;
        this.accountService.currentUser$.pipe(take(1)).subscribe(user => currentUser = user);
        this.filterData.ticketsMentions.ticketsYouWantToSee.options[0].id =    currentUser.data.user.userId;
        this.callAllApis();
        this.excludeFiltersForm = new FormGroup({});
        this.filterForm = this.generateForms();

        this._postOptionService.optionForm.valueChanges.subscribe((val) => {
            this.getFilled(this.filterForm.value, false);
            this.ascDescFilterOpt.next(JSON.stringify(this.getGenericFilter()));
        });
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

    callAllApis(): void {
        this.fillBrandList(true);
    }

    // get form filled data.
    getFilled(filterFilledData: FilterFilledData, isForCount: boolean, callextraapi = true): void {
        this._filterFilledData = filterFilledData;
        this.fillAllFilterReply();
        if (!isForCount && callextraapi)
        {
        this.currentBrandSource.next(true);
        this.filterTabSource.next(this._navigationService.currentSelectedTab);
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
                const brandAllData = this.fetchedBrandData.find(b => b.brandID === value);
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
            // this.fillCategoryList(this.FilterFilledDataReply);
            this.fillFilterBasicList(this.FilterFilledDataReply, false);
            this.callFilterCountAPI(this.FilterFilledDataReply);
        }
    }


    onlyDurationSelected(startDate, endDate): void {
        this.readyForFilterStartApi(this.brandreplyAll, startDate, endDate);
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

    fillBrandList(firstcall = false): void {
        this._filterConfig.postData(this.brandConfigUrl, {}).subscribe(resData => {
            this._LoaderService.toggleMainLoader(false);
            const data = JSON.stringify(resData);
            this.fetchedBrandData = JSON.parse(data).data;
            const options = [];
            const brandreply = [];
            // tslint:disable-next-line: forin
            for (const each in this.fetchedBrandData) {
                options.push({ id: this.fetchedBrandData[each].brandID, label: this.fetchedBrandData[each].brandName });
                // Brand data to be send
                const brand = new Brand();
                brand.brandID = Number(this.fetchedBrandData[each].brandID);
                brand.brandName = this.fetchedBrandData[each].brandName;
                brand.categoryGroupID = Number(this.fetchedBrandData[each].categoryGroupID);
                brand.mainBrandID = Number(this.fetchedBrandData[each].brandID),
                brand.compititionBrandIDs = [];
                brand.brandFriendlyName = this.fetchedBrandData[each].brandFriendlyName,
                brand.brandLogo = '';
                brand.isBrandworkFlowEnabled = this.fetchedBrandData[each].isBrandworkFlowEnabled;
                brand.brandGroupName = '';
                brandreply.push(brand);
            }
            // Advance setting
            this.filterData.brandDateDuration.selectBrand.options = options;
            this.durationsOptions = this.filterData.brandDateDuration.Duration.options;



            if ((this.filterForm.get('brandDateDuration') as FormGroup).get('selectBrand').value === null)
            {
                (this.filterForm.get('brandDateDuration') as FormGroup).get('selectBrand')
                    .patchValue([...this.filterData.brandDateDuration.selectBrand.options.map(item => item.id), 'All']);
            }

            this.brandOptions = options;
            this.brandreplyAll = brandreply;
            this.readyForFilterStartApi(brandreply, this.filterForm.controls.brandDateDuration.value.Duration.StartDate,
                this.filterForm.controls.brandDateDuration.value.Duration.EndDate, firstcall);
            // this.readyForCategoryList(brandreply, this.filterForm.controls.brandDateDuration.value.Duration.StartDate,
            //     this.filterForm.controls.brandDateDuration.value.Duration.EndDate);
            this.currentBrandSource.next(true);
            this.currentBrandListFirstCall.next(true);
        });
    }

    // getBrandList(): Observable<BrandList[]> {
    //     this._filterConfig.postData(this.brandConfigUrl, {}).subscribe(resData => {
    //         const data = JSON.stringify(resData);
    //         this.fetchedBrandData = JSON.parse(data).data;
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

    getBasicFiltersList(keyObj): Observable<any> {
        return this._http.post(
            environment.baseUrl + '/Tickets/GetFilters',
            keyObj
          ).pipe(
            map(response => {
              return response;
            })
          );
    }

    fillFilterBasicList(body: ApiReply, firstcall = false): void {
        let data = JSON.stringify(body);
        this._filterConfig.postData(this.filterBasicConfigUrl, body).subscribe(resData => {
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
            this.fillCategoryList(body);
            if (firstcall)
            {
                this.filterTabSource.next(this._navigationService.currentSelectedTab);
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
        this._filterConfig.postData(this.categoryListConfigUrl, body).subscribe(resData => {
            const data = JSON.stringify(resData);
            this.filterApiSuccessFull.next(true);
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
        });
    }

    getCategoryList(keyObj): Observable<any> {
        return this._http.post(
            environment.baseUrl + '/Tickets/GetCategoriesList',
            keyObj
          ).pipe(
            map(response => {
              return response;
            })
          );
    }

    // Start the ChecklistFlag
    // Observable to inform that Data is availabel and ready to display
    getValue(): Observable<boolean> {
        return this.isFetched.asObservable();
    }
    setValue(newValue: boolean): void {
        this.isFetched.next(newValue);
    }

    fillAllFilterReply(): void {
        this.FilterFilledDataReply = new ApiReply();
        const brandInfo: BrandInfo[] = [];
        for (const value of this._filterFilledData.brandDateDuration.selectBrand) {
            const searchedBrand = this.fetchedBrandData.find(b => b.brandID === value);
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
                                count += 1;
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
                                count += 1;
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
                                this.ApplyFilter();
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
        this.callFilterCountAPI(this.FilterFilledDataReply);
    }

    callFilterCountAPI(body): void
    {
        this._mainService.GetTicketsCount(body).subscribe
        (
            resData => { this.filterCount = resData; }
        );
    }

    public setTicketType(value: number): void
    {
        if (!this.FilterFilledDataReply)
        {
            this.FilterFilledDataReply = {};
        }
        this.FilterFilledDataReply.ticketType = [value];
        const filterjson = this.getGenericFilter();
    }

    public setMention(value1: number[]): void
    {
        const filters = [];
        for (const eachFilters of this.FilterFilledDataReply.filters)
        {
           if (eachFilters.name === 'isbrandactivity')
           {
               continue;
           }
           filters.push(eachFilters);
        }
        this.FilterFilledDataReply.filters = filters;
        const brandActivity = {
            name: allFilterReply.Mentions.name,
            type: allFilterReply.Mentions.type,
            value: value1
        };
        if (value1[0] === 2)
        {
            const filters = [];
            let count = 0;
            for (const eachFilters of this.FilterFilledDataReply.filters)
            {
                if (eachFilters.name === 'brandpostorreply')
                {
                    continue;
                }
                if (eachFilters.name === 'isactionable')
                {
                    count += 1;
                }
                filters.push(eachFilters);
            }
            if (count === 0)
            {
                filters.push({
                    name: allFilterReply.userActivity.name,
                    type: allFilterReply.userActivity.type,
                    value: allFilterReply.userActivity.value
                });
                ((this.filterForm.get('ticketsMentions') as FormGroup).get('Mentions') as FormControl).get('User Activity').patchValue(true);
                this.togleActionable(true);
                this.togleNonActionable(true);
            }
            ((this.filterForm.get('ticketsMentions') as FormGroup).get('Mentions') as FormControl).get('Brand Activity').patchValue(false);
            this.togleBrandPost(false);
            this.togleBrandReplies(false);
            this.FilterFilledDataReply.filters = filters;

        }
        else{
            const filters = [];
            let count = 0;
            for (const eachFilters of this.FilterFilledDataReply.filters)
            {
                if (eachFilters.name === 'isactionable')
                {
                    continue;
                }
                if (eachFilters.name === 'brandpostorreply')
                {
                    count += 1;
                }
                filters.push(eachFilters);
            }
            if (count === 0)
            {
                filters.push({
                    name: allFilterReply.brandActivity.name,
                    type: allFilterReply.brandActivity.type,
                    value: allFilterReply.brandActivity.value
                });
                ((this.filterForm.get('ticketsMentions') as FormGroup).get('Mentions') as FormControl).get('Brand Activity').patchValue(true);
                this.togleBrandPost(true);
                this.togleBrandReplies(true);
            }
            ((this.filterForm.get('ticketsMentions') as FormGroup).get('Mentions') as FormControl).get('User Activity').patchValue(false);
            this.togleActionable(false);
            this.togleNonActionable(false);
            this.FilterFilledDataReply.filters = filters;


        }
        this.FilterFilledDataReply.filters.push(brandActivity);
        this.getGenericFilter();

    }
    setSearchInFilter(value: string): void
    {
        this.FilterFilledDataReply.SimpleSearch = value;
    }

    getNameByID(id: number, searchin: AssignToList[]): string
    {
        for (const each of searchin)
        {
        if (id === each.agentID)
        {
            return each.agentName;
        }
        }
    }

    ApplyFilter(): void
    {
        this.currentBrandSource.next(true);
        this.filterTabSource.next(this._navigationService.currentSelectedTab);
    }


    searchInFilter(value: string): void
    {
        this.FilterFilledDataReply.SimpleSearch = value;
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
        // this.generateForms();
        // ((this.filterForm.get('ticketsMentions') as FormGroup).get('TAT') as FormControl).patchValue(1);
        // this.getFilled(this.filterForm.value, false);
        const tabevent: TabEvent = {
            tab: this._navigationService.currentSelectedTab,
            event: FilterEvents.applyabouttobreach,
            value: ''
          };
        this.filterTab.next(tabevent);
    }

    public reverseApply(saveFilter: GenericFilter, justForView: boolean = false): any
    {
        const filterForm: FormGroup = this.generateForms();
        const brandid = [];
        for (const each of saveFilter.brands)
        {
            brandid.push('' + each.brandID);
        }
        if (brandid.length > 0)
        {
            filterForm.get('brandDateDuration').get('selectBrand').patchValue(brandid);
            const eachForm = filterForm.get('brandDateDuration').get('Duration');
            // const startDate = eachForm.get('StartDate');
            // const endDate = eachForm.get('EndDate');
            // // const Duration = eachForm.get('Duration');
            // startDate.patchValue(saveFilter.startDateEpoch);
            // endDate.patchValue(saveFilter.endDateEpoch);
            const brandDateDuration = (filterForm.get('brandDateDuration') as FormGroup);
            this.fillBrandSelected(brandDateDuration);
        }
        else{
            filterForm.get('brandDateDuration').get('selectBrand').patchValue(
                [...this.filterData.brandDateDuration.selectBrand.options.map(item => item.id), 'All']);
        }
        // SET DURATION
        if (saveFilter.isCustom !== -1)
        {
            if (!saveFilter.isCustom)
            {
                saveFilter.isCustom = 2;
            }
            for (const each of filterData.brandDateDuration.Duration.options)
            {
                if (each.id === saveFilter.isCustom)
                {
                    this.durationlabel = each.label;
                }
            }
            const eachForm = filterForm.get('brandDateDuration').get('Duration');
            const startDate = eachForm.get('StartDate');
            const endDate = eachForm.get('EndDate');
            const Duration = eachForm.get('Duration');
            startDate.patchValue(moment().subtract(saveFilter.isCustom, 'days').startOf('day').utc().unix());
            endDate.patchValue(moment().endOf('day').utc().unix());
        }
        else{
            this.durationlabel = '-1';
            const eachForm = filterForm.get('brandDateDuration').get('Duration');
            const startDate = eachForm.get('StartDate');
            const endDate = eachForm.get('EndDate');
            const Duration = eachForm.get('Duration');
            startDate.patchValue(saveFilter.startDateEpoch);
            endDate.patchValue(saveFilter.endDateEpoch);
        }
        // set PostType and orderbycoloum
        if (saveFilter.postsType === PostsType.Tickets)
        {
            filterForm.get('ticketsMentions').get('whatToMonitor').patchValue(0);
            if (saveFilter.orderBYColumn === ticketMentionDropdown.sortBy.createdDate.ticket)
            {
                this._postOptionService.setSortByValue('createdDate');
            }
            if (saveFilter.orderBYColumn === ticketMentionDropdown.sortBy.lastUpdated.ticket)
            {
                this._postOptionService.setSortByValue('lastUpdated');
            }
            if (saveFilter.orderBYColumn === ticketMentionDropdown.sortBy.authorName.ticket)
            {
                this._postOptionService.setSortByValue('authorName');
            }
        }
        if (saveFilter.postsType === PostsType.Mentions)
        {
            filterForm.get('ticketsMentions').get('whatToMonitor').patchValue(1);
            if (saveFilter.orderBYColumn === ticketMentionDropdown.sortBy.createdDate.mention)
            {
                this._postOptionService.setSortByValue('createdDate');
            }
            if (saveFilter.orderBYColumn === ticketMentionDropdown.sortBy.lastUpdated.mention)
            {
                this._postOptionService.setSortByValue('lastUpdated');
            }
            if (saveFilter.orderBYColumn === ticketMentionDropdown.sortBy.authorName.mention)
            {
                this._postOptionService.setSortByValue('authorName');
            }
        }
        // Set order by asc or dsc
        if (saveFilter.orderBY === 'asc')
        {
            this._postOptionService.setSortOrderValue('0');
        }
        else
        {
            this._postOptionService.setSortOrderValue('1');
        }
        // Set Search BY observable
        this.setSearch.next(saveFilter.simpleSearch);
        for (const key of Object.keys(this.filterData))
        {
            if (key === 'excludeFilters' || key === 'brandDateDuration') {
                continue;
            }
            if (key === 'Keywords')
            {
                const formGroup = filterForm.get(key);
                for (const attribute of saveFilter.filters)
                {
                    if (attribute.name === 'keywordsearch')
                    {
                        const value  = attribute.value;

                        if (value.ShouldContain.length > 0)
                        {
                            const formAttri = formGroup.get('AND').get('array');
                            formAttri.patchValue(value.ShouldContain);
                            const formAttriCondition = formGroup.get('AND').get('category');
                            formAttriCondition.patchValue(value.ShouldContainCondition);
                        }
                        if (value.MayContain.length > 0)
                        {
                            const formAttri = formGroup.get('Or');
                            formAttri.patchValue(value.MayContain);
                        }
                        if (value.ShouldNotContain.length > 0)
                        {
                            const formAttri = formGroup.get('Donot');
                            formAttri.patchValue(value.ShouldNotContain);
                        }
                    }
                }
                continue;
            }
            const value = this.filterData[key];
            const formGroup = filterForm.get(key);
            // filling form group
            for (const key1 of Object.keys(value))
            {
                if (key1 === 'displayName' || key1 === 'refreshTime') {
                    continue;
                }
                const value1 = formGroup.get(key1);
                const find = allFilterReply[key1];
                // if (find === null)
                // {

                // }
                if (key1 === 'myTickets'){
                    if (saveFilter.ticketType.length > 0)
                    {
                        value1.patchValue(saveFilter.ticketType[0]);
                    }
                    else{
                        value1.patchValue(4);
                    }
                    continue;
                }
                for (const attribute of saveFilter.filters)
                {
                    if  (key1 === 'brandActivity')
                    {
                        if (find.name === attribute.name)
                        {
                            const BrandReplies = value1.get('Brand Replies');
                            BrandReplies.patchValue(false);
                            const BrandPost = value1.get('Brand Post');
                            BrandPost.patchValue(false);
                            for (const num of attribute.value)
                            {
                                if (num === 0)
                                {
                                    BrandPost.patchValue(true);
                                }
                                if (num === 1)
                                {
                                    BrandReplies.patchValue(true);
                                }
                            }
                        }
                    }
                    else if  (key1 === 'userActivity')
                    {
                        if (find.name === attribute.name)
                        {
                            const Actionable = value1.get('Actionable');
                            Actionable.patchValue(false);
                            const nonActionable = value1.get('Non Actionable');
                            nonActionable.patchValue(false);
                            for (const num of attribute.value)
                            {
                                if (num === 0)
                                {
                                    nonActionable.patchValue(true);
                                }
                                if (num === 1)
                                {
                                    Actionable.patchValue(true);
                                }
                            }
                        }
                    }
                    else if  (key1 === 'Mentions')
                    {
                        if (find.name === attribute.name)
                        {
                            const userActivity = value1.get('User Activity');
                            userActivity.patchValue(false);
                            const brandActivity = value1.get('Brand Activity');
                            brandActivity.patchValue(false);
                            for (const num of attribute.value)
                            {
                                if (num === 1)
                                {
                                    brandActivity.patchValue(true);
                                }
                                if (num === 2)
                                {
                                    userActivity.patchValue(true);
                                }
                            }
                        }
                    }
                    else if (key1 === 'upperCategory')
                    {
                        // It's for Ticket
                        if (find.Ticketsname === attribute.name)
                        {
                            const value2 = formGroup.get(key1 + 'condition');
                            value2.patchValue(true);
                            value1.patchValue(attribute.value);
                        }
                        // It's for Mention
                        if (find.Mentionname === attribute.name)
                        {
                            const value2 = formGroup.get(key1 + 'condition');
                            value2.patchValue(false);
                            value1.patchValue(attribute.value);
                        }
                    }
                    // {item: "Facebook", level: 0, expandable: true}
                    else if (key1 === 'Category')
                    {
                        const categoryCondition = formGroup.get(key1 + 'condition');
                        const list = [];
                        for (const attribute of  saveFilter.filters)
                        {
                            if (find.TicketsCname === attribute.name || find.MentionCname === attribute.name)
                            {
                                if (find.TicketsCname === attribute.name)
                                {
                                    categoryCondition.patchValue(true);
                                }
                                else
                                {
                                    categoryCondition.patchValue(false);
                                }
                                for (const groupid of attribute.value)
                                {
                                    list.push(
                                    {
                                        item: this.fetchedCategoryDatacategoryidname[groupid],
                                        level: 0,
                                        expandable: true
                                    });
                                }
                            }
                            if (find.TicketsDname === attribute.name || find.MentionDname === attribute.name)
                            {
                                for (const groupid of attribute.value)
                                {
                                    list.push(
                                    {
                                        item: this.fetchedCategoryDatadepartmentidname[groupid],
                                        level: 1,
                                        expandable: false
                                    });
                                }
                            }
                            if (find.TicketsSname === attribute.name || find.MentionSname === attribute.name)
                            {
                                for (const groupid of attribute.value)
                                {
                                    list.push(
                                    {
                                        item: this.fetchedCategoryDatasubCategoryidname[groupid],
                                        level: 2,
                                        expandable: false
                                    });
                                }
                            }
                        }
                        value1.patchValue(list);
                    }
                    else if (key1 === 'Channel')
                    {
                        const list = [];
                        for (const attribute of  saveFilter.filters)
                        {
                            if (find.gname === attribute.name)
                            {
                                for (const groupid of attribute.value)
                                {
                                    list.push(
                                    {
                                        item: this.fetchedChannelgroupidname[groupid],
                                        level: 0,
                                        expandable: true
                                    });
                                }
                            }
                            if (find.tname === attribute.name)
                            {
                                for (const groupid of attribute.value)
                                {
                                    list.push(
                                    {
                                        item: this.fetchedChanneltypeidname[groupid],
                                        level: 1,
                                        expandable: false
                                    });
                                }
                            }
                        }
                        value1.patchValue(list);
                    }
                    else if (attribute.name === find.name)
                    {
                        value1.patchValue(attribute.value);
                    }

                }
            }
        }
        const excludeDisplay = {};
        const excludeFiltersForm: FormGroup = new FormGroup({});
        for (const key of Object.keys(this.filterData))
        {
            if (key === 'excludeFilters' || key === 'brandDateDuration' || key === 'Keywords') {
                continue;
            }
            const value = this.filterData[key];
            // filling form group
            for (const key1 of Object.keys(value))
            {
                if (key1 === 'displayName'
                    || key1 === 'refreshTime'
                    || key1 === 'brandActivity'
                    || key1 === 'userActivity'
                    || key1 === 'Mention') {
                    continue;
                }
                const find = allFilterReply[key1];
                // if (find === null)
                // {
                //     ;
                // }
                for (const attribute of saveFilter.notFilters)
                {
                    if (key1 === 'upperCategory')
                    {
                        // It's for Ticket
                        if (find.Ticketsname === attribute.name)
                        {
                            excludeDisplay[this.filterData[key][key1].displayName] = this.filterData[key][key1];
                            excludeFiltersForm.addControl(this.filterData[key][key1].displayName + 'condition', new FormControl(null));
                            excludeFiltersForm.addControl(this.filterData[key][key1].displayName, new FormControl(null));
                            const value1 = excludeFiltersForm.get(this.filterData[key][key1].displayName);
                            const value2 = excludeFiltersForm.get(this.filterData[key][key1].displayName + 'condition');
                            value2.patchValue(true);
                            value1.patchValue(attribute.value);
                        }
                        // It's for Mention
                        if (find.Mentionname === attribute.name)
                        {
                            excludeDisplay[this.filterData[key][key1].displayName] = this.filterData[key][key1];
                            excludeFiltersForm.addControl(this.filterData[key][key1].displayName + 'condition', new FormControl(null));
                            excludeFiltersForm.addControl(this.filterData[key][key1].displayName, new FormControl(null));
                            const value1 = excludeFiltersForm.get(this.filterData[key][key1].displayName);
                            const value2 = excludeFiltersForm.get(this.filterData[key][key1].displayName + 'condition');
                            value2.patchValue(false);
                            value1.patchValue(attribute.value);
                        }
                    }
                    // {item: "Facebook", level: 0, expandable: true}
                    else if (key1 === 'Category')
                    {
                        // excludeFiltersForm.addControl(this.filterData[key][key1].displayName + 'condition', null);
                        // excludeFiltersForm.addControl(this.filterData[key][key1].displayName, null);
                        const value1 = new FormControl(null);
                        const categoryCondition = new FormControl(true);
                        let isfill = false;
                        const list = [];
                        for (const attribute of  saveFilter.filters)
                        {
                            if (find.TicketsCname === attribute.name || find.MentionCname === attribute.name)
                            {
                                isfill = true;
                                if (find.TicketsCname === attribute.name)
                                {
                                    categoryCondition.patchValue(true);
                                }
                                else
                                {
                                    categoryCondition.patchValue(false);
                                }
                                for (const groupid of attribute.value)
                                {
                                    list.push(
                                    {
                                        item: this.fetchedCategoryDatacategoryidname[groupid],
                                        level: 0,
                                        expandable: true
                                    });
                                }
                            }
                            if (find.TicketsDname === attribute.name || find.MentionDname === attribute.name)
                            {
                                isfill = true;
                                for (const groupid of attribute.value)
                                {
                                    list.push(
                                    {
                                        item: this.fetchedCategoryDatadepartmentidname[groupid],
                                        level: 1,
                                        expandable: false
                                    });
                                }
                            }
                            if (find.TicketsSname === attribute.name || find.MentionSname === attribute.name)
                            {
                                isfill = true;
                                for (const groupid of attribute.value)
                                {
                                    list.push(
                                    {
                                        item: this.fetchedCategoryDatasubCategoryidname[groupid],
                                        level: 2,
                                        expandable: false
                                    });
                                }
                            }
                        }
                        value1.patchValue(list);
                        if (isfill)
                        {
                            excludeDisplay[this.filterData[key][key1].displayName] = this.filterData[key][key1];
                            excludeFiltersForm.addControl(this.filterData[key][key1].displayName + 'condition', categoryCondition);
                            excludeFiltersForm.addControl(this.filterData[key][key1].displayName, value1);
                        }
                    }
                    else if (key1 === 'Channel')
                    {
                        const value1 = new FormControl(null);
                        let isFill = false;
                        const list = [];
                        for (const attribute of  saveFilter.filters)
                        {
                            if (find.gname === attribute.name)
                            {
                                isFill = true;
                                for (const groupid of attribute.value)
                                {
                                    list.push(
                                    {
                                        item: this.fetchedChannelgroupidname[groupid],
                                        level: 0,
                                        expandable: true
                                    });
                                }
                            }
                            if (find.tname === attribute.name)
                            {
                                isFill = true;
                                for (const groupid of attribute.value)
                                {
                                    list.push(
                                    {
                                        item: this.fetchedChanneltypeidname[groupid],
                                        level: 1,
                                        expandable: false
                                    });
                                }
                            }
                        }
                        value1.patchValue(list);
                        if (isFill)
                        {
                            excludeDisplay[this.filterData[key][key1].displayName] = this.filterData[key][key1];
                            excludeFiltersForm.addControl(this.filterData[key][key1].displayName, value1);
                        }
                    }
                    else if (attribute.name === find.name)
                    {
                        const value1 = new FormControl(null);
                        value1.patchValue(attribute.value);
                        excludeDisplay[this.filterData[key][key1].displayName] = this.filterData[key][key1];
                        excludeFiltersForm.addControl(this.filterData[key][key1].displayName, value1);
                    }

                }
            }
        }
        const filterFromObject: FilterFilledData = filterForm.value;
        const excludeForm = excludeFiltersForm.value;
        filterFromObject.excludeFilters = excludeForm;
        if (justForView)
        {
            return filterFromObject;
        }
        else
        {
            console.log(filterForm);
            this.filterForm = filterForm;
            this.excludeFiltersForm = excludeFiltersForm;
            this.excludeDisplay = excludeDisplay;
            this.getFilled(filterFromObject, true);
        }

    }

    getGenericFilter(): GenericFilter {
        // fills the brand value from brand array
        let currentUser: AuthUser;
        this.accountService.currentUser$.pipe(take(1)).subscribe(user => currentUser = user);
        let brandInfo: BrandInfo[] = [];
        let startDateEpcoh1: number;
        let endDateEpoch1: number;
        let isCustom1: number;
        let filterArray = [];
        let notFiltersArray = [];
        let ticketType1 = [];
        let search: string = '';
        let postsType1: PostsType = PostsType.Tickets;
        if (this.FilterFilledDataReply) {
            brandInfo = this.FilterFilledDataReply.brands;
            startDateEpcoh1 = this.FilterFilledDataReply.startDateEpoch;
            endDateEpoch1 = this.FilterFilledDataReply.endDateEpoch;
            isCustom1 = this.FilterFilledDataReply.isCustom;
            filterArray = this.FilterFilledDataReply.filters;
            notFiltersArray = this.FilterFilledDataReply.notFilters;
        }
        else {
            for (const searchedBrand of this.fetchedBrandData) {
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
            startDateEpcoh1 = this.filterForm.controls.brandDateDuration.value.Duration.StartDate;
            endDateEpoch1 = this.filterForm.controls.brandDateDuration.value.Duration.EndDate;
            isCustom1 = this.filterForm.controls.brandDateDuration.value.Duration.isCustom;
        }

        if (this.FilterFilledDataReply?.ticketType)
        {
            ticketType1 = this.FilterFilledDataReply.ticketType;
        }
        if (this.FilterFilledDataReply?.postsType)
        {
            if (+this.FilterFilledDataReply.postsType === 0)
            {
                postsType1 = PostsType.Tickets;
            }
            else
            {
                postsType1 = PostsType.Mentions;
            }
        }
        if (this.FilterFilledDataReply?.SimpleSearch)
        {
            search = this.FilterFilledDataReply.SimpleSearch;
        }


        this.genericFilter = {
            categoryID: 0,
            brands: brandInfo,
            categoryName: 'string',
            startDateEpoch: startDateEpcoh1,
            endDateEpoch: endDateEpoch1,
            isCustom: isCustom1,
            userID: currentUser.data.user.userId,
            userRole: currentUser.data.user.role,
            filters: filterArray,
            notFilters: notFiltersArray,
            isAdvance: false,
            query: 'string',
            orderBYColumn: this.FilterFilledDataReply.orderBYColumn,
            orderBY: this.FilterFilledDataReply.orderBY,
            isRawOrderBy: false,
            oFFSET: 0,
            noOfRows: 10,
            ticketType: ticketType1,
            simpleSearch: search,
            postsType: postsType1
        };
        // console.log(JSON.stringify(this.genericFilter));
        // console.log('ME HERE')
        // this.reverseApply(this.genericFilter);
        return this.genericFilter;
    }

    getGenericRequestFilter(mentionObj: BaseMention): GenericRequestParameters {
        const brandInfo: BrandInfo[] = [];
        let startDateEpcoh1: number;
        let endDateEpoch1: number;
        if (this._filterFilledData && this._filterFilledData.brandDateDuration.selectBrand) {
            startDateEpcoh1 = this._filterFilledData.brandDateDuration.Duration.StartDate;
            endDateEpoch1 = this._filterFilledData.brandDateDuration.Duration.EndDate;
        }
        else {
            startDateEpcoh1 = this.filterForm.controls.brandDateDuration.value.Duration.StartDate;
            endDateEpoch1 = this.filterForm.controls.brandDateDuration.value.Duration.EndDate;
        }

        this.genericRequestParameter = {
            brandInfo: mentionObj.brandInfo,
            startDateEpcoh: startDateEpcoh1,
            endDateEpoch: endDateEpoch1,
            ticketId: mentionObj.ticketInfo.ticketID,
            tagID: mentionObj.tagID,
            to: 1,
            from: 1,
            authorId: mentionObj.author.socialId,
            author: this._locobuzzEntitiesService.mapMention(mentionObj).author,
            isActionableData: 0,
            channel: mentionObj.channelGroup,
            isPlainLogText: false,
            targetBrandName: '',
            targetBrandID: 0,
            oFFSET: 0,
            noOfRows: 10,
            isCopy: true
        };

        return this.genericRequestParameter;
    }
}
