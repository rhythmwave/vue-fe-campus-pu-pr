import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateRoomRequest {
    building_id: string
    code: string
    name: string
    capacity: number
    exam_capacity: number
    is_usable: boolean
    area: number
    phone_number: string
    facility: string
    remarks: string
    purpose: string
    owner: string
    location: string
    study_program_id: string
    is_laboratory: boolean
}
  

export interface CreateRoomRoot {
    meta: MetaModel
    data: any
}

