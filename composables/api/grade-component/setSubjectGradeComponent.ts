import { ErrorRoot } from "~~/types/api/error";
import { GetSubjectGradeComponentListRoot } from "~~/types/api/grade-component/GetSubjectGradeComponentList";
import { UpdateSubjectGradeComponent, UpdateSubjectGradeComponentRoot } from "~~/types/api/subject-grade-component/UpdateSubjectGradeComponent";

export async function setSubjectGradeComponent(body: UpdateSubjectGradeComponent)
    : Promise<{ response: UpdateSubjectGradeComponentRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<GetSubjectGradeComponentListRoot>(() => `/api/v1/admin/grade_component/admin_subject_grade_component.AdminSubjectGradeComponentHandler/Set`, <any>{
            method: 'PATCH',
            body: req
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