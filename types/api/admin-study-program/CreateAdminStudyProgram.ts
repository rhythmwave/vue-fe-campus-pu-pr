import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateAdminStudyProgramRequest {
    name: string
    age: number
}
  

export interface CreateAdminStudyProgramRoot {
    meta: MetaModel
    data: any
}

