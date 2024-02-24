<script setup lang="ts">
import { AnyMap } from '@jridgewell/trace-mapping';
let firstLoad = true;
const emit = defineEmits(['reload', 'selected'])
onMounted(() => {
})

onUpdated(() => {
    if (!props.options) {
        rendertext({ id: '', name: '' })
    } else
        if ((<any[]>props.options).length == 0) {
            rendertext({ id: '', name: '' })
        }
    if (firstLoad)
        if (props.initSelected)
            if (props.initSelected.name) {
                rendertext(props.initSelected)
                firstLoad = false
            }
})
const props = defineProps({
    label: String,
    options: Array as any,
    initSelected: Array as any
})

const dataSelectedAutocomplete = ref('')
const autocompleteShow = ref(false)
const selectAutocomplete = (event: any) => {
    emit("reload", { search: event.target.value });
    autocompleteShow.value = true

}
function rendertext(findSelected: any) {
    if (!findSelected) return;
    if (findSelected.code) {
        dataSelectedAutocomplete.value = findSelected.code + ' - '
    } else {
        dataSelectedAutocomplete.value = ''
    }
    dataSelectedAutocomplete.value += findSelected.name;
    if (findSelected.study_level_short_name) dataSelectedAutocomplete.value += ' (' + findSelected.study_level_short_name + ')'

}
const selectedAutocomplete = (id: string) => {
    autocompleteShow.value = false
    let options = <any[]>props.options;
    let findSelected: any = {};
    options.forEach(function (e) {
        if (e.id == id) {
            findSelected = e
        }
    })
    rendertext(findSelected)
    emit("selected", findSelected);
}

</script>
<template>
    <VTextField v-model="dataSelectedAutocomplete" :label="props.label" @keyup="selectAutocomplete($event)"
        @click="selectAutocomplete($event)" />
    <div v-for="item in props.options" style="margin: 0px 5px 5px 5px" v-if="autocompleteShow">
        <input v-if="item.code" @click="selectedAutocomplete(item.id)"
            style="border: 1px solid #dfe5ef; border-radius: 5px; width: 100%; height: 40px; padding: 0px 5px 5px 5px"
            type="text" :value="item.code + ' - ' + item.name + ' (' + item.study_level_short_name + ')'">
        <input v-else @click="selectedAutocomplete(item.id)"
            style="border: 1px solid #dfe5ef; border-radius: 5px; width: 100%; height: 40px; padding: 0px 5px 5px 5px"
            type="text" :value="item.name">

    </div>
</template>