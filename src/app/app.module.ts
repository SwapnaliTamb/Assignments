import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  MoviesDetailsComponent,
} from './components/movies-details/movies-details.component';
import {
  NgbdSortableHeader,
} from './components/movies-details/sortable.directive';

@NgModule({
  declarations: [
    AppComponent,NgbdSortableHeader,
  MoviesDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,HttpClientModule, NgbModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
