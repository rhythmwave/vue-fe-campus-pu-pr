import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetMasterOfLearningOutcomesRoot {
  meta: MetaModel
  pagination: PaginationModel
  data: GetMasterOfLearningOutcomesCategoryData[]
}
  
export interface GetMasterOfLearningOutcomesCategoryData {
    id: string
    name: string
    english_name: string
}

export interface GetMasterOfLearningOutcomesCategoryDetailData {
  
}
export interface GetMasterOfLearningOutcomesData {
    id: string
    name: string
    english_name: string
}

export interface GetMasterOfLearningOutcomesDetailData {
  
}
  