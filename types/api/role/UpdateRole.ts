import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateRoleRequest {
    id: string
    name: string
    description: string
    study_program_ids: string[]
    permission_ids: string[]
}
  

export interface UpdateRoleRoot {
    meta: MetaModel
    data: any
}
