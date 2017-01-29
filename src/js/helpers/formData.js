export default (files) => {
    const data = new FormData();
    files.forEach((file)=>{
        data.append(file.name, file);
        data.append('timestamp', Date.now());
    });
    return data;
}