import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetStudentClassAnnouncementListRequest {
    name: string
}
  

export interface GetStudentClassAnnouncementListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetStudentClassAnnouncementListData[]
}

export interface GetStudentClassAnnouncementListData {
    id: string
    title: string
    content: string
    file_path: string
    file_path_type: string
    file_url: string
    start_time: string
    end_time: string
}