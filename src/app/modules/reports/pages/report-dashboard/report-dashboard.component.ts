import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/material-imports';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ReportService } from '../../../../core/services/report.service';
import {
  TicketStats,
  AgentPerformance,
  CategoryDistribution,
  PriorityDistribution,
  TimeSeriesData
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
  agentPerformance?: AgentPerformance;
  categoryDistribution: CategoryDistribution[] = [];
  priorityDistribution: PriorityDistribution[] = [];
  timeSeriesData: TimeSeriesData[] = [];

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService
  ) {
    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      groupBy: ['day']
    });
  }

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    const params = this.filterForm.value;
    
    this.reportService.getTicketStats(params).subscribe(stats => {
      this.ticketStats = stats;
    });

    this.reportService.getCategoryDistribution(params).subscribe(distribution => {
      this.categoryDistribution = distribution;
    });

    this.reportService.getPriorityDistribution(params).subscribe(distribution => {
      this.priorityDistribution = distribution;
    });

    this.reportService.getTimeSeriesData(params).subscribe(data => {
      this.timeSeriesData = data;
    });
  }

  onFilterChange() {
    this.loadReports();
  }

  downloadReport() {
    // Implementar lógica para descargar reporte
  }
} 