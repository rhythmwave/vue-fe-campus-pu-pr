import { ErrorRoot } from "~~/types/api/error";
import { MergeClassStudentClassRequest, MergeClassStudentClassRoot } from "~~/types/api/student-class/MergeStudentClassRequest";

export async function mergeStudentClass(body: MergeClassStudentClassRequest)
    : Promise<{ response: MergeClassStudentClassRoot | null, error: ErrorRoot | null }> {
    try {
        let sourceIds = <string[]>[]
        body.source_class_ids.forEach(function(item){
            sourceIds.push(item)
        })
        let req = <MergeClassStudentClassRequest>{
            destination_class_id: body.destination_class_id,
            source_class_ids: sourceIds,
        }
        const { data: data, pending, refresh, error } = await useAPIFetch<MergeClassStudentClassRoot>(() => `/api/v1/admin/student_class/admin_student_class.AdminStudentClassHandler/MergeStudentClass`, <any>{
            method: 'PATCH',
            body: req
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