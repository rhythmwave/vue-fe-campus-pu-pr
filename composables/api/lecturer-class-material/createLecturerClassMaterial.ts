import { ErrorRoot } from "~~/types/api/error";
import { CreateLecturerClassMaterialRequest, CreateLecturerClassMaterialRoot } from "~~/types/api/lecturer-class-material/CreateLecturerClassMaterial";

export async function createLecturerClassMaterial(body: CreateLecturerClassMaterialRequest)
    : Promise<{ response: CreateLecturerClassMaterialRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateLecturerClassMaterialRoot>(() => `/api/v1/lecturer/lecturer_class_material.LecturerClassMaterialHandler/Create`, <any>{
            method: 'POST',
            body: {
                class_id: req.class_id,
                title: req.title,
                abstraction: req.abstraction,
                file_path: req.file_path,
                file_path_type: req.file_path_type,
                is_active: req.is_active,
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