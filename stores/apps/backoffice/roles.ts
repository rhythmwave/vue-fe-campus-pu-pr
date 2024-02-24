import { defineStore } from 'pinia';
// project imports
import axios from '@/utils/axios';
import { number } from '@intlify/core-base';
import config from '~~/config';

export interface Role {
    id: string,
    name: string,
    description: string,
    created_by: string,
    updated_by: string | null,
    created_at: Date,
    updated_at: Date | null,
}

export let useBackofficeRolesStore = defineStore({
    id: 'BackofficeRoles',
    state: () => ({
        roles: [],
        pagination: {
            total_pages: 1,
            total_records: 0,
            prev: 0,
            next: 0,
        },
    }),
    getters: {},
    actions: {
        // Fetch followers from action
        async fetchBackofficeRoles(limit: number, page: number, search: String) {
            try {
                const { data: response, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_role.RootRoleHandler/GetList?limit=${limit}&page=${page}&search=${search}`,)
                this.pagination.total_pages =  response.value.pagination.total_pages
                this.pagination.total_records = response.value.pagination.total_records
                this.pagination.prev = response.value.pagination.prev
                this.pagination.next = response.value.pagination.next
                this.roles = response.value.data;
               
            } catch (error) {
                alert(error);
                console.log(error);
            }
        },

        async createBackofficeRoles(name: String, description: String) : Promise<boolean>{
            try {
                const { data: response, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/root/root_role.RootRoleHandler/Create`,{
                    method: 'POST',
                    body:{
                        "name": name,
                        "description": description,
                        "study_program_ids": [],
                        "permission_ids": [],
                    }

                },)
                return true;
            } catch (error) {
                alert(error);
                console.log(error);
                return false;
            }
        }
    }
});
