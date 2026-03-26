export default async function handler(req, res) {
  try {
    let body = req.body;

    // 🔥 body가 비어있으면 raw로 다시 읽기
    if (!body || Object.keys(body).length === 0) {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const raw = Buffer.concat(chunks).toString();
      if (raw) {
        body = JSON.parse(raw);
      }
    }

    const key = body?.key;

    if (!key) {
      return res.status(200).json({ success: false, message: "No key" });
    }

    if (key.length > 10) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(200).json({ success: false });
    }

  } catch (e) {
    return res.status(200).json({ success: false, error: "Server error" });
  }
}
