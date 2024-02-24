import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface SetClassGradeComponentRequest {
    class_id: string
    data: SetClassGradeComponentData[]
}

export interface SetClassGradeComponentData {
    name: string
    percentage: number
    is_active: boolean
}


export interface SetClassGradeComponentRoot {
    meta: MetaModel
    data: any
}
