export interface MetaModel {
    message: string
    status: number
    code: string
}

export interface PaginationModel {
    page: number
    limit: number
    prev: number
    next: number
    total_pages: number
    total_records: number
}

/* Top Cards */
type topCards={
    link: string;
    img: string;
    title: string;
    subTitle: string;
    number: string;
    bgcolor: string;
    bgsubcolor: string;
    textcolor: string;
};

export type{ topCards }

export interface Role {
    id: string,
    name: string,
    description: string,
    created_by: string,
    updated_by: string | null,
    created_at: Date,
    updated_at: Date | null,
    permissions: Permission[],
    study_programs: StudyProgram[],
}

export interface User {
    id: string,
    name: string,
    username: string,
    password: string,
    role_id: string,
    role_name: string,
    permissions: Permission[]
    study_programs: StudyProgram[]
}

export interface Permission {
    id: string,
    name: string,
}

export interface Faculty {
    id: string,
    name: string,
    short_name: string,
    english_name: string,
    english_short_name: string,
    address: string,
    phone_number: string,
    fax: string,
    email: string,
    contact_person: string,
    experiment_building_area: number,
    lecture_hall_area: number,
    lecture_hall_count: number,
    laboratorium_area: number,
    laboratorium_count: number,
    permanent_lecturer_room_area: number,
    administration_room_area: number,
    book_count: number,
    book_copy_count: number,
}

export interface Major {
    id: string,
    faculty_id: string,
    faculty_name: string,
    name: string,
    short_name: string,
    english_name: string,
    english_short_name: string,
    address: string,
    phone_number: string,
    fax: string,
    email: string,
    contact_person: string,
    experiment_building_area: number,
    lecture_hall_area: number,
    lecture_hall_count: number,
    laboratorium_area: number,
    laboratorium_count: number,
    permanent_lecturer_room_area: number,
    administration_room_area: number,
    book_count: number,
    book_copy_count: number,
}

export interface StudyProgram {
    id: string ,
    dikti_study_program_id: string ,
    dikti_study_program_code: string ,
    dikti_study_program_name: string ,
    dikti_study_program_type: string ,
    study_level_short_name: string ,
    study_level_name: string ,
    name: string ,
    english_name: string ,
    short_name: string ,
    english_short_name: string ,
    administrative_unit: string ,
    faculty_id: string ,
    faculty_name: string ,
    major_id: string ,
    major_name: string ,
    address: string ,
    phone_number: string ,
    fax: string ,
    email: string ,
    website: string ,
    contact_person: string ,
    curiculum_review_frequency: string ,
    curiculum_review_method: string ,
    establishment_date: string ,
    is_active: boolean ,
    start_semester: string ,
    operational_permit_number: string ,
    operational_permit_date: string ,
    operational_permit_due_date: string ,
    head_lecturer_id: string ,
    head_lecturer_mobile_phone_number: string ,
    operator_name: string ,
    operator_phone_number: string ,
}
export interface Lecture {
    id: string ,
    name: string ,
}

export interface StudyProgramDikti {
    id: string,
    code: string,
    name: string,
    study_level_name: string,
    study_level_short_name: string,
    alias: string,
}
export interface GetStudyProgramDiktiRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: StudyProgramDikti[]
}
export interface GetFacultyRoot {
    meta: MetaModel
    pagination: PaginationModel
    data: Faculty[]
}