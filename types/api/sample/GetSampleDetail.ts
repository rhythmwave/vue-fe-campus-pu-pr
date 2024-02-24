import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetSampleDetailRoot {
    meta: MetaModel
    data: GetSampleDetailData
}

export interface GetSampleDetailData {
    id: string,
    name: string,
    age: number,
}
