import { MetaModel } from "../meta"

export interface CreateThesisRequest {
    student_id: string
    topic: string
    status: string
    title: string
    english_title: string
    start_semester_id: string
    start_date: string
    remarks: string
    is_joint_thesis: boolean
    file_path: string
    file_path_type: string
    file_description: string
    proposal_seminar_date: string
    proposal_certificate_number: string
    proposal_certificate_date: string
    thesis_supervisors: CreateThesisSupervisorRequest[]
}

export interface CreateThesisSupervisorRequest {
    lecturer_id: string
    lecturer_name: string
    thesis_supervisor_role_id: string
    thesis_supervisor_role_name: string
}
  

export interface CreateThesisRoot {
    meta: MetaModel
    data: any
}