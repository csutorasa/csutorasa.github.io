import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DownloadComponent } from './download/download.component';
import { TimerComponent } from './timer/timer.component';
import { SudokuComponent } from './sudoku/sudoku.component';
import { HelloWorldComponent } from './hello-world/hello-world.component';

const routes: Routes = [{
    path: '',
    component: HelloWorldComponent
},
{
    path: 'download',
    component: DownloadComponent
},
{
    path: 'timer',
    component: TimerComponent
},
{
    path: 'sudoku',
    component: SudokuComponent
},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
