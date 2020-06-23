import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as ENVIRONMENT from '../../../environments/environment';

const ENV = ENVIRONMENT.environment;

@Injectable({
  providedIn: 'root'
})
export class BasicTypeService {

  constructor(private http: HttpClient) { }

  getProperyArea(payload): Observable<any> {
    const url = ENV.FEASIBILITY_API + '/property/area';
    return this.http.post(url, payload);
  }

  getProperyProduct(payload): Observable<any> {
    const url = ENV.FEASIBILITY_API + '/property/product';
    return this.http.post(url, payload);
  }

  getProperySpendings(payload): Observable<any> {
    const url = ENV.FEASIBILITY_API + '/property/spendings';
    return this.http.post(url, payload);
  }

  getProperyImplicitCosts(payload): Observable<any> {
    const url = ENV.FEASIBILITY_API + '/property/implicit-costs';
    return this.http.post(url, payload);
  }

  getProperyProfit(payload): Observable<any> {
    const url = ENV.FEASIBILITY_API + '/property/profit';
    return this.http.post(url, payload);
  }

  getProperyRateReturn(payload): Observable<any> {
    const url = ENV.FEASIBILITY_API + '/property/ipr';
    return this.http.post(url, payload);
  }

}
