import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface GetStudentSkpiDetailRoot {
    meta: MetaModel
    data: GetStudentSkpiDetailData
}

export interface GetStudentSkpiDetailData {
    id: string
    student_id: string
    student_nim_number: string
    student_name: string
    student_study_program_id: string
    student_study_program_name: string
    student_dikti_study_program_code: string
    skpi_number: string
    is_approved: boolean
    achievement_path: string
    achievement_path_type: string
    achievement_url: string
    organization_path: string
    organization_path_type: string
    organization_url: string
    certificate_path: string
    certificate_path_type: string
    certificate_url: string
    language_path: string
    language_path_type: string
    language_url: string
    achievements: GetStudentSkpiDetailAchievement[]
    organizations: GetStudentSkpiDetailOrganization[]
    certificates: GetStudentSkpiDetailCertificate[]
    character_buildings: GetStudentSkpiDetailCharacterBuilding[]
    internships: GetStudentSkpiDetailInternship[]
    languages: GetStudentSkpiDetailLanguage[]
}

export interface GetStudentSkpiDetailAchievement {
    id: string
    name: string
    year: number
}

export interface GetStudentSkpiDetailOrganization {
    id: string
    name: string
    position: string
    service_length: number
}

export interface GetStudentSkpiDetailCertificate {
    id: string
    name: string
}

export interface GetStudentSkpiDetailCharacterBuilding {
    id: string
    name: string
}

export interface GetStudentSkpiDetailInternship {
    id: string
    name: string
}

export interface GetStudentSkpiDetailLanguage {
    id: string
    name: string
    score: string
    date: string
}
