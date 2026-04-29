const clients = new Set();

function writeEvent(res, payload) {
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

export function registerRealtimeRoute(app) {
  app.get('/api/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    const client = { id: Date.now() + Math.random(), res };
    clients.add(client);

    writeEvent(res, { type: 'connected', at: new Date().toISOString() });
    const ping = setInterval(() => writeEvent(res, { type: 'ping', at: new Date().toISOString() }), 25000);

    req.on('close', () => {
      clearInterval(ping);
      clients.delete(client);
    });
  });
}

export function emitRealtimeEvent(type, payload = {}) {
  const event = { type, at: new Date().toISOString(), payload };
  for (const client of clients) {
    try {
      writeEvent(client.res, event);
    } catch {
      clients.delete(client);
    }
  }
}
