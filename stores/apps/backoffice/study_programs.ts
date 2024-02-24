import { defineStore } from 'pinia';
// project imports
import axios from '@/utils/axios';
import { number } from '@intlify/core-base';

export let useBackofficeStudyProgramsStore = defineStore({
    id: 'BackofficeStudyPrograms',
    state: () => ({
        study_programs: [],
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
        async fetchBackofficeStudyPrograms(limit: number, page: number, search: String) {
            try {
                var response = await axios.get(`http://127.0.0.1:9000/api/v1/root/root_study_program.RootStudyProgramHandler/GetList?limit=${limit}&page=${page}&search=${search}`);
                this.pagination.total_pages = response.data.pagination.total_pages
                this.pagination.total_records = response.data.pagination.total_records
                this.pagination.prev = response.data.pagination.prev
                this.pagination.next = response.data.pagination.next
                this.study_programs = response.data.data;
            } catch (error) {
                alert(error);
                console.log(error);
            }
        }
    }
});
