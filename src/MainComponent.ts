import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Component({
	selector: 'my-app',
	template: `<router-outlet></router-outlet>`,
})
export class MainComponent {
	constructor(protected http: HttpClient) {
		http.get('https://api.github.com/repos/csutorasa/XOutput/releases').toPromise().then(data => {
			console.log(data);
		}, err =>{
			console.error(err);
		});
	}
}