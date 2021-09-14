import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { PostDetailService } from 'app/social-inbox/services/post-detail.service';
import { FilterService } from 'app/social-inbox/services/filter.service';
import { BrandList } from 'app/shared/components/filter/filter-models/brandlist.model';
import { BaseMention } from 'app/core/models/mentions/locobuzz/BaseMention';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CrmService } from 'app/social-inbox/services/crm.service';
import { TitanRequest } from 'app/core/models/crm/TitanRequest';
import { MagmaRequest } from 'app/core/models/crm/MagmaRequest';
import { FedralRequest, FedralRequestType } from 'app/core/models/crm/FedralRequest';
import { BandhanRequest, BandhanRequestType } from 'app/core/models/crm/BandhanRequest';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-new-sr',
  templateUrl: './new-sr.component.html',
  styleUrls: ['./new-sr.component.scss']
})
export class NewSrComponent implements OnInit {
  panelOpenState = false;
  selected = '+91';
  showmobilenumber: boolean;
  showcreditcard: boolean;
  showfirstname: boolean;
  showlastname: boolean;
  showpancard: boolean;
  showemail: boolean;
  showproduct: boolean;
  showcategory: boolean;
  showsubcategory: boolean;
  showsubsubcategory: boolean;
  showconversationlog: boolean;
  showremarks: boolean;
  ticketid: string;
  showquerytype: boolean;
  showfullname: boolean;
  showcustId: boolean;
  showstorelocation: boolean;
  showdomainarea: boolean;
  showfunctionalarea: boolean;
  showcomments: boolean;
  showsource: boolean;
  showleadtype: boolean;
  showaddress: boolean;
  showcountry: boolean;
  showstate: boolean;
  showcity: boolean;
  showpostelcode: boolean;
  showtitle: boolean;
  showrequesttype: boolean;


  checkoutForm = this._formBuilder.group({
    mobilenumber: '',
    creditcard: '',
    firstname: '',
    lastname: '',
    pancard: '',
    email: '',
    product: '',
    category: '',
    subcategory: '',
    subsubcategory: '',
    conversationlog: '',
    remarks: '',
    ticketid: '',
    querytype: '',
    fullname: '',
    custId: '',
    storelocation: '',
    domainarea: [{ value: '', disabled: true }],
    functionalarea: '',
    comments: '',
    source: '',
    leadtype: '',
    address: '',
    country: '',
    state: '',
    city: '',
    postelcode: '',
    title: '',
    requesttype: new FormControl('1'),

  });

  public functionalarea = ['E-Commerce', 'Eyewear', 'Fragrance', 'Jewellery', 'Taneira', 'Unified Loyalty Program', 'Watches'];

  public domainareaArray = ['E-Commerce', 'Leads', 'Non Service', 'Outreach NPS', 'Service', 'ULP-Data Enrichment Program', 'Unified Loyalty Program', 'Smart Watches'];

  public productList = [
    { id: 1, value: 'Construction Loans' },
    { id: 2, value: 'Housing Loans' },
    { id: 3, value: 'Car Loans' },
    { id: 4, value: 'Tractor Loans' },
    { id: 5, value: 'Commercial Loans' },
    { id: 6, value: 'SME Loans' }
  ];

  public sourceList = [
    { id: 1, value: 'Website' },
    { id: 2, value: 'Social media leads' },
    { id: 3, value: 'Social media QRC' },
    { id: 4, value: 'SME-LOS' }
  ];

  public categoryList = [
    { id: '300000189881858', value: 'Block and Issue a New Card' },
    { id: '300000193108100', value: 'Complaint for ATM, NEFT & RTGS' },
    { id: '300000190701477', value: 'Cheque book Request' },
    { id: '300000189882074', value: 'Personal - Billing Dispute' },
    { id: '300000189882082', value: 'Personal - Cheque status' },
    { id: '300000189882076', value: 'Personal - Cheque status' }
  ];

  public leadList = [
    { id: 'HOUSING_LOANS', value: 'Housing loans' },
    { id: 'INSURANCE', value: 'Complaint for ATM, NEFT & RTGS' },
    { id: 'AUTO_LOANS', value: 'Auto loans' },
    { id: 'SAVING_ACCOUNT', value: 'Saving account' }
  ];

  public countryList = [{ id: 'IN', value: 'India' }];

  public statelist = [{ id: 'Karnataka', value: 'Karnataka' }];

