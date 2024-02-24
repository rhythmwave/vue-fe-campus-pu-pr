import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateLecturerResignationRequest {
    id: string
    semester_id: string
    resign_date: string
    resignation_number: string
    purpose: string
    remarks: string
}
  

export interface UpdateLecturerResignationRoot {
    meta: MetaModel
    data: any
}
