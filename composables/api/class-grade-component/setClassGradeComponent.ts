import { ErrorRoot } from "~~/types/api/error";
import { SetClassGradeComponentRequest, SetClassGradeComponentRoot } from "~~/types/api/class-grade-component/SetClassGradeComponent";

export async function setClassGradeComponent(body: SetClassGradeComponentRequest)
    : Promise<{ response: SetClassGradeComponentRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        var listData = []
        for (var i = 0; i < body.data.length; i++) {
            var dt = body.data[i]
            var d = Object.assign({}, dt)
            listData.push(d)
        }
        const { data: data, pending, refresh, error } = await useAPIFetch<SetClassGradeComponentRoot>(() => `/api/v1/admin/grade_component/admin_class_grade_component.AdminClassGradeComponentHandler/Set`, <any>{
            method: 'PATCH',
            body: {
                class_id: req.class_id,
                data: listData,
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