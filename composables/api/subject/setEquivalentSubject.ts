import { ErrorRoot } from "~~/types/api/error";
import { SetEquivalentSubjectRequest, SetEquivalentSubjectRoot } from "~~/types/api/subject/SetEquivalentSubject";

export async function setEquivalentSubject(body: SetEquivalentSubjectRequest)
    : Promise<{ response: SetEquivalentSubjectRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<SetEquivalentSubjectRoot>(() => `/api/v1/admin/curriculum/admin_subject.AdminSubjectHandler/SetEquivalentSubject`, <any>{
            method: 'PATCH',
            body: {
                subject_id: req.subject_id,
                equivalent_subject_id: req.equivalent_subject_id,
                is_vice_versa: req.is_vice_versa,
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