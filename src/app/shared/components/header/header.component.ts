import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../material-imports';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class HeaderComponent implements OnInit {
  title = 'material-responsive-sidenav';
  //@ViewChild(MatSidenav) sidenav: MatSidenav | null = null;
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isMobile= true;
  isCollapsed = true;

  constructor(private readonly observer: BreakpointObserver) { }

  ngOnInit() {
    this.observer.observe(['(max-width: 2000px)']).subscribe((screenSize) => {
      if(screenSize.matches){
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
  }

  toggleMenu() {
    if(this.isMobile){
      this.sidenav.toggle();
      this.isCollapsed = false; // On mobile, the menu can never be collapsed
    } else {
      this.sidenav.open(); // On desktop/tablet, the menu can never be fully closed
      this.isCollapsed = !this.isCollapsed;
    }
  }

  toggleSidebar() {
    this.sidenav.toggle(); 
  }

}
