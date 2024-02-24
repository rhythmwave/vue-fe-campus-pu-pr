import { ErrorRoot } from "~~/types/api/error";
import { CreateLessonPlanRequest, CreateLessonPlanRoot } from "~~/types/api/lesson-plan/CreateLessonPlan";

export async function createLessonPlan(body: CreateLessonPlanRequest)
    : Promise<{ response: CreateLessonPlanRoot | null, error: ErrorRoot | null }> {
    try {
        var req = Object.assign({}, body)
        const { data: data, pending, refresh, error } = await useAPIFetch<CreateLessonPlanRoot>(() => `/api/v1/admin/curriculum/admin_lesson_plan.AdminLessonPlanHandler/Create`, <any>{
            method: 'POST',
            body: {
                subject_id: req.subject_id,
                meeting_order: Number(req.meeting_order),
                lesson: req.lesson,
                english_lesson: req.english_lesson,
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