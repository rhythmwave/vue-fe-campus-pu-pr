import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface UpdateSubjectGradeComponent {
    subject_id: string
    data: SubjectGradeComponentDataList[],
}

export interface SubjectGradeComponentDataList {
    name: string
    percentage: number
    is_active: boolean
}

export interface UpdateSubjectGradeComponentRoot {
    meta: MetaModel
    data: any
}