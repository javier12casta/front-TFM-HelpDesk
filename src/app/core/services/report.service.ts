import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  TicketStats,
  AreaStats,
  CategoryStats,
  ReportQueryParams
} from '../interfaces/report.interface';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.baseAPI}/reports`;

  constructor(private http: HttpClient) {}

  getTicketStats(params: ReportQueryParams): Observable<TicketStats> {
    const httpParams = this.buildParams(params);
    return this.http.get<TicketStats>(`${this.apiUrl}/tickets`, { params: httpParams });
  }

  getAreaStats(params: ReportQueryParams): Observable<AreaStats[]> {
    const httpParams = this.buildParams(params);
    return this.http.get<AreaStats[]>(`${this.apiUrl}/areas`, { params: httpParams });
  }

  getCategoryStats(params: ReportQueryParams): Observable<CategoryStats[]> {
    const httpParams = this.buildParams(params);
    return this.http.get<CategoryStats[]>(`${this.apiUrl}/categories`, { params: httpParams });
  }

  downloadReport(params: ReportQueryParams): Observable<Blob> {
    const httpParams = this.buildParams(params);
    return this.http.get(`${this.apiUrl}/download`, {
      params: httpParams,
      responseType: 'blob'
    });
  }

  private buildParams(params: ReportQueryParams): HttpParams {
    let httpParams = new HttpParams();
    
    if (params.startDate) {
      httpParams = httpParams.set('startDate', params.startDate);
    }
    if (params.endDate) {
      httpParams = httpParams.set('endDate', params.endDate);
    }
    if (params.area) {
      httpParams = httpParams.set('area', params.area);
    }
    if (params.category) {
      httpParams = httpParams.set('category', params.category);
    }
    
    return httpParams;
  }
} 