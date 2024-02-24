import { ErrorRoot } from "~~/types/api/error";
import { GetRoomListRoot } from "~~/types/api/room/GetRoomList";

export async function getRoomList(limit: number, page: number, searchText: string, buildingId:string, isLaboratory: any, excludeLectureDate: any, excludeStartTime: any, excludeEndTime: any, maximumParticipant: any, forExam: any)
    : Promise<{ response: GetRoomListRoot | null, error: ErrorRoot | null }> {
    try {
        const { data: data, pending, refresh, error } = await useAPIFetch<GetRoomListRoot>(() => `/api/v1/admin/admin_room.AdminRoomHandler/GetList?limit=${limit}&page=${page}&search=${searchText}&buildingId=${buildingId}&isLaboratory=${isLaboratory}&excludeLectureDate=${excludeLectureDate}&excludeStartTime=${excludeStartTime}&excludeEndTime=${excludeEndTime}&maximumParticipant=${maximumParticipant}&forExam=${forExam}`, <any>{
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