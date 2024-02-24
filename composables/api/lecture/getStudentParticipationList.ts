import { ErrorRoot } from "~~/types/api/error";
import { GetStudentParticipationListRoot } from "~~/types/api/lecture/GetStudentParticipation";

export async function getStudentParticipationList(limit: number, page: number, classId: string, studentId: string)
    : Promise<{ response: GetStudentParticipationListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetStudentParticipationListRoot>(() => `/api/v1/admin/student_class/admin_lecture.AdminLectureHandler/GetStudentParticipation?limit=${limit}&page=${page}&classId=${classId}&studentId=${studentId}`, <any>{
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