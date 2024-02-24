import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetSubjectCategoryListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetSubjectCategoryListData[]
}

export interface GetSubjectCategoryListData {
    id: string
    code: string
    name: string
}
