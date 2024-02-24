import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateLecturerRequest {
    name: string
    age: number
}
  

export interface CreateLecturerRoot {
    meta: MetaModel
    data: any
}

