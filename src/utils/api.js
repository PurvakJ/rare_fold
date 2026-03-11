const BASE_URL = "https://script.google.com/macros/s/AKfycbxUPrvE8ML-eFPMtfAkDqeicQWjvXRg6BiJ7oJRySgE21ewCFsThCfZZvu0SVPjCgin/exec";

export async function apiGet(action, params = {}) {
  const query = new URLSearchParams({ action, ...params }).toString();

  const res = await fetch(`${BASE_URL}?${query}`);
  return res.json();
}

export async function apiPost(data) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify(data)
  });

  return res.json();
}