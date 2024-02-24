import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetStudentAnnouncementListRequest {
    name: string
}
  

export interface GetStudentAnnouncementListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetStudentAnnouncementListData[]
}

export interface GetStudentAnnouncementListData {
    id: string
    type: string
    title: string
    announcement_date: string
    file_url: string
    file_title: string
    content: string
}