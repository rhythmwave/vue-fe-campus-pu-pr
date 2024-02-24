import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface SetPrerequisiteSubjectRequest {
    id: string
    prerequisites: SetPrerequisitePrerequisiteSubject[]
}

export interface SetPrerequisitePrerequisiteSubject {
  id: string
  prerequisite_type: string
  minimum_grade_point: number
}
  

export interface SetPrerequisiteSubjectRoot {
    meta: MetaModel
    data: any
}
