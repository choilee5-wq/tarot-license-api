export default async function handler(req, res) {
  try {
    // 1. POST만 허용
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // 2. body 받기
    const body = req.body;

    console.log("📩 webhook received:", JSON.stringify(body, null, 2));

    // 3. license key 추출 (핵심 수정 부분)
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
      console.error("❌ Supabase env 없음");
      return res.status(500).json({ error: "Missing env" });
    }

    // 5. Supabase insert
    const response = await fetch(`${SUPABASE_URL}/rest/v1/licenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        license_key: licenseKey,
        is_used: false,
      }),
    });

    // 6. 결과 확인
    if (!response.ok) {
      const text = await response.text();
      console.error("❌ Supabase insert 실패:", text);
      return res.status(500).json({ error: "DB insert failed" });
    }

    console.log("🔥 DB 저장 성공");

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("💥 서버 에러:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
