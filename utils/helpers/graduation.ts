export { getYearGraduation, getMajorSMTA, getTypeSMTA, getYearBatch };

function getYearGraduation() :Array<string> {
    let date = new Date()
    let yearStart = date.getFullYear()-20
    let yearEnd = date.getFullYear()+5
    let year = []

    for (let index = yearStart; index < yearEnd; index++) {
        year.push(index.toString()+'/'+(index+1).toString())
    }
    return year
}

function getYearBatch() :Array<number> {
    let date = new Date()
    let yearStart = date.getFullYear()-10
    let yearEnd = date.getFullYear()+10
    let year = []

    for (let index = yearStart; index < yearEnd; index++) {
        year.push(index)
    }
    return year
}

function getMajorSMTA() :Array<string> {
    return [
        'SMU/MA IPA',
        'SMU/MA IPS',
        'SMK Teknik',
        'SMK Pertanian',
        'SMK Ekonomi',
        'SMK Sosial',
        'SMK Seni',
        'SMU/MA Bahasa',
        'SMK Pariwisata',
        'Sekolah Menengah Kedinasan',
        'Lain-lain',
    ]
}

function getTypeSMTA() :Array<string> {
    return [
        'SMA',
        'SMLB',
        'SMK',
        'MA',
        'MAK',
        'Paket C',
    ]
}