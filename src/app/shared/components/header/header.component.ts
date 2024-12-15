import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SharedModule } from '../../material-imports';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class HeaderComponent implements OnInit {
  @Output() menuToggled = new EventEmitter<void>();

  constructor(private router: Router) {}

  ngOnInit() {}

  toggleMenu() {
    this.menuToggled.emit();
  }

  logout() {
    this.router.navigate(['/auth/login']);
  }
}
