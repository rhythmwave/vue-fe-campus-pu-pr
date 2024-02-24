import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface BulkUpdateStudentPaymentRequest {
    student_ids: string[]
}
  

export interface BulkUpdateStudentPaymentRoot {
    meta: MetaModel
    data: any
}
