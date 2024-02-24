import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteSubjectRequest {
    id: string
}
  

export interface DeleteSubjectRoot {
    meta: MetaModel
    data: any
}
