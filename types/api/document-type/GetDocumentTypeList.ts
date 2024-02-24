import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetDocumentTypeListRequest {
    name: string
}
  

export interface GetDocumentTypeListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetDocumentTypeListData[]
}

export interface GetDocumentTypeListData {
    id: string,
    name: string,
}