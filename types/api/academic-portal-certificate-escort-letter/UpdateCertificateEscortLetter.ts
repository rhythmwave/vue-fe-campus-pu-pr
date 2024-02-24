export interface UpdateCertificateEscortLetterRequest {
    id: string
    achievements: AchievementCertificateEscortLetterRequest[],
    organizations: OrganizationCertificateEscortLetterRequest[],
    skills: SkillCertificateEscortLetterRequest[],
    character_buildings: CharacterBuildingCertificateEscortLetterRequest[],
    practical_works: PracticalWorkCertificateEscortLetterRequest[],
    theses: ThesisCertificateEscortLetterRequest[],
    languages: LanguageCertificateEscortLetterRequest[],
}

export interface AchievementCertificateEscortLetterRequest {
    name: string
    year: number
}
export interface OrganizationCertificateEscortLetterRequest {
    name: string
    position: string
    year: number
}
export interface SkillCertificateEscortLetterRequest {
    name: string
}
export interface CharacterBuildingCertificateEscortLetterRequest {
    name: string
}
export interface PracticalWorkCertificateEscortLetterRequest {
    name: string
}
export interface ThesisCertificateEscortLetterRequest {
    name: string
}
export interface LanguageCertificateEscortLetterRequest {
    name: string
    value: string
    date: string
}

