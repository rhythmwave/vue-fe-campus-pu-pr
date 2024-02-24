import { ErrorRoot } from "~~/types/api/error";
import { ReshuffleStudentClassRequest, ReshuffleStudentClassDataRequest, ReshuffleStudentClassRoot } from "~~/types/api/student-class/ReshuffleStudentClassRequest";

export async function reshuffleStudentClass(body: ReshuffleStudentClassRequest[])
    : Promise<{ response: ReshuffleStudentClassRoot | null, error: ErrorRoot | null }> {
    try {
        let req = <ReshuffleStudentClassRequest[]>[]
        body.forEach(function(item){
            let students = <ReshuffleStudentClassDataRequest[]>[]
            for (let index = 0; index < item.students.length; index++) {
                students.push(<ReshuffleStudentClassDataRequest>{
                    source_class_id: item.students[index].source_class_id,
                    student_id: item.students[index].student_id,
                })
            }
            req.push(<ReshuffleStudentClassRequest>{
                destination_class_id: item.destination_class_id,
                students: students,
            })
        })
        const { data: data, pending, refresh, error } = await useAPIFetch<ReshuffleStudentClassRoot>(() => `/api/v1/admin/student_class/admin_student_class.AdminStudentClassHandler/ReshuffleStudentClass`, <any>{
            method: 'PATCH',
            body: {
                data: req,
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