import { ErrorRoot } from "~~/types/api/error";
import { GetStudentStudyPlanDetailRoot } from "~~/types/api/student-study-plan/GetStudentStudyPlanDetail";

export async function getStudentStudyPlanDetail(semesterId:string)
    : Promise<{ response: GetStudentStudyPlanDetailRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetStudentStudyPlanDetailRoot>(() => `/api/v1/student/student_study_plan.StudentStudyPlanHandler/GetDetail?semesterId=${semesterId}`, <any>{
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