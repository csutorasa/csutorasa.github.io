import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-icon',
    templateUrl: './icon.component.html',
    styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {

    public value: string;

    @Input('type')
    public set type(type: string) {
        this.value = type;
    }
    constructor() { }

    ngOnInit() {
    }

}
