import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetLecturerAnnouncementDetailRoot {
    meta: MetaModel
    data: GetLecturerAnnouncementDetailData
}

export interface GetLecturerAnnouncementDetailData {
    id: string,
    name: string,
    age: number,
}
