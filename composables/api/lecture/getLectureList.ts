import { ErrorRoot } from "~~/types/api/error";
import { GetLectureListRoot } from "~~/types/api/lecture/GetLectureList";

export async function getLectureList(limit: number, page: number, classId: string, hasActualLecture: boolean, isExam: any, examType: string)
    : Promise<{ response: GetLectureListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetLectureListRoot>(() => `/api/v1/admin/admin_lecture.AdminLectureHandler/GetList?limit=${limit}&page=${page}&classId=${classId}&hasActualLecture=${hasActualLecture}&isExam=${isExam}&examType=${examType}`, <any>{
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