import { ErrorRoot } from "~~/types/api/error";
import { UpdateOfficerRequest, UpdateOfficerRoot } from "~~/types/api/officer/UpdateOfficer";

export async function updateOfficer(body: UpdateOfficerRequest)
    : Promise<{ response: UpdateOfficerRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<UpdateOfficerRoot>(() => `/api/v1/admin/officer/admin_officer.AdminOfficerHandler/Update`, <any>{
            method: 'PATCH',
            body: {
                id: req.id,
                id_national_lecturer: req.id_national_lecturer,
                name: req.name,
                employee_no: req.employee_no,
                title: req.title,
                english_title: req.english_title,
                study_program_id: req.study_program_id,
                signature_path: req.signature_path,
                signature_path_type: req.signature_path_type,
                show_signature: req.show_signature,
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