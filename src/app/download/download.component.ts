import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

interface AssetData {
    file: string;
    download: number;
    url: string;
}

interface ReleaseData {
    id: number;
    download: number;
    name: string;
    url: string;
    body: string[];
    assets: AssetData[];
    publishDate: Date;
    lifetime: number;
    downloadRate: number;
}

interface RepositoryData {
    name: string;
    download: number;
    releases: ReleaseData[];
    url: string;
}

@Component({
    selector: 'app-download',
    templateUrl: './download.component.html',
    styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {

    public searchForm: {
        username?: string;
    } = {};
    public notfound = false;
    public repository: string;
    public readonly repositories: RepositoryData[] = [];
    public downloadData: RepositoryData;

    constructor(protected httpClient: HttpClient, private router: Router, private route: ActivatedRoute, private location: Location) {
        this.route.params.subscribe(params => {
            if (params['user']) {
                this.searchForm.username = params['user'];
                const discover = this.findRepositories();
                const repo = params['repo'];
                if (repo) {
                    discover.then(() => {
                        if (this.repositories.map(r => r.name).indexOf(repo) >= 0) {
                            this.selectRepository(repo);
                        }
                    });
                }
            }
        });
    }

    ngOnInit() {
    }

    public reset(): void {
        this.repository = undefined;
        this.repositories.length = 0;
        this.downloadData = undefined;
        this.location.go('/download');
    }

    public selectRepository(repoName: string): Promise<void> {
        this.repository = repoName;
        return this.getDownloadData(this.searchForm.username, this.repositories.find(r => r.name === repoName)).then(data => {
            this.downloadData = data;
            this.location.replaceState('/download/' + this.searchForm.username + '/' + repoName);
        });
    }

    public findRepositories(): Promise<void> {
        return this.getRepositoryNames(this.searchForm.username).then((repos: RepositoryData[]) => {
            this.repositories.length = 0;
            this.notfound = false;
            this.repositories.push(...repos.sort((a, b) => a.name.localeCompare(b.name)));
            this.location.go('/download/' + this.searchForm.username);
        }, err => {
            this.repositories.length = 0;
            this.downloadData = undefined;
            this.notfound = true;
            console.error(err);
        });
    }

    protected getDownloadData(username: string, repository: RepositoryData): Promise<RepositoryData> {
        return this.getReleases(username, repository.name).then((releases: any[]) => {
            const assests: AssetData[][] = releases.map(r => (<any[]>r.assets).map(a => {
                return {
                    download: a.download_count,
                    file: a.name,
                    url: a.browser_download_url,
                };
            }));
            const releaseDatas: ReleaseData[] = assests.map((r, index) => {
                const d = r.reduce((a, b) => a + b.download, 0);
                const release = releases[index];
                return <ReleaseData>{
                    assets: r,
                    download: d,
                    id: release.id,
                    name: release.name,
                    url: release.html_url,
                    body: release.body.split('\n'),
                    publishDate: new Date(release.published_at),
                    lifetime: 0,
                };
            });
            releaseDatas.slice().reverse().forEach((r, i, data) => {
                const current = r.publishDate;
                let next: Date;
                if (i + 1 < data.length) {
                    next = data[i + 1].publishDate;
                } else {
                    next = new Date();
                }
                const lifetime = (next.getTime() - current.getTime()) / 1000 / 60 / 60 / 24;
                r.downloadRate = Math.round(r.download * 100 / lifetime) / 100;
                r.lifetime = Math.round(lifetime);
            });
            const donwloadCount = releaseDatas.reduce((a, b) => a + b.download, 0);
            return <RepositoryData>{
                name: username + '/' + repository.name,
                download: donwloadCount,
                releases: releaseDatas,
                url: repository.url
            };
        }).catch(err => {
            console.error(err);
            return <RepositoryData>{ name: username + '/' + repository.name, download: 0, releases: [], url: repository.url };
        });
    }

    protected getRepositoryNames(username: string): Promise<RepositoryData[]> {
        return this.httpClient.get('https://api.github.com/search/repositories?q=user:' + username).toPromise()
            .then(r => (<any[]>(<any>r).items))
            .then(res => res.map(r => {
                return <RepositoryData>{
                    name: r.name,
                    url: r.html_url,
                    download: 0,
                    releases: [],
                };
            }));

    }

    protected getReleases(username: string, repository: string): Promise<any[]> {
        return this.getReleasesRecursive('https://api.github.com/repos/' + username + '/' + repository + '/releases', []);
    }

    protected getReleasesRecursive(url: string, releases: any[]): Promise<any[]> {
        return this.httpClient.get(url, { observe: 'response' }).toPromise()
            .then(r => {
                releases.push(...(<any[]>r.body));
                if (r.headers.has('Link')) {
                    const link = r.headers.get('Link');
                    const links = link.split(',');
                    const nextLink = links.find(l => l.indexOf('rel="next"') >= 0);
                    if (nextLink) {
                        const newUrl = nextLink.split('>')[0].substring(1);
                        return this.getReleasesRecursive(newUrl, releases);
                    }
                }
                return releases;
            });
    }
}
