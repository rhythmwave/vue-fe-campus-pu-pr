import { MetaModel } from "../meta"


export interface GetReportStudentSchoolProvinceListRequest {
    name: string
}

export interface GetReportStudentSchoolProvinceListRoot {
    meta: MetaModel
    data: GetReportStudentSchoolProvinceListData[]
}


export interface GetReportStudentSchoolProvinceListData {
    province_id: number
    province_name: string
    student_forces: GetReportStudentSchoolProvinceListStudentForce[]
}

export interface GetReportStudentSchoolProvinceListStudentForce {
    student_force: number
    total: number
}
