import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"


export interface GetActiveSemesterClassListRequest {
    name: string
}
  

export interface GetActiveSemesterClassListRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: GetActiveSemesterClassListData[]
}

export interface GetActiveSemesterClassListData {
    semester_package: number
    classes: GetActiveSemesterClassClass[]
  }
  
  export interface GetActiveSemesterClassClass {
    id: string
    name: string
    subject_code: string
    subject_name: string
    subject_is_mandatory: boolean
    subject_theory_credit: number
    subject_practicum_credit: number
    subject_field_practicum_credit: number
    maximum_participant: number
    lecturers: GetActiveSemesterClassLecturer[]
  }
  
  export interface GetActiveSemesterClassLecturer {
    name: string
    front_title: string
    back_degree: string
  }