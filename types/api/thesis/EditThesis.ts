import { MetaModel } from "../meta"

export interface EditThesisRequest {
    id: string
    student_id: string
    start_semester_id: string
    finish_semester_id: string
    topic: string
    title: string
    english_title: string
    start_date: string
    finish_date: string
    remarks: string
    is_joint_thesis: boolean
    status: string
    proposal_seminar_date: string
    proposal_certificate_number: string
    proposal_certificate_date: string
    files: EditThesisFileRequest[]
    thesis_supervisors: EditThesisSupervisorRequest[]
}

export interface EditThesisFileRequest {
    file_path: string
    file_url: string
    file_path_type: string
    file_description: string
}

export interface EditThesisSupervisorRequest {
    lecturer_id: string
    lecturer_name: string
    thesis_supervisor_role_id: string
    thesis_supervisor_role_name: string
}
  

export interface EditThesisRoot {
    meta: MetaModel
    data: any
}