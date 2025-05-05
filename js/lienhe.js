function nguoidung() {
  const form = document.forms["formlh"];
  const sdt = form["sdt"].value.trim();
  const phoneOk = /^0\d{9}$/.test(sdt);

  if (!phoneOk) {
    alert("Số điện thoại không hợp lệ.");
    return false;
  }

  alert("Gửi thành công!");
  return true;
}
  