import { MetaModel } from "../meta"

export interface UpdateExpertiseGroupRequest {
    id: string
    name: string
}
  

export interface UpdateExpertiseGroupRoot {
    meta: MetaModel
    data: any
}