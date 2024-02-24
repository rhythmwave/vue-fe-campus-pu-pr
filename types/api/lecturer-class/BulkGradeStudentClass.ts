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
    subject_grade_component_id: string
    initial_grade: number
}