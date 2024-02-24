import { ErrorRoot } from "~~/types/api/error";
import { CreateStudyPlanRoot } from "~~/types/api/academic-portal-student-study-plan/CreateStudyPlan";

export async function createStudyPlan(data: string[])
    : Promise<{ response: CreateStudyPlanRoot | null, error: ErrorRoot | null }> {
        let class_ids = <string[]>[]
        if(data.length > 0){
            data.forEach(item => {
                class_ids.push(item)
            });
        }
        try {
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateStudyPlanRoot>(() => `/api/v1/student/student_study_plan.StudentStudyPlanHandler/Create`, <any>{
            method: 'POST',
            body: {
                class_ids: class_ids
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