import { ErrorRoot } from "~~/types/api/error";
import { UpdateClassGradeComponentRequest, UpdateClassGradeComponentRoot } from "~~/types/api/class-grade-component/UpdateClassGradeComponent";

export async function updateClassGradeComponent(body: UpdateClassGradeComponentRequest)
    : Promise<{ response: UpdateClassGradeComponentRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateClassGradeComponentRoot>(() => `api/v1/admin/class-grade-component/classGradeComponent.ClassGradeComponentHandler/Update`, <any>{
            method: 'PATCH',
            body: {
                id: req.id,
                name: req.name,
                age: Number(req.age)
            },
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