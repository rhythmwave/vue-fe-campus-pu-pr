import { ErrorRoot } from "~~/types/api/error";
import { CreateStudentStudyPlanRequest, CreateStudentStudyPlanRoot } from "~~/types/api/student-study-plan/CreateStudentStudyPlan";

export async function createStudentStudyPlan(body: CreateStudentStudyPlanRequest)
    : Promise<{ response: CreateStudentStudyPlanRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateStudentStudyPlanRoot>(() => `/api/v1/admin/student-study-plan/studentStudyPlan.StudentStudyPlanHandler/Create`, <any>{
            method: 'POST',
            body: {
                name: req.name,
                age: Number(req.age)
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