export default async function handler(req, res) {
  const { action, q, rows, resource_id, limit } = req.query;

  try {
    let url = `https://dadesobertes.gva.es/api/3/action/${action}?`;

    if (action === 'package_search') {
      url += `q=${q || 'subvencions'}&rows=${rows || 50}`;
    } else if (action === 'datastore_search') {
      url += `resource_id=${resource_id}&limit=${limit || 5000}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Content-Type', 'application/json');

    res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error fetching data', details: error.message });
  }
}
