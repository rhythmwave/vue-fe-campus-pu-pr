import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetMasterSKPI {
    meta: MetaModel
    pagination: PaginationModel
    data: GetMasterSKPIData[]
}
    
export interface GetMasterSKPIData {
    id: string
    name: string
    short_name: string
    kkni_qualification: string
    acceptance_requirement: string
    further_education_level: string
    professional_status: string
    course_language: string
}