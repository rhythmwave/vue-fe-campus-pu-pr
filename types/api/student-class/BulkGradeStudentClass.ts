import { boolean } from "yup"
import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface BulkGradeStudentClassRoot {
    meta: MetaModel
    data: any
}

export interface BulkGradeStudentClassRequest{
    class_id: string
    students: StudentRequest[]
}
export interface StudentRequest{
    student_id: string
    grades: GradeRequest[]
}
export interface GradeRequest{
    class_grade_component_id: string
    initial_grade: number
}

export interface ClassGradeRequest{
    class_id: string
    data: number
}

export interface ClassGradeDataRequest {
    name: string
    percentage: number
    is_active: boolean
}