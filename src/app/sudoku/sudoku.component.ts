import { Component, OnInit } from '@angular/core';

interface Cell {
    x: number;
    y: number;
    value?: number;
    possibleValues: Set<number>;
    blocks: Block[];
}

interface Block {
    cells: Cell[];
}

@Component({
    selector: 'app-sudoku',
    templateUrl: './sudoku.component.html',
    styleUrls: ['./sudoku.component.scss']
})
export class SudokuComponent implements OnInit {
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

    ngOnInit() {
    }

    protected assignCellToBlock(cell: Cell, block: Block) {
        block.cells.push(cell);
        cell.blocks.push(block);
    }

    protected createValuesSequence(): Set<number> {
        const sequence = new Set();
        for (let i = 1; i <= this.size; i++) {
            sequence.add(i);
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
                    values[i][j] = parseInt(cells[j], 10);
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
                const possibleValues = this.createValuesSequence();
                possibleValues.delete(values[i][j]);
                this.cells[i][j] = {
                    x: i,
                    y: j,
                    value: values[i][j] === 0 ? undefined : values[i][j],
                    possibleValues: possibleValues,
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
        for (let i = 0; i < 10 && processed > 0; i++) {
            processed = 0;
            for (const block of this.blocks) {
                processed += this.filterValueAlreadyExistsInBlock(block);
                processed += this.setValueOnlyOnePossibilityinBlock(block);
                processed += this.nextGen(block);
            }
        }

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.cells[i][j].value == null) {
                    return false;
                }
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
            return this.removePossibleValues(cell, ...filterValues);
        }).reduce((a, b) => a + (b ? 1 : 0), 0);
    }

    /**
	 * Set the cell value when the value can be used only in one cell.
	 * @param block block to check
	 * @returns number of changed cells
	 */
    public setValueOnlyOnePossibilityinBlock(block: Block): number {
        return Array.from(this.createValuesSequence()).map(value => {
            const possibleCells: Cell[] = [];
            let containsAlready = false;
            for (const cell of block.cells) {
                if (cell.value === value) {
                    containsAlready = true;
                    break;
                }
                if (cell.possibleValues.has(value)) {
                    possibleCells.push(cell);
                }
            }
            if (!containsAlready && possibleCells.length === 1) {
                const possibleCell = possibleCells[0];
                const valuesToRemove = Array.from(possibleCell.possibleValues).filter(v => v !== value);
                return this.removePossibleValues(possibleCell, ...valuesToRemove);
            }
            return false;
        }).reduce((a, b) => a + (b ? 1 : 0), 0);
    }

    public nextGen(block: Block): number {
        const emptyCells: Cell[] = block.cells.filter(c => c.value == null);
        const possibleValues: Set<number> = new Set(block.cells.filter(c => c.value != null).map(c => c.value));
        return emptyCells.map((blockEmpty, i) => {
            const include = emptyCells.filter((c, index) => i !== index);
            const exclude = emptyCells.filter((c, index) => i === index);
            return this.nextGenLogic(include, exclude, possibleValues);
        }).reduce((a, b) => a + b, 0);
    }

    protected nextGenLogic(include: Cell[], exclude: Cell[], possibleValues: Set<number>): number {
        const valuesToRemoveFromExclude = new Set<number>();
        include.forEach(cell => {
            cell.possibleValues.forEach(value => {
                valuesToRemoveFromExclude.add(value);
            });
        });
        const valuesToRemoveFromInclude = Array.from(possibleValues).filter(v => !valuesToRemoveFromExclude.has(v));
        if (valuesToRemoveFromExclude.size === include.length) {
            const excluded = exclude.map(c => {
                return this.removePossibleValues(c, ...Array.from(valuesToRemoveFromExclude));
            }).reduce((a, b) => a + (b ? 1 : 0), 0);
            const included = include.map(c => {
                return this.removePossibleValues(c, ...valuesToRemoveFromInclude);
            }).reduce((a, b) => a + (b ? 1 : 0), 0);
            return included + excluded;
        }
    }

    protected removePossibleValues(cell: Cell, ...removeValues: number[]): boolean {
        if (cell.value != null) {
            return false;
        }
        const changed = removeValues.map(v => cell.possibleValues.delete(v)).reduce((a, b) => a + (b ? 1 : 0), 0);
        if (changed > 0) {
            if (cell.value == null && cell.possibleValues.size === 1) {
                cell.value = Array.from(cell.possibleValues)[0];
                console.log('Value set', cell);
                cell.blocks.forEach(b => {
                    b.cells
                        .filter(c => c.value == null)
                        .filter(c => c.possibleValues.has(cell.value))
                        .forEach(c => {
                            this.removePossibleValues(c, cell.value);
                        });
                });
                return true;
            } else {
                console.log('Possible values changed', cell);
            }
        }
        return false;
    }
}
