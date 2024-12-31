import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '../../core/services/ticket.service';
import { CategoryService } from '../../core/services/category.service';
import { AreaService } from '../../core/services/area.service';
import { SharedModule } from '../../shared/material-imports';
import { FormsModule } from '@angular/forms';
import { Ticket } from '../../core/interfaces/ticket.interface';
import { Category } from '../../core/interfaces/category.interface';
import { forkJoin } from 'rxjs';

interface TicketStats {
  total: number;
  pendientes: number;
  resueltos: number;
}

interface InfoCard {
  name?: string;
  area?: string;
  nombre_categoria?: string;
  count?: number;
  icon?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [SharedModule, FormsModule]
})
export class HomeComponent implements OnInit {
  tickets: Ticket[] = [];
  stats: any = { total: 0, pendientes: 0, resueltos: 0, inProgress: 0 };
  categories: InfoCard[] = [];
  areas: InfoCard[] = [];

  // Mapeo de íconos por categoría
  private categoryIcons: { [key: string]: string } = {
    'Incidentes (Tecnología)': 'computer_problem', // o 'error'
    'Gestión Interna': 'business',
    // Subcategorías de Incidentes
    'Hardware': 'devices',
    'Software': 'apps',
    'Redes y Conectividad': 'network_check',
    'Seguridad y Ciberseguridad': 'security',
    'Soporte de Base de Datos': 'storage',
    // Subcategorías de Gestión Interna
    'Recursos Humanos': 'people',
    'Finanzas': 'payments',
    'Gestión Administrativa': 'admin_panel_settings',
    'Soporte a Colaboradores': 'support_agent',
    // Ícono por defecto
    'default': 'category'
  };

  // Mapeo de íconos por área
  private areaIcons: { [key: string]: string } = {
    'Tecnología y Sistemas': 'computer',
    'Recursos Humanos': 'people',
    'Gestión Interna': 'business',
    'Cumplimiento y Auditoría': 'gavel',
    'Operaciones Bancarias': 'account_balance',
    'Atención al Cliente': 'support_agent',
    'Marketing y Comunicaciones': 'campaign',
    'Riesgos y Seguridad': 'security',
    'Desarrollo y Proyectos': 'developer_mode',
    'Finanzas y Contabilidad': 'payments',
    'default': 'business'
  };

  constructor(
    private ticketService: TicketService,
    private categoryService: CategoryService,
    private areaService: AreaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    forkJoin({
      tickets: this.ticketService.getAllTickets(),
      categories: this.categoryService.getAllCategories(),
      areas: this.areaService.getAllAreas(),
      stats: this.ticketService.getStats()
    }).subscribe({
      next: (data) => {
        this.tickets = data.tickets;
        this.stats = data.stats;
        
        // Procesar categorías
        this.categories = this.processCategories(data.categories, this.tickets);
        
        // Procesar áreas
        this.areas = this.processAreas(data.areas, this.tickets);

        // Calcular estadísticas
        this.stats = this.calculateStats(this.tickets);
      },
      error: (error) => {
        console.error('Error loading data:', error);
        // Aquí podrías agregar manejo de errores
      }
    });
  }

  private processCategories(categories: any[], tickets: Ticket[]): InfoCard[] {
    return categories.map(category => ({
      nombre_categoria: category.nombre_categoria,
      count: this.countTicketsByCategory(tickets, category._id),
      icon: this.categoryIcons[category.nombre_categoria] || this.categoryIcons['default']
    }));
  }

  private processAreas(areas: any[], tickets: Ticket[]): InfoCard[] {
    return areas.map(area => ({
      area: area.area,
      count: this.countTicketsByArea(tickets, area._id),
      icon: this.areaIcons[area.area] || this.areaIcons['default']
    }));
  }

  private countTicketsByCategory(tickets: Ticket[], categoryId: number): number {
    return tickets.filter(ticket => ticket?.category?._id === categoryId).length;
  }

  private countTicketsByArea(tickets: Ticket[], areaId: number): number {
    return tickets.filter(ticket => ticket?.area?._id === areaId).length;
  }

  private calculateStats(tickets: Ticket[]): { total: number; pendientes: number; resueltos: number; inProgress: number } {
    const total = tickets.length;
    const pendientes = tickets.filter(ticket => ticket.status === 'Pendiente').length;
    const resueltos = tickets.filter(ticket => ticket.status === 'Resuelto').length;
    const inProgress = tickets.filter(ticket => ticket.status === 'En Proceso').length;
    return { total: total, pendientes: pendientes, resueltos: resueltos, inProgress: inProgress };
  }

  createNewTicket() {
    this.router.navigate(['/app/tickets/new']);
  }

}
