import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogComponent } from './blog/blog.component';

import { HomeComponent } from './home/home.component';
import { ServiceComponent } from './service/service.component';
import {AboutComponent} from './about/about.component'

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: "full" },
  { path: 'home', component: HomeComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'services', component: ServiceComponent },
  {path:'about',component:AboutComponent},
  { path: '**', redirectTo: '/home', pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
