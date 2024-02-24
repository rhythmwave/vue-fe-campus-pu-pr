import { ErrorRoot } from "~~/types/api/error";
import { CreateOfficerActionRequest, CreateOfficerActionRoot } from "~~/types/api/officer-action/CreateOfficerAction";

export async function createOfficerAction(body: CreateOfficerActionRequest)
    : Promise<{ response: CreateOfficerActionRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateOfficerActionRoot>(() => `/api/v1/admin/officer/admin_officer_action.AdminOfficerActionHandler/Create`, <any>{
            method: 'POST',
            body: {
                document_type_id: req.document_type_id,
                document_action_id: req.document_action_id,
                officer_id: req.officer_id,
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