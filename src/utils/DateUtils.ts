export function diffMinutes(dt2: Date, dt1: Date): number {
    let diff = dt2.getTime() - dt1.getTime();
    diff /= 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
}

export function addLeadingZeros(value: number): string {
    return ('0' + value).slice(-2);
}

export function formatDate(date: Date): string {
    return `${addLeadingZeros(date.getMonth() + 1)}.${addLeadingZeros(date.getDate())} 
    ${addLeadingZeros(date.getHours())} ${addLeadingZeros(date.getMinutes())}`;
}
