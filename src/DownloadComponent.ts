import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Component({
	selector: 'download',
	template: `<table>
	<tr>
		<th>Repository</th>
		<th>Download count</th>
	</tr>
	<tr *ngFor="let repo of downloadData">
		<td>{{repo.name}}</td>
		<td>{{repo.download < 0 ? 'Failed to get' : repo.download}}</td>
	</tr>
</table>`,
})
export class DownloadComponent {

	private readonly username: string = 'csutorasa';
	protected readonly downloadData: { name: string, download: number }[] = [];

	constructor( @Inject(HttpClient) protected httpClient: HttpClient) {
		this.getDownloadData(this.username).then(data => {
			this.downloadData.length = 0;
			data.forEach(d => this.downloadData.push(d));
		});
	}

	protected getDownloadData(username: string): Promise<{ name: string, download: number }[]> {
		return this.getRepositoryNames(username).then((repoNames: string[]) => {
			const promises: Promise<{ name: string, download: number }>[] = repoNames.map(name => {
				return this.getReleases(username, name).then((releases: any[]) => {
					const donwloadCount = this.calculateDownloadCount(releases);
					return { name: name, download: donwloadCount };
				}).catch(err => {
					console.error(err);
					return { name: name, download: -1 };
				});
			});
			return Promise.all(promises);
		});
	}

	protected getRepositoryNames(username: string): Promise<string[]> {
		return this.httpClient.get('https://api.github.com/search/repositories?q=user:' + username).toPromise()
			.then(r => (<any[]>(<any>r).items))
			.then(r => r.map(r => r.name));

	}

	protected getReleases(username: string, repository: string): Promise<any[]> {
		return this.httpClient.get('https://api.github.com/repos/' + username + '/' + repository + '/releases').toPromise().then(r => <any[]>r);
	}

	protected calculateDownloadCount(releases: any[]): number {
		return releases.map(release => <any[]>release.assets)
			.map(assets => {
			return assets.map(asset => <number>asset.download_count)
				.reduce((prev, curr, index, array) => {
					return prev + curr;
				}, 0);
		}).reduce((prev, curr, index, array) => {
			return prev + curr;
		}, 0);
	}
}