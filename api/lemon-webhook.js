export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const body = req.body;
    console.log("📩 webhook:", JSON.stringify(body, null, 2));

    // 🔥 핵심 수정 (여기만 중요)
    const licenseKey =
      body?.data?.attributes?.key ||
      body?.data?.attributes?.license_key;

    if (!licenseKey) {
      console.error("❌ license key 없음");
      return res.status(400).json({ error: "No license key" });
    }

    console.log("✅ license key:", licenseKey);

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const response = await fetch(`${SUPABASE_URL}/rest/v1/licenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
      body: JSON.stringify({
        license_key: licenseKey,
        is_used: false,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("❌ DB 실패:", text);
      return res.status(500).json({ error: text });
    }

    console.log("🔥 저장 성공");

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("💥 서버 에러:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
