import { ErrorRoot } from "~~/types/api/error";
import { LoginWithSsoRequest, LoginWithSsoRoot } from "~~/types/api/auth/LoginWithSso";

export async function loginWithSso(body: LoginWithSsoRequest)
    : Promise<{ response: LoginWithSsoRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<LoginWithSsoRoot>(() => `/api/v1/general_auth.GeneralAuthHandler/LoginWithSso`, <any>{
            method: 'POST',
            body: {
                username: req.username,
                sso_code: req.sso_code,
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

        const authUser = useAuthStorage();
        authUser.value = data.value?.data;
        return { response: data.value, error: null };
    } catch (error) {
        return { response: null, error: <ErrorRoot>{ meta: { code: 'EXCEPCTION', status: 0, message: <string>error } } }
    }
}