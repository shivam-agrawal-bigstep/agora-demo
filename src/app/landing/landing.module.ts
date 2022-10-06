import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LandingRoutingModule } from './landing.routing-module';



@NgModule({
  declarations: [
    LandingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LandingRoutingModule
  ]
})
export class LandingModule { }
