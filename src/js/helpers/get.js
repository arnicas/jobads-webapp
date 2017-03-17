
let formatParams = ( params ) => {
  return "?" + Object
        .keys(params)
        .map(function(key){
          return key+"="+params[key]
        })
        .join("&")
}

export default (_url, params) => {
    return new Promise( (resolve, reject) => {
        let request = new XMLHttpRequest();
        let url = (params) ? _url + formatParams(params) : _url;
        request.open('GET', url, true);
        request.onloadend = () => {
            if(request.readyState == 4 && request.status == 200) {
                resolve(JSON.parse(request.response));
            }
        };
        request.onerror = () => {
            reject(new Error("Error posting result"));
        };
        request.send(null);
    });
};