import { ErrorRoot } from "~~/types/api/error";
import { CreateAdminStudyProgramRequest, CreateAdminStudyProgramRoot } from "~~/types/api/admin-study-program/CreateAdminStudyProgram";

export async function createAdminStudyProgram(body: CreateAdminStudyProgramRequest)
    : Promise<{ response: CreateAdminStudyProgramRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateAdminStudyProgramRoot>(() => `/api/v1/admin/admin-study-program/adminStudyProgram.AdminStudyProgramHandler/Create`, <any>{
            method: 'POST',
            body: {
                name: req.name,
                age: Number(req.age)
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