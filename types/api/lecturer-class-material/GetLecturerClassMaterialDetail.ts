import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetLecturerClassMaterialDetailRoot {
    meta: MetaModel
    data: GetLecturerClassMaterialDetailData
}

export interface GetLecturerClassMaterialDetailData {
    id: string,
    name: string,
    age: number,
}
