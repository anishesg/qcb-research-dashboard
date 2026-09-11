export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  const BLACKWELL = process.env.BLACKWELL_URL || 'http://44.201.140.239:7861/status';
  const OREGON = process.env.OREGON_URL || 'http://54.213.35.32:7861/status';

  async function safeFetch(url) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(8000) });
      return await r.json();
    } catch(e) { return { error: e.message, status: 'OFFLINE' }; }
  }

  const [fe, dcs] = await Promise.all([safeFetch(BLACKWELL), safeFetch(OREGON)]);
  res.json({ flash_evict: fe, dcs, timestamp: new Date().toISOString() });
}
