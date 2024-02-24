import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateRoomRequest {
    id: string
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
}

export interface UpdateRoomRoot {
    meta: MetaModel
    data: any
}
