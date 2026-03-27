export default async function handler(req, res) {
  try {
    let key;

    // body 처리
    if (typeof req.body === "string") {
      key = req.body;
    } else {
      key = req.body?.key;
    }

    if (!key) {
      return res.status(400).json({ valid: false, error: "No key" });
    }

    // 🔥 핵심: 공백 제거 + 문자열 강제
    const cleanKey = String(key).replace(/\s/g, "");

    const url = `${process.env.SUPABASE_URL}/rest/v1/licenses?license_key=eq.${cleanKey}`;

    console.log("URL:", url);
    console.log("INPUT KEY:", key);
    console.log("CLEAN KEY:", cleanKey);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        apikey: process.env.SUPABASE_SECRET_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    console.log("DB RESULT:", data);

    // ❌ 키 없음
    if (!data || data.length === 0) {
      return res.status(200).json({ valid: false, error: "Invalid key" });
    }

    // ❌ 이미 사용됨
    if (data[0].is_used) {
      return res.status(200).json({ valid: false, error: "Already used" });
    }

    // ✅ 성공
    return res.status(200).json({ valid: true });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ valid: false, error: "Server error" });
  }
}
