import { ErrorRoot } from "~~/types/api/error";
import { CreateStudentRequest, CreateStudentRoot } from "~~/types/api/student/CreateStudent";
import { convertDateWithoutTimeToTimezoned } from '~~/utils/helpers/date-utils';

export async function createStudent(body: CreateStudentRequest)
    : Promise<{ response: CreateStudentRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateStudentRoot>(() => `/api/v1/admin/student/admin_student.AdminStudentHandler/Create`, <any>{
            method: 'POST',
            body: {
                name: req.name,
                sex: req.sex,
                marital_status: req.marital_status,
                birth_regency_id: Number(req.birth_regency_id),
                birth_date: req.birth_date ? convertDateWithoutTimeToTimezoned(req.birth_date) : '',
                religion: req.religion,
                address: req.address,
                rt: req.rt,
                rw: req.rw,
                village_id: Number(req.village_id),
                postal_code: req.postal_code,
                previous_address: req.previous_address,
                id_number: req.id_number,
                npwp_number: req.npwp_number,
                nisn_number: req.nisn_number,
                residence_type: req.residence_type,
                transportation_mean: req.transportation_mean,
                kps_receiver: req.kps_receiver,
                phone_number: req.phone_number,
                mobile_phone_number: req.mobile_phone_number,
                email: req.email,
                homepage: req.homepage,
                work_type: req.work_type,
                work_place: req.work_place,
                nationality: req.nationality,
                askes_number: req.askes_number,
                total_brother: Number(req.total_brother),
                total_sister: Number(req.total_sister),
                hobby: req.hobby,
                experience: req.experience,
                total_dependent: Number(req.total_dependent),
                nim_number: Number(req.nim_number),
                student_force: Number(req.student_force),
                admittance_semester: req.admittance_semester,
                study_program_id: req.study_program_id,
                curriculum_id: req.curriculum_id,
                admittance_test_number: req.admittance_test_number,
                admittance_date: req.admittance_date ? convertDateWithoutTimeToTimezoned(req.admittance_date) : '',
                admittance_status: req.admittance_status,
                total_transfer_credit: Number(req.total_transfer_credit),
                previous_college: req.previous_college,
                previous_study_program: req.previous_study_program,
                previous_nim_number: req.previous_nim_number,
                previous_nim_admittance_year: req.previous_nim_admittance_year,
                status: req.status,
                is_foreign_student: req.is_foreign_student,
                college_entrance_type: req.college_entrance_type,
                class_time: req.class_time,
                fund_source: req.fund_source,
                is_scholarship_grantee: req.is_scholarship_grantee,
                has_complete_requirement: req.has_complete_requirement,
                school_certificate_type: req.school_certificate_type,
                school_graduation_year: req.school_graduation_year,
                school_name: req.school_name,
                school_accreditation: req.school_accreditation,
                school_address: req.school_address,
                school_major: req.school_major,
                school_certificate_number: req.school_certificate_number,
                school_certificate_date: req.school_certificate_date ? convertDateWithoutTimeToTimezoned(req.school_certificate_date) : '',
                total_school_final_exam_subject: Number(req.total_school_final_exam_subject),
                school_final_exam_score: Number(req.school_final_exam_score),
                guardian_name: req.guardian_name,
                guardian_birth_date: req.guardian_birth_date ? convertDateWithoutTimeToTimezoned(req.guardian_birth_date) : '',
                guardian_death_date: req.guardian_death_date ? convertDateWithoutTimeToTimezoned(req.guardian_death_date) : '',
                guardian_address: req.guardian_address,
                guardian_regency_id: Number(req.guardian_regency_id),
                guardian_postal_code: req.guardian_postal_code,
                guardian_phone_number: req.guardian_phone_number,
                guardian_email: req.guardian_email,
                guardian_final_academic_background: req.guardian_final_academic_background,
                guardian_occupation: req.guardian_occupation,
                father_id_number: req.father_id_number,
                father_name: req.father_name,
                father_birth_date: req.father_birth_date ? convertDateWithoutTimeToTimezoned(req.father_birth_date) : '',
                father_death_date: req.father_death_date ? convertDateWithoutTimeToTimezoned(req.father_death_date) : '',
                mother_id_number: req.mother_id_number,
                mother_name: req.mother_name,
                mother_birth_date: req.mother_birth_date ? convertDateWithoutTimeToTimezoned(req.mother_birth_date) : '',
                mother_death_date: req.mother_death_date ? convertDateWithoutTimeToTimezoned(req.mother_death_date) : '',
                parent_address: req.parent_address,
                parent_regency_id: Number(req.parent_regency_id),
                parent_postal_code: req.parent_postal_code,
                parent_phone_number: req.parent_phone_number,
                parent_email: req.parent_email,
                father_final_academic_background: req.father_final_academic_background,
                father_occupation: req.father_occupation,
                mother_final_academic_background: req.mother_final_academic_background,
                mother_occupation: req.mother_occupation,
                parent_income: Number(req.parent_income),
                is_financially_capable: req.is_financially_capable,
            },
        })
        if (error.value) {
            let errorRoot = <ErrorRoot><unknown>error.value.data;
            if (!errorRoot.meta) {
                return { response: null, error: errorRoot };
            }
            if (errorRoot.meta.status == 401) {
                const authUser = useAuthStorage();
                authUser.value = null;
                navigateTo({ name: 'login', path: '' })
                return { response: null, error: errorRoot };
            }
            return { response: null, error: errorRoot };
        }
        return { response: data.value, error: null };
    } catch (error) {
        return { response: null, error: <ErrorRoot>{ meta: { code: 'EXCEPCTION', status: 0, message: <string>error } } }
    }
}