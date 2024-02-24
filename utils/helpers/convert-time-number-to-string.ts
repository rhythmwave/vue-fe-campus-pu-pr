export function convertTimeNumberToString(date: number): string {
    return parseFloat(date.toString()).toFixed(0).replace(/\B(?=(\d{2})+(?!\d))/g,".")
}
    