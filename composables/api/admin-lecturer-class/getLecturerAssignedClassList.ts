import { ErrorRoot } from "~~/types/api/error";
import {  GetLecturerAssignedClassListRoot } from "~~/types/api/lecturer-class/GetLecturerAssignedClassList";

export async function getLecturerAssignedClassList(semesterId: string, lecturerId: string)
    : Promise<{ response: GetLecturerAssignedClassListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetLecturerAssignedClassListRoot>(() => `/api/v1/admin/student_class/admin_lecturer.AdminLecturerHandler/GetAssignedClass?semesterId=${semesterId}&lecturerId=${lecturerId}`, <any>{
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