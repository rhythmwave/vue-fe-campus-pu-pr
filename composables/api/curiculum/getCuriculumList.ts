import { ErrorRoot } from "~~/types/api/error";
import { GetCuriculumListRoot } from "~~/types/api/curiculum/GetCuriculumList";

export async function getCuriculumList(limit: number, page: number, searchText: string, studyProgramId:string)
    : Promise<{ response: GetCuriculumListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetCuriculumListRoot>(() => `/api/v1/admin/admin_curriculum.AdminCurriculumHandler/GetList?limit=${limit}&page=${page}&search=${searchText}&studyProgramId=${studyProgramId}`, <any>{
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