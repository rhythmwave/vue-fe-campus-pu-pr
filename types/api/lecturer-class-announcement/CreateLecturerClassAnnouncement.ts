import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateLecturerClassAnnouncementRoot {
    meta: MetaModel
    data: any
}

export interface CreateLecturerClassAnnouncementRequest {
    class_id: string
    title: string
    content: string
    file_path: string
    file_path_type: string
    start_time: string
    end_time: string
}