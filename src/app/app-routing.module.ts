import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AppComponent } from './app.component';
import * as CoreComponents from './core/components/index';
import * as sharedComponents from './shared/components/index';




const AppRoutes: Routes = [
  { path: '', component: AppComponent },
  {
    path: 'social-inbox',
    component: CoreComponents.LayoutMainComponent,
    children: [
      { path: '', redirectTo: '/social-inbox', pathMatch: 'full' },
      {
        path: '',
        loadChildren: () =>
          import('./social-inbox/social-inbox.module').then(m => m.SocialInboxModule)
      },
      {
        path: '**',
        component: sharedComponents.NoPageComponent,
      }
    ]
  },


  // {
  //   path:"",
  //   component:auth
  // },
  // {
  //   path: '**',
  //   component: CoreComponents.LayoutMainComponent,
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(AppRoutes, {
    preloadingStrategy: PreloadAllModules,
    relativeLinkResolution: 'legacy'
})],

  exports: [RouterModule]
})
export class AppRoutingModule { }

