import { ErrorRoot } from "~~/types/api/error";
import { GetCalendarListRoot } from "~~/types/api/schedule/GetCalendarList";

export async function getCalendarList(year: number, month: number, roomId: string, lecturerId: string, classId: string)
    : Promise<{ response: GetCalendarListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetCalendarListRoot>(() => `/api/v1/admin/admin_lecture.AdminLectureHandler/GetCalendar?year=${year}&month=${month}&roomId=${roomId}&lecturerId=${lecturerId}&classId=${classId}`, <any>{
            method: 'GET',
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
        }
        return { response: data.value, error: null };
    } catch (error) {
        return { response: null, error: <ErrorRoot>{ meta: { code: 'EXCEPCTION', status: 0, message: <string>error } } }
    }
}