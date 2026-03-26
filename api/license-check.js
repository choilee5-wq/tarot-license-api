export default async function handler(req, res) {
  const { licenseKey } = req.body;

  if (!licenseKey) {
    return res.status(400).json({ success: false });
  }

  try {
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/licenses?license_key=eq.${licenseKey}`,
      {
        method: "GET",
        headers: {
          apikey: process.env.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
      }
    );

    const data = await response.json();

    if (data.length === 0) {
      return res.status(200).json({ success: false });
    }

    const license = data[0];

    // 이미 사용된 키
    if (license.is_used) {
      return res.status(200).json({ success: false });
    }

    // 사용 처리
    await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/licenses?id=eq.${license.id}`,
      {
        method: "PATCH",
        headers: {
          apikey: process.env.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_used: true }),
      }
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
}
