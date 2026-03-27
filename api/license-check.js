export default async function handler(req, res) {
  try {
    const { key } = req.body;

    console.log("받은 키:", key);

    if (!key) {
      return res.status(400).json({ valid: false, error: "No key" });
    }

    const url = `${process.env.SUPABASE_URL}/rest/v1/licenses?license_key=eq.${key}`;
    console.log("조회 URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        apikey: process.env.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("DB 결과:", data);

    if (!data || data.length === 0) {
      return res.status(400).json({ valid: false, error: "Invalid key" });
    }

    if (data[0].is_used) {
      return res.status(400).json({ valid: false, error: "Already used" });
    }

    // 사용 처리
    await fetch(url, {
      method: "PATCH",
      headers: {
        apikey: process.env.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ is_used: true }),
    });

    return res.status(200).json({ valid: true });
  } catch (err) {
    console.error("에러:", err);
    return res.status(500).json({ valid: false, error: "Server error" });
  }
}
