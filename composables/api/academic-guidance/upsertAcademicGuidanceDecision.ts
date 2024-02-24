import { ErrorRoot } from "~~/types/api/error";
import { UpsertAcademicGuidanceDecisionRequest, UpsertAcademicGuidanceDecisionRoot } from "~~/types/api/academic-guidance/UpsertAcademicGuidanceDecision";

export async function upsertAcademicGuidanceDecision(body: UpsertAcademicGuidanceDecisionRequest)
    : Promise<{ response: UpsertAcademicGuidanceDecisionRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<UpsertAcademicGuidanceDecisionRoot>(() => `/api/v1/admin/lecturer/admin_academic_guidance.AdminAcademicGuidanceHandler/UpsertDecision`, <any>{
            method: 'POST',
            body: {
                lecturer_id: req.lecturer_id,
                semester_id: req.semester_id,
                decision_number: req.decision_number,
                decision_date: req.decision_date,
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