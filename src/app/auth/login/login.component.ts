import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '../../shared/material-imports';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
  }
  
  login() {
    this.router.navigate(['/app']);
  }
}
