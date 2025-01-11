import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mockTicketStats, mockAreaStats, mockCategoryStats } from '../data/reports.mock';

@Injectable({
  providedIn: 'root'
})
export class MockReportService {
  getTicketStats(): Observable<any> {
    return of(mockTicketStats);
  }

  getAreaStats(): Observable<any> {
    return of(mockAreaStats);
  }

  getCategoryStats(): Observable<any> {
    return of(mockCategoryStats);
  }

  downloadReport(): Observable<Blob> {
    return of(new Blob(['mock data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
  }
} 