import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetSubjectGradeComponentListRoot {
    meta: MetaModel
    data: GetSubjectGradeComponentListData[]
}

export interface GetSubjectGradeComponentListData {
    id: string
    name: string
    percentage: string
    is_active: boolean
}