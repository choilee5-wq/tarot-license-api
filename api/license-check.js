export default async function handler(req, res) {
  // ✅ CORS 허용
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

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
      return res.status(200).json({ success: false });
    }

    // ✅ 실제 허용 키 목록
    const VALID_KEYS = [
      "ABC123-REAL-KEY-001",
      "ABC123-REAL-KEY-002",
      "ABC123-REAL-KEY-003"
    ];

    // ✅ 키 검증
    if (VALID_KEYS.includes(key.trim())) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(200).json({ success: false });
    }

  } catch (e) {
    return res.status(200).json({ success: false });
  }
}
