import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateLecturerClassWorkRequest {
    class_id: string
    title: string
    abstraction: string
    file_path: string
    file_path_type: string
    start_time: string
    end_time: string
}
  

export interface CreateLecturerClassWorkRoot {
    meta: MetaModel
    data: any
}

