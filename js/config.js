const API_BASE_URL = "https://tangy-suns-drum.loca.lt/api";
function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // tháng tính từ 0
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}
