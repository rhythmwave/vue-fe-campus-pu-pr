import { ErrorRoot } from "~~/types/api/error";
import { GetClassGradeComponentListRoot } from "~~/types/api/class-grade-component/GetClassGradeComponentList";

export async function getClassGradeComponentList(classId: string)
    : Promise<{ response: GetClassGradeComponentListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetClassGradeComponentListRoot>(() => `/api/v1/admin/admin_class_grade_component.AdminClassGradeComponentHandler/GetList?classId=${classId}`, <any>{
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