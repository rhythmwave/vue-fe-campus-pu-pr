export interface UpdateHighSchoolRequest {
    id: string
    educations: EducationUpdateHighSchoolRequest[],
}

export interface EducationUpdateHighSchoolRequest {
    education: string
    name_school: string
    graduation_year: string
}

