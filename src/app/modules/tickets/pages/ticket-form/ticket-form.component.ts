import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from '../../../../shared/material-imports';
import { TicketService } from '../../../../core/services/ticket.service';
import { Category, SubCategory, SubCategoryDetail } from '../../../../core/interfaces/category.interface';
import { CategoryService } from '../../../../core/services/category.service';
import { Ticket, CreateTicketDTO } from '../../../../core/interfaces/ticket.interface';
import { SocketService } from '../../../../core/services/socket.service';
import { NavigationService } from '../../../../core/services/navigation.service';

@Component({
  selector: 'app-ticket-form',
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule]
})
export class TicketFormComponent implements OnInit {
  ticketForm!: FormGroup;
  isEditMode = false;
  ticketId!: string;
  categories: Category[] = [];
  selectedSubcategories: SubCategory[] = [];
  selectedSubcategoryDetails: SubCategoryDetail[] = [];
  priorities: string[] = ['Baja', 'Media', 'Alta'];
  cancelRoute!: string;

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private socketService: SocketService,
    private navigationService: NavigationService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.ticketId = this.route.snapshot.params['id'];
    this.loadCategories();

    this.ticketForm.get('categoryId')?.valueChanges.subscribe(categoryId => {
      const category = this.categories.find(c => c._id === categoryId);
      if (category) {
        this.selectedSubcategories = category.subcategorias;
      }
    });

    this.setCancelRoute();
  }

  setCancelRoute() {
    const currentUrl = this.router.url;
    if (currentUrl.includes('/app/tickets/edit/')) {
      this.cancelRoute = '/app/tickets';
    } else if (currentUrl.includes('app')) {
      this.cancelRoute = '/app';
    }
  }

  cancel() {
    this.navigationService.cancel(this.cancelRoute);
  }

  createForm() {
    this.ticketForm = this.fb.group({
      description: ['', Validators.required],
      categoryId: ['', Validators.required],
      subcategory: ['', Validators.required],
      priority: ['', Validators.required]
    });
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories;
      if (this.ticketId) {
        this.isEditMode = true;
        this.loadTicket();
      }
    });
  }

  loadTicket() {
    if (this.ticketId) {
      this.ticketService.getTicketById(this.ticketId).subscribe((ticket: Ticket) => {
        if (ticket) {
          this.ticketForm.patchValue({
            description: ticket.description,
            priority: ticket.priority
          });

          this.ticketForm.patchValue({
            categoryId: ticket.category?._id
          });

          setTimeout(() => {
            if (ticket.subcategory) {
              this.ticketForm.patchValue({
                subcategory: ticket.subcategory._id
              });
            }
          }, 300);
        }
      });
    }
  }

  onSubmit() {
    if (this.ticketForm.valid) {
      const formValue = this.ticketForm.value;
      const subcategory = this.selectedSubcategories.find(s => s._id === formValue.subcategory);
      const subcategoryDetail = subcategory?.subcategorias_detalle[0]; // Tomamos el primer detalle por defecto

      if (!subcategory || !subcategoryDetail) return;

      const ticketData: CreateTicketDTO = {
        description: formValue.description,
        categoryId: formValue.categoryId,
        subcategory: {
          nombre_subcategoria: subcategory.nombre_subcategoria,
          descripcion_subcategoria: subcategory.descripcion_subcategoria,
          subcategoria_detalle: {
            nombre_subcategoria_detalle: subcategoryDetail.nombre_subcategoria_detalle,
            descripcion: subcategoryDetail.descripcion
          }
        },
        priority: formValue.priority
      };

      if (this.isEditMode) {
        this.ticketService.updateTicket(this.ticketId, ticketData).subscribe(() => {
          this.router.navigate(['/app/tickets']);
        });
      } else {
        this.ticketService.createTicket(ticketData).subscribe(() => {
          this.onTicketCreated();
          this.router.navigate(['/app/tickets']);
        });
      }
    }
  }

  onTicketCreated() {
    this.socketService.emit('customEvent', { 
      message: 'Ticket creado exitosamente'
    });
  }
} 