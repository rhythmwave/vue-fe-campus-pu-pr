import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetStudentFileSharingDetailRoot {
    meta: MetaModel
    data: GetStudentFileSharingDetailData
}

export interface GetStudentFileSharingDetailData {
    id: string,
    name: string,
    age: number,
}
