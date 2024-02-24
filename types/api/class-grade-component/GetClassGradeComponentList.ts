import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetClassGradeComponentListRequest {
    name: string
}
  

export interface GetClassGradeComponentListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetClassGradeComponentListData[]
}

export interface GetClassGradeComponentListData {
    id: string
    name: string
    percentage: number
    is_active: boolean
}