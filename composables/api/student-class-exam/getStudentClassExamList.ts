import { ErrorRoot } from "~~/types/api/error";
import { GetStudentClassExamListRoot } from "~~/types/api/student-class-exam/GetStudentClassExamList";

export async function getStudentClassExamList(limit: number, page: number, searchText: string)
    : Promise<{ response: GetStudentClassExamListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetStudentClassExamListRoot>(() => `/api/v1/student/student_class_exam.StudentClassExamHandler/GetList?limit=${limit}&page=${page}&search=${searchText}`, <any>{
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