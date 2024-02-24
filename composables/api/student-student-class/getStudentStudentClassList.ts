import { ErrorRoot } from "~~/types/api/error";
import { GetStudentStudentClassListRoot } from "~~/types/api/student-student-class/GetStudentStudentClassList";

export async function getStudentStudentClassList(semesterId: string)
    : Promise<{ response: GetStudentStudentClassListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetStudentStudentClassListRoot>(() => `/api/v1/student/student_class.StudentClassHandler/GetTakenClass?semesterId=${semesterId}`, <any>{
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