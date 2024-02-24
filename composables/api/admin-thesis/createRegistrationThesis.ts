import { ErrorRoot } from "~~/types/api/error";
import { CreateRegistrationThesisRequest, CreateRegistrationThesisRoot } from "~~/types/api/thesis/CreateRegistrationThesis";
import { convertDateWithoutTimeToTimezoned } from  '~~/utils/helpers/date-utils'
export async function createRegistrationThesis(body: CreateRegistrationThesisRequest)
    : Promise<{ response: CreateRegistrationThesisRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateRegistrationThesisRoot>(() => `/api/v1/admin/thesis/admin_thesis.AdminThesisHandler/RegisterThesisDefense`, <any>{
            method: 'POST',
            body: body,
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