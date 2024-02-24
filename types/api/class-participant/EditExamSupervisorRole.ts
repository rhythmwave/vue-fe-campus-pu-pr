import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface EditExamSupervisorRole {
    id: string
    name: string
    sort: number
}

export interface EditExamSupervisorRoleRoot {
    meta: MetaModel
    data: any
}