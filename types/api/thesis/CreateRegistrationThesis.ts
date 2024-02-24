import { MetaModel } from "../meta"

export interface CreateRegistrationThesisRequest {
    student_id: string
}

export interface CreateRegistrationThesisRoot {
    meta: MetaModel
    data: any
}