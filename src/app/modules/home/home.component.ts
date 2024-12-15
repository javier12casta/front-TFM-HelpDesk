import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/material-imports';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
