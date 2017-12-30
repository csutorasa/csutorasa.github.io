import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'hello-world',
	template: `Hello World!`,
})
export class HelloWorldComponent {
	constructor(protected httpClient: HttpClient) {
		httpClient.get('https://api.github.com/repos/csutorasa/XOutput/releases').toPromise().then(data => {
			console.log(data);
		}, err =>{
			console.error(err);
		});
	}
}