import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) { }
  ngOnInit(): void {
    document.getElementById("myNav").classList.remove("collapsed");
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    let element = document.getElementById('navbar');
    if (window.pageYOffset > 450) {
      element.classList.add('header');
    } else {
      element.classList.remove('header');
    }
  }

  collapse() {
    document.getElementById("myNav").classList.toggle("collapsed");
  }
  home() {
    this.router.navigate(['home']);
  }

}
