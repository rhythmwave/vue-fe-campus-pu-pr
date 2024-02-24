import { ErrorRoot } from "~~/types/api/error";
import { CreateStudentAcademicGuidanceRequest, CreateStudentAcademicGuidanceRoot } from "~~/types/api/student-academic-guidance/CreateStudentAcademicGuidance";

export async function createStudentAcademicGuidance(body: CreateStudentAcademicGuidanceRequest)
    : Promise<{ response: CreateStudentAcademicGuidanceRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateStudentAcademicGuidanceRoot>(() => `/api/v1/admin/student-academic-guidance/studentAcademicGuidance.StudentAcademicGuidanceHandler/Create`, <any>{
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