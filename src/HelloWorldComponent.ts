import { Component } from '@angular/core';

@Component({
	selector: 'hello-world',
	template: `<h1>Hello!</h1>
	<a href="https://www.github.com/csutorasa">GitHub page</a>
	<a routerLink="/download" routerLinkActive="active">Downloads</a>
	<a routerLink="/timer" routerLinkActive="active">Timer</a>`,
})
export class HelloWorldComponent {
	constructor() {
		
	}
}