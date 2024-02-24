import { ErrorRoot } from "~~/types/api/error";
import { CreateLecturerSemesterRequest, CreateLecturerSemesterRoot } from "~~/types/api/lecturer-semester/CreateLecturerSemester";

export async function createLecturerSemester(body: CreateLecturerSemesterRequest)
    : Promise<{ response: CreateLecturerSemesterRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateLecturerSemesterRoot>(() => `/api/v1/admin/lecturer-semester/lecturerSemester.LecturerSemesterHandler/Create`, <any>{
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