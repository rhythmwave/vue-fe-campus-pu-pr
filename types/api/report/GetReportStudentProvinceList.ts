import { MetaModel } from "../meta"


export interface GetReportStudentProvinceListRequest {
    name: string
}

export interface GetReportStudentProvinceListRoot {
    meta: MetaModel
    data: GetReportStudentProvinceListData[]
}


export interface GetReportStudentProvinceListData {
    province_id: number
    province_name: string
    student_forces: GetReportStudentProvinceListStudentForce[]
}

export interface GetReportStudentProvinceListStudentForce {
    student_force: number
    total: number
}
