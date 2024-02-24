export function convertDayOfWeek(date: number): string {
    let result = ''
    switch (date) {
        case 1:
            result = 'Senin'
            break;
        case 2:
            result = 'Selasa'
            break;
        case 3:
            result = 'Rabu'
            break;
        case 4:
            result = 'Kamis'
            break;
        case 5:
            result = `Jum'at`
            break;
        case 6:
            result = 'Sabtu'
            break;
        case 7:
            result = 'Minggu'
            break;
    }
    return result
}