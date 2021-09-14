
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BandhanRequest } from 'app/core/models/crm/BandhanRequest';
import { FedralRequest } from 'app/core/models/crm/FedralRequest';
import { MagmaRequest } from 'app/core/models/crm/MagmaRequest';
import { TitanRequest } from 'app/core/models/crm/TitanRequest';
import { CustomResponse } from 'app/core/models/dbmodel/TicketReplyDTO';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CrmService {



  constructor(
    private _http: HttpClient,
    private _snackBar: MatSnackBar) { }

  @Input() bandhanrequest: BandhanRequest;
  @Input() fedralrequest: FedralRequest;
  @Input() titanrequest: TitanRequest;
  @Input() magmarequest: MagmaRequest;

  NoLookupCrmRequest(keyObj): Observable<any> {
    return this._http.post<CustomResponse>(environment.baseUrl + '/Crm/NoLookupCrmRequest', keyObj).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        else {
          this._snackBar.open(response.message, 'Ok', {
            duration: 2000
          });
        }
      })
    );

  }

  GetBrandCrmRequestDetails(keyObj): Observable<any> {
    return this._http.post<CustomResponse>(environment.baseUrl + '/Crm/GetBrandCrmRequestDetails', keyObj).pipe(
      map(response => {
        if (response.success) {
          return response.data;
        }
        else {
          this._snackBar.open('Error Occurred while making mention actionable', 'Ok', {
            duration: 2000
          });
        }
      })
    );

  }
}
