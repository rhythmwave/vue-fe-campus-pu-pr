async function fileUpload(fileBase64:string){
    const { data: _organizer, pending, refresh, error } = await useAPIFetch<any>(() => `/api/v1/general/general_file.GeneralFileHandler/UploadBase64Temp`, <any>{
        method: 'POST',
        body: {
            file: fileBase64,
        },
    })
    return _organizer.value?.data
}
export { fileUpload };