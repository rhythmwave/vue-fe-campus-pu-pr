import { object } from "yup";
import { ErrorRoot } from "~~/types/api/error";
import { CreateSubjectCategoryRequest, CreateSubjectCategoryRoot } from "~~/types/api/subject-category/CreateSubjectCategory";


export async function createSubjectCategory(body: CreateSubjectCategoryRequest)
    : Promise<{ response: CreateSubjectCategoryRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateSubjectCategoryRoot>(() => `/api/v1/admin/reference_data/admin_subject_category.AdminSubjectCategoryHandler/Create`, <any>{
            method: 'POST',
            body: req,
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