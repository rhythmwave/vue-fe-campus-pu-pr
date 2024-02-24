import { ErrorRoot } from "~~/types/api/error";
import { GetActiveSemesterClassListRoot } from "~~/types/api/lecturer-class/GetActiveSemesterClassList";

export async function getActiveSemesterClassList( studyProgramId: string)
    : Promise<{ response: GetActiveSemesterClassListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetActiveSemesterClassListRoot>(() => `/api/v1/lecturer/lecturer_class.LecturerClassHandler/GetActiveSemesterClassList?studyProgramId=${studyProgramId}`, <any>{
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