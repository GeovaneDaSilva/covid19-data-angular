import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { CaseByDate } from '../models/case-by-date';
import { ErrorHandlerService } from 'src/app/shared/services/error-handler.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CovidService {
  private readonly baseUrl = `${environment.apiUrl}/covid-19/grouped-by-earliest-positive-diagnostic-date`;

  constructor(private _http: HttpClient,private _errorHandler: ErrorHandlerService) {}

  getCovidCases(startDate: string, endDate: string, caseType?:string): Observable<CaseByDate[]> {

    let params = new HttpParams()
    .set('StartDate',startDate)
    .set('EndDate',endDate)
    if(caseType){
      params = params.set('CaseType',caseType);
    }
   return this._http.get<CaseByDate[]>(this.baseUrl,{params}).pipe(
    catchError(this._errorHandler.handleError)
   );

  }
}
