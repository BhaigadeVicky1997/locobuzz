import { NgModule } from '@angular/core';
import { Routes , RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { HighchartsChartModule } from 'highcharts-angular';

import * as SocialInboxComponents from './component/index';
import { RouteguidResolverService } from 'app/core/services/routeguid-resolver.service';
import { FilterjsonresolverService } from 'app/core/services/filterjsonresolver.service';
import { BreakComponent } from './component/break/break.component';


export const routes: Routes = [
  {
    path: '',
    component: SocialInboxComponents.PageComponent,
    resolve: {resolvedguid : RouteguidResolverService}
  },
  {
    path: ':guid',
    component: SocialInboxComponents.PageComponent,
    resolve: {resolvedjson: FilterjsonresolverService}
  }
];

@NgModule({
  declarations: [
    SocialInboxComponents.PageComponent,
    SocialInboxComponents.CategoryFilterComponent,
    SocialInboxComponents.PostComponent,
    SocialInboxComponents.PostDetailComponent,
    SocialInboxComponents.PostShortenedComponent,
    SocialInboxComponents.PostUserinfoComponent,
    SocialInboxComponents.PostReplyComponent,
    SocialInboxComponents.PostLogComponent,
    SocialInboxComponents.PostMessageComponent,
    SocialInboxComponents.PostLoaderComponent,
    SocialInboxComponents.PostAssigntoComponent,
    SocialInboxComponents.PostMarkinfluencerComponent,
    SocialInboxComponents.PostAssigntoComponent,
    SocialInboxComponents.PostBulkActionsComponent,
    SocialInboxComponents.PostEmailComponent,
    SocialInboxComponents.EnrichViewComponent,
    SocialInboxComponents.PostUserprofileComponent,
    SocialInboxComponents.UserActivitiesComponent,
    SocialInboxComponents.UserOverviewComponent,
    SocialInboxComponents.AddAssociateChannelsComponent,
    SocialInboxComponents.MediaGalleryComponent,
    SocialInboxComponents.CannedResponseComponent,
    SocialInboxComponents.SmartSuggestionComponent,
    SocialInboxComponents.MediaDropzoneComponent,
    SocialInboxComponents.MediaDropitemComponent,
    SocialInboxComponents.AssignUserDropdownComponent,
    SocialInboxComponents.PostSubscribeComponent,
    SocialInboxComponents.SendEmailComponent,
    SocialInboxComponents.TakeBreakComponent,
    SocialInboxComponents.CrmComponent,
    SocialInboxComponents.NewSrComponent,
    SocialInboxComponents.CrmCustomerComponent,
    SocialInboxComponents.CrmSrDetailsComponent,
    SocialInboxComponents.CrmFtrDetailsComponent,
    SocialInboxComponents.CrmRecomProductComponent,
    SocialInboxComponents.AttachTicketComponent,
    SocialInboxComponents.TicketConversationComponent,
    SocialInboxComponents.CopyMoveComponent,
    SocialInboxComponents.SocialboxComponent,
    SocialInboxComponents.ReplyLoaderComponent,
    SocialInboxComponents. VideoDialogComponent,
    BreakComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    HighchartsChartModule
  ],
})
export class SocialInboxModule { }
