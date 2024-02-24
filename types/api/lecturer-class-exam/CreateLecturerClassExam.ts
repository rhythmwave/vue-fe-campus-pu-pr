import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateLecturerClassExamRequest {
    class_id: string
    title: string
    abstraction: string
    file_path: string
    file_path_type: string
    start_time: string
    end_time: string
}
  

export interface CreateLecturerClassExamRoot {
    meta: MetaModel
    data: any
}

