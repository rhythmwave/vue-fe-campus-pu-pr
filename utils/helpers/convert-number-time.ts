export function convertNumberTime(time: number): string {
    let result = ''
    let temp = time.toString()
    if (temp.length == 3) {
        temp = "0" + temp
    }
    return temp.substring(0, 2) + ":" + temp.substring(2, 4)
}