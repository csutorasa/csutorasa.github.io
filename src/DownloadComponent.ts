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
		<td>{{repo.download}}</td>
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
		return this.getRepositories(username).then((repos: any[]) => {
			const promises: Promise<{ name: string, download: number }>[] = repos.map(repo => {
				const name: string = repo.name;
				return this.getReleases(username, name).then((releases: any[]) => {
					const donwloadCount = this.calculateDownloadCount(releases);
					return { name: name, download: donwloadCount };
				});
			});
			return Promise.all(promises);
		});
	}

	protected getRepositories(username: string): Promise<any[]> {
		return this.httpClient.get('https://api.github.com/users/' + username + '/repos').toPromise().then(r => <any[]>r);

	}

	protected getReleases(username: string, repository: string): Promise<any[]> {
		return this.httpClient.get('https://api.github.com/repos/' + username + '/' + name + '/releases').toPromise().then(r => <any[]>r);
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