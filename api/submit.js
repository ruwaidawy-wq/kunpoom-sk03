export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const GAS_URL = "https://script.google.com/macros/s/AKfycbxKtzjYWSkRVG47df9DEorwj3vXkpSIYQN_mbRYmYYr9es6pJ6VAr1YGJLmEcnfKIs7/exec";

  try {
    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.toString() });
  }
}
