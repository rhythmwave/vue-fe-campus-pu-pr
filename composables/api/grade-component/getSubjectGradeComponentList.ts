import { ErrorRoot } from "~~/types/api/error";
import { GetSubjectGradeComponentListRoot } from "~~/types/api/grade-component/GetSubjectGradeComponentList";

export async function getSubjectGradeComponentList(subjectId: string, subjectCategoryId: string)
    : Promise<{ response: GetSubjectGradeComponentListRoot | null, error: ErrorRoot | null }> {
    try {
        // const { data: data, pending, refresh, error } = await useAPIFetch<GetSubjectGradeComponentListRoot>(() => `/api/v1/admin/admin_subject_grade_component.AdminSubjectGradeComponentHandler/GetList?subjectId=${subjectId}&subjectCategoryId=${subjectCategoryId}`, <any>{
        const { data: data, pending, refresh, error } = await useAPIFetch<GetSubjectGradeComponentListRoot>(() => `/api/v1/admin/admin_subject_grade_component.AdminSubjectGradeComponentHandler/GetList?subjectId=${subjectId}`, <any>{
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