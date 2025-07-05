async function handleRedirect() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (token) {
    localStorage.setItem("token", token);

    const userId = await getUserId(); 
    localStorage.setItem("userId", userId);

    if (isAdmin()) {
      window.location.href = "../admin.html";
    } else {
      window.location.href = "../sanpham.html";
    }
  }
}

handleRedirect();
