import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateLecturerResignationRequest {
    lecturer_id: string
    semester_id: string
    resign_date: string
    resignation_number: string
    purpose: string
    remarks: string
}
  

export interface CreateLecturerResignationRoot {
    meta: MetaModel
    data: any
}

