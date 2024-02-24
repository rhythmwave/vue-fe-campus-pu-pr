import { ErrorRoot } from "~~/types/api/error";
import { GetGradeTypeListRoot } from "~~/types/api/grade-type/GetGradeTypeList";

export async function getGradeTypeList(limit: number, page: number, searchText: string, studyLevelId: string)
    : Promise<{ response: GetGradeTypeListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetGradeTypeListRoot>(() => `/api/v1/admin/admin_grade_type.AdminGradeTypeHandler/GetList?limit=${limit}&page=${page}&search=${searchText}&studyLevelId=${studyLevelId}`, <any>{
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