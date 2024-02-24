import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetRoomListRequest {
    name: string
}
  

export interface GetRoomListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetRoomListData[]
}

export interface GetRoomListData {
    id: string
    code: string
    name: string
    capacity: number
    is_laboratory: boolean
    building_id: string
}