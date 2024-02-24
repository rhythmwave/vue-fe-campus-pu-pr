import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface ReshuffleStudentClassRoot {
    meta: MetaModel
    data: any
}

export interface ReshuffleStudentClassRequest{
    destination_class_id: string
    students: ReshuffleStudentClassDataRequest[]
}

export interface ReshuffleStudentClassDataRequest{
    source_class_id: string
    student_id: string
}