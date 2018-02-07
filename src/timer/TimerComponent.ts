import { Component, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Task, Interval } from './Task';

@Component({
	selector: 'timer',
	template: `<div>
	<div class="title">Search</div>
	<div><input type="text" [(ngModel)]="searchText"/></div>
	<button (click)="addNew()">Add</button>
	<button *ngIf="currentInterval" (click)="finish()">Finish</button>
	<div>Total duration: {{ totalDurationString }}<div>
	<div *ngFor="let task of tasks">
		<div *ngIf="matchesFilter(task)" class="task" [ngClass]="{active: task.intervals.indexOf(currentInterval) >= 0}">
			<div class="title" *ngIf="!task.editTitle" (click)="startEditTitle(task)">{{task.title}}</div>
			<div class="title" *ngIf="task.editTitle"><input type="text" [(ngModel)]="task.title"
				(blur)="finishEditTitle(task)" (keyup)="finishKeyListener($event, task)" (load)="asd($event)" #editField/></div>
			<div>
				<div *ngIf="task.durationString" (click)="toggleDetails(task)">Duration: {{ task.durationString }}</div>
			</div>
			<div *ngIf="task.detailsOpen">
				<div *ngFor="let interval of task.intervals" class="interval">
					<div>From: {{ interval.startTimeString }}</div>
					<div *ngIf="interval.endTimeString">To: {{ interval.endTimeString }}</div>
					<div>Duration: {{ interval.durationString }}</div>
				</div>
			</div>
			<div *ngIf="task.intervals.indexOf(currentInterval) < 0">
				<button (click)="extend(task)">Continue</button>
			</div>
		</div>
	</div>
</div>`,
})
export class TimerComponent {

	@ViewChildren('editField') protected editFields: QueryList<ElementRef>;

	protected readonly tasks: Task[] = [];
	protected searchText: string = '';
	protected currentTask: Task;
	protected currentInterval: Interval;
	protected totalDurationString: string = this.getDurationString(0);

	constructor() {
		setInterval(() => {
			this.refreshDuration(true);
		}, 1000);
	}

	public addNew(): void {
		this.close();
		const task: Task = {
			intervals: [],
			duration: 0,
			durationString: this.getDurationString(0),
			detailsOpen: false,
			editTitle: false,
			title: 'Task',
		};
		this.tasks.push(task);
		this.open(task);
	}

	public extend(task: Task) {
		this.close();
		this.open(task);
	}

	public finish(): void {
		this.close();
		this.currentTask = undefined;
		this.currentInterval = undefined;
	}

	public toggleDetails(task: Task): void {
		task.detailsOpen = !task.detailsOpen;
	}

	public startEditTitle(task: Task) {
		task.editTitle = true;
		setTimeout(() => (<HTMLScriptElement>this.editFields.first.nativeElement).focus(), 0);
	}

	public finishKeyListener(event: KeyboardEvent, task: Task) {
		if(event.keyCode == 13) {
			this.finishEditTitle(task);
		}
	}

	public finishEditTitle(task: Task) {
		task.editTitle = false;
	}

	public matchesFilter(task: Task): boolean {
		return task.title.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0;
	}

	public asd(event) {
		console.log(event);
	}

	protected open(task: Task): void {
		const start: Date = new Date();
		const interval: Interval = {
			startTime: start,
			startTimeString: this.dateToString(start),
			durationString: this.getDurationString(0),
		};
		task.intervals.push(interval);
		this.currentTask = task;
		this.currentInterval = interval;
	}

	protected close(): void {
		if (this.currentInterval) {
			const end: Date = new Date();
			this.currentInterval.endTime = end;
			this.currentInterval.endTimeString = this.dateToString(end);
			this.currentInterval.duration = this.currentInterval.endTime.getTime() - this.currentInterval.startTime.getTime();
			this.currentTask.duration += this.currentInterval.duration;
			this.refreshDuration(false);
		}
	}

	protected refreshDuration(onGoing: boolean): void {
		if(!this.currentInterval) {
			return;
		}
		let taskDuration: number;
		if(onGoing) {
			const currentIntervalDuration = new Date().getTime() - this.currentInterval.startTime.getTime();
			this.currentInterval.durationString = this.getDurationString(currentIntervalDuration);
			taskDuration = this.currentTask.intervals.filter(i => i.duration).reduce((sum, i) => sum + i.duration, 0) + currentIntervalDuration;
			this.currentTask.durationString = this.getDurationString(taskDuration);
		} else {
			const currentIntervalDuration = this.currentInterval.endTime.getTime() - this.currentInterval.startTime.getTime();
			this.currentInterval.durationString = this.getDurationString(currentIntervalDuration);
			taskDuration = this.currentTask.intervals.reduce((sum, i) => sum + i.duration, 0);
			this.currentTask.durationString = this.getDurationString(taskDuration);
		}
		const totalDuration = this.tasks.filter(t => t!==this.currentTask).reduce((sum, i) => sum + i.duration, 0) + taskDuration;
		this.totalDurationString = this.getDurationString(totalDuration);
	}

	protected dateToString(date: Date): string {
		return date.toISOString().replace('T', ' ').replace('Z', '').substr(0, 16);
	}
	
	protected getDurationString(duration: number): string {
		const hours = Math.floor(duration / (60 * 60 * 1000));
		duration = duration % (60 * 60 * 1000);

		const minutes = Math.floor(duration / (60 * 1000));
		duration = duration % (60 * 1000);

		const seconds = Math.floor(duration / 1000);
		
		return hours + 'h ' + minutes + 'm ' + seconds + 's';
	}
}