import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetLecturerAnnouncementListRequest {
    name: string
}
  

export interface GetLecturerAnnouncementListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetLecturerAnnouncementListData[]
}

export interface GetLecturerAnnouncementListData {
    id: string
    type: string
    title: string
    announcement_date: string
    file_url: string
    file_title: string
    content: string
}