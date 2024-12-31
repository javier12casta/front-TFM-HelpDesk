import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/material-imports';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ReportService } from '../../../../core/services/report.service';
import { AreaService } from '../../../../core/services/area.service';
import { CategoryService } from '../../../../core/services/category.service';
import {
  TicketStats,
  AreaStats,
  CategoryStats
} from '../../../../core/interfaces/report.interface';

@Component({
  selector: 'app-report-dashboard',
  templateUrl: './report-dashboard.component.html',
  styleUrls: ['./report-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule]
})
export class ReportDashboardComponent implements OnInit {
  filterForm: FormGroup;
  ticketStats?: TicketStats;
  areaStats: AreaStats[] = [];
  categoryStats: CategoryStats[] = [];
  areas: any[] = [];
  categories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private areaService: AreaService,
    private categoryService: CategoryService
  ) {
    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      area: [''],
      category: ['']
    });
  }

  ngOnInit() {
    this.loadAreas();
    this.loadCategories();
    this.loadReports();
  }

  loadAreas() {
    this.areaService.getAllAreas().subscribe((areas: any) => {
      this.areas = areas;
    });
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe((categories: any) => {
      this.categories = categories;
    });
  }

  loadReports() {
    const params = this.filterForm.value;
    
    this.reportService.getTicketStats(params).subscribe(stats => {
      this.ticketStats = stats;
    });

    this.reportService.getAreaStats(params).subscribe(stats => {
      this.areaStats = stats;
    });

    this.reportService.getCategoryStats(params).subscribe(stats => {
      this.categoryStats = stats;
    });
  }

  onFilterChange() {
    this.loadReports();
  }

  downloadReport() {
    const params = this.filterForm.value;
    this.reportService.downloadReport(params).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-tickets-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  }
} 