  public cityList = [{ id: 'Bangalore', value: 'Bangalore' }];

  public drpfunctional: string;
  public drpdomain: string;

  constructor(
    private _location: Location, public dialog: MatDialog, public select: MatSelectModule,
    private _postdetailservice: PostDetailService,
    private _filterService: FilterService,
    private _formBuilder: FormBuilder,
    private _crmService: CrmService,
    private _snackBar: MatSnackBar,) {

    this.drpfunctional = this.functionalarea[0];
  }

  @Input() postData: BaseMention;
  @Input() bandhanrequest: BandhanRequest;
  @Input() fedralrequest: FedralRequest;
  @Input() titanrequest: TitanRequest;
  @Input() magmarequest: MagmaRequest;



  ngOnInit(): void {
    this.postData = this._postdetailservice.postObj;
    const postCRMdata = this._filterService.fetchedBrandData.find(
      (brand: BrandList) => +brand.brandID === this.postData.brandInfo.brandID
    );

    if (postCRMdata.crmClassName.toLowerCase() === 'bandhancrm') {
      this.bandhanrequest = this._crmService.bandhanrequest;
      this.checkoutForm.controls['firstname'].setValue(this.bandhanrequest.FirstName, '');
      this.checkoutForm.controls['lastname'].setValue(this.bandhanrequest.LastName, '');
      this.checkoutForm.controls['email'].setValue(this.bandhanrequest.EmailAddress, '');
      this.checkoutForm.controls['mobilenumber'].setValue(this.bandhanrequest.MobileNumber, '');
      this.checkoutForm.controls['conversationlog'].setValue(this.bandhanrequest.ConversationLog, '');
      this.showfirstname = true;
      this.showlastname = true;
      this.showemail = true;
      this.showmobilenumber = true;
      this.showconversationlog = true;
      this.showquerytype = true;
      this.showremarks = true;
    }
    else if (postCRMdata.crmClassName.toLowerCase() === 'fedralcrm') {
      this.fedralrequest = this._crmService.fedralrequest;
      this.checkoutForm.controls['firstname'].setValue(this.fedralrequest.FirstName, '');
      this.checkoutForm.controls['lastname'].setValue(this.fedralrequest.LastName, '');
      this.checkoutForm.controls['email'].setValue(this.fedralrequest.EmailAddress, '');
      this.checkoutForm.controls['mobilenumber'].setValue(this.fedralrequest.MobileNumber, '');
      this.checkoutForm.controls['conversationlog'].setValue(this.fedralrequest.ConversationLog, '');
      this.showfirstname = true;
      this.showlastname = true;
      this.showemail = true;
      this.showmobilenumber = true;
      this.showconversationlog = true;
      this.showcategory = true;
      this.showleadtype = false;
      this.showaddress = false;
      this.showcountry = false;
      this.showstate = false;
      this.showcity = false;
      this.showpostelcode = false;
      this.showtitle = true;
      this.showrequesttype = true;

    }
    else if (postCRMdata.crmClassName.toLowerCase() === 'titancrm') {
      this.titanrequest = this._crmService.titanrequest;
      this.checkoutForm.controls['fullname'].setValue(this.titanrequest.FullName, '');
      this.checkoutForm.controls['email'].setValue(this.titanrequest.EmailAddress, '');
      this.checkoutForm.controls['mobilenumber'].setValue(this.titanrequest.MobileNumber, '');
      this.checkoutForm.controls['conversationlog'].setValue(this.titanrequest.ConversationLog, '');
      this.checkoutForm.controls['storelocation'].setValue(this.titanrequest.StoreLocation, '');
      this.checkoutForm.controls['custId'].setValue(this.titanrequest.CustomerId, '');
      this.showfullname = true;
      this.showemail = true;
      this.showmobilenumber = true;
      this.showconversationlog = true;
      this.showquerytype = true;
      this.showstorelocation = true;
      this.showdomainarea = true;
      this.showfunctionalarea = true;
      this.showcomments = true;
      this.showcustId = true;

    }
    else if (postCRMdata.crmClassName.toLowerCase() === 'magmacrm') {
      this.magmarequest = this._crmService.magmarequest;
      this.checkoutForm.controls['firstname'].setValue(this.magmarequest.FirstName, '');
      this.checkoutForm.controls['lastname'].setValue(this.magmarequest.LastName, '');
      this.checkoutForm.controls['pancard'].setValue(this.magmarequest.PanCard, '');
      this.checkoutForm.controls['email'].setValue(this.magmarequest.EmailAddress, '');
      this.checkoutForm.controls['mobilenumber'].setValue(this.magmarequest.MobileNumber, '');
      this.checkoutForm.controls['conversationlog'].setValue(this.magmarequest.ConversationLog, '');
      this.checkoutForm.controls['product'].setValue(this.magmarequest.Product, '');
      this.checkoutForm.controls['remarks'].setValue(this.magmarequest.Remarks, '');
      this.checkoutForm.controls['source'].setValue(this.magmarequest.Source, '');
      this.showfirstname = true;
      this.showlastname = true;
      this.showpancard = true;
      this.showemail = true;
      this.showmobilenumber = true;
      this.showproduct = true;
      this.showsource = true;
      this.showconversationlog = true;
      this.showremarks = true;
    }
    // this.checkoutForm = new FormGroup({
    //   'mobilenumber' : new FormControl(this.checkoutForm.value.mobilenumber , [Validators.required, Validators.pattern('^\\s*(?:\\+?(\\d{1,3}))?[-. (]*(\\d{3})[-. )]*(\\d{3})[-. ]*(\\d{4})(?: *x(\\d+))?\\s*$')])
    // })
  }

