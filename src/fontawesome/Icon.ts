import { Component, Input } from '@angular/core';

@Component({
	selector: 'icon',
	template: `<i class="fa {{value ? 'fa-' + value : ''}}"></i>`,
})
export class IconComponent {

    protected value: string;

    @Input('type')
    public set type(type: string) {
        this.value = type;
    }

	constructor() {

	}
}