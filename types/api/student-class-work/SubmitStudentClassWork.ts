import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface SubmitStudentClassWorkRequest {
    class_work_id: string
    file_path: string
    file_path_type: string
}


export interface SubmitStudentClassWorkRoot {
    meta: MetaModel
    data: any
}
