import { ErrorRoot } from "~~/types/api/error";
import { AttendAutonomousLectureRequest, AttendAutonomousLectureRoot } from "~~/types/api/student-lecture/AttendAutonomousLecture";

export async function attendAutonomousLecture(body: AttendAutonomousLectureRequest)
    : Promise<{ response: AttendAutonomousLectureRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<AttendAutonomousLectureRoot>(() => `/api/v1/student/student_lecture.StudentLectureHandler/AttendAutonomousLecture`, <any>{
            method: 'PATCH',
            body: {
                lecture_id: req.lecture_id,
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