import { useStorage, StorageSerializers } from "@vueuse/core";
import { LogoutRoot } from "~~/types/api/auth/Login";

export const ApiAuthLogout = async () => {
    const { data: loginResponse, pending, refresh, error } = await useAPIFetch<LogoutRoot>('/api/v1/general/general_auth.GeneralAuthHandler/Logout', <any>{
        method: 'POST',
    })
    const authUser = useAuthStorage();
    authUser.value = null;
    console.log("logout")
    useStorage('lecturerProfile', null, undefined, { serializer: StorageSerializers.object }).value = null
    navigateTo({ name: 'login', path: '' })
}
