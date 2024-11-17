import { MatButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatList, MatNavList } from '@angular/material/list';
import { MatFormField, MatInput, MatInputModule, MatLabel } from '@angular/material/input';
import { MatCard } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { QRCodeModule } from 'angularx-qrcode'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
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
        QRCodeModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatNavList,
        MatSidenavContainer,
        MatSidenavContent
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
        QRCodeModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatNavList,
        MatSidenavContainer,
        MatSidenavContent
    ],
    declarations: [],
    providers: [
        provideHttpClient(withFetch())
    ]
  })
  export class SharedModule {}