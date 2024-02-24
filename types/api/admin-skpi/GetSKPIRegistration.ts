import { MetaModel } from "../meta"
import { PaginationModel } from "../pagination"

export interface GetSKPIRegistration {
    meta: MetaModel
    pagination: PaginationModel
    data: GetSKPIRegistrationData[]
}
    
export interface GetSKPIRegistrationData {
    id: string
    student_id: string
    student_nim_number: string
    student_name: string
    student_study_program_id: string
    student_study_program_name: string
    student_dikti_study_program_code: string
    is_approved: boolean
}

export interface GetSKPIRegistrationDetail {
    meta: MetaModel
    pagination: PaginationModel
    data: GetSKPIRegistrationDataDetail
}

export interface GetSKPIRegistrationDataDetail {
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
    achievements: AchievementData[]
    organizations: OrganizationData[]
    certificates: CertificateData[]
    character_buildings: CharacterBuildingData[]
    internships: InternshipData[]
    languages: LanguageData[]
}

export interface AchievementData {
    id: string
    name: string
    year: number
}
export interface OrganizationData {
    id: string
    name: string
    position: string
    service_length: boolean
}
export interface CertificateData {
    id: string
    name: string
}
export interface CharacterBuildingData {
    id: string
    name: string
}
export interface InternshipData {
    id: string
    name: string
}
export interface LanguageData {
    id: string
    name: string
    score: string,
    date: string
}

export interface CreateSkpiRegistration {
    student_id: string
    achievement_path: string
    achievement_path_type: string
    organization_path: string
    organization_path_type: string
    certificate_path: string
    certificate_path_type: string
    language_path: string
    language_path_type: string
    achievements: CreateAchievementData[]
    organizations: CreateOrganizationData[]
    certificates: CreateCertificateData[]
    character_buildings: CreateCharacterBuildingData[]
    internships: CreateInternshipData[]
    languages: CreateLanguageData[]
}

export interface CreateAchievementData{
    name: string
    year: number
}

export interface CreateOrganizationData{
    name: string
    position: string
    service_length: number
}

export interface CreateCertificateData{
    name: string
}

export interface CreateCharacterBuildingData{
    name: string
}

export interface CreateInternshipData{
    name: string
}

export interface CreateLanguageData{
    name: string
    score: string
    date: string
}

