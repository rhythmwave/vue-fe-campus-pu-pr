import { ErrorRoot } from "~~/types/api/error";
import { CreateLecturerClassWorkRequest, CreateLecturerClassWorkRoot } from "~~/types/api/lecturer-class-work/CreateLecturerClassWork";

export async function createLecturerClassWork(body: CreateLecturerClassWorkRequest)
    : Promise<{ response: CreateLecturerClassWorkRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateLecturerClassWorkRoot>(() => `/api/v1/lecturer/lecturer_class_work.LecturerClassWorkHandler/Create`, <any>{
            method: 'POST',
            body: {
                class_id: req.class_id,
                title: req.title,
                abstraction: req.abstraction,
                file_path: req.file_path,
                file_path_type: req.file_path_type,
                start_time: req.start_time,
                end_time: req.end_time,
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