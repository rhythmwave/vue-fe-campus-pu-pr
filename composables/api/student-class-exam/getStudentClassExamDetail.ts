import { ErrorRoot } from "~~/types/api/error";
import { GetStudentClassExamDetailRoot } from "~~/types/api/student-class-exam/GetStudentClassExamDetail";

export async function getStudentClassExamDetail(id: string)
    : Promise<{ response: GetStudentClassExamDetailRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetStudentClassExamDetailRoot>(() => `api/v1/admin/student-class-exam/studentClassExam.StudentClassExamHandler/GetList?id=${id}`, <any>{
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