import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface DeleteStudentTranscriptRequest {
    id: string
}
  

export interface DeleteStudentTranscriptRoot {
    meta: MetaModel
    data: any
}
