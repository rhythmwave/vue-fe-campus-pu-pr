import { ApiAuthRefresh } from "~~/composables/api/auth/useRefresh";
import { LoginData } from "~~/types/api/auth/Login";


export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = useAuth()
    console.log("user.value");
    console.log(user.value);
    if (user.value) {
        var userData = <LoginData>user.value;
        if (new Date(userData.expiry_time) < new Date()) {
            await ApiAuthRefresh('Bearer ' + userData.refresh_token);
        }
        if(userData.app_type=="root"){
            return navigateTo({ name: 'backoffice' , path: 'backoffice'})
        }
        if(userData.app_type=="admin"){
            return navigateTo({ path: '/backoffice/study-program/study-program-management'})
        }
        if(userData.app_type=="lecturer" || userData.app_type=="student"){
            return navigateTo({ path: '/academic-portal'})
        }
    } 
})
