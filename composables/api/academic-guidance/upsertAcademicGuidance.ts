import { ErrorRoot } from "~~/types/api/error";
import { UpsertAcademicGuidanceRequest, UpsertAcademicGuidanceRoot } from "~~/types/api/academic-guidance/UpsertAcademicGuidance";

export async function upsertAcademicGuidance(body: UpsertAcademicGuidanceRequest)
    : Promise<{ response: UpsertAcademicGuidanceRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<UpsertAcademicGuidanceRoot>(() => `/api/v1/admin/student/admin_academic_guidance.AdminAcademicGuidanceHandler/Upsert`, <any>{
            method: 'POST',
            body: {
                semester_id: req.semester_id,
                lecturer_id: req.lecturer_id,
                student_ids: Array.from(req.student_ids)
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