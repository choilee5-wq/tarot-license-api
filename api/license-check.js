export default async function handler(req, res) {
  try {
    let key;

    // 🔥 핵심: body가 문자열일 경우 대응
    if (typeof req.body === "string") {
      key = req.body;
    } else {
      key = req.body.key;
    }

    if (!key) {
      return res.status(400).json({ valid: false, error: "No key" });
    }

    const cleanKey = key.trim();

    const url = `${process.env.SUPABASE_URL}/rest/v1/licenses?license_key=eq.${cleanKey}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        apikey: process.env.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!data || data.length === 0) {
      return res.status(400).json({ valid: false, error: "Invalid key" });
    }

    if (data[0].is_used) {
      return res.status(400).json({ valid: false, error: "Already used" });
    }

    // 사용 처리
    await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/licenses?id=eq.${data[0].id}`,
      {
        method: "PATCH",
        headers: {
          apikey: process.env.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ is_used: true }),
      }
    );

    return res.status(200).json({ valid: true });

  } catch (error) {
    return res.status(500).json({ valid: false, error: error.message });
  }
}
