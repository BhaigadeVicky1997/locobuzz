import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { locobuzzAnimations } from '@locobuzz/animations';
import { DashboardService } from 'app/analytics/services/dashboard.service';
import { DIYTemplateCategory } from 'app/core/models/analytics/DIYTemplateCategory';
import { DIYTemplate, DIYTemplateParams, DIYTemplateStore, TemplateFormSort } from 'app/core/models/analytics/DIYTemplates';
import { SelectbrandWizardComponent } from '../selectbrand-wizard/selectbrand-wizard.component';
import { ModalService } from './../../../shared/services/modal.service';
@Component({
  selector: 'app-select-dashboard',
  templateUrl: './select-dashboard.component.html',
  styleUrls: ['./select-dashboard.component.scss'],
  animations: locobuzzAnimations
})
export class SelectDashboardComponent implements OnInit {

  constructor(
    private _modalService: ModalService,
    private _dialog: MatDialog,
    private _dashboardService: DashboardService
    ) { }
  hideSearch: boolean = true;
  TemplateCategory: DIYTemplateCategory[] = [];
  dIYTemplateStore: DIYTemplateStore[] = [];
  currentTemplates: DIYTemplate[] = [];
  dIYTemplateParams: DIYTemplateParams;
  pagerCount = 0;
  searchBoxVal = '';
  selectedCategory = 0;
  sortForm: FormGroup;
  ngOnInit(): void {
    this.generateForms();
    this.initializeComponent();
  }

  generateForms(): void
  {
      this.sortForm = new FormGroup({});
      this.sortForm.addControl('sortBy', new FormControl(TemplateFormSort.sortBy.default));
      this.sortForm.addControl('sortOrder', new FormControl(TemplateFormSort.sortOrder.default));
  }

  initializeComponent(): void {
    this.sortForm.valueChanges.subscribe((val) => {
      console.log(this.sortForm.value);
      this.dIYTemplateParams.OrderBY = `${this.sortForm.value.sortBy} ${this.sortForm.value.sortOrder}`;
      this.callDIYTemplates(this.dIYTemplateParams);
    });
    this.getDIYTemplateCategotries();
    this.getDIYTemplates(0);
  }

  getDIYTemplateCategotries(): void {
    this._dashboardService.getDIYTemplateCategotries().subscribe(resp => {
      if (resp && resp.length > 0)
      {
        resp.forEach(element => {
          element.isActive = +element.templateCategoryID === 0 ? true : false;
        });
        this.TemplateCategory = resp;
        this._dashboardService.currentDashboard.categoryID = 0; // set default all
      }
    });
  }

  getDIYTemplates(categoryid: number): void {
    this.dIYTemplateParams = {
      TemplateCategory: categoryid,
      SearchQuery : '',
      OffSet: this.pagerCount,
      NoOfRows: 20
    };
    if (this.dIYTemplateStore.length > 0)
    {
      const templateindex = this.dIYTemplateStore.findIndex(obj => obj.templateCategoryID === categoryid);
      if (templateindex > -1)
      {
        this.currentTemplates = [];
        this.currentTemplates = this.dIYTemplateStore[templateindex].data;
      }
      else
      {
        this.callDIYTemplates(this.dIYTemplateParams);
      }
    }
    else
    {
      this.callDIYTemplates(this.dIYTemplateParams);
    }
  }

  callDIYTemplates(paramObj: DIYTemplateParams): void {
    this._dashboardService.getDIYTemplates(paramObj).subscribe(resp => {
      if (resp && resp.length > 0)
      {
        const templates: DIYTemplateStore = {
          templateCategoryID: paramObj.TemplateCategory,
          data: resp
        };
        this.dIYTemplateStore.push(templates);
        this.currentTemplates = [];
        this.currentTemplates = resp;
      }
      else
      {
        this.currentTemplates = [];
      }
    });
  }

  OnPageChange(event: PageEvent): void {
    console.log(event);
    this.dIYTemplateParams.OffSet = event.pageIndex * event.pageSize;
    if (event.pageIndex !== event.previousPageIndex) {
      this.callDIYTemplates(this.dIYTemplateParams);
    }
  }

  search(): void {
    if (this.hideSearch === false)
    {
      // if (this.searchBoxVal.trim())
      // {
        const categoryId = this.dIYTemplateParams.TemplateCategory;
        this.dIYTemplateParams = {
          TemplateCategory: categoryId,
          SearchQuery : this.searchBoxVal,
          OffSet: 0,
          NoOfRows: 20
        };
        this.callDIYTemplates(this.dIYTemplateParams);
      // }
    }
    this.hideSearch = false;
  }

  getDIYTemplatesByCategory(category: number): void {
    this.selectedCategory = category;
    this._dashboardService.currentDashboard.categoryID = category;
    this.dIYTemplateParams = {
      TemplateCategory: category,
      SearchQuery : '',
      OffSet: 0,
      NoOfRows: 20
    };
    this.TemplateCategory.forEach(element => {
      element.isActive = +element.templateCategoryID === category ? true : false;
    });
    this.callDIYTemplates(this.dIYTemplateParams);
  }

  clearSearch(): void {
    this.hideSearch = true;
    this.searchBoxVal = '';
  }

  openWizard(): void {
    const sideModalConfig = this._modalService.getSideModalConfig('select-brand', ['side-modal__full']);
    this._dialog.open(SelectbrandWizardComponent, sideModalConfig);
  }

}
