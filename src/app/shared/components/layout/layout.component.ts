import { Component, OnInit, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { SharedModule } from '../../material-imports';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { delay } from 'rxjs/operators';
import { ThemeService } from '../../../core/services/theme.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SharedModule],
  encapsulation: ViewEncapsulation.None
})
export class LayoutComponent implements AfterViewInit, OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isMobile = false;
  isCollapsed = false;
  isDarkMode$!: Observable<boolean>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.isDarkMode$ = this.themeService.darkMode$;
  }

  ngAfterViewInit() {
    this.breakpointObserver
      .observe(['(max-width: 800px)'])
      .pipe(delay(1)) // Pequeño delay para evitar ExpressionChangedAfterItHasBeenCheckedError
      .subscribe(result => {
        this.isMobile = result.matches;
        if (this.isMobile) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }

}
