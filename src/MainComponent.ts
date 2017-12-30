import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Component({
	selector: 'my-app',
	template: `<router-outlet></router-outlet>`,
})
export class MainComponent {
	constructor(protected http: Http) {
		http.get('https://api.github.com/repos/csutorasa/XOutput/releases').map(res => res.json()).toPromise().then(data => {
			console.log(data);
		}, err =>{
			console.error(err);
		});
	}
}