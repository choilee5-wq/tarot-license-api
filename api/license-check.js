export default async function handler(req, res) {
  const { key } = req.body;

  if (!key) {
    return res.status(400).json({ success: false, message: "No key" });
  }

  // 테스트용
  if (key.length > 10) {
    return res.status(200).json({ success: true });
  } else {
    return res.status(200).json({ success: false });
  }
}
