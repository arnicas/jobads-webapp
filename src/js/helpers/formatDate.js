export default function formatDate(dateIn) {
  let date = (new Date(dateIn))
  let d = date.getDate();
  let m = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  return ((d<10?'0':'') + d) + ' ' + m[date.getMonth()] + ' ' + date.getFullYear();
}