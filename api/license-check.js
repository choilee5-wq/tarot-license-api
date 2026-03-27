export default async function handler(req, res) {
  try {
    let key;

    // body 형태 대응
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
        apikey: process.env.SUPABASE_SECRET_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
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
      `${process.env.SUPABASE_URL}/rest/v1/licenses?license_key=eq.${cleanKey}`,
      {
        method: "PATCH",
        headers: {
          apikey: process.env.SUPABASE_SECRET_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_used: true }),
      }
    );

    return res.status(200).json({ valid: true });

  } catch (err) {
    return res.status(500).json({ valid: false, error: "Server error" });
  }
}
