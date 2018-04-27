import { Component } from '@angular/core';

type CellValue = number;

interface Cell {
	x: number;
	y: number;
	value?: number;
	possibleValues: number[];
	blocks: Block[];
}

interface Block {
	cells: Cell[];
}

function permuteArray(array: any[], size: number, indices: number[] = []): any[][] {
	const result: any[][] = [];
	const newIndices: any[][] = [];

	for (let i = 0; i < array.length; i++) {
		if(indices.indexOf(i) < 0) {
			for (let j = 0; j < indices.length; j++) {
				const newI = indices.slice();
				newI.splice(j, 0, i);
				newIndices.push(newI);
				result.push(indices.map(index => array[index]));
			}
			const newI = indices.slice();
			newI.push(i);
			newIndices.push(newI);
			result.push(indices.map(index => array[index]));
		}
	}

	if(indices.length < size) {
		const r: any[][] = [];
		for(let i = 0; i < newIndices.length; i++) {
			console.log(newIndices[i]);
			r.push(...permuteArray(array, size, newIndices[i]));
		}
		return r;
	}
	console.log(result);
	return result;
}

@Component({
	selector: 'sudoku',
	template: `<table>
	<tbody>
		<tr *ngFor="let row of cells">
			<td *ngFor="let cell of row" style="border: solid 1px black;padding: 10px;">
				{{cell.value ? cell.value : ''}}
			</td>
		</tr>
	</tbody>
</table>
<button (click)="solve()">Solve</button>
<textarea [(ngModel)]="input"></textarea>
<button (click)="reload()">Reload</button>`,
})
export class SudokuComponent {
	protected readonly size: number = 9;

	protected input: string;
	protected cells: Cell[][] = [];
	protected blocks: Block[] = [];


	constructor() {
		const values: number[][] = [];
		for (let i = 0; i < this.size; i++) {
			values[i] = Array(this.size);
		}

		this.createData(values);
	}

	protected assignCellToBlock(cell: Cell, block: Block) {
		block.cells.push(cell);
		cell.blocks.push(block);
	}

	protected createValuesSequence(): number[] {
		const sequence = [];
		for (let i = 1; i <= this.size; i++) {
			sequence.push(i);
		}
		return sequence;
	}

	public reload() {
		const values: number[][] = [];
		const rows = this.input.split('\n');
		for (let i = 0; i < this.size; i++) {
			const cells = rows[i].split(' ');
			values[i] = new Array(this.size);
			for (let j = 0; j < this.size; j++) {
				if (cells[j]) {
					values[i][j] = parseInt(cells[j]);
				}
			}
		}
		this.createData(values);
	}

	protected createData(values: number[][]) {
		this.blocks = [];
		for (let i = 0; i < this.size; i++) {
			this.cells[i] = [];
			for (let j = 0; j < this.size; j++) {
				this.cells[i][j] = {
					x: i,
					y: j,
					value: values[i][j] == 0 ? undefined : values[i][j],
					possibleValues: this.createValuesSequence().filter(v => v != values[i][j]),
					blocks: [],
				};
			}
		}

		for (let i = 0; i < this.size; i++) {
			const rowBlock: Block = { cells: [] };
			const columnBlock: Block = { cells: [] };
			for (let j = 0; j < this.size; j++) {
				this.assignCellToBlock(this.cells[i][j], rowBlock);
				this.assignCellToBlock(this.cells[j][i], columnBlock);
			}
			this.blocks.push(rowBlock);
			this.blocks.push(columnBlock);
		}
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				const areaBlock: Block = { cells: [] };
				for (let k = 0; k < 3; k++) {
					for (let l = 0; l < 3; l++) {
						this.assignCellToBlock(this.cells[i * 3 + k][j * 3 + l], areaBlock);
					}
				}
				this.blocks.push(areaBlock);
			}
		}
	}

	public solve(): boolean {
		let processed = 1;
		console.log(this.generateSubsets(this.createValuesSequence(), 3));
		while (processed > 0) {
			processed = 0;
			for (let block of this.blocks) {
				processed += this.filterValueAlreadyExistsInBlock(block);
				processed += this.setValueOnlyOnePossibilityinBlock(block);
			}
		}

		for (let i = 0; i < this.size; i++) {
			for (let j = 0; j < this.size; j++) {
				if (this.cells[i][j].value == null)
					return false;
			}
		}
		return true;
	}

	/**
	 * Filter possible values fro cells that are already present in the block.
	 * @param block block to check
	 * @returns number of changed cells
	 */
	public filterValueAlreadyExistsInBlock(block: Block): number {
		const filterValues: number[] = block.cells.filter(c => c.value != null).map(c => c.value);
		return block.cells.filter(c => c.value == null).map(cell => {
			cell.possibleValues = cell.possibleValues.filter(v => filterValues.indexOf(v) < 0);
			if (cell.possibleValues.length == 1) {
				cell.value = cell.possibleValues[0];
				return <number>1;
			}
			return 0;
		}).reduce((a, b) => a + b, 0);
	}

	/**
	 * Set the cell value when the value can be used only in one cell.
	 * @param block block to check
	 * @returns number of changed cells
	 */
	public setValueOnlyOnePossibilityinBlock(block: Block): number {
		return this.createValuesSequence().map(value => {
			const possibleCells: Cell[] = [];
			let containsAlready = false;
			for (let cell of block.cells) {
				if (cell.value == value) {
					containsAlready = true;
					break;
				}
				if (cell.possibleValues.indexOf(value) >= 0) {
					possibleCells.push(cell);
				}
			}
			if (!containsAlready && possibleCells.length == 1) {
				const possibleCell = possibleCells[0];
				possibleCell.value = value;
				return <number>1;
			}
			return 0;
		}).reduce((a, b) => a + b, 0);
	}

	public nextGen(block: Block) {

	}

	protected generateSubsets(data: any[], size: number) {
		return permuteArray(data, size).filter(x => x.length == size);
	}
}