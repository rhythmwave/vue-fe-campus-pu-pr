import { ErrorRoot } from "~~/types/api/error";
import { GetStudentSemesterListRoot } from "~~/types/api/student-semester/GetStudentSemesterList";

export async function getStudentSemesterList(limit: number, page: number, studyProgramId: string)
    : Promise<{ response: GetStudentSemesterListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetStudentSemesterListRoot>(() => `/api/v1/student/student_semester.StudentSemesterHandler/GetList?limit=${limit}&page=${page}&studyProgramId=${studyProgramId}`, <any>{
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