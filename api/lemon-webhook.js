export default async function handler(req, res) {
  try {
    // 1. POST만 허용
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // 2. webhook 데이터 받기
    const body = req.body;
    console.log("📩 webhook:", JSON.stringify(body, null, 2));

    // 3. 라이센스 키 추출 (둘 다 대응)
    const licenseKey =
      body?.data?.attributes?.key ||
      body?.data?.attributes?.license_key;

    if (!licenseKey) {
      console.error("❌ license key 없음");
      return res.status(400).json({ error: "No license key" });
    }

    console.log("✅ license key:", licenseKey);

    // 4. 환경변수
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SERVICE_KEY) {
      console.error("❌ env 없음");
      return res.status(500).json({ error: "Missing env" });
    }

    // 5. Supabase 저장
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
      console.error("❌ DB 저장 실패:", text);
      return res.status(500).json({ error: text });
    }

    console.log("🔥 DB 저장 성공");

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("💥 서버 에러:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
