import { ErrorRoot } from "~~/types/api/error";
import { GetStudentClassParticipantDataRoot } from "~~/types/api/student-class/GetStudentClassParticipantList";

export async function getStudentClassParticipantList(limit: number, page: number, searchText: string, classId: string)
    : Promise<{ response: GetStudentClassParticipantDataRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetStudentClassParticipantDataRoot>(() => `/api/v1/admin/student_class/admin_class.AdminClassHandler/GetClassParticipantList?limit=${limit}&page=${page}&search=${searchText}&classId=${classId}`, <any>{
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
        }
        return { response: data.value, error: null };
    } catch (error) {
        return { response: null, error: <ErrorRoot>{ meta: { code: 'EXCEPCTION', status: 0, message: <string>error } } }
    }
}