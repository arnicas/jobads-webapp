export default (url, data) => {
    return new Promise( (resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('POST', url, true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
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