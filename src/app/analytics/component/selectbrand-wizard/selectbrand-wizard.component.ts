import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardService } from 'app/analytics/services/dashboard.service';
import { DIYDashboardDetail } from 'app/core/models/analytics/DIYDashboardDetail';
import { BrandList } from 'app/shared/components/filter/filter-models/brandlist.model';
import { FilterService } from 'app/social-inbox/services/filter.service';
import { DashboardEditorComponent } from './../dashboard/dashboard.component';

@Component({
  selector: 'app-selectbrand-wizard',
  templateUrl: './selectbrand-wizard.component.html',
  styleUrls: ['./selectbrand-wizard.component.scss']
})
export class SelectbrandWizardComponent implements OnInit {

  constructor(private _bottomSheet: MatBottomSheet,
              private _filterService: FilterService,
              private _snackBar: MatSnackBar,
              private _dashboardService: DashboardService) {}
  selectedBrandIndex: number = 0;
  brands: BrandList[] = [];
  searchBoxVal = '';
  selectedBrands: BrandList[] = [];

  ngOnInit(): void {
    const brands = this._filterService.fetchedBrandData;
    brands.forEach(brand =>
      {
        brand.isCustomActive = false;
      });
    this.brands = brands;
  }

  selectBrand(brand): void{
    if (brand.isCustomActive)
    {
      this.brands.forEach(element => {
        if (element.brandID === brand.brandID)
        {
          element.isCustomActive = false;
        }
      });
      this.selectedBrands = this.selectedBrands.filter(obj => obj.brandID !== brand.brandID);
    }
    else
    {
      this.brands.forEach(element => {
        if (element.brandID === brand.brandID)
        {
          element.isCustomActive = true;
        }
      });
      this.selectedBrands.push(brand);
    }
  }

  search(): void
  {
    if (this.searchBoxVal.trim())
    {
      if (this.brands.length === 0)
      {
        const brands = this._filterService.fetchedBrandData;
        brands.forEach(brand =>
          {
            brand.isCustomActive = false;
          });
  
        if (this.selectedBrands && this.selectedBrands.length > 0)
          {
            brands.forEach(brand =>
              {
                const index = this.selectedBrands.findIndex(obj => obj.brandID === brand.brandID);
                if (index > -1)
                {
                  brand.isCustomActive = true;
                }
              });
          }
        this.brands = brands;
      }
      this.brands = this.brands.filter(obj => {
        if (obj.brandName.toLowerCase().includes(this.searchBoxVal.trim().toLowerCase()))
        {
          return obj;
        }
      });
    }
    else
    {
      const brands = this._filterService.fetchedBrandData;
      brands.forEach(brand =>
        {
          brand.isCustomActive = false;
        });

      if (this.selectedBrands && this.selectedBrands.length > 0)
        {
          brands.forEach(brand =>
            {
              const index = this.selectedBrands.findIndex(obj => obj.brandID === brand.brandID);
              if (index > -1)
              {
                brand.isCustomActive = true;
              }
            });
        }
      this.brands = brands;
    }
  }
  openBlankDashboard(): void{
    if (this.selectedBrands && this.selectedBrands.length > 0)
    {
      const currentTemplate: DIYDashboardDetail = {
        templateID: 0,
        title: 'Untitled',
        description: '',
        isEditable: true,
        filterJson: '',
        version: 1,
        uiJson: '',
        status: 1,
        isActive: false,
        categoryID: this._dashboardService.currentDashboard.categoryID
      };

      this._dashboardService.SaveDIYDashboard(currentTemplate).subscribe(resp => {
        if (resp && resp.success)
        {
        const data = JSON.parse(JSON.stringify(resp.data));
        this._dashboardService.currentDashboard.templateID = data.TemplateID;
        this._dashboardService.currentDashboard.gUID = data.GUID;
        this._bottomSheet.open(DashboardEditorComponent, {
          panelClass: ['full-screen-bottomsheet']
        });
        }
        else{
          this._snackBar.open('Something went wrong please try again', 'Ok', {
            duration: 2000,
          });
        }
      });
    }
    else{
      this._snackBar.open('Please select any brand', 'Ok', {
        duration: 2000,
      });
    }
  }


}
