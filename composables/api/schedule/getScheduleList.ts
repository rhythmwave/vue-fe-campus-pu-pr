import { ErrorRoot } from "~~/types/api/error";
import { GetScheduleListRoot } from "~~/types/api/schedule/GetScheduleList";

export async function getScheduleList(limit: number, page: number, class_id: string, is_actual_lecture: any, is_exam: boolean, exam_type: string)
    : Promise<{ response: GetScheduleListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetScheduleListRoot>(() => `/api/v1/admin/admin_lecture.AdminLectureHandler/GetList?limit=${limit}&page=${page}&classId=${class_id}&hasActualLecture=${is_actual_lecture}&isExam=${is_exam}&examType=${exam_type}`, <any>{
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