import { ErrorRoot } from "~~/types/api/error";
import { ApproveStudyPlanRequest, ApproveStudyPlanRoot } from "~~/types/api/study-plan/ApproveStudyPlanRequest";

export async function approveStudyPlan(body: ApproveStudyPlanRequest)
    : Promise<{ response: ApproveStudyPlanRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<ApproveStudyPlanRoot>(() => `/api/v1/admin/study_plan_approval/admin_study_plan.AdminStudyPlanHandler/BulkApprove`, <any>{
            method: 'PATCH',
            body: {
                study_plan_ids: req.study_plan_ids,
                is_approved: req.is_approved,
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