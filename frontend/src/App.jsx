import { useState, useEffect, useCallback } from 'react';

const SERVICES = [
  { key: 'user',         name: 'user-service',         port: 4001, path: '/api/users',        fields: ['name', 'email'] },
  { key: 'product',      name: 'product-service',      port: 4002, path: '/api/products',      fields: ['name', 'price'] },
  { key: 'order',        name: 'order-service',        port: 4003, path: '/api/orders',        fields: ['userId', 'productId', 'quantity', 'status'] },
  { key: 'payment',      name: 'payment-service',      port: 4004, path: '/api/payments',      fields: ['orderId', 'amount', 'status'] },
  { key: 'inventory',    name: 'inventory-service',    port: 4005, path: '/api/inventory',     fields: ['productId', 'stock'] },
  { key: 'notification', name: 'notification-service', port: 4006, path: '/api/notifications', fields: ['message', 'type'] },
];

function emptyForm(fields) {
  return Object.fromEntries(fields.map((f) => [f, '']));
}

function ServicePanel({ service, gatewayUrl }) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('checking'); // checking | up | down
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm(service.fields));

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${gatewayUrl}${service.path}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setItems(data);
      setStatus('up');
    } catch (err) {
      setStatus('down');
    }
  }, [gatewayUrl, service.path]);

  useEffect(() => {
    load();
    const id = setInterval(load, 8000);
    return () => clearInterval(id);
  }, [load]);

  async function handleAdd(e) {
    e.preventDefault();
    const body = Object.fromEntries(
      Object.entries(form).filter(([, v]) => v.trim() !== '')
    );
    if (Object.keys(body).length === 0) return;
    try {
      const res = await fetch(`${gatewayUrl}${service.path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setForm(emptyForm(service.fields));
      load();
    } catch (err) {
      setError(`Couldn't add item: ${err.message}`);
      setTimeout(() => setError(''), 4000);
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`${gatewayUrl}${service.path}/${id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) throw new Error(`HTTP ${res.status}`);
      load();
    } catch (err) {
      setError(`Couldn't delete: ${err.message}`);
      setTimeout(() => setError(''), 4000);
    }
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <div className="name">{service.name} <span className="port">:{service.port}</span></div>
        <div className="status-row">
          <span className={`dot ${status === 'up' ? 'up' : status === 'down' ? 'down' : ''}`} />
          {status === 'up' ? `${items.length} record${items.length === 1 ? '' : 's'}` : status}
        </div>
      </div>

      <form className="add-item" onSubmit={handleAdd}>
        {service.fields.map((f) => (
          <input
            key={f}
            placeholder={f}
            value={form[f]}
            onChange={(e) => setForm({ ...form, [f]: e.target.value })}
          />
        ))}
        <button type="submit">Add</button>
      </form>

      {error && <div className="error-msg">{error}</div>}

      <div className="item-list">
        {status === 'down' ? (
          <div className="empty">Can't reach {service.name}.<br />Is it running on :{service.port}?</div>
        ) : items.length === 0 ? (
          <div className="empty">No records yet</div>
        ) : (
          items.map((item) => (
            <div className="item-row" key={item._id}>
              <div className="fields">
                {service.fields
                  .filter((f) => item[f])
                  .map((f) => (
                    <span key={f}><b>{f}</b>{item[f]}</span>
                  ))}
              </div>
              <button className="del" title="Delete" onClick={() => handleDelete(item._id)}>×</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function App() {
  // In production this is empty -- the app is served behind the same Ingress
  // host as the gateway (path-based routing: "/" -> frontend, "/api" ->
  // api-gateway), so a relative URL just works and there's no CORS to deal
  // with. Locally with `npm run dev`, .env.development points this at
  // http://localhost:4000 instead.
  const [gatewayUrl, setGatewayUrl] = useState(import.meta.env.VITE_GATEWAY_URL || '');

  return (
    <>
      <header>
        <div>
          <h1>Service Console</h1>
          <div className="sub">7 microservices behind one gateway — add and remove records live</div>
        </div>
        <div className="gateway-config">
          <label htmlFor="gwUrl">Gateway</label>
          <input
            id="gwUrl"
            className="mono"
            value={gatewayUrl}
            onChange={(e) => setGatewayUrl(e.target.value)}
          />
        </div>
      </header>

      <main>
        <div className="grid">
          {SERVICES.map((service) => (
            <ServicePanel key={service.key} service={service} gatewayUrl={gatewayUrl} />
          ))}
        </div>
      </main>
    </>
  );
}
