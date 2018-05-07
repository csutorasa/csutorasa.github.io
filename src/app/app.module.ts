import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DownloadComponent } from './download/download.component';
import { TimerComponent } from './timer/timer.component';
import { SudokuComponent } from './sudoku/sudoku.component';
import { HelloWorldComponent } from './hello-world/hello-world.component';
import { IconComponent } from './icon/icon.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    DownloadComponent,
    TimerComponent,
    SudokuComponent,
    HelloWorldComponent,
    IconComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
