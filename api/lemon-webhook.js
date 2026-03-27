export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const body = req.body;

    // 이벤트 타입 확인
    const eventType = body.meta?.event_name;

    // license_key_created만 처리
    if (eventType !== "license_key_created") {
      return res.status(200).json({ message: "ignored" });
    }

    const licenseKey = body.data?.attributes?.key;

    if (!licenseKey) {
      return res.status(400).json({ error: "No license key" });
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const response = await fetch(`${SUPABASE_URL}/rest/v1/licenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({
        license_key: licenseKey,
        is_used: false,
      }),
    });

    const data = await response.json();

    return res.status(200).json({ success: true, data });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "server error" });
  }
}
