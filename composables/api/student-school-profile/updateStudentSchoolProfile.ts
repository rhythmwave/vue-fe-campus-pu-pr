import { ErrorRoot } from "~~/types/api/error";
import { UpdateStudentSchoolProfileRequest, UpdateStudentSchoolProfileRoot } from "~~/types/api/student-school-profile/UpdateStudentSchoolProfile";

export async function updateStudentSchoolProfile(body: UpdateStudentSchoolProfileRequest)
    : Promise<{ response: UpdateStudentSchoolProfileRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        var prehighscools = <any>[]
        body.pre_high_school_histories.forEach(ph => {
            prehighscools.push(Object.assign({}, ph))
        });
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateStudentSchoolProfileRoot>(() => `/api/v1/student/student_general.StudentGeneralHandler/UpdateSchoolProfile`, <any>{
            method: 'PATCH',
            body: {
                school_enrollment_year: req.school_enrollment_year.toString(),
                school_graduation_year: req.school_graduation_year.toString(),
                school_enrollment_class: req.school_enrollment_class,
                school_major: req.school_major,
                school_type: req.school_type,
                school_name: req.school_name,
                school_province_id: Number(req.school_province_id),
                school_address: req.school_address,
                school_certificate_number: req.school_certificate_number,
                school_certificate_date: req.school_certificate_date,
                school_status: req.school_status,
                school_accreditation: req.school_accreditation,
                school_final_exam_score: Number(req.school_final_exam_score),
                school_mathematics_final_exam_score: Number(req.school_mathematics_final_exam_score),
                school_indonesian_final_exam_score: Number(req.school_indonesian_final_exam_score),
                school_english_final_exam_score: Number(req.school_english_final_exam_score),
                school_mathematics_report_score: Number(req.school_mathematics_report_score),
                school_indonesian_report_score: Number(req.school_indonesian_report_score),
                school_english_report_score: Number(req.school_english_report_score),
                pre_high_school_histories: prehighscools
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