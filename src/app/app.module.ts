import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from "./shared/shared.module";
import { HomeModule } from "./home/home.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminModule } from "./admin/admin.module";
import { HttpClientModule } from '@angular/common/http';
import { EmployeeModule } from './Employee/employee.module'; 

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HomeModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    EmployeeModule // Import EmployeeModule vào đây
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
