
import { MetaModel } from "../meta"

export interface UpdateAccreditationRequest {
    id: string
    decree_number: string
    decree_date: string
    decree_due_date: string
    accreditation: string
    is_active: boolean
}

export interface UpdateAccreditationRoot {
    meta: MetaModel
    data: any
}

