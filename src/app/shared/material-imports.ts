import { MatButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { MatList } from '@angular/material/list';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatCard } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';

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
    ],
    exports: [],
    declarations: [],
    providers: []
  })
  export class SharedModule {}