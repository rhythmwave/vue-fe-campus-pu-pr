import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface MergeClassStudentClassRoot {
    meta: MetaModel
    data: any
}

export interface MergeClassStudentClassRequest{
    destination_class_id: string
    source_class_ids: string[]
}