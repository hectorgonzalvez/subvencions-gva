module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { action, q, rows, resource_id, limit } = req.query;

    if (!action) {
      return res.status(400).json({ error: 'Paràmetre action requerit' });
    }

    let url = `https://dadesobertes.gva.es/api/3/action/${action}?`;

    if (action === 'package_search') {
      url += `q=${encodeURIComponent(q || 'subvencions')}&rows=${rows || 50}`;
    } else if (action === 'datastore_search') {
      url += `resource_id=${resource_id}&limit=${limit || 5000}`;
    }

    console.log('Fetching URL:', url);

    const response = await fetch(url, {
      headers: { 'User-Agent': 'SubvencionsBrowser/1.0' }
    });

    if (!response.ok) {
      return res.status(502).json({ 
        error: `API externa ha retornat ${response.status}`,
        url 
      });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Error detallat:', error);
    return res.status(500).json({ 
      error: error.message,
      type: error.constructor.name
    });
  }
};
