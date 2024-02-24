import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateStudentThesisRequest {
    topic: string
    title: string
    english_title: string
    remarks: string
    is_joint_thesis: boolean
    file_path: string
    file_path_type: string
    file_description: string
} 

export interface CreateStudentThesisRoot {
    meta: MetaModel
    data: any
}

