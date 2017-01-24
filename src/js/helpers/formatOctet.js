export default function formatOctet(bytes,decimals) {
   if(bytes == 0) return '0 octet';
   var k = 1000,
       dm = decimals + 1 || 0,
       sizes = ['octets', 'Ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo'],
       i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};