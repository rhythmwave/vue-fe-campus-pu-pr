import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetStudentClassMaterialDetailRoot {
    meta: MetaModel
    data: GetStudentClassMaterialDetailData
}

export interface GetStudentClassMaterialDetailData {
    id: string,
    name: string,
    age: number,
}
