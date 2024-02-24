import { ErrorRoot } from "~~/types/api/error";
import { CreateExaminerRoleRequest, CreateExaminerRoleRoot } from "~~/types/api/thesis/CreateExaminerRole";

export async function createExaminerRole(body: CreateExaminerRoleRequest)
    : Promise<{ response: CreateExaminerRoleRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateExaminerRoleRoot>(() => `/api/v1/admin/thesis/admin_thesis_examiner_role.AdminThesisExaminerRoleHandler/Create`, <any>{
            method: 'POST',
            body: {
                name: req.name,
                sort: parseFloat(req.sort),
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