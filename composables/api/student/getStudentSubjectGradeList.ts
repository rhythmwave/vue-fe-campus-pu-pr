import { ErrorRoot } from "~~/types/api/error";
import { GetStudentSubjectGradeListRoot } from "~~/types/api/student/GetStudentSubjectGradeList";

export async function getStudentSubjectGradeList(limit: number, page: number, studentId: string)
    : Promise<{ response: GetStudentSubjectGradeListRoot | null, error: ErrorRoot | null }> {

    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetStudentSubjectGradeListRoot>(() => `/api/v1/admin/recap/admin_student.AdminStudentHandler/GetSubjectGrade?limit=${limit}&page=${page}&studentId=${studentId}`, <any>{
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