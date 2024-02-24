import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateStudentThesisRequest {
    topic: string
    title: string
    english_title: string
    remarks: string
    is_joint_thesis: boolean
    status: string
    files: UpdateStudentThesisFile[]
}

export interface UpdateStudentThesisFile {
    file_path: string
    file_path_type: string
    file_description: string
}

export interface UpdateStudentThesisRoot {
    meta: MetaModel
    data: any
}
