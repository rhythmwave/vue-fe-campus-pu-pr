import { ErrorRoot } from "~~/types/api/error";
import { GetRegencyListRoot } from "~~/types/api/location/GetRegencyList";

export async function getRegencyList(limit: number, page: number, searchText: string, provinceId: string)
    : Promise<{ response: GetRegencyListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetRegencyListRoot>(() => `/api/v1/general/general_location.GeneralLocationHandler/GetListRegency?limit=${limit}&page=${page}&search=${searchText}&provinceId=${provinceId}`, <any>{
            method: 'GET',
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