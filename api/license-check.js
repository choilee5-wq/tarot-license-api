export default async function handler(req, res) {
  try {
    let body = req.body;

    // 🔥 body가 string일 경우 파싱
    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    const key = body?.key;

    if (!key) {
      return res.status(200).json({ success: false, message: "No key" });
    }

    // 테스트용 (길이 10 이상이면 성공)
    if (key.length > 10) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(200).json({ success: false });
    }

  } catch (e) {
    return res.status(200).json({ success: false, error: "Server error" });
  }
}
