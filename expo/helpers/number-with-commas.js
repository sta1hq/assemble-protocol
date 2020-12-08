export default (x) => {
  if (!x) return '0';
  return `${x}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}