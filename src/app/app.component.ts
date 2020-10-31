import { Component } from '@angular/core';
import * as AOS from 'aos'; //<------ Add this line
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'stackroots';

  constructor() {
    AOS.init();
  }
}
