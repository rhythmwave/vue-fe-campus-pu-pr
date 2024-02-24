import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateSemesterActivationRequest {
    id: string
    is_active: boolean
}

export interface UpdateSemesterActivationRoot {
    meta: MetaModel
    data: any
}
