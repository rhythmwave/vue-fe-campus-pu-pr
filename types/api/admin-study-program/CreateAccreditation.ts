import { MetaModel } from "../meta"

export interface CreateAccreditationRequest {
    study_program_id: string
    decree_number: string
    decree_date: string
    decree_due_date: string
    accreditation: string
    is_active: boolean
}

export interface CreateAccreditationRoot {
    meta: MetaModel
    data: any
}

