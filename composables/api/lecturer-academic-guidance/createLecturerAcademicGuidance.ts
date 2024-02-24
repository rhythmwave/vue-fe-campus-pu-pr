import { ErrorRoot } from "~~/types/api/error";
import { CreateLecturerAcademicGuidanceRequest, CreateLecturerAcademicGuidanceRoot } from "~~/types/api/lecturer-academic-guidance/CreateLecturerAcademicGuidance";

export async function createLecturerAcademicGuidance(body: CreateLecturerAcademicGuidanceRequest)
    : Promise<{ response: CreateLecturerAcademicGuidanceRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        var files = Object.assign([], body.files)
        var student_ids = Object.assign([], body.student_ids)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateLecturerAcademicGuidanceRoot>(() => `/api/v1/lecturer/lecturer_academic_guidance.LecturerAcademicGuidanceHandler/CreateSession`, <any>{
            method: 'POST',
            body: {
                semester_id: req.semester_id,
                subject: req.subject,
                session_date: req.session_date,
                summary: req.summary,
                files: files,
                student_ids: student_ids,
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