import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mockAreas } from '../data/tickets.mock';

@Injectable({
  providedIn: 'root'
})
export class MockAreaService {
  getAllAreas(): Observable<any[]> {
    return of(mockAreas);
  }
} 