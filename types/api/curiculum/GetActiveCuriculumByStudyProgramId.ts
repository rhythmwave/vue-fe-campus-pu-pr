import { MetaModel } from "../meta"

export interface GetActiveCuriculumByStudyProgramIdRoot {
    meta: MetaModel
    data: GetActiveCuriculumByStudyProgramIdData
}

export interface GetActiveCuriculumByStudyProgramIdData {
    id: string
    study_program_id: string
    name: string
    year: string
    rector_decision_number: string
    rector_decision_date: string
    aggreeing_party: string
    aggreement_date: string
    ideal_study_period: number
    maximum_study_period: number
    remarks: string
    study_program_name: string
    study_level_short_name: string
    dikti_study_program_type: string
    is_active: boolean
    final_score_determinant: string
}
