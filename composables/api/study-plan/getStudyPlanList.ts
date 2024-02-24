import { ErrorRoot } from "~~/types/api/error";
import { GetStudyPlanListRoot } from "~~/types/api/study-plan/GetStudyPlan";

export async function getStudyPlanList(limit: number, page: number, search: string, student_id: string, semester_id: string)
    : Promise<{ response: GetStudyPlanListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetStudyPlanListRoot>(() => `/api/v1/admin/admin_study_plan.AdminStudyPlanHandler/GetList?limit=${limit}&page=${page}&search=${search}&studentId=${student_id}&semesterId=${semester_id}`, <any>{
            method: 'GET',
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
        }
        return { response: data.value, error: null };
    } catch (error) {
        return { response: null, error: <ErrorRoot>{ meta: { code: 'EXCEPCTION', status: 0, message: <string>error } } }
    }
}