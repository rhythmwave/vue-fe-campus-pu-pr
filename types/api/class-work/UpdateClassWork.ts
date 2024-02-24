import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateClassWorkRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateClassWorkRoot {
    meta: MetaModel
    data: any
}
