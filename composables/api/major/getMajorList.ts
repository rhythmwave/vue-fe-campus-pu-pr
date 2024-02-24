import { ErrorRoot } from "~~/types/api/error";
import { GetMajorListRoot } from "~~/types/api/major/GetMajorList";

export async function getMajorList(limit: number, page: number, searchText: string, facultyId:string)
    : Promise<{ response: GetMajorListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetMajorListRoot>(() => `/api/v1/admin/admin_major.AdminMajorHandler/GetList?limit=${limit}&page=${page}&search=${searchText}&facultyId=${facultyId}`, <any>{
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