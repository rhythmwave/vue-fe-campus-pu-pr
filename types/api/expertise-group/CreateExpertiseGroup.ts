import { MetaModel } from "../meta"

export interface CreateExpertiseGroupRequest {
    name: string
  }
  

export interface CreateExpertiseGroupRoot {
    meta: MetaModel
    data: any
}