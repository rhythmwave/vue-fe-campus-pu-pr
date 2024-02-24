export function convertNumberMoney(money: number): string {
    let result = ''
    let temp = money.toString()
    let moneyNew = "";
    let index = 0
    for (let i = temp.length - 1; i >= 0; i--) {
        moneyNew += temp.charAt(index)
        index++
        if ((i) % 3 == 0 && i != 0) {
            moneyNew += "."
        }
    }
    return moneyNew
}