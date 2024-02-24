import { MetaModel, PaginationModel } from "~~/types/backoffice/backofficeTypes"

export interface GetLecturerClassAnnouncementRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetLecturerClassAnnouncementData[]
}

export interface GetLecturerClassAnnouncementData {
    id: string
    title: string
    content: string
    file_path: string
    file_path_type: string
    file_url: string
    start_time: string
    end_time: string
}
