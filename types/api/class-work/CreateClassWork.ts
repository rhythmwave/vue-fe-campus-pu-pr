import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateClassWorkRequest {
    name: string
    age: number
}
  

export interface CreateClassWorkRoot {
    meta: MetaModel
    data: any
}

