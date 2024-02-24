import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateMajorRequest {
    name: string
    age: number
}
  

export interface CreateMajorRoot {
    meta: MetaModel
    data: any
}

