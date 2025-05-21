function getToken() {
  const token = localStorage.getItem("token");
  if (token) return token;
  return null;
}

function getPayload() {
  const token = getToken();
  if (!token) return null;
  try {
    return jwt_decode(token);
  } catch (e) {
    console.log("token không hợp lệ");
    return null;
  }
}

function isAdmin() {
  const payload = getPayload();
  return payload?.authorities == "ADMIN";
}

function isTokenExpired() {
  const payload = getPayload();
  if (!payload?.exp) return null;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

function isLoggedIn() {
  return !!getToken() || !!isTokenExpired();
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "dangnhap.html";
}

async function getUserId() {
  const payload = getPayload();
  const email = payload?.sub;
  const res = await fetch(`${API_BASE_URL}/account/email?email=` + email, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (res.ok) {
    const data = await res.json();
    return data.id;
  } else {
    return null;
  }
}
