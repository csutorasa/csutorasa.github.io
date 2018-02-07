export interface Interval {
    startTime: Date;
    startTimeString: string;
    endTime?: Date;
    endTimeString?: string;
    duration?: number;
    durationString: string;
}

export interface Task {
    intervals: Interval[];
    duration: number;
    durationString: string;
    detailsOpen: boolean;
    title: string;
    editTitle: boolean;
}