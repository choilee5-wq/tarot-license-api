export default async function handler(req, res) {
  // ✅ CORS 허용
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // preflight 대응
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    let body = req.body;

    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    const key = body?.key;

    if (!key) {
      return res.status(200).json({ success: false, message: "No key" });
    }

    // 테스트 조건 (11자리 이상)
    if (key.length > 10) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(200).json({ success: false });
    }

  } catch (e) {
    return res.status(200).json({ success: false, error: "Server error" });
  }
}
