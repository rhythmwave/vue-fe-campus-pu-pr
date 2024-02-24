import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateOfficerActionRequest {
    document_type_id: string
    document_action_id: string
    officer_id: string
}


export interface CreateOfficerActionRoot {
    meta: MetaModel
    data: any
}

