import { MetaModel } from '../meta'
import { PaginationModel } from '../pagination'

export interface GetFacultyListData {
    id: string
    name: string
    short_name: string
}

export interface GetFacultyListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetFacultyListData[]
}
