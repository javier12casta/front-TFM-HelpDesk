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


  constructor() {}

  ngOnInit() {
   
  }

} 