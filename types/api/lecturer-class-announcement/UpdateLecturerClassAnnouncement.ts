import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateLecturerClassAnnouncementRoot {
    meta: MetaModel
    data: any
}

export interface UpdateLecturerClassAnnouncementRequest {
    id: string
    class_id: string
    title: string
    content: string
    file_path: string
    file_path_type: string
    file_url: string
    start_time: string
    end_time: string
}