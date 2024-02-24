import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetBuildingDetailRoot {
    meta: MetaModel
    data: GetBuildingDetaiData
}

export interface GetBuildingDetaiData {
    id: string
    level: string
    faculty_id: string
    faculty_name: string
    major_id: string
    major_name: string
    code: string
    name: string
}
