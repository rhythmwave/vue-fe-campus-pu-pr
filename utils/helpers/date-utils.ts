export function convertDateWithoutTimeToTimezoned(date: string): string {
    let offset = (new Date().getTimezoneOffset())/60 * -1;
    let isNeggative = true;
    if (offset >= 0) {
        isNeggative = false
    }
    let formatTimeAppend = `T00:00:00${isNeggative ? '-' : '+'}${offset.toString().length == 1 ? "0" + offset : offset}00`
    return date + formatTimeAppend;
}
export function convertDateTimeToTimezoned(date: string, time: string): string {
    let offset = (new Date().getTimezoneOffset())/60 * -1;
    let isNeggative = true;
    if (offset >= 0) {
        isNeggative = false
    }
    let formatTimeAppend = `T${time}:00${isNeggative ? '-' : '+'}${offset.toString().length == 1 ? "0" + offset : offset}00`
    return date + formatTimeAppend;
}
export function formatYearMonthDate(date:string):string {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}
export function formatHourMinute(date:string):string {
    var d = new Date(date)
    let hour = '' + d.getHours()
    let minute = '' + d.getMinutes()
    let second = '' + d.getSeconds()

    return [hour, minute,  second].join('-');
}

export function formatDateNow() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

export function convertMonthToTextString(month: number): string {
    let result = ''
    switch (month) {
        case 1:
            result = 'Januari'
            break;
        case 2:
            result = 'Februari'
            break;
        case 3:
            result = 'Maret'
            break;
        case 4:
            result = 'April'
            break;
        case 5:
            result = 'Mei'
            break;
        case 6:
            result = 'Juni'
            break;
        case 7:
            result = 'Juli'
            break;
        case 8:
            result = 'Agustus'
            break;
        case 9:
            result = 'September'
            break;
        case 10:
            result = 'Oktober'
            break;
        case 11:
            result = 'November'
            break;
        case 12:
            result = 'Januari'
            break;
    }
    return result
}

export function convertStringTimeToNumberTime(time: string): number {
    let result = 0
    if(time){
        let data = time.split(':')
        let first = parseFloat(data[0])
        let second = parseFloat(data[1])

        result = parseFloat(first.toString() + second.toString())
    }
    return result
}

export function convertNumberTimeToStringTime(time: number): string {
    return parseFloat(time.toString()).toFixed(0).replace(/\B(?=(\d{2})+(?!\d))/g,".")
}

export function convertNumberTimeToStringTimeBootstrap(time: number): string {
    let result = ''
    let string = parseFloat(time.toString()).toFixed(0).replace(/\B(?=(\d{2})+(?!\d))/g,":")
    if(string){
        if(string.split(':')[0].length == 1){
            result = '0'+string
        }else{
            result = string
        }
    }
    return result
}