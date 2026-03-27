export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const body = req.body;

  console.log("WEBHOOK RECEIVED:", body);

  const licenseKey = body.data?.attributes?.license_key;

  if (!licenseKey) {
    return res.status(400).json({ error: "No license key" });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  await fetch(`${SUPABASE_URL}/rest/v1/licenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      key: licenseKey,
      used: false,
    }),
  });

  return res.status(200).json({ success: true });
}
