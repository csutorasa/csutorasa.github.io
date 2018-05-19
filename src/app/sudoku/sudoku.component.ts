import { Component, OnInit } from '@angular/core';

interface Cell {
    x: number;
    y: number;
    value?: number;
    possibleValues: Set<number>;
    blocks: Block[];
}

interface Block {
    name: string;
    cells: Cell[];
}

@Component({
    selector: 'app-sudoku',
    templateUrl: './sudoku.component.html',
    styleUrls: ['./sudoku.component.scss']
})
export class SudokuComponent implements OnInit {
    protected readonly size: number = 9;

    public input: string;
    public cells: Cell[][] = [];
    protected blocks: Block[] = [];

    public readonly reset = `0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0`;

    public readonly easy1 = `0 0 0 2 6 0 7 0 1
6 8 0 0 7 0 0 9 0
1 9 0 0 0 4 5 0 0
8 2 0 1 0 0 0 4 0
0 0 4 6 0 2 9 0 0
0 5 0 0 0 3 0 2 8
0 0 9 3 0 0 0 7 4
0 4 0 0 5 0 0 3 6
7 0 3 0 1 8 0 0 0`;

    public readonly easy2 = `1 0 0 4 8 9 0 0 6
7 3 0 0 0 0 0 4 0
0 0 0 0 0 1 2 9 5
0 0 7 1 2 0 6 0 0
5 0 0 7 0 3 0 0 8
0 0 6 0 9 5 7 0 0
9 1 4 6 0 0 0 0 0
0 2 0 0 0 0 0 3 7
8 0 0 5 1 2 0 0 4`;

    public readonly intermediate = `0 2 0 6 0 8 0 0 0
5 8 0 0 0 9 7 0 0
0 0 0 0 4 0 0 0 0
3 7 0 0 0 0 5 0 0
6 0 0 0 0 0 0 0 4
0 0 8 0 0 0 0 1 3
0 0 0 0 2 0 0 0 0
0 0 9 8 0 0 0 3 6
0 0 0 3 0 6 0 9 0`;

    public readonly hard = `0 0 0 6 0 0 4 0 0
7 0 0 0 0 3 6 0 0
0 0 0 0 9 1 0 8 0
0 0 0 0 0 0 0 0 0
0 5 0 1 8 0 0 0 3
0 0 0 3 0 6 0 4 5
0 4 0 2 0 0 0 6 0
9 0 3 0 0 0 0 0 0
0 2 0 0 0 0 1 0 0`;

