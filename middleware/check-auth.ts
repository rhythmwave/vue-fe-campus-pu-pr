import {permissions} from "~~/components/lc/Backoffice/vertical-sidebar/sidebarItem";
import { ApiAuthRefresh } from "~~/composables/api/auth/useRefresh";
import { LoginData } from "~~/types/api/auth/Login";



export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = useAuth()
    console.log("user.value");
    console.log(user.value);
    if (user.value) {
        var userData = <LoginData>user.value;
        if (new Date(userData.expiry_time) < new Date()) {
            let login= await ApiAuthRefresh('Bearer ' + userData.refresh_token);
            if(!login.data){
                return navigateTo({ name: 'login', path: '' })
            }
            userData = login.data;
        }
        
        permissions.name=userData.app_type;
        
        // return navigateTo({ name: 'backoffice' , path: 'backoffice'})
    } else {
        return navigateTo({ name: 'login', path: '' })
    }
})
