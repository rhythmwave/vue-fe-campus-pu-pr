import { ErrorRoot } from "~~/types/api/error";
import { DeleteActualLecturePlanRoot } from "~~/types/api/lecture/DeleteActualLecturePlan";
import { convertDateWithoutTimeToTimezoned, formatDateNow } from '~~/utils/helpers/date-utils';

export async function deleteLecture(id: string)
    : Promise<{ response: DeleteActualLecturePlanRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<DeleteActualLecturePlanRoot>(() => `/api/v1/admin/student_class/admin_lecture.AdminLectureHandler/Delete`, <any>{
            method: 'DELETE',
            body: {id: id},
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