    constructor() {
        const values: number[][] = [];
        for (let i = 0; i < this.size; i++) {
            values[i] = [];
            for (let j = 0; j < this.size; j++) {
                values[i][j] = 0;
            }
        }
        this.input = this.reset;

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
                    possibleValues: values[i][j] === 0 ? possibleValues : new Set([values[i][j]]),
                    blocks: [],
                };
            }
        }

        for (let i = 0; i < this.size; i++) {
            const rowBlock: Block = { name: `Row #${i}`, cells: [] };
            const columnBlock: Block = { name: `Column #${i}`, cells: [] };
            for (let j = 0; j < this.size; j++) {
                this.assignCellToBlock(this.cells[i][j], rowBlock);
                this.assignCellToBlock(this.cells[j][i], columnBlock);
            }
            this.blocks.push(rowBlock);
            this.blocks.push(columnBlock);
        }
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const areaBlock: Block = { name: `Area: Row ${i * 3}-${i * 3 + 2} Column ${j * 3}-${j * 3 + 2}`, cells: [] };
                for (let k = 0; k < 3; k++) {
                    for (let l = 0; l < 3; l++) {
                        this.assignCellToBlock(this.cells[i * 3 + k][j * 3 + l], areaBlock);
                    }
                }
                this.blocks.push(areaBlock);
            }
        }
    }

    protected createCombinations<T>(a: T[]): T[][] {
        const res: T[][] = [];
        for (let i = 0; i < Math.pow(2, a.length); i++) {
            let bin = i.toString(2);
            const set: T[] = [];
            bin = new Array((a.length - bin.length) + 1).join('0') + bin;
            for (let j = 0; j < bin.length; j++) {
                if (bin[j] === '1') {
                    set.push(a[j]);
                }
            }
            res.push(set);
        }
        return res;
    }

    public solve(): boolean {
        let processed = 1;
        for (let i = 0; i < 10 && processed > 0; i++) {
            processed = 0;
            for (const block of this.blocks) {
                processed += this.filterValueAlreadyExistsInBlock(block);
                processed += this.setValueOnlyOnePossibilityinBlock(block);
                processed += this.valueInMultipleBlocks(block);
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
        const presentValues: number[] = Array.from(this.createValuesSequence()).filter(v => !filterValues.includes(v));
        return block.cells.filter(c => c.value == null).map(cell => {
            return this.removePossibleValues(cell, `${block.name} contains value(s) ${presentValues.toString()}`, ...filterValues);
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
                return this.removePossibleValues(possibleCell, `In ${block.name} only here can be ${value}`, ...valuesToRemove);
            }
            return false;
        }).reduce((a, b) => a + (b ? 1 : 0), 0);
    }

    public valueInMultipleBlocks(block: Block): number {
        return Array.from(this.createValuesSequence()).map(value => {
            const cells = block.cells.filter(c => c.value == null).filter(c => c.possibleValues.has(value));
            if (cells.length >= 2 && cells.length <= 3) {
                const blocksToModify = this.blocks.filter(b => b !== block).filter(b => cells.every(c => b.cells.includes(c)));
                return blocksToModify.map(b => b.cells
                    .filter(c => !cells.includes(c))
                    .map(c => this.removePossibleValues(c, `${block.name} can contain values in cells matching ${b.cells}`, value))
                    .reduce((x, y) => x + (y ? 1 : 0), 0)
                ).reduce((x, y) => x + y, 0);
            }
            return 0;
        }).reduce((x, y) => x + y, 0);
    }

    public nextGen(block: Block): number {
        const emptyCells: Cell[] = block.cells.filter(c => c.value == null);
        const possibleValues: Set<number> = new Set(block.cells.filter(c => c.value != null).map(c => c.value));
        const combinations = this.createCombinations(emptyCells).filter(c => c.length !== emptyCells.length && c.length > 1);
        return combinations.map(combination => {
            const include = emptyCells.filter(c => combination.includes(c));
            const exclude = emptyCells.filter(c => !combination.includes(c));
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
                return this.removePossibleValues(c, 'nexgen', ...Array.from(valuesToRemoveFromExclude));
            }).reduce((a, b) => a + (b ? 1 : 0), 0);
            const included = include.map(c => {
                return this.removePossibleValues(c, 'nexgen', ...valuesToRemoveFromInclude);
            }).reduce((a, b) => a + (b ? 1 : 0), 0);
            return included + excluded;
        }
        return 0;
    }

    protected removePossibleValues(cell: Cell, reason: string, ...removeValues: number[]): boolean {
        if (cell.value != null) {
            return false;
        }
        const changed = removeValues.map(v => cell.possibleValues.delete(v)).reduce((a, b) => a + (b ? 1 : 0), 0);
        if (changed > 0) {
            if (cell.value == null && cell.possibleValues.size === 1) {
                cell.value = Array.from(cell.possibleValues)[0];
                console.log('Value set', reason, cell);
                cell.blocks.forEach(b => {
                    b.cells
                        .filter(c => c.value == null)
                        .filter(c => c.possibleValues.has(cell.value))
                        .forEach(c => {
                            this.removePossibleValues(c, `${b.name} contains value ${cell.value}`, cell.value);
                        });
                });
            } else {
                console.log('Possible values changed', reason, cell);
            }
            return true;
        }
        return false;
    }

    public setToString<T>(set: Set<T>): string {
        return Array.from(set).toString();
    }
}
