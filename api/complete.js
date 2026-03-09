export default async function handler(req, res) {

  const API_KEY = "usqgwegrliqtohsifyholnutf1cggxdmgpfyyr31uhfj4noemwfyibkgm2pnwfsy";
  const { paymentId } = req.body;

  try {

    const response = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const data = await response.json();

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }

}
