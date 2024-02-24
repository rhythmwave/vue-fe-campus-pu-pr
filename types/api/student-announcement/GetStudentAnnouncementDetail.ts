import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetStudentAnnouncementDetailRoot {
    meta: MetaModel
    data: GetStudentAnnouncementDetailData
}

export interface GetStudentAnnouncementDetailData {
    id: string,
    name: string,
    age: number,
}
