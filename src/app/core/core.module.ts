import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import * as CoreComponents from './components/index';



@NgModule({
  declarations: [
    CoreComponents.LocobuzzSidebarComponent,
    CoreComponents.LayoutMainComponent,
    CoreComponents.NavigationComponent,
    CoreComponents.NavigationItemComponent,
    CoreComponents.HeaderComponent,
    CoreComponents.HeaderTabsComponent,
    CoreComponents.SavedTabsComponent,
    CoreComponents.ToolbarComponent
  ],

  imports: [
    RouterModule,
    SharedModule
  ]
})
export class CoreModule { }
