import { ErrorRoot } from "~~/types/api/error";
import { GetVillageListRoot } from "~~/types/api/location/GetVillageList";

export async function getVillageList(limit: number, page: number, searchText: string, districtId: string)
    : Promise<{ response: GetVillageListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetVillageListRoot>(() => `/api/v1/general/general_location.GeneralLocationHandler/GetListVillage?limit=${limit}&page=${page}&search=${searchText}&districtId=${districtId}`, <any>{
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