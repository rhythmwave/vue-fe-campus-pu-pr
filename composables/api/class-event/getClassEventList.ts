import { ErrorRoot } from "~~/types/api/error";
import { GetClassEventListRoot } from "~~/types/api/class-event/GetClassEventList";

export async function getClassEventList(limit: number, page: number, searchText: string,classId:string)
    : Promise<{ response: GetClassEventListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetClassEventListRoot>(() => `/api/v1/admin/admin_class_event.AdminClassEventHandler/GetList?limit=${limit}&page=${page}&search=${searchText}&classId=${classId}`, <any>{
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