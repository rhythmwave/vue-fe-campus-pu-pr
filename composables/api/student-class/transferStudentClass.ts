import { ErrorRoot } from "~~/types/api/error";
import { TransferStudentClassRequest, TransferStudentClassDataRequest, TransferStudentClassRoot } from "~~/types/api/student-class/TransferStudentClassRequest";

export async function transferStudentClass(body: TransferStudentClassRequest)
    : Promise<{ response: TransferStudentClassRoot | null, error: ErrorRoot | null }> {
    try {
        let dataArr = <TransferStudentClassDataRequest[]>[];
        for (let index = 0; index < body.data.length; index++) {
            dataArr.push(<TransferStudentClassDataRequest>{
                student_id: body.data[index].student_id,
                destination_class_id: body.data[index].destination_class_id,
            })
        }
        let req = <TransferStudentClassRequest>{
            source_class_id: body.source_class_id,
            data: dataArr,
        }
        const { data: data, pending, refresh, error } = await useAPIFetch<TransferStudentClassRoot>(() => `/api/v1/admin/student_class/admin_student_class.AdminStudentClassHandler/TransferStudentClass`, <any>{
            method: 'PATCH',
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