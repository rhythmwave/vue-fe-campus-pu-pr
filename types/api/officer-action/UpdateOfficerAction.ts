import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateOfficerActionRequest {
    id: string
    document_type_id: string
    document_action_id: string
    officer_id: string
}


export interface UpdateOfficerActionRoot {
    meta: MetaModel
    data: any
}
