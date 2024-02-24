import { ErrorRoot } from "~~/types/api/error";
import { GetLecturerSemesterListRoot } from "~~/types/api/lecturer-semester/GetLecturerSemesterList";

export async function getLecturerSemesterList(limit: number, page: number, studyProgramId: string)
    : Promise<{ response: GetLecturerSemesterListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetLecturerSemesterListRoot>(() => `/api/v1/lecturer/lecturer_semester.LecturerSemesterHandler/GetList?limit=${limit}&page=${page}&studyProgramId=${studyProgramId}`, <any>{
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