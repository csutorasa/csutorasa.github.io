import { Component, NgModule, enableProdMode } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { routerConfig } from './router';
import { MainComponent } from './MainComponent';

import { HelloWorldComponent } from './HelloWorldComponent';
import { DownloadComponent } from './DownloadComponent';

import 'reflect-metadata/Reflect.js';
import 'zone.js/dist/zone.min.js';
import 'zone.js/dist/long-stack-trace-zone.min.js';

const debug = true;

@NgModule({
	imports: [
		BrowserModule,
		HttpClientModule,
		FormsModule,
		RouterModule.forRoot(routerConfig)
	],
	declarations: [
		MainComponent,
		HelloWorldComponent,
		DownloadComponent
    ],
	providers: [
		{ provide: LocationStrategy, useClass: HashLocationStrategy }
	],
	bootstrap: [MainComponent]
})
export class MainModule { }

window.onload = () => {
	if (debug) {
		console.debug('Bootstrapping...');
	} else {
		enableProdMode();
	}
	const bootstappingStart = new Date();
	platformBrowserDynamic().bootstrapModule(MainModule).then(() => {
		if (debug) {
			console.debug('Bootstrapped successfully in ' + (new Date().getTime() - bootstappingStart.getTime()) + 'ms');
		}
	}, err => {
		console.error(err);
	});
}
