
export function convertNumberTimeToString(time: number): string {
    let stringTime = time.toString()
    if (stringTime.length == 3) {
        stringTime = '0' + stringTime
    }

    return stringTime.substring(0, 2) + ':' + stringTime.substring(2, 4);
}