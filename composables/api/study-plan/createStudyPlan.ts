import { ErrorRoot } from "~~/types/api/error";
import { CreateStudyPlanRequest, CreateStudyPlanRoot } from "~~/types/api/study-plan/CreateStudyPlanRequest";

export async function createStudyPlan(body: CreateStudyPlanRequest)
    : Promise<{ response: CreateStudyPlanRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateStudyPlanRoot>(() => `/api/v1/admin/study_plan/admin_study_plan.AdminStudyPlanHandler/BulkCreate`, <any>{
            method: 'POST',
            body: {
                semester_id: req.semester_id,
                student_ids: req.student_ids,
                class_ids: req.class_ids,
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
        return {
            response: null, error: <ErrorRoot>{ meta: { code: 'EXCEPCTION', status: 0, message: <string>error } }
        }
    }
}