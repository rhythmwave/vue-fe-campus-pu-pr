import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetLecturerClassGradeComponentListRequest {
    name: string
}
  

export interface GetLecturerClassGradeComponentListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetLecturerClassGradeComponentListData[]
}

export interface GetLecturerClassGradeComponentListData {
    id: string
    name: string
    percentage: number
    is_active: boolean
}