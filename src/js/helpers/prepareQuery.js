export default (query, filters, geofilter, offset) => {
    return Object.assign({},{q:query}, filters, geofilter);
};