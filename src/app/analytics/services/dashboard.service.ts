import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DIYDashboardDetail } from 'app/core/models/analytics/DIYDashboardDetail';
import { DIYMasterWidgets, DIYMasterWidgetsResponse } from 'app/core/models/analytics/DIYMasterWidgets';
import { DIYTemplateCategory, DIYTemplateCategoryResponse } from 'app/core/models/analytics/DIYTemplateCategory';
import { DIYTemplate, DIYTemplateResponse } from 'app/core/models/analytics/DIYTemplates';
import { DIYWidgetCategory, DIYWidgetCategoryResponse } from 'app/core/models/analytics/DIYWidgetCategory';
import { CustomResponse } from 'app/core/models/dbmodel/TicketReplyDTO';
import { DataanalyticsService } from 'app/core/services/dataanalytics.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  baseUrl = environment.baseUrl;
  currentDashboard: DIYDashboardDetail = {};

  constructor(private _http: HttpClient, public DataanalyticsService: DataanalyticsService) { }

  getDIYTemplateCategotries(): Observable<DIYTemplateCategory[]> {
    return this.DataanalyticsService.postData('/DIY/GetDIYTemplateCategotries', {}).pipe(
      map(response => {
        console.log(response);
        if (response.success) {
          return response.data;
        }
      })
    );
  }


  // getDIYTemplateCategotries(): Observable<DIYTemplateCategory[]> {
  //   return this._http.post<DIYTemplateCategoryResponse>(environment.baseUrl + '/DIY/GetDIYTemplateCategotries', {}).pipe(
  //     map(response => {
  //       if (response.success) {
  //         return response.data;
  //       }
  //     })
  //   );
  // }

  getDIYTemplates(keyObj): Observable<DIYTemplate[]> {
    return this.DataanalyticsService.postData('/DIY/GetDIYTemplates', keyObj).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
      })
    );
   
    // return this._http.post<DIYTemplateResponse>(environment.baseUrl + '/DIY/GetDIYTemplates', keyObj).pipe(
    //   map(response => {
    //     if (response.success) {
    //       return response.data;
    //     }
    //   })
    // );
    
  }

  getDIYWidgetCategotries(): Observable<DIYWidgetCategory[]> {
    
    return this.DataanalyticsService.postData('/DIY/GetDIYWidgetCategotries', {}).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
      })
    );

    // return this._http.post<DIYWidgetCategoryResponse>(environment.baseUrl + '/DIY/GetDIYWidgetCategotries', {}).pipe(
    //   map(response => {
    //     if (response.success) {
    //       return response.data;
    //     }
    //   })
    // );
  }

  getGetDIYWidgets(keyObj): Observable<DIYMasterWidgets[]> {
    return this.DataanalyticsService.postData('/DIY/GetDIYWidgets', keyObj).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
      })
    );
    
    // return this._http.post<DIYMasterWidgetsResponse>(environment.baseUrl + '/DIY/GetDIYWidgets', keyObj).pipe(
    //   map(response => {
    //     if (response.success) {
    //       return response.data;
    //     }
    //   })
    // );
  }

  SaveDIYDashboard(keyObj: DIYDashboardDetail): Observable<CustomResponse> {
    return this.DataanalyticsService.postData('/DIY/SaveDIYDashboard', keyObj).pipe(
      map(response => {
        if (response.success) {
          return response;
        }
      })
    );
   
    // return this._http.post<CustomResponse>(environment.baseUrl + '/DIY/SaveDIYDashboard', keyObj).pipe(
    //   map(response => {
    //     if (response.success) {
    //       return response;
    //     }
    //   })
    // );
  }
}
