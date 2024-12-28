import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/material-imports';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ReportService } from '../../../../core/services/report.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule, NgxChartsModule]
})
export class DashboardComponent implements OnInit {
  // Datos para las gráficas
  categoryData: any[] = [];
  priorityData: any[] = [];
  timeSeriesData: any[] = [];

  // Opciones de las gráficas
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  timeline = true;

  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
    const params = {
      startDate: lastMonth.toISOString(),
      endDate: today.toISOString(),
      groupBy: 'day' as 'day' | 'week' | 'month'
    };

    forkJoin({
      categories: this.reportService.getCategoryDistribution(params),
      priorities: this.reportService.getPriorityDistribution(params),
      timeSeries: this.reportService.getTimeSeriesData(params)
    }).subscribe(data => {
      this.categoryData = data.categories.map(item => ({
        name: String(item.categoryName || 'Sin categoría'),
        value: Number(item.count || 0)
      }));

      this.priorityData = data.priorities.map(item => ({
        name: String(item.priority || 'Sin prioridad'),
        value: Number(item.count || 0)
      }));

      this.timeSeriesData = [{
        name: 'Tickets',
        series: data.timeSeries.map(item => ({
          name: new Date(item.date).toLocaleDateString(),
          value: Number(item.count || 0)
        }))
      }];
    });
  }
} 