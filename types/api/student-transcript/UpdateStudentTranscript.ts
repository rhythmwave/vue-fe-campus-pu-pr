import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateStudentTranscriptRequest {
    id: string
    name: string
    age: number
}
  

export interface UpdateStudentTranscriptRoot {
    meta: MetaModel
    data: any
}
