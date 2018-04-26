import { Component } from '@angular/core';

@Component({
	selector: 'sudoku',
	template: `<table>
	<tbody>
		<tr *ngFor="let row in data">
			<td *ngFor="let cell in row">
				{{value}}
			</td>
		</tr>
	</tbody>
</table>`,
})
export class SudokuComponent {
	protected data: number[][] = [];

	constructor() {
		for(let i = 0; i < 9; i++) {
			this.data[i] = [];
			for(let j = 0; j < 9; j++) {
				this.data[i][j] = 2;
			}	
		}
	}
}