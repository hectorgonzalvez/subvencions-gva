import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { action, q, rows, resource_id, limit } = req.query;
    let url = `https://dadesobertes.gva.es/api/3/action/${action}?`;

    if (action === 'package_search') {
      url += `q=${q || 'subvencions'}&rows=${rows || 50}`;
    } else if (action === 'datastore_search') {
      url += `resource_id=${resource_id}&limit=${limit || 5000}`;
    }

    const response = await fetch(url, { timeout: 30000 });
    const data = await response.json();

    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Error:', error.message);
    return res.status(500).json({ 
      error: 'Error', 
      message: error.message 
    });
  }
}