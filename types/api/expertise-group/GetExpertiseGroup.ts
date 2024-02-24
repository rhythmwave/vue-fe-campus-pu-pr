import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GroupExpertiseListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GroupExpertiseListData[]
}

export interface GroupExpertiseListData {
    id: string
    code: string
    name: string
}
