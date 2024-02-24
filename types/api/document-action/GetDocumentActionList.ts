import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetDocumentActionListRequest {
    name: string
}


export interface GetDocumentActionListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetDocumentActionListData[]
}

export interface GetDocumentActionListData {
    id: string
    action: string
    english_action: string
}