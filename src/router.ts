import { Routes } from '@angular/router';

import { HelloWorldComponent } from './HelloWorldComponent';
import { DownloadComponent } from './DownloadComponent';

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
    }
];