  onSubmit(): void {
    let obj = {};
    this.checkoutForm.value.mobilenumber
    const postCRMdata = this._filterService.fetchedBrandData.find(
      (brand: BrandList) => +brand.brandID === this.postData.brandInfo.brandID
    );

    switch (postCRMdata.crmClassName.toLowerCase()) {
      case 'titancrm': {
        this.titanrequest = this._crmService.titanrequest;
        let Srrequest: TitanRequest;
        Srrequest = {
          $type: 'LocobuzzNG.Entities.Classes.Crm.BrandCrm.TitanRequest, LocobuzzNG.Entities',
          CaseSource: this.titanrequest.CaseSource,
          UserName: this.titanrequest.UserName,
          LocobuzzTicketID: this.titanrequest.LocobuzzTicketID,
          Channel: this.titanrequest.Channel,
          SubChannel: this.titanrequest.SubChannel,
          UserProfileurl: this.titanrequest.UserProfileurl,
          FollowingCount: this.titanrequest.FollowingCount,
          FollowerCount: this.titanrequest.FollowerCount,
          ConversationLog: this.checkoutForm.value.conversationlog,
          FullName: this.checkoutForm.value.fullname,
          MobileNumber: this.checkoutForm.value.mobilenumber,
          EmailAddress: this.checkoutForm.value.email,
          CustomerId: this.checkoutForm.value.custId,
          StoreLocation: this.checkoutForm.value.storelocation,
          Remarks: this.checkoutForm.value.remarks,
          QueryType: this.checkoutForm.value.querytype,
          FunctionalArea: this.checkoutForm.value.functionalarea,
          DomainArea: this.checkoutForm.value.domainarea,
          TagID: this.titanrequest.TagID,
          ChannelType: this.titanrequest.ChannelType,
          LoggedInUserEmailAddress: this.titanrequest.LoggedInUserEmailAddress,
          CreatedBy: this.titanrequest.CreatedBy,
          SrID: this.titanrequest.SrID,
          IsUserFeedback: this.titanrequest.IsUserFeedback
        };

        obj = {
          BrandInfo: this.postData.brandInfo,
          RequestJsonString: Srrequest,
          ClassName: postCRMdata.crmClassName,
          TicketStatus: this.postData.ticketInfo.status,
          ActionStatus: 0

        }
        break;
      }
      case 'magmacrm': {
        this.magmarequest = this._crmService.magmarequest;
        let Srrequest: MagmaRequest;
        Srrequest = {
          $type: 'LocobuzzNG.Entities.Classes.Crm.BrandCrm.MagmaRequest, LocobuzzNG.Entities',
          Source: this.checkoutForm.value.source,
          LocobuzzTicketID: this.magmarequest.LocobuzzTicketID,
          MobileNumber: this.checkoutForm.value.mobilenumber,
          EmailAddress: this.checkoutForm.value.email,
          FirstName: this.checkoutForm.value.firstname,
          LastName: this.checkoutForm.value.lastname,
          PanCard: this.checkoutForm.value.pancard,
          Product: this.checkoutForm.value.product,
          UCIC: this.magmarequest.UCIC,
          ConversationLog: this.checkoutForm.value.conversationlog,
          Remarks: this.checkoutForm.value.remarks,
          Channel: this.magmarequest.Channel,
          TagID: this.magmarequest.TagID,
          ChannelType: this.magmarequest.ChannelType,
          UserProfileurl: this.magmarequest.UserProfileurl,
          FollowingCount: this.magmarequest.FollowingCount,
          FollowerCount: this.magmarequest.FollowerCount,
          SubChannel: this.magmarequest.SubChannel,
          UserName: this.magmarequest.UserName,
          FullName: this.magmarequest.FullName,
          CreatedBy: this.magmarequest.CreatedBy,
          SrID: this.magmarequest.SrID,
          IsUserFeedback: this.magmarequest.IsUserFeedback,
          LoggedInUserEmailAddress: this.magmarequest.LoggedInUserEmailAddress,
          LosLeadID: this.magmarequest.LosLeadID,
          Customer: this.magmarequest.Customer,
          Disposition: this.magmarequest.Disposition,
          SubDisposition: this.magmarequest.SubDisposition,
          LeadStatus: this.magmarequest.LeadStatus,
          LeadStage: this.magmarequest.LeadStage,
          LeadSubStage: this.magmarequest.LeadSubStage,
          NewAppointmentDate: this.magmarequest.NewAppointmentDate,
          CurrentOwner: this.magmarequest.CurrentOwner,
          Owner: this.magmarequest.Owner
        };

        obj = {
          BrandInfo: this.postData.brandInfo,
          RequestJsonString: Srrequest,
          ClassName: postCRMdata.crmClassName,
          TicketStatus: this.postData.ticketInfo.status,
          ActionStatus: 0

        }
        break;
      }
      case 'fedralcrm': {
        this.fedralrequest = this._crmService.fedralrequest;
        let Srrequest: FedralRequest;
        Srrequest = {
          $type: 'LocobuzzNG.Entities.Classes.Crm.BrandCrm.FedralRequest, LocobuzzNG.Entities',
          Source: this.fedralrequest.Source,
          LocobuzzTicketID: this.fedralrequest.LocobuzzTicketID,
          MobileNumber: this.checkoutForm.value.mobilenumber,
          EmailAddress: this.checkoutForm.value.email,
          FirstName: this.checkoutForm.value.firstname,
          LastName: this.checkoutForm.value.lastname,
          Category: this.checkoutForm.value.category,
          RequestType: this.checkoutForm.value.requesttype,
          UCIC: this.fedralrequest.UCIC,
          ConversationLog: this.checkoutForm.value.conversationlog,
          Remarks: this.checkoutForm.value.remarks,
          Channel: this.fedralrequest.Channel,
          TagID: this.fedralrequest.TagID,
          ChannelType: this.fedralrequest.ChannelType,
          Severity: '',
          City: this.checkoutForm.value.city,
          State: this.checkoutForm.value.state,
          Address: this.checkoutForm.value.address,
          PostalCode: this.checkoutForm.value.postalcode,
          Country: this.checkoutForm.value.country,
          UserProfileurl: this.fedralrequest.UserProfileurl,
          FollowingCount: this.fedralrequest.FollowingCount,
          FollowerCount: this.fedralrequest.FollowerCount,
          SubChannel: this.fedralrequest.SubChannel,
          UserName: this.fedralrequest.UserName,
          FullName: this.fedralrequest.FullName,
          CreatedBy: this.fedralrequest.CreatedBy,
          SrID: this.fedralrequest.SrID,
          IsUserFeedback: this.fedralrequest.IsUserFeedback,
          LoggedInUserEmailAddress: this.fedralrequest.LoggedInUserEmailAddress,
          LosLeadID: '',
        };

        obj = {
          BrandInfo: this.postData.brandInfo,
          RequestJsonString: Srrequest,
          ClassName: postCRMdata.crmClassName,
          TicketStatus: this.postData.ticketInfo.status,
          ActionStatus: 0

        }
        break;
      }
      case 'bandhancrm': {
        this.bandhanrequest = this._crmService.bandhanrequest;
        let Srrequest: BandhanRequest;
        Srrequest = {
          $type: 'LocobuzzNG.Entities.Classes.Crm.BrandCrm.BandhanRequest, LocobuzzNG.Entities',
          UserProfileurl: this.bandhanrequest.UserProfileurl,
          FollowingCount: this.bandhanrequest.FollowingCount,
          FollowerCount: this.bandhanrequest.FollowerCount,
          LocobuzzTicketID: this.bandhanrequest.LocobuzzTicketID,
          MobileNumber: this.checkoutForm.value.mobilenumber,
          EmailAddress: this.checkoutForm.value.email,
          FirstName: this.checkoutForm.value.firstname,
          LastName: this.checkoutForm.value.lastname,
          RequestType: BandhanRequestType.Query,
          UCIC: this.bandhanrequest.UCIC,
          ConversationLog: this.checkoutForm.value.conversationlog,
          Remarks: this.checkoutForm.value.remarks,
          Channel: this.bandhanrequest.Channel,
          TagID: this.bandhanrequest.TagID,
          ChannelType: this.bandhanrequest.ChannelType,
          ProductGroup: this.bandhanrequest.ProductGroup,
          QueryType: this.checkoutForm.value.querytype,
          QueryName: this.checkoutForm.value.querytype,
          SubChannel: this.bandhanrequest.SubChannel,
          UserName: this.bandhanrequest.UserName,
          FullName: this.bandhanrequest.FullName,
          CreatedBy: this.bandhanrequest.CreatedBy,
          SrID: this.bandhanrequest.SrID,
          IsUserFeedback: this.bandhanrequest.IsUserFeedback,
          LoggedInUserEmailAddress: this.bandhanrequest.LoggedInUserEmailAddress,
          Source: this.bandhanrequest.Source,
          LosLeadID: '',
          AuthorDetails: this.bandhanrequest.AuthorDetails

        };

        obj = {
          BrandInfo: this.postData.brandInfo,
          RequestJsonString: Srrequest,
          ClassName: postCRMdata.crmClassName,
          TicketStatus: this.postData.ticketInfo.status,
          ActionStatus: 0

        }

      }
    }

    this._crmService.NoLookupCrmRequest(obj).subscribe((data) => {
      if (data.success) {
        this.checkoutForm.reset();
      }
    });
    console.log(this.checkoutForm.value);
    // if(this.checkoutForm.value.mobilenumber != (Validators.pattern('^\\s*(?:\\+?(\\d{1,3}))?[-. (]*(\\d{3})[-. )]*(\\d{3})[-. ]*(\\d{4})(?: *x(\\d+))?\\s*$'))){
    //   this._snackBar.open('Please enter 10 digits number. Not allow alphabets', 'Ok', {
    //     duration: 2000
    //   });
    //   return;
    // }
  }

  changefunction(event): void {
    this.checkoutForm.controls.domainarea.enable();
    if (event.value === 'E-Commerce') {
      this.domainareaArray = ['E-Commerce'];
    }
    else if (event.value === 'Eyewear') {
      this.domainareaArray = ['Leads', 'Non Service', 'Outreach NPS', 'Service'];
    }
    else if (event.value === 'Fragrance') {
      this.domainareaArray = ['Non Service', 'Outreach NPS', 'Service'];
    }
    else if (event.value === 'Jewellery') {
      this.domainareaArray = ['Leads', 'Non Service', 'Outreach NPS', 'Service'];
    }
    else if (event.value === 'Taneira') {
      this.domainareaArray = ['Non Service', 'Outreach NPS', 'Service'];
    }
    else if (event.value === 'Unified Loyalty Program') {
      this.domainareaArray = ['Outreach NPS', 'ULP-Data Enrichment Program', 'Unified Loyalty Program'];
    }
    else if (event.value === 'Watches') {
      this.domainareaArray = ['Leads', 'Non Service', 'Outreach NPS', 'Service', 'Smart Watches'];
    }
  }

  changeRequestType(requesttype: string): void {
    if (requesttype === '2') {
      this.showcategory = false;
      this.showleadtype = true;
      this.showaddress = true;
      this.showcountry = true;
      this.showstate = true;
      this.showcity = true;
      this.showpostelcode = true;
    }
    else {
      this.showfirstname = true;
      this.showlastname = true;
      this.showemail = true;
      this.showmobilenumber = true;
      this.showconversationlog = true;
      this.showcategory = true;
      this.showleadtype = false;
      this.showaddress = false;
      this.showcountry = false;
      this.showstate = false;
      this.showcity = false;
      this.showpostelcode = false;
      this.showtitle = true;
      this.showrequesttype = true;
    }
  }


}
