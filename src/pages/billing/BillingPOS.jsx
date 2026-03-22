// Add this import at the very top of BillingPOS.jsx
import { useState, useMemo, useRef } from "react";

import { menuData } from "../../data/mockFoods";
import toast from "react-hot-toast";


const O = "#f97316";
const OD = "#ea580c";

export default function BillingPOS() {
  const [activeCat, setActiveCat] = useState(menuData[0].id);
  const [cart, setCart] = useState({});
  const [search, setSearch] = useState("");
  const [orderMode, setOrderMode] = useState("TAKE AWAY");
  const [lang, setLang] = useState("both"); // 'en' | 'ta' | 'both'
  const billRef = useRef();

  // ── Cart helpers ──────────────────────────────────────
  const addToCart = (item) => {
    setCart((prev) => ({
      ...prev,
      [item.id]: { ...item, qty: (prev[item.id]?.qty || 0) + 1 },
    }));
  };
  const changeQty = (id, delta) => {
    setCart((prev) => {
      const qty = (prev[id]?.qty || 0) + delta;
      if (qty <= 0) {
        const n = { ...prev };
        delete n[id];
        return n;
      }
      return { ...prev, [id]: { ...prev[id], qty } };
    });
  };
  const clearCart = () => {
    setCart({});
    toast.success("Cart cleared");
  };

  // ── Totals ────────────────────────────────────────────
  const cartItems = Object.values(cart);
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const gst = subtotal * 0.05;
  const grandTotal = subtotal + gst;

  // ── Search filter ─────────────────────────────────────
  const searchResults = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    const found = [];
    menuData.forEach((cat) =>
      cat.items.forEach((item) => {
        if (item.name.toLowerCase().includes(q) || item.nameTa.includes(q))
          found.push(item);
      }),
    );
    return found;
  }, [search]);

  const displayItems =
    searchResults || menuData.find((c) => c.id === activeCat)?.items || [];

  // ── Item name display ─────────────────────────────────
  const itemName = (item) => {
    if (lang === "en") return item.name;
    if (lang === "ta") return item.nameTa;
    return `${item.nameTa} / ${item.name}`;
  };

  const [billNo] = useState(() => Math.floor(Math.random() * 9000) + 1000);

