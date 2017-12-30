import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Component({
	selector: 'download',
	template: `<div *ngFor="let repo of downloadData">
	<h1>{{repo.name}}</h1>
	<span>{{repo.download}}</span>
</div>`,
})
export class DownloadComponent {

	private readonly username: string = 'csutorasa';
	protected readonly downloadData: { name: string, donwload: number }[] = [];

	constructor( @Inject(HttpClient) protected httpClient: HttpClient) {
		httpClient.get('https://api.github.com/users/' + this.username + '/repos').toPromise().then((repos: any[]) => {
			const promises: Promise<void>[] = [];
			repos.forEach(repo => {
				const name: string = repo.name;
				promises.push(httpClient.get('https://api.github.com/repos/' + this.username + '/' + name + '/releases').toPromise().then((releases: any[]) => {
					const donwloadCount = this.calculateDownloadCount(releases);
					this.downloadData.push({ name: name, donwload: donwloadCount });
				}));
			});
			return Promise.all(promises);
		});


	}

	protected calculateDownloadCount(releases: any[]): number {
		return releases.map(release => <any>release.assets).map(assets => {
			return assets.map(asset => <number>asset.download_count)
				.reduce((prev, curr, index, array) => {
					return prev + curr;
				}, 0);
		}).reduce((prev, curr, index, array) => {
			return prev + curr;
		}, 0);
	}
}