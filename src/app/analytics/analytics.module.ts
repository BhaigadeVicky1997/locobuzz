import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { HighchartsChartModule } from 'highcharts-angular';
import * as AnalyticsComponents from './component/analyticsindex';
import { RouterModule, Routes } from '@angular/router';
import { RouteguidResolverService } from 'app/core/services/routeguid-resolver.service';
import { FilterjsonresolverService } from 'app/core/services/filterjsonresolver.service';
import { SelectbrandWizardComponent } from './component/selectbrand-wizard/selectbrand-wizard.component';
import { DashboardEditorComponent } from './component/dashboard/dashboard.component';
import { DashboardActionComponent } from './component/dashboard-action/dashboard-action.component';
import { WidgetFilterComponent } from './component/widget-filter/widget-filter.component';
import { GridsterModule } from 'angular-gridster2';

export const routes: Routes = [
  {
    path: '',
    component: AnalyticsComponents.AnalyticstabComponent,
    resolve: { resolvedguid: RouteguidResolverService },
  },
  {
    path: ':guid',
    component: AnalyticsComponents.AnalyticstabComponent,
    resolve: { resolvedjson: FilterjsonresolverService },
  },
];

@NgModule({
  declarations: [
    AnalyticsComponents.WidgetComponent,
    AnalyticsComponents.AnalyticstabComponent,
    AnalyticsComponents.WidgetboxComponent,
    AnalyticsComponents.SelectDashboardComponent,
    SelectbrandWizardComponent,
    DashboardActionComponent,
    AnalyticsComponents.SelectbrandWizardComponent,
    AnalyticsComponents.DashboardEditorComponent,
    AnalyticsComponents.WidgetContainerComponent,
    WidgetFilterComponent,
  ],
  imports: [CommonModule, SharedModule, GridsterModule, RouterModule.forChild(routes)],
  exports: [],
})
export class AnalyticsModule {}
