import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Component({
	selector: 'download',
	template: `DownloadCount`,
})
export class DownloadComponent {
	constructor(@Inject(HttpClient) protected httpClient: HttpClient) {
		httpClient.get('https://api.github.com/repos/csutorasa/XOutput/releases').toPromise().then(data => {
			console.log(data);
		}, err =>{
			console.error(err);
		});
	}
}