import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface SetLecturerClassGradeComponentRequest {
    class_id: string
    data: SetLecturerClassGradeComponentData[]
}

export interface SetLecturerClassGradeComponentData {
    name: string
    percentage: number
    is_active: boolean
}


export interface SetLecturerClassGradeComponentRoot {
    meta: MetaModel
    data: any
}
