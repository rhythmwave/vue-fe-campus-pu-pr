import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface SubmitStudentClassExamRequest {
    class_exam_id: string
    file_path: string
    file_path_type: string
}


export interface SubmitStudentClassExamRoot {
    meta: MetaModel
    data: any
}
