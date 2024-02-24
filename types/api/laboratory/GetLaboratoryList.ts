import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetLaboratoryListRequest {
    name: string
}
  

export interface GetLaboratoryListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetLaboratoryListData[]
}

export interface GetLaboratoryListData {
    id: string
    code: string
    name: string
    capacity: number
    is_laboratory: boolean
}