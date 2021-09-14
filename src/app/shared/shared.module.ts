import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
// import { MdePopoverModule } from '@material-extended/mde';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ResponsiveAdaptDirective } from './directives/responsive-adapt.directive';
import { LocobuzzPaginatorDirective } from './directives/locobuzz-paginator.directive';
import { MatButtonLoadingDirective } from './directives/mat-button-loading.directive'
import { CustomSelectDirective } from './directives/custom-select.directive';
import { IsotopeGridDirective } from './directives/isotope-grid.directive';
import { LocobuzzPipesModule } from './pipes/pipes.module';
import { NouisliderModule } from 'ng2-nouislider';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { HighchartsChartModule } from 'highcharts-angular';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

import * as sharedComponents from './components/index';
import { ElementRendererDirective } from './directives/element-renderer.directive';
import { HoverDropdownDirective } from './directives/hover-dropdown.directive';
import { ContentcontainerDirective } from 'app/shared/directives/contentcontainer.directive';
import { IfOnDomDirective } from './directives/if-on-dom.directive';




@NgModule({
  declarations: [
    sharedComponents.SideModalComponent,
    sharedComponents.NoPageComponent,
    sharedComponents.CustomDropdownComponent,
    sharedComponents.AlertPopupComponent,
    sharedComponents.StarRatingComponent,
    sharedComponents.ComponentLoaderComponent,
    sharedComponents.ChartComponent,
    sharedComponents.ChatbotComponent,
    sharedComponents.NoNetworkComponent,
    sharedComponents.SessionExpiredComponent,
    sharedComponents.GlobalNotificationComponent,
    sharedComponents.ModalComponent,
    sharedComponents.TreeChecklistComponent,
    sharedComponents.CustomChipsComponent,
    sharedComponents.NoNetworkComponent,
    sharedComponents.SessionExpiredComponent,
    sharedComponents.SocialHandleComponent,
    sharedComponents.PostMinimalComponent,
    sharedComponents.PostSummaryComponent,
    sharedComponents.PostOptionsComponent,
    sharedComponents.PostSearchComponent,
    sharedComponents.FilterComponent,
    sharedComponents.AdvanceFilterComponent,
    sharedComponents.CustomAutoCompleteComponent,
    sharedComponents.FilterGroupComponent,
    sharedComponents.MultipleSelectComponent,
    sharedComponents.RatingComponent,
    sharedComponents.SlidderComponent,
    sharedComponents.TabcontentComponent,
    ResponsiveAdaptDirective,
    LocobuzzPaginatorDirective,
    CustomSelectDirective,
    IsotopeGridDirective,
    IsotopeGridDirective,
    MatButtonLoadingDirective,
    ElementRendererDirective,
    HoverDropdownDirective,
    ContentcontainerDirective,
    IfOnDomDirective
  ],

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    MaterialModule,
    // MdePopoverModule,
    NgxDropzoneModule,
    LocobuzzPipesModule,
    NouisliderModule,
    CKEditorModule,
    PickerModule,
    HighchartsChartModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    HttpClientModule,
    MaterialModule,
    // MdePopoverModule,
    NgxDropzoneModule,
    LocobuzzPipesModule,
    NouisliderModule,
    CKEditorModule,
    PickerModule,
    HighchartsChartModule,
    ResponsiveAdaptDirective,
    IsotopeGridDirective,
    LocobuzzPaginatorDirective,
    CustomSelectDirective,
    MatButtonLoadingDirective,
    HoverDropdownDirective,
    sharedComponents.SideModalComponent,
    sharedComponents.NoPageComponent,
    sharedComponents.CustomDropdownComponent,
    sharedComponents.AlertPopupComponent,
    sharedComponents.StarRatingComponent,
    sharedComponents.ComponentLoaderComponent,
    sharedComponents.ChartComponent,
    sharedComponents.ChatbotComponent,
    sharedComponents.SocialHandleComponent,
    sharedComponents.NoNetworkComponent,
    sharedComponents.SessionExpiredComponent,
    sharedComponents.GlobalNotificationComponent,
    sharedComponents.TreeChecklistComponent,
    sharedComponents.CustomChipsComponent,
    sharedComponents.PostMinimalComponent,
    sharedComponents.PostSummaryComponent,
    sharedComponents.PostOptionsComponent,
    sharedComponents.PostSearchComponent,
    sharedComponents.FilterComponent,
    sharedComponents.AdvanceFilterComponent,
    sharedComponents.CustomAutoCompleteComponent,
    sharedComponents.FilterGroupComponent,
    sharedComponents.MultipleSelectComponent,
    sharedComponents.RatingComponent,
    sharedComponents.SlidderComponent,
    sharedComponents.TabcontentComponent,
    ContentcontainerDirective,
    IfOnDomDirective
  ]
})
export class SharedModule { }
