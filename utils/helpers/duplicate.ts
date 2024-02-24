export interface DateStartEnd {
    index: number,
    date: string,
    start: number,
    end: number
}
// export function findDuplicates(dates: string[]): number[] {
//     let result = <number[]>[]
//     dates.filter(function(item, index){
//         if(dates.indexOf(item) !== index){
//             result.push(index)
//         }
//         if (result.length > 0){
//             result.push(index-1)
//         }
//     })
//     return result
// }
export function isDuplicate(dates: string[]): boolean {
    let result = false
    dates.filter(function(item, index){
        if(dates.indexOf(item) !== index){
            result = true
        }
    })
    return result
}