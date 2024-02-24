import { ErrorRoot } from "~~/types/api/error";
import { GetGradeComponentListRoot } from "~~/types/api/grade-component/GetGradeComponentList";

export async function getGradeComponentList(limit: number, page: number, searchText: string, studyProgramId: string, subjectCategoryId: string)
    : Promise<{ response: GetGradeComponentListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetGradeComponentListRoot>(() => `/api/v1/admin/admin_grade_component.AdminGradeComponentHandler/GetList?limit=${limit}&page=${page}&search=${searchText}&studyProgramId=${studyProgramId}&subjectCategoryId=${subjectCategoryId}`, <any>{
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