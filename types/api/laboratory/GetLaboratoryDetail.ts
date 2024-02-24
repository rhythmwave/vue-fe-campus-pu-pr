import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetLaboratoryDetailRoot {
    meta: MetaModel
    data: GetLaboratoryDetaiData
}

export interface GetLaboratoryDetaiData {
    id: string
    building_id: string
    building_code: string
    building_name: string
    code: string
    name: string
    capacity: number
    exam_capacity: number
    purpose: string
    is_usable: boolean
    area: number
    phone_number: string
    facility: string
    remarks: string
    owner: string
    location: string
    study_program_id: string
    study_program_name: string
    is_laboratory: boolean
  }
  