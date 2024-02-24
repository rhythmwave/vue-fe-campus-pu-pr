import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateRoleRequest {
    name: string
    description: string
    study_program_ids: string[]
    permission_ids: string[]
}
  

export interface CreateRoleRoot {
    meta: MetaModel
    data: any
}
