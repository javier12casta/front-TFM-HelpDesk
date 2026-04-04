import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/material-imports';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ReportService } from '../../../../core/services/report.service';
import { AreaService } from '../../../../core/services/area.service';
import { CategoryService } from '../../../../core/services/category.service';
import {
  TicketStats,
  AreaStats,
  CategoryStats,
  ReportQueryParams
} from '../../../../core/interfaces/report.interface';
import { forkJoin, finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category } from '../../../../core/interfaces/category.interface';

@Component({
  selector: 'app-report-dashboard',
  templateUrl: './report-dashboard.component.html',
  styleUrls: ['./report-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule]
})
export class ReportDashboardComponent implements OnInit {
  private snackBar = inject(MatSnackBar);

  filterForm: FormGroup;
  ticketStats?: TicketStats;
  areaStats: AreaStats[] = [];
  categoryStats: CategoryStats[] = [];
  areas: { _id: string; area: string }[] = [];
  categories: Category[] = [];

  isLoading = false;
  isDownloading = false;

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
    this.areaService.getAllAreas().subscribe({
      next: (areas: { _id: string; area: string }[]) => {
        this.areas = areas ?? [];
      },
      error: () => {
        this.snackBar.open('No se pudieron cargar las áreas', 'Cerrar', { duration: 4000 });
      }
    });
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories ?? [];
      },
      error: () => {
        this.snackBar.open('No se pudieron cargar las categorías', 'Cerrar', { duration: 4000 });
      }
    });
  }

  /** Convierte tasas del API (0–1 o 0–100) a fracción 0–1 para el pipe percent. */
  resolutionRateFraction(rate: number | undefined | null): number {
    if (rate == null || !Number.isFinite(rate)) {
      return 0;
    }
    if (rate > 1) {
      return Math.min(Math.max(rate / 100, 0), 1);
    }
    return Math.min(Math.max(rate, 0), 1);
  }

  resolvedPercent(total: number, resolved: number): number {
    if (!total || total < 1) {
      return 0;
    }
    return Math.min(100, Math.max(0, (resolved / total) * 100));
  }

  buildQueryParams(): ReportQueryParams {
    const v = this.filterForm.getRawValue();
    const toDateStr = (d: unknown): string | undefined => {
      if (d == null || d === '') {
        return undefined;
      }
      if (d instanceof Date) {
        return d.toISOString().split('T')[0];
      }
      return String(d);
    };
    return {
      startDate: toDateStr(v.startDate),
      endDate: toDateStr(v.endDate),
      area: v.area ? String(v.area) : undefined,
      category: v.category ? String(v.category) : undefined
    };
  }

  loadReports() {
    const params = this.buildQueryParams();
    this.isLoading = true;

    forkJoin({
      ticket: this.reportService.getTicketStats(params),
      area: this.reportService.getAreaStats(params),
      category: this.reportService.getCategoryStats(params)
    })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: ({ ticket, area, category }) => {
          this.ticketStats = ticket;
          this.areaStats = area ?? [];
          this.categoryStats = category ?? [];
        },
        error: () => {
          this.snackBar.open('No se pudieron cargar las estadísticas. Intente de nuevo.', 'Cerrar', {
            duration: 5000
          });
        }
      });
  }

  onFilterChange() {
    this.loadReports();
  }

  downloadReport() {
    const params = this.buildQueryParams();
    this.isDownloading = true;
    this.reportService
      .downloadReport(params)
      .pipe(finalize(() => (this.isDownloading = false)))
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `reporte-tickets-${new Date().toISOString().split('T')[0]}.xlsx`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        },
        error: () => {
          this.snackBar.open('No se pudo generar el reporte. Revise los filtros o intente más tarde.', 'Cerrar', {
            duration: 6000
          });
        }
      });
  }
}
