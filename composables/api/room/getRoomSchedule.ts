import { ErrorRoot } from "~~/types/api/error";
import { GetRoomScheduleRoot } from "~~/types/api/room/GetRoomSchedule";

export async function getRoomSchedule(limit: number, page: number, searchText: string, roomId: string, dayOfWeek: string, semesterId: string)
    : Promise<{ response: GetRoomScheduleRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetRoomScheduleRoot>(() => `/api/v1/admin/space/admin_room.AdminRoomHandler/GetSchedule?limit=${limit}&page=${page}&search=${searchText}&roomId=${roomId}&dayOfWeek=${dayOfWeek}&semesterId=${semesterId}`, <any>{
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
            return { response: null, error: errorRoot };
        }
        return { response: data.value, error: null };
    } catch (error) {
        return { response: null, error: <ErrorRoot>{ meta: { code: 'EXCEPCTION', status: 0, message: <string>error } } }
    }
}