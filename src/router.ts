import { Routes } from '@angular/router';

import { HelloWorldComponent } from './HelloWorldComponent';
import { DownloadComponent } from './DownloadComponent';
import { TimerComponent } from './timer/TimerComponent';
import { SudokuComponent } from './SudokuComponent';

export const routerConfig: Routes = [
    {
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