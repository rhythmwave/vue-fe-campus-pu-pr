import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface TransferStudentClassRoot {
    meta: MetaModel
    data: any
}

export interface TransferStudentClassRequest{
    source_class_id: string
    data: TransferStudentClassDataRequest[]
}

export interface TransferStudentClassDataRequest{
    student_id: string
    destination_class_id: string
}