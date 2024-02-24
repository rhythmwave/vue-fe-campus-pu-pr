import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface SetEquivalentSubjectRequest {
    subject_id: string
    equivalent_subject_id: string
    is_vice_versa: boolean
}


export interface SetEquivalentSubjectRoot {
    meta: MetaModel
    data: any
}
