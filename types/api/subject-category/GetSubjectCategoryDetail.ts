import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetSubjectCategoryDetailRoot {
    meta: MetaModel
    data: GetSubjectCategoryDetaiData
}

export interface GetSubjectCategoryDetaiData {
    data: any
}
