import { ErrorRoot } from "~~/types/api/error";
import { UpdateSubjectRequest, UpdateSubjectRoot } from "~~/types/api/subject/UpdateSubject";

export async function updateSubject(body: UpdateSubjectRequest)
    : Promise<{ response: UpdateSubjectRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateSubjectRoot>(() => `/api/v1/admin/curriculum/admin_subject.AdminSubjectHandler/Update`, <any>{
            method: 'PATCH',
            body: {
                id: req.id,
                curriculum_id: req.curriculum_id,
                code: req.code,
                name: req.name,
                short_name: req.short_name,
                english_name: req.english_name,
                english_short_name: req.english_short_name,
                is_mandatory: req.is_mandatory,
                trait: req.trait,
                type: req.type,
                subject_category_id: req.subject_category_id,
                curriculum_type: req.curriculum_type,
                theory_credit: Number(req.theory_credit),
                practicum_credit: Number(req.practicum_credit),
                field_practicum_credit: Number(req.field_practicum_credit),
                semester_package: Number(req.semester_package),
                repeat_course_limit: Number(req.repeat_course_limit),
                is_active: req.is_active,
                has_lecture_unit: req.has_lecture_unit,
                has_teaching_material: req.has_teaching_material,
                has_lecture_summary: req.has_lecture_summary,
                supporting_lecturer_id: req.supporting_lecturer_id,
                start_date: req.start_date,
                end_date: req.end_date,
                minimum_passing_grade_point: Number(req.minimum_passing_grade_point),
                minimum_mandatory_credit_taken: Number(req.minimum_mandatory_credit_taken),
                minimum_optional_credit_taken: Number(req.minimum_optional_credit_taken),
                minimum_total_credit_taken: Number(req.minimum_total_credit_taken),
                minimum_mandatory_credit_passed: Number(req.minimum_mandatory_credit_passed),
                minimum_optional_credit_passed: Number(req.minimum_optional_credit_passed),
                minimum_total_credit_passed: Number(req.minimum_total_credit_passed),
                minimum_gpa: Number(req.minimum_gpa),
                abstraction: req.abstraction,
                syllabus_path: req.syllabus_path,
                syllabus_path_type: req.syllabus_path_type,
                is_thesis: req.is_thesis,
                is_mbkm: req.is_mbkm,
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