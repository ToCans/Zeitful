export function colorToInt(hex: string): number {
    return parseInt(hex.replace('#', ''), 16);
}

export function intToColor(int: number): string {
    return '#' + int.toString(16).padStart(6, '0').toUpperCase();
}