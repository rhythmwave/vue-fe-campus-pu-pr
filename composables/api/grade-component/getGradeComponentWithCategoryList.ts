import { ErrorRoot } from "~~/types/api/error";
import { GetGradeComponentWithCategoryListRoot } from "~~/types/api/grade-component/GetGradeComponentWithCategoryList";

export async function getGradeComponentWithCategoryList(limit: number, page: number, searchText: string, studyProgramId: string)
    : Promise<{ response: GetGradeComponentWithCategoryListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetGradeComponentWithCategoryListRoot>(() => `api/v1/admin/grade_component/admin_grade_component.AdminGradeComponentHandler/GetListBySubjectCategory?limit=${limit}&page=${page}&search=${searchText}&studyProgramId=${studyProgramId}`, <any>{
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