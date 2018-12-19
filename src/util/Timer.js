class Timer {
    mark(tag: string): void {
        performance.mark(tag);
    }

    clearMark(tag: string): void {
        performance.clearMarks(tag);
    }

    getDuration(firstTag: string, secondTag: string): number {
        const measureTag = `${firstTag}-${secondTag}`;
        performance.measure(measureTag, firstTag, secondTag);

        const measures = performance.getEntriesByName(measureTag);
        const time = measures[0].duration;

        // clean up the measure object
        performance.clearMeasures(measureTag);

        return time;
    }
}

export default new Timer();
