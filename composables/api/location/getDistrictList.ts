import { ErrorRoot } from "~~/types/api/error";
import { GetDistrictListRoot } from "~~/types/api/location/GetDistrictList";

export async function getDistrictList(limit: number, page: number, searchText: string, regencyId: string)
    : Promise<{ response: GetDistrictListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetDistrictListRoot>(() => `/api/v1/general/general_location.GeneralLocationHandler/GetListDistrict?limit=${limit}&page=${page}&search=${searchText}&regencyId=${regencyId}`, <any>{
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