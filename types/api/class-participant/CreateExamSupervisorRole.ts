import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateExamSupervisorRole {
    name: string
    sort: number
}

export interface CreateExamSupervisorRoleRoot {
    meta: MetaModel
    data: any
}