import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mockCategories } from '../data/tickets.mock';
import { Category } from '../../../interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class MockCategoryService {
  getAllCategories(): Observable<Category[]> {
    return of(mockCategories);
  }
} 