import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetLecturerAcademicGuidanceStudentListRequest {
    name: string
}
  

export interface GetLecturerAcademicGuidanceStudentListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetLecturerAcademicGuidanceStudentListData[]
}

export interface GetLecturerAcademicGuidanceStudentListData {
  id: string
  nim_number: string
  student_force: string
  name: string
  status: string
  study_plan_form_is_approved: boolean
}