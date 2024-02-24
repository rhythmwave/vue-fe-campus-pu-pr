import { MetaModel } from "~~/types/backoffice/backofficeTypes"

export interface CreateExamSupervisor {
    id_national_lecturer: string
    name: string
    front_title: string
    back_degree: string
    study_program_id: string
    id_number: string
    birth_date: string
    birth_regency_id: number
    sex: string
    blood_type: string
    religion: string
    marital_status: string
    address: string
    regency_id: number
    postal_code: string
    phone_number: string
    fax: string
    mobile_phone_number: string
    office_phone_number: string
    employee_type: string
    employee_status: string
    sk_cpns_number: string
    sk_cpns_date: string
    tmt_cpns_date: string
    cpns_category: string
    cpns_duration_month: number
    pre_position_date: string
    sk_pns_number: string
    sk_pns_date: string
    tmt_pns_date: string
    pns_category: string
    pns_oath_date: string
    join_date: string
    end_date: string
    taspen_number: string
    former_instance: string
    remarks: string
}

export interface CreateExamSupervisorRoot {
    meta: MetaModel
    data: any
}