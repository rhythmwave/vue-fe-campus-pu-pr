import { ErrorRoot } from "~~/types/api/error";
import { CreateLecturerClassGradeComponentRequest, CreateLecturerClassGradeComponentRoot } from "~~/types/api/lecturer-class-grade-component/CreateLecturerClassGradeComponent";

export async function createLecturerClassGradeComponent(body: CreateLecturerClassGradeComponentRequest)
    : Promise<{ response: CreateLecturerClassGradeComponentRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateLecturerClassGradeComponentRoot>(() => `/api/v1/admin/lecturer-class-grade-component/lecturerClassGradeComponent.LecturerClassGradeComponentHandler/Create`, <any>{
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