import { ErrorRoot } from "~~/types/api/error";
import { SetPrerequisiteSubjectRequest, SetPrerequisiteSubjectRoot } from "~~/types/api/subject/SetPrerequisiteSubject";

export async function setPrerequisiteSubject(body: SetPrerequisiteSubjectRequest)
    : Promise<{ response: SetPrerequisiteSubjectRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<SetPrerequisiteSubjectRoot>(() => `/api/v1/admin/curriculum/admin_subject.AdminSubjectHandler/SetPrerequisiteSubject`, <any>{
            method: 'PATCH',
            body: {
                id: req.id,
                prerequisites: req.prerequisites,
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