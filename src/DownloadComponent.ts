import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Component({
	selector: 'download',
	template: `DownloadCount`,
})
export class DownloadComponent {

	private readonly username: string = 'csutorasa';

	constructor( @Inject(HttpClient) protected httpClient: HttpClient) {
		httpClient.get('https://api.github.com/users/' + this.username + '/repos').toPromise().then((repos: any[]) => {
			const promises: Promise<void>[] = [];
			repos.forEach(repo => {
				const fullName: string = repo.full_name;
				promises.push(httpClient.get('https://api.github.com/repos/' + fullName + '/releases').toPromise().then((releases: any[]) => {
					const donwloadCount = releases.map(release => <any>release.assets).map(assets => {
						return assets.map(asset => asset.download_count)
							.reduce((prev, curr, index, array) => {
								return prev + curr;
							}, 0);
					}).reduce((prev, curr, index, array) => {
						return prev + curr;
					}, 0);
					console.log(fullName, donwloadCount);
				}));
			});
			return Promise.all(promises);
		});


	}
}