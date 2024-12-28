import { MatButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatList, MatNavList } from '@angular/material/list';
import { MatFormField, MatInput, MatInputModule, MatLabel } from '@angular/material/input';
import { MatCard } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import {MatChipsModule} from '@angular/material/chips';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
    imports: [
        MatToolbar,
        MatIcon,
        MatSidenav,
        MatList,
        MatInput,
        MatCard,
        MatSnackBarModule,
        MatDialogModule,
        MatTable,
        MatPaginator,
        MatSort,
        MatFormField,
        MatButton,
        MatLabel,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatNavList,
        MatSidenavContainer,
        MatSidenavContent,
        MatMenuModule,
        MatTableModule,
        MatChipsModule,
        MatSelectModule,
        MatCardModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatDividerModule,
        MatBadgeModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatProgressBarModule
    ],
    exports: [
        MatToolbar,
        MatIcon,
        MatSidenav,
        MatList,
        MatInput,
        MatCard,
        MatSnackBarModule,
        MatDialogModule,
        MatTable,
        MatPaginator,
        MatSort,
        MatFormField,
        MatButton,
        MatLabel,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatNavList,
        MatSidenavContainer,
        MatSidenavContent,
        MatMenuModule,
        MatTableModule,
        MatChipsModule,
        MatSelectModule,
        MatCardModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatDividerModule,
        MatBadgeModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatProgressBarModule
    ],
    declarations: [],
    providers: [
        provideHttpClient(withFetch())
    ]
  })
  export class SharedModule {}