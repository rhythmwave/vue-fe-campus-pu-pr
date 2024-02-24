import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateOfficerRequest {
    id_national_lecturer: string
    name: string
    employee_no: string
    title: string
    english_title: string
    study_program_id: string
    signature_path: string
    signature_path_type: string
    show_signature: boolean
}
  

export interface CreateOfficerRoot {
    meta: MetaModel
    data: any
}