const printBill = () => {
  if (cartItems.length === 0) { toast.error('Cart is empty!'); return; }

  const now     = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  const itemsHTML = cartItems.map((item, i) => `
    <div style="margin-bottom:5px;">
      <div style="font-weight:700;font-size:12px;">${i + 1}. ${item.name}</div>
      <div style="font-size:10px;color:#444;padding-left:12px;">${item.nameTa}</div>
      <div style="display:flex;justify-content:flex-end;font-size:12px;">
        <span style="min-width:28px;text-align:center;">${item.qty}</span>
        <span style="min-width:44px;text-align:right;">x${item.price}</span>
        <span style="min-width:56px;text-align:right;font-weight:700;">
          Rs.${(item.price * item.qty).toFixed(2)}
        </span>
      </div>
    </div>
  `).join('');

  const billHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Bill #${billNo} - I Thulir Restaurant</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Courier New', Courier, monospace;
          font-size: 12px;
          color: #000;
          background: #fff;
          width: 80mm;
          padding: 4mm 3mm;
          line-height: 1.5;
        }
        .center { text-align: center; }
        .row    { display: flex; justify-content: space-between; }
        .hr     { border: none; border-top: 1px dashed #000; margin: 5px 0; }
        .hr-solid { border: none; border-top: 2px solid #000; margin: 5px 0; }
        .grand  { display:flex; justify-content:space-between; font-weight:900; font-size:15px; margin:3px 0; }
        .footer { text-align:center; font-size:11px; line-height:1.7; margin-top:6px; }
        @page   { size: 80mm auto; margin: 0; }
        @media print { body { width: 80mm; } }
      </style>
    </head>
    <body>

      <div class="center" style="margin-bottom:6px;">
        <div style="font-size:16px;font-weight:900;letter-spacing:1px;">I THULIR RESTAURANT</div>
        <div style="font-size:11px;">I &#2980;&#3009;&#2995;&#3007;&#2992; &#E0A6;&#2989;&#2979;&#2997;&#2965;&#2990;</div>
        <div style="font-size:11px;">Tharamangalam, Salem - 636 502</div>
        <div style="font-size:11px;">Ph: +91 98765 43210</div>
        <div style="font-size:11px;">GSTIN: 33XXXXXX1234Z5</div>
      </div>

      <hr class="hr" />

      <div style="font-size:11px;margin-bottom:5px;">
        <div class="row">
          <span>Bill No : <strong>#${billNo}</strong></span>
          <span>Mode: <strong>${orderMode}</strong></span>
        </div>
        <div class="row">
          <span>Date : ${dateStr}</span>
          <span>Time : ${timeStr}</span>
        </div>
        <div>Cashier: <strong>Counter 1</strong></div>
      </div>

      <hr class="hr" />

      <div style="display:flex;font-weight:700;font-size:11px;margin-bottom:3px;">
        <span style="flex:1;">ITEM</span>
        <span style="min-width:28px;text-align:center;">QTY</span>
        <span style="min-width:44px;text-align:right;">RATE</span>
        <span style="min-width:56px;text-align:right;">AMT</span>
      </div>

      <hr class="hr" />

      ${itemsHTML}

      <hr class="hr" />

      <div style="font-size:12px;">
        <div class="row"><span>Subtotal</span><span>Rs.${subtotal.toFixed(2)}</span></div>
        <div class="row"><span>GST (5%)</span><span>Rs.${gst.toFixed(2)}</span></div>
        <div class="row"><span>Discount</span><span>Rs.0.00</span></div>
      </div>

      <hr class="hr-solid" />

      <div class="grand">
        <span>GRAND TOTAL</span>
        <span>Rs.${grandTotal.toFixed(2)}</span>
      </div>

      <hr class="hr-solid" />

      <div style="font-size:12px;margin-top:4px;">
        <div class="row"><span>Payment Mode</span><span><strong>CASH</strong></span></div>
        <div class="row"><span>Amount Paid</span><span>Rs.${grandTotal.toFixed(2)}</span></div>
        <div class="row"><span>Balance</span><span>Rs.0.00</span></div>
      </div>

      <hr class="hr" />

      <div style="font-size:11px;text-align:center;margin-bottom:4px;">
        Items: <strong>${cartItems.length}</strong> &nbsp;|&nbsp;
        Qty: <strong>${cartItems.reduce((s, i) => s + i.qty, 0)}</strong>
      </div>

      <hr class="hr" />

      <div class="footer">
        <div style="font-weight:700;font-size:13px;">*** THANK YOU ***</div>
        <div>&#2984;&#2985;&#3007;! &#2990;&#3๎&#2979;&#3009;&#2990;&#3021; &#2997;&#3006;&#2992;&#3009;&#2919;&#3021;!</div>
        <div style="font-size:10px;margin-top:4px;">Computer generated bill.</div>
        <div style="font-size:10px;">No signature required.</div>
        <div style="font-weight:700;margin-top:6px;">* I THULIR RESTAURANT *</div>
      </div>

      <div style="text-align:center;margin-top:8px;font-size:10px;letter-spacing:2px;color:#555;">
        - - - - - - - - - - - - - - - - <br/>
        ✂ CUT HERE
      </div>

    </body>
    </html>
  `;

  // Open popup, write bill, auto-print
  const popup = window.open('', '_blank', 'width=350,height=700,scrollbars=yes');
  popup.document.open();
  popup.document.write(billHTML);
  popup.document.close();

  // Wait for fonts/content to load then print
  popup.onload = () => {
    popup.focus();
    popup.print();
    popup.onafterprint = () => popup.close();
  };

  // Fallback if onload already fired
  setTimeout(() => {
    if (!popup.closed) {
      popup.focus();
      popup.print();
      popup.onafterprint = () => popup.close();
    }
  }, 600);

  clearCart();
  toast.success('Bill printed!');
};

  // ── Styles ────────────────────────────────────────────
  const s = {
    wrap: {
      display: "flex",
      gap: "0",
      height: "100%",
      fontFamily: "'Inter','Segoe UI',sans-serif",
      minHeight: 0,
    },

    // LEFT PANEL
    left: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      background: "#fff",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
      marginRight: "16px",
    },

    // Search + Controls bar
    topBar: {
      padding: "14px 16px",
      borderBottom: "1px solid #f0f0f0",
      background: "#fafafa",
    },
    topRow: {
      display: "flex",
      gap: "10px",
      marginBottom: "12px",
      alignItems: "center",
    },
    searchInput: {
      flex: 1,
      padding: "10px 16px",
      fontSize: "14px",
      border: "1.5px solid #e5e5e5",
      borderRadius: "10px",
      outline: "none",
      background: "#fff",
      color: "#1a1a1a",
    },
    modeSelect: {
      padding: "10px 14px",
      fontSize: "13px",
      fontWeight: "600",
      border: `1.5px solid ${O}`,
      borderRadius: "10px",
      outline: "none",
      background: "#fff",
      color: OD,
      cursor: "pointer",
    },
    langBtns: { display: "flex", gap: "4px" },
    langBtn: (active) => ({
      padding: "8px 12px",
      fontSize: "12px",
      fontWeight: "600",
      border: `1.5px solid ${active ? O : "#e5e5e5"}`,
      borderRadius: "8px",
      cursor: "pointer",
      background: active ? O : "#fff",
      color: active ? "#fff" : "#666",
      transition: "all 0.15s",
    }),

    // Category tabs
    catRow: {
      display: "flex",
      gap: "6px",
      overflowX: "auto",
      paddingBottom: "2px",
    },
    catBtn: (active) => ({
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "8px 14px",
      borderRadius: "8px",
      cursor: "pointer",
      whiteSpace: "nowrap",
      fontSize: "13px",
      fontWeight: active ? "700" : "500",
      background: active ? O : "#f5f5f5",
      color: active ? "#fff" : "#555",
      border: "none",
      transition: "all 0.15s",
      boxShadow: active ? `0 3px 8px rgba(249,115,22,0.3)` : "none",
    }),
    // ── PASTE THIS to replace foodCard → inCartBadge styles ──

    grid: {
      flex: 1,
      overflowY: "auto",
      padding: "16px",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))",
      gap: "12px",
      alignContent: "start",
    },

    foodCard: {
      background: "#fff",
      border: "1.5px solid #efefef",
      borderRadius: "14px",
      cursor: "pointer",
      transition: "all 0.18s",
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      height: "240px", // ← FIXED height always
    },
    foodImg: {
      width: "100%",
      height: "130px",
      minHeight: "130px", // ← never shrinks
      maxHeight: "130px", // ← never grows
      objectFit: "cover",
      display: "block",
      background: "#f5f5f5",
      flexShrink: 0, // ← critical
    },
    foodImgFallback: {
      width: "100%",
      height: "130px",
      minHeight: "130px",
      maxHeight: "130px",
      background: "linear-gradient(135deg, #fff7ed, #ffedd5)",
      display: "none",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "38px",
      flexShrink: 0,
    },
    foodInfo: {
      height: "80px", // ← info takes remaining 100px
      minHeight: "85px",
      padding: "8px 12px 10px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between", // ← spreads name+tamil+price evenly
      overflow: "hidden",
      flexShrink: 0,
    },
    foodName: {
      fontSize: "13px",
      fontWeight: "700",
      color: "#1a1a2e",
      lineHeight: "1.35",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap", // ← single line, no wrapping
    },
    foodNameTa: {
      fontSize: "11.5px",
      color: "#888",
      lineHeight: "1.3",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      marginTop: "2px",
    },
    foodPriceRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: "auto",
    },
    foodPrice: {
      fontSize: "15px",
      fontWeight: "800",
      color: O,
    },
    addBtn: {
      width: "28px",
      height: "28px",
      borderRadius: "50%",
      background: O,
      border: "none",
      color: "#fff",
      fontWeight: "700",
      fontSize: "18px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 2px 6px rgba(249,115,22,0.4)",
      lineHeight: 1,
      flexShrink: 0,
    },
    inCartBadge: {
      position: "absolute",
      top: "8px",
      right: "8px",
      background: O,
      color: "#fff",
      fontSize: "11px",
      fontWeight: "700",
      borderRadius: "20px",
      padding: "3px 9px",
      boxShadow: "0 2px 6px rgba(249,115,22,0.5)",
      zIndex: 2,
    },

    // RIGHT PANEL — Cart
    right: {
      width: "320px",
      minWidth: "320px",
      background: "#fff",
      borderRadius: "16px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
    cartHeader: {
      padding: "16px 18px",
      borderBottom: "1px solid #f0f0f0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    cartTitle: { fontSize: "16px", fontWeight: "700", color: "#1a1a2e" },
    orderBadge: {
      background: "#fff3e0",
      color: OD,
      fontSize: "11px",
      fontWeight: "700",
      padding: "4px 10px",
      borderRadius: "20px",
      border: `1px solid #fed7aa`,
    },
    cartItems: { flex: 1, overflowY: "auto", padding: "12px" },
    emptyCart: { padding: "40px 0", textAlign: "center", color: "#ccc" },
    cartRow: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 0",
      borderBottom: "1px solid #f5f5f5",
    },
    cartName: {
      flex: 1,
      fontSize: "13px",
      fontWeight: "600",
      color: "#1a1a2e",
      lineHeight: "1.3",
    },
    cartNameTa: { fontSize: "11px", color: "#999" },
    qtyBtns: { display: "flex", alignItems: "center", gap: "6px" },
    qBtn: (type) => ({
      width: "26px",
      height: "26px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "700",
      fontSize: "14px",
      background: type === "minus" ? "#fee2e2" : "#dcfce7",
      color: type === "minus" ? "#dc2626" : "#16a34a",
    }),
    qtyNum: {
      fontSize: "14px",
      fontWeight: "700",
      color: "#1a1a2e",
      minWidth: "18px",
      textAlign: "center",
    },
    cartPrice: {
      fontSize: "13px",
      fontWeight: "700",
      color: O,
      minWidth: "48px",
      textAlign: "right",
    },
    delBtn: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "14px",
      color: "#dc2626",
      padding: "2px",
    },

    // Totals
    totals: {
      padding: "14px 18px",
      borderTop: "2px solid #f0f0f0",
      background: "#fafafa",
    },
    totalRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "6px",
    },
    totalLabel: { fontSize: "13px", color: "#666" },
    totalValue: { fontSize: "13px", fontWeight: "600", color: "#333" },
    grandRow: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "8px",
      paddingTop: "8px",
      borderTop: "1.5px solid #e5e5e5",
    },
    grandLabel: { fontSize: "16px", fontWeight: "800", color: "#1a1a2e" },
    grandValue: { fontSize: "18px", fontWeight: "800", color: O },

    // Action Buttons
    btnRow: { padding: "12px 18px", display: "flex", gap: "8px" },
    clearBtn: {
      flex: 1,
      padding: "12px",
      border: "none",
      borderRadius: "10px",
      background: "#fee2e2",
      color: "#dc2626",
      fontWeight: "700",
      fontSize: "14px",
      cursor: "pointer",
    },
    printBtn: {
      flex: 2,
      padding: "12px",
      border: "none",
      borderRadius: "10px",
      background: `linear-gradient(135deg, ${O}, ${OD})`,
      color: "#fff",
      fontWeight: "700",
      fontSize: "14px",
      cursor: "pointer",
      boxShadow: `0 4px 12px rgba(249,115,22,0.35)`,
    },
  };

  const catEmoji = (cat) => menuData.find((c) => c.id === cat)?.icon || "🍽️";

  return (
    <>
      <div style={s.wrap}>
        {/* ── LEFT: Menu ── */}
        <div style={s.left}>
          {/* Top Controls */}
          <div style={s.topBar}>
            <div style={s.topRow}>
              <input
                style={s.searchInput}
                placeholder="Search food... (தேட இங்கே டைப் செய்யுங்கள்)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={(e) => {
                  e.target.style.borderColor = O;
                  e.target.style.boxShadow = `0 0 0 3px rgba(249,115,22,0.12)`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e5e5";
                  e.target.style.boxShadow = "none";
                }}
              />
              <select
                style={s.modeSelect}
                value={orderMode}
                onChange={(e) => setOrderMode(e.target.value)}
              >
                <option>TAKE AWAY</option>
                <option>DINING IN</option>
                <option>DINING OUT</option>
              </select>
            </div>
            {/* Language Toggle */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "10px",
              }}
            >
              <span
                style={{ fontSize: "12px", color: "#888", fontWeight: "600" }}
              >
                Language:
              </span>
              {["en", "ta", "both"].map((l) => (
                <button
                  key={l}
                  style={s.langBtn(lang === l)}
                  onClick={() => setLang(l)}
                >
                  {l === "en" ? "EN" : l === "ta" ? "தமிழ்" : "Both"}
                </button>
              ))}
            </div>
            {/* Category Tabs */}
            {!search && (
              <div style={s.catRow}>
                {menuData.map((cat) => (
                  <button
                    key={cat.id}
                    style={s.catBtn(activeCat === cat.id)}
                    onClick={() => setActiveCat(cat.id)}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.category}</span>
                  </button>
                ))}
              </div>
            )}
            {search && (
              <div style={{ fontSize: "13px", color: "#888" }}>
                Showing results for "<strong>{search}</strong>" —{" "}
                {searchResults?.length || 0} items
              </div>
            )}
          </div>

          {/* Food Grid */}
          {/* Food Grid */}
          <div style={s.grid}>
            {displayItems.map((item) => {
              const catIcon = menuData.find((c) =>
                c.items.some((i) => i.id === item.id),
              )?.icon;
              const inCart = cart[item.id]?.qty || 0;

              return (
                <div
                  key={item.id}
                  style={{ ...s.foodCard, position: "relative" }}
                  onClick={() => {
                    addToCart(item);
                    toast.success(`${item.name} added!`, {
                      icon: "✅",
                      duration: 900,
                    });
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = O;
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = `0 8px 20px rgba(249,115,22,0.18)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#f0f0f0";
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(0,0,0,0.06)";
                  }}
                >
                  {/* Cart badge */}
                  {inCart > 0 && <div style={s.inCartBadge}>×{inCart}</div>}

                  {/* Food Image */}
                  <img
                    src={item.img}
                    alt={item.name}
                    style={s.foodImg}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div style={{ ...s.foodImgFallback, display: "none" }}>
                    <span>{catIcon}</span>
                  </div>

                  {/* Info */}
                  <div style={s.foodInfo}>
                    <div>
                      <div style={s.foodName}>
                        {lang === "ta" ? item.nameTa : item.name}
                      </div>
                      {lang === "both" && (
                        <div style={s.foodNameTa}>{item.nameTa}</div>
                      )}
                    </div>
                    <div style={s.foodPriceRow}>
                      <span style={s.foodPrice}>₹{item.price}</span>
                      <button
                        style={s.addBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item);
                          toast.success(`${item.name} added!`, {
                            icon: "✅",
                            duration: 900,
                          });
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: Cart ── */}
        <div style={s.right} className="no-print">
          <div style={s.cartHeader}>
            <div>
              <div style={s.cartTitle}>🧾 Current Order</div>
              <div
                style={{ fontSize: "11px", color: "#aaa", marginTop: "2px" }}
              >
                {cartItems.length} items
              </div>
            </div>
            <div style={s.orderBadge}>{orderMode}</div>
          </div>

          {/* Cart Items */}
          <div style={s.cartItems}>
            {cartItems.length === 0 ? (
              <div style={s.emptyCart}>
                <div style={{ fontSize: "36px" }}>🛒</div>
                <div style={{ marginTop: "8px", fontSize: "14px" }}>
                  Cart is empty
                </div>
                <div style={{ fontSize: "12px", marginTop: "4px" }}>
                  Click food items to add
                </div>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} style={s.cartRow}>
                  <div style={{ flex: 1 }}>
                    <div style={s.cartName}>
                      {lang === "ta" ? item.nameTa : item.name}
                    </div>
                    {lang === "both" && (
                      <div style={s.cartNameTa}>{item.nameTa}</div>
                    )}
                    <div style={{ fontSize: "11px", color: "#aaa" }}>
                      ₹{item.price} each
                    </div>
                  </div>
                  <div style={s.qtyBtns}>
                    <button
                      style={s.qBtn("minus")}
                      onClick={() => changeQty(item.id, -1)}
                    >
                      −
                    </button>
                    <span style={s.qtyNum}>{item.qty}</span>
                    <button
                      style={s.qBtn("plus")}
                      onClick={() => changeQty(item.id, +1)}
                    >
                      +
                    </button>
                  </div>
                  <div style={s.cartPrice}>₹{item.price * item.qty}</div>
                  <button
                    style={s.delBtn}
                    onClick={() => changeQty(item.id, -item.qty)}
                  >
                    🗑
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Totals */}
          <div style={s.totals}>
            <div style={s.totalRow}>
              <span style={s.totalLabel}>Subtotal</span>
              <span style={s.totalValue}>₹{subtotal.toFixed(2)}</span>
            </div>
            <div style={s.totalRow}>
              <span style={s.totalLabel}>GST (5%)</span>
              <span style={s.totalValue}>₹{gst.toFixed(2)}</span>
            </div>
            <div style={s.grandRow}>
              <span style={s.grandLabel}>Grand Total</span>
              <span style={s.grandValue}>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Buttons */}
          <div style={s.btnRow}>
            <button style={s.clearBtn} onClick={clearCart}>
              Clear
            </button>
            <button style={s.printBtn} onClick={printBill}>
              🖨 Print Bill
            </button>
          </div>
        </div>
      </div>

      {/* ── THERMAL BILL via Portal — renders outside #root ── */}
   
    </>
  );
}
