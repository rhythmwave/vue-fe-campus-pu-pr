import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetStudentClassAnnouncementDetailRoot {
    meta: MetaModel
    data: GetStudentClassAnnouncementDetailData
}

export interface GetStudentClassAnnouncementDetailData {
    id: string,
    name: string,
    age: number,
}
