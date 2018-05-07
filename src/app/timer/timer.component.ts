import { Component, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';

interface Interval {
    startTime: Date;
    startTimeString: string;
    endTime?: Date;
    endTimeString?: string;
    duration?: number;
    durationString: string;
}

interface Task {
    intervals: Interval[];
    duration: number;
    durationString: string;
    detailsOpen: boolean;
    title: string;
    editTitle: boolean;
}

@Component({
    selector: 'app-timer',
    templateUrl: './timer.component.html',
    styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

    @ViewChildren('editField') protected editFields: QueryList<ElementRef>;

    protected readonly tasks: Task[] = [];
    protected searchText = '';
    protected currentTask: Task;
    protected currentInterval: Interval;
    protected totalDurationString: string;

    constructor() {
        this.load();
        this.refreshDuration(this.currentTask != null);
        setInterval(() => {
            this.refreshDuration(true);
        }, 1000);
    }

    ngOnInit() {
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
        this.save();
    }

    public extend(task: Task) {
        this.close();
        this.open(task);
        this.save();
    }

    public finish(): void {
        this.close();
        this.currentTask = undefined;
        this.currentInterval = undefined;
        this.save();
    }

    public toggleDetails(task: Task): void {
        task.detailsOpen = !task.detailsOpen;
    }

    public startEditTitle(task: Task) {
        task.editTitle = true;
        setTimeout(() => (<HTMLScriptElement>this.editFields.first.nativeElement).focus(), 0);
    }

    public finishKeyListener(event: KeyboardEvent, task: Task) {
        if (event.keyCode === 13) {
            this.finishEditTitle(task);
        }
    }

    public finishEditTitle(task: Task) {
        task.editTitle = false;
    }

    public matchesFilter(task: Task): boolean {
        return task.title.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0;
    }

    protected save(): void {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        localStorage.setItem('currenttask', this.tasks.indexOf(this.currentTask).toString());
        localStorage.setItem('currentinterval',
            this.currentTask ? this.currentTask.intervals.indexOf(this.currentInterval).toString() : '-1');
    }

    protected load(): void {
        this.tasks.length = 0;
        try {
            const tasks: Task[] = <Task[]>JSON.parse(localStorage.getItem('tasks'));
            tasks.forEach(t => t.intervals.forEach(i => {
                i.startTime = new Date(<any>i.startTime);
                if (i.endTime) {
                    i.endTime = new Date(<any>i.endTime);
                }
            }));
            this.tasks.push(...tasks);
            const taskIndex: number = parseInt(localStorage.getItem('currenttask'), 10);
            if (taskIndex >= 0) {
                this.currentTask = this.tasks[taskIndex];
                const intervalIndex: number = parseInt(localStorage.getItem('currentinterval'), 10);
                if (intervalIndex >= 0) {
                    this.currentInterval = this.currentTask.intervals[intervalIndex];
                }
            }
        } catch (e) {
            console.warn(e);
        }
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
        let taskDuration = 0;
        if (this.currentInterval) {
            if (onGoing) {
                const currentIntervalDuration = new Date().getTime() - this.currentInterval.startTime.getTime();
                this.currentInterval.durationString = this.getDurationString(currentIntervalDuration);
                taskDuration = this.currentTask.intervals.filter(i => i.duration).reduce((sum, i) => sum + i.duration, 0)
                    + currentIntervalDuration;
                this.currentTask.durationString = this.getDurationString(taskDuration);
            } else {
                const currentIntervalDuration = this.currentInterval.endTime.getTime() - this.currentInterval.startTime.getTime();
                this.currentInterval.durationString = this.getDurationString(currentIntervalDuration);
                taskDuration = this.currentTask.intervals.reduce((sum, i) => sum + i.duration, 0);
                this.currentTask.durationString = this.getDurationString(taskDuration);
            }
        }
        const totalDuration = this.tasks.filter(t => t !== this.currentTask).reduce((sum, i) => sum + i.duration, 0) + taskDuration;
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
