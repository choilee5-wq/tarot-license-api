export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;

    // 👉 핵심: 여기 구조로 꺼내야 함
    const licenseKey = body?.data?.attributes?.key;

    if (!licenseKey) {
      return res.status(400).json({ error: 'No license key' });
    }

    // 👉 Supabase 저장
    const response = await fetch(process.env.SUPABASE_URL + '/rest/v1/licenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        license_key: licenseKey,
        is_used: false
      })
    });

    const data = await response.json();

    return res.status(200).json({ success: true, data });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
