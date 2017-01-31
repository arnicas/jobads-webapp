export default (url, files) => {
    const data = new FormData();
    data.append('file', files[0]);
    return new Promise( (resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('POST', url, true);
        request.onloadend = () => {
            if(request.readyState == 4 && request.status == 200) {
                resolve(JSON.parse(request.response));
            }
        };
        request.onerror = () => {
            reject(new Error("Error posting result"));
        };
        request.send(data);
    });
};