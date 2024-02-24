import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetClassMaterialListRequest {
  name: string
}


export interface GetClassMaterialListRoot {
  meta: MetaModel
  pagination: PaginationModel
  data: GetClassMaterialListData[]
}

export interface GetClassMaterialListData {
  id: string
  title: string
  abstraction: string
  file_url: string
  lecturer_id: string
  lecturer_name: string
  lecturer_front_title: string
  lecturer_back_degree: string
  is_active: boolean
  created_at: string
}