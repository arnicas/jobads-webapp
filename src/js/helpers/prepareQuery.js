export default (query, filters, geofilter) => {
    return Object.assign({q:query}, filters, geofilter);
};