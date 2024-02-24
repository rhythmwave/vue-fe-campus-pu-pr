import { ErrorRoot } from "~~/types/api/error";
import { GetStudentClassEventDetailRoot } from "~~/types/api/student-class-event/GetStudentClassEventDetail";

export async function getStudentClassEventDetail(id: string)
    : Promise<{ response: GetStudentClassEventDetailRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetStudentClassEventDetailRoot>(() => `api/v1/admin/student-class-event/studentClassEvent.StudentClassEventHandler/GetList?id=${id}`, <any>{
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