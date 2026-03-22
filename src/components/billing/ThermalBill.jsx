// src/components/billing/ThermalBill.jsx
export default function ThermalBill({ cartItems, subtotal, gst, grandTotal, orderMode, billNo }) {
  const now     = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  const s = {
    wrap: {
      width: '80mm',
      fontFamily: "'Courier New', Courier, monospace",
      fontSize: '12px',
      color: '#000',
      padding: '4mm 2mm',
      lineHeight: '1.5',
    },
    center:   { textAlign: 'center' },
    row:      { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    hr:       { borderTop: '1px dashed #000', margin: '4px 0', border: 'none', borderTopStyle: 'dashed', borderTopWidth: '1px', borderTopColor: '#000' },
    hrSolid:  { borderTop: '2px solid #000', margin: '4px 0', border: 'none', borderTopStyle: 'solid', borderTopWidth: '2px', borderTopColor: '#000' },
    grandRow: { display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '15px', marginTop: '2px' },
    footer:   { textAlign: 'center', fontSize: '11px', marginTop: '6px', lineHeight: '1.6' },
  };

  return (
    <div style={s.wrap}>

      {/* Header */}
      <div style={{ ...s.center, marginBottom: '4px' }}>
        <div style={{ fontSize: '16px', fontWeight: '900', letterSpacing: '1px' }}>I THULIR RESTAURANT</div>
        <div style={{ fontSize: '11px' }}>I துளிர் உணவகம்</div>
        <div style={{ fontSize: '11px' }}>Tharamangalam, Salem - 636 502</div>
        <div style={{ fontSize: '11px' }}>Ph: +91 98765 43210</div>
        <div style={{ fontSize: '11px' }}>GSTIN: 33XXXXXX1234Z5</div>
      </div>

      <div style={s.hr} />

      {/* Bill Info */}
      <div style={{ fontSize: '11px', marginBottom: '4px' }}>
        <div style={s.row}>
          <span>Bill No : <strong>#{billNo}</strong></span>
          <span>Mode: <strong>{orderMode}</strong></span>
        </div>
        <div style={s.row}>
          <span>Date: {dateStr}</span>
          <span>Time: {timeStr}</span>
        </div>
        <div><span>Cashier: <strong>Counter 1</strong></span></div>
      </div>

      <div style={s.hr} />

      {/* Column Headers */}
      <div style={{ display: 'flex', fontWeight: '700', fontSize: '11px', marginBottom: '2px' }}>
        <span style={{ flex: 1 }}>ITEM</span>
        <span style={{ minWidth: '28px', textAlign: 'center' }}>QTY</span>
        <span style={{ minWidth: '40px', textAlign: 'right' }}>RATE</span>
        <span style={{ minWidth: '52px', textAlign: 'right' }}>AMT</span>
      </div>

      <div style={s.hr} />

      {/* Items */}
      {cartItems.map((item, i) => (
        <div key={item.id} style={{ marginBottom: '4px' }}>
          <div style={{ fontWeight: '600', fontSize: '12px' }}>
            {i + 1}. {item.name}
          </div>
          <div style={{ fontSize: '10px', color: '#444', paddingLeft: '12px', marginBottom: '1px' }}>
            {item.nameTa}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '12px' }}>
            <span style={{ minWidth: '28px', textAlign: 'center' }}>{item.qty}</span>
            <span style={{ minWidth: '40px', textAlign: 'right' }}>x{item.price}</span>
            <span style={{ minWidth: '52px', textAlign: 'right', fontWeight: '700' }}>
              Rs.{(item.price * item.qty).toFixed(2)}
            </span>
          </div>
        </div>
      ))}

      <div style={s.hr} />

      {/* Totals */}
      <div style={{ fontSize: '12px' }}>
        <div style={s.row}><span>Subtotal</span><span>Rs.{subtotal.toFixed(2)}</span></div>
        <div style={s.row}><span>GST (5%)</span><span>Rs.{gst.toFixed(2)}</span></div>
        <div style={s.row}><span>Discount</span><span>Rs.0.00</span></div>
      </div>

      <div style={s.hrSolid} />

      <div style={s.grandRow}>
        <span>GRAND TOTAL</span>
        <span>Rs.{grandTotal.toFixed(2)}</span>
      </div>

      <div style={s.hrSolid} />

      {/* Payment */}
      <div style={{ fontSize: '12px', marginTop: '4px' }}>
        <div style={s.row}><span>Payment</span><span><strong>CASH</strong></span></div>
        <div style={s.row}><span>Amount Paid</span><span>Rs.{grandTotal.toFixed(2)}</span></div>
        <div style={s.row}><span>Balance</span><span>Rs.0.00</span></div>
      </div>

      <div style={s.hr} />

      {/* Count */}
      <div style={{ fontSize: '11px', textAlign: 'center', marginBottom: '4px' }}>
        Items: <strong>{cartItems.length}</strong> | Qty: <strong>{cartItems.reduce((s, i) => s + i.qty, 0)}</strong>
      </div>

      <div style={s.hr} />

      {/* Footer */}
      <div style={s.footer}>
        <div style={{ fontWeight: '700', fontSize: '12px' }}>*** THANK YOU ***</div>
        <div>நன்றி! மீண்டும் வாருங்கள்!</div>
        <div style={{ marginTop: '4px', fontSize: '10px' }}>Computer generated bill.</div>
        <div style={{ fontSize: '10px' }}>No signature required.</div>
        <div style={{ marginTop: '6px', fontSize: '11px', fontWeight: '700' }}>* I THULIR RESTAURANT *</div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '10px', letterSpacing: '2px', color: '#666' }}>
        - - - - - - - - - - - - - - - -<br />
        CUT HERE
      </div>

    </div>
  );
}
