import { ErrorRoot } from "~~/types/api/error";
import { GetLessonPlanListRoot } from "~~/types/api/lesson-plan/GetLessonPlanList";

export async function getLessonPlanList(limit: number, page: number, searchText: string, subjectId: string)
    : Promise<{ response: GetLessonPlanListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetLessonPlanListRoot>(() => `/api/v1/admin//admin_lesson_plan.AdminLessonPlanHandler/GetList?limit=${limit}&page=${page}&search=${searchText}&subjectId=${subjectId}`, <any>{
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
            return { response: null, error: errorRoot };
        }
        return { response: data.value, error: null };
    } catch (error) {
        return { response: null, error: <ErrorRoot>{ meta: { code: 'EXCEPCTION', status: 0, message: <string>error } } }
    }
}