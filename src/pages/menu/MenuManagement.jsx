import { useState } from 'react';
import { menuData, saveMenuData } from '../../data/mockFoods';
import toast from 'react-hot-toast';

const O  = '#f97316';
const OD = '#ea580c';

const ICONS = ['🍽️','🥘','🍛','🍜','🥗','🍱','🥙','🌮','🥪','🍔','🍟','🍕',
               '🥞','🧇','🍳','🥚','🥓','🍗','🍖','🥩','🦐','🐟','🦑',
               '🥤','🧃','☕','🍵','🧋','🍹','🥛','🍶','🧊',
               '🍦','🍧','🍨','🍰','🎂','🍮','🍩','🍪','🍫','🍬','🍭',
               '🫓','🥐','🧆','🥜','🫘','🌽','🥕','🧄','🧅'];

const emptyCategory = { id: '', category: '', categoryTa: '', icon: '🍽️', items: [] };
const emptyItem     = { id: '', name: '', nameTa: '', price: '', img: '' };

export default function MenuManagement() {
  const [menu, setMenu]             = useState([...menuData]);
  const [activeTab, setActiveTab]   = useState('overview');  // overview | category | items
  const [selectedCat, setSelectedCat] = useState(null);     // category object being managed

  // ── Category modal state ──
  const [showCatModal, setShowCatModal]   = useState(false);
  const [editCat, setEditCat]             = useState(null);
  const [catForm, setCatForm]             = useState(emptyCategory);
  const [deleteCatId, setDeleteCatId]     = useState(null);
  const [showIconPicker, setShowIconPicker] = useState(false);

  // ── Item modal state ──
  const [showItemModal, setShowItemModal] = useState(false);
  const [editItem, setEditItem]           = useState(null);
  const [itemForm, setItemForm]           = useState(emptyItem);
  const [deleteItemId, setDeleteItemId]   = useState(null);
  const [searchItem, setSearchItem]       = useState('');
  const [imgPreview, setImgPreview]       = useState('');

  // ── Save to global ────────────────────────────────────
  const persist = (updated) => {
    setMenu(updated);
    saveMenuData(updated);
  };

  // ── Summary stats ─────────────────────────────────────
  const totalCategories = menu.length;
  const totalItems      = menu.reduce((s, c) => s + c.items.length, 0);
  const avgPrice        = totalItems > 0
    ? Math.round(menu.flatMap(c => c.items).reduce((s, i) => s + i.price, 0) / totalItems)
    : 0;
  const maxCat = menu.reduce((a, c) => c.items.length > (a?.items?.length || 0) ? c : a, null);

  // ── Category CRUD ─────────────────────────────────────
  const openAddCat  = () => { setEditCat(null); setCatForm({ ...emptyCategory }); setShowCatModal(true); };
  const openEditCat = (cat) => {
    setEditCat(cat);
    setCatForm({ id: cat.id, category: cat.category, categoryTa: cat.categoryTa, icon: cat.icon, items: cat.items });
    setShowCatModal(true);
  };
  const closeCatModal = () => { setShowCatModal(false); setEditCat(null); setShowIconPicker(false); };

  const handleSaveCat = () => {
    if (!catForm.category.trim() || !catForm.id.trim()) { toast.error('Category name and ID required!'); return; }
    if (editCat) {
      persist(menu.map(c => c.id === editCat.id ? { ...c, ...catForm } : c));
      toast.success(`"${catForm.category}" updated!`);
    } else {
      if (menu.find(c => c.id === catForm.id)) { toast.error('Category ID already exists!'); return; }
      persist([...menu, { ...catForm, items: [] }]);
      toast.success(`"${catForm.category}" category added!`);
    }
    closeCatModal();
  };

  const handleDeleteCat = (id) => {
    const cat = menu.find(c => c.id === id);
    persist(menu.filter(c => c.id !== id));
    setDeleteCatId(null);
    toast.success(`"${cat.category}" deleted!`);
  };

  // ── Item CRUD ─────────────────────────────────────────
  const openManageItems = (cat) => { setSelectedCat(cat); setActiveTab('items'); setSearchItem(''); };

  const openAddItem = () => {
    setEditItem(null);
    setItemForm({ ...emptyItem, id: `${selectedCat.id}_${Date.now()}` });
    setImgPreview('');
    setShowItemModal(true);
  };
  const openEditItem = (item) => {
    setEditItem(item);
    setItemForm({ id: item.id, name: item.name, nameTa: item.nameTa, price: item.price, img: item.img });
    setImgPreview(item.img);
    setShowItemModal(true);
  };
  const closeItemModal = () => { setShowItemModal(false); setEditItem(null); setImgPreview(''); };

  const handleSaveItem = () => {
    if (!itemForm.name.trim() || !itemForm.price) { toast.error('Item name and price required!'); return; }
    const updatedItem = { ...itemForm, price: Number(itemForm.price) };
    const updatedMenu = menu.map(cat => {
      if (cat.id !== selectedCat.id) return cat;
      if (editItem) {
        return { ...cat, items: cat.items.map(i => i.id === editItem.id ? updatedItem : i) };
      } else {
        return { ...cat, items: [...cat.items, updatedItem] };
      }
    });
    persist(updatedMenu);
    // refresh selectedCat
    setSelectedCat(updatedMenu.find(c => c.id === selectedCat.id));
    toast.success(editItem ? `"${itemForm.name}" updated!` : `"${itemForm.name}" added!`);
    closeItemModal();
  };

  const handleDeleteItem = (itemId) => {
    const item = selectedCat.items.find(i => i.id === itemId);
    const updatedMenu = menu.map(cat => {
      if (cat.id !== selectedCat.id) return cat;
      return { ...cat, items: cat.items.filter(i => i.id !== itemId) };
    });
    persist(updatedMenu);
    setSelectedCat(updatedMenu.find(c => c.id === selectedCat.id));
    setDeleteItemId(null);
    toast.success(`"${item.name}" removed!`);
  };

  // ── Copy format ───────────────────────────────────────
  const copyFormat = (cat) => {
    const code = `{
  id: '${cat.id}',
  category: '${cat.category}',
  categoryTa: '${cat.categoryTa}',
  icon: '${cat.icon}',
  items: [
${cat.items.map(item => `    {
      id: '${item.id}',
      name: '${item.name}',
      nameTa: '${item.nameTa}',
      price: ${item.price},
      img: '${item.img}',
    },`).join('\n')}
  ],
},`;
    navigator.clipboard.writeText(code);
    toast.success('Category code copied to clipboard!');
  };

  // ── Filtered items ────────────────────────────────────
  const filteredItems = selectedCat?.items?.filter(i =>
    i.name.toLowerCase().includes(searchItem.toLowerCase()) ||
    i.nameTa.includes(searchItem)
  ) || [];

  // ── Styles ────────────────────────────────────────────
  const s = {
    wrap: { fontFamily: "'Inter','Segoe UI',sans-serif", height: '100%', display: 'flex', flexDirection: 'column', gap: '16px', minHeight: 0 },

    // Summary
    summaryRow: { display: 'flex', gap: '14px', flexShrink: 0 },
    sumCard: (color, shadow) => ({
      flex: 1, background: `linear-gradient(135deg,${color},${shadow})`,
      borderRadius: '14px', padding: '18px 20px',
      boxShadow: `0 6px 20px ${color}44`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }),
    sumLeft: { display: 'flex', flexDirection: 'column', gap: '3px' },
    sumLabel: { color: 'rgba(255,255,255,0.75)', fontSize: '12px', fontWeight: '600' },
    sumValue: { color: '#fff', fontSize: '26px', fontWeight: '900' },
    sumSub:   { color: 'rgba(255,255,255,0.6)', fontSize: '11px' },
    sumIcon:  { fontSize: '30px', opacity: 0.85 },

    // Tab bar
    tabRow: {
      display: 'flex', gap: '6px', flexShrink: 0,
      background: '#fff', borderRadius: '12px', padding: '6px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
      alignItems: 'center',
    },
    tab: (active) => ({
      flex: 1, padding: '10px 16px', border: 'none', borderRadius: '9px',
      cursor: 'pointer', fontSize: '13px', fontWeight: '700',
      background: active ? O : 'transparent',
      color: active ? '#fff' : '#888',
      boxShadow: active ? `0 3px 10px rgba(249,115,22,0.3)` : 'none',
      transition: 'all 0.18s',
    }),
    backBtn: {
      padding: '10px 16px', border: 'none', borderRadius: '9px',
      cursor: 'pointer', fontSize: '13px', fontWeight: '700',
      background: '#f5f5f5', color: '#555', display: 'flex', alignItems: 'center', gap: '6px',
    },

    // Controls
    controls: {
      background: '#fff', borderRadius: '12px', padding: '12px 16px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.06)', flexShrink: 0,
      display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap',
    },
    searchInput: {
      flex: 1, minWidth: '160px', padding: '9px 14px', fontSize: '14px',
      border: '1.5px solid #e5e5e5', borderRadius: '10px', outline: 'none',
    },
    addBtn: {
      padding: '9px 20px', fontSize: '14px', fontWeight: '700',
      border: 'none', borderRadius: '10px', cursor: 'pointer',
      background: `linear-gradient(135deg,${O},${OD})`, color: '#fff',
      boxShadow: `0 3px 10px rgba(249,115,22,0.3)`,
      display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap',
    },

    // Category grid
    catGrid: {
      flex: 1, overflowY: 'auto',
      display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))',
      gap: '14px', alignContent: 'start',
    },
    catCard: {
      background: '#fff', borderRadius: '16px', overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      border: '1.5px solid #f0f0f0', transition: 'all 0.18s',
      display: 'flex', flexDirection: 'column',
    },
    catCardHead: {
      padding: '18px 20px',
      background: `linear-gradient(135deg,${O}18,${O}08)`,
      display: 'flex', alignItems: 'center', gap: '14px',
      borderBottom: '1px solid #f5f5f5',
    },
    catIconBox: {
      width: '52px', height: '52px', borderRadius: '14px',
      background: `linear-gradient(135deg,${O},${OD})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '26px', flexShrink: 0,
      boxShadow: `0 4px 12px rgba(249,115,22,0.3)`,
    },
    catCardBody: { padding: '14px 20px', flex: 1 },
    catCardFoot: {
      padding: '12px 20px', borderTop: '1px solid #f5f5f5',
      display: 'flex', gap: '8px', background: '#fafafa',
    },

    // Item grid
    itemGrid: {
      flex: 1, overflowY: 'auto',
      display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))',
      gap: '14px', alignContent: 'start',
    },
    itemCard: {
      background: '#fff', borderRadius: '14px', overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
      border: '1.5px solid #f0f0f0', transition: 'all 0.18s',
    },
    itemImg: {
      width: '100%', height: '130px', objectFit: 'cover',
      background: '#f5f5f5', display: 'block',
    },
    itemImgFallback: {
      width: '100%', height: '130px',
      background: 'linear-gradient(135deg,#fff7ed,#ffedd5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px',
    },
    itemBody: { padding: '12px 14px' },

    // Buttons
    smEditBtn: {
      flex: 1, padding: '7px', fontSize: '12px', fontWeight: '700',
      border: `1.5px solid ${O}`, borderRadius: '8px',
      background: '#fff3e0', color: OD, cursor: 'pointer',
    },
    smDelBtn: {
      flex: 1, padding: '7px', fontSize: '12px', fontWeight: '700',
      border: '1.5px solid #fca5a5', borderRadius: '8px',
      background: '#fee2e2', color: '#dc2626', cursor: 'pointer',
    },
    smManageBtn: {
      flex: 1, padding: '7px', fontSize: '12px', fontWeight: '700',
      border: 'none', borderRadius: '8px', cursor: 'pointer',
      background: `linear-gradient(135deg,${O},${OD})`, color: '#fff',
    },
    smCopyBtn: {
      padding: '7px 12px', fontSize: '12px', fontWeight: '700',
      border: '1.5px solid #e5e5e5', borderRadius: '8px',
      background: '#fff', color: '#555', cursor: 'pointer',
    },

    // Modal
    overlay: {
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, backdropFilter: 'blur(3px)',
    },
    modal: (w) => ({
      background: '#fff', borderRadius: '18px', width: w || '480px', maxWidth: '95vw',
      boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden',
      maxHeight: '90vh', display: 'flex', flexDirection: 'column',
    }),
    modalHeader: {
      padding: '18px 24px', background: `linear-gradient(135deg,${O},${OD})`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      flexShrink: 0,
    },
    modalTitle: { color: '#fff', fontSize: '16px', fontWeight: '800' },
    modalClose: {
      width: '30px', height: '30px', borderRadius: '50%',
      border: 'none', background: 'rgba(255,255,255,0.25)',
      color: '#fff', fontWeight: '700', cursor: 'pointer', fontSize: '16px',
    },
    modalBody: { padding: '22px 24px', overflowY: 'auto', flex: 1 },
    label: { display: 'block', fontSize: '13px', fontWeight: '700', color: '#555', marginBottom: '6px' },
    input: {
      width: '100%', padding: '10px 14px', fontSize: '14px',
      border: '1.5px solid #e5e5e5', borderRadius: '10px',
      outline: 'none', boxSizing: 'border-box', background: '#fafafa',
      transition: 'border 0.2s',
    },
    formRow: { display: 'flex', gap: '12px', marginBottom: '14px' },
    formGroup: { flex: 1 },
    modalFooter: {
      padding: '14px 24px', borderTop: '1px solid #f0f0f0',
      display: 'flex', gap: '10px', justifyContent: 'flex-end',
      background: '#fafafa', flexShrink: 0,
    },
    cancelBtn: {
      padding: '10px 20px', fontSize: '14px', fontWeight: '700',
      border: '1.5px solid #e5e5e5', borderRadius: '10px',
      background: '#fff', color: '#666', cursor: 'pointer',
    },
    saveBtn: {
      padding: '10px 24px', fontSize: '14px', fontWeight: '700',
      border: 'none', borderRadius: '10px', cursor: 'pointer',
      background: `linear-gradient(135deg,${O},${OD})`, color: '#fff',
      boxShadow: `0 3px 10px rgba(249,115,22,0.3)`,
    },

    // Icon picker
    iconGrid: {
      display: 'grid', gridTemplateColumns: 'repeat(10,1fr)',
      gap: '6px', maxHeight: '180px', overflowY: 'auto',
      padding: '10px', background: '#fafafa', borderRadius: '10px',
      border: '1.5px solid #e5e5e5',
    },
    iconBtn: (selected) => ({
      width: '36px', height: '36px', borderRadius: '8px', fontSize: '20px',
      background: selected ? O : '#fff', border: `1.5px solid ${selected ? OD : '#e5e5e5'}`,
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }),

    // Code preview
    codeBox: {
      background: '#0f172a', borderRadius: '10px', padding: '14px 16px',
      fontFamily: "'Courier New',monospace", fontSize: '11px',
      color: '#e2e8f0', overflowX: 'auto', lineHeight: '1.6',
      maxHeight: '200px', overflowY: 'auto',
    },

    // Confirm
    confirmBox: {
      background: '#fff', borderRadius: '16px', padding: '32px',
      width: '360px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    },
  };

  const focusStyle = { borderColor: O, boxShadow: `0 0 0 3px rgba(249,115,22,0.12)` };
  const blurStyle  = { borderColor: '#e5e5e5', boxShadow: 'none' };

  return (
    <div style={s.wrap}>

      {/* ── Summary Cards ── */}
      <div style={s.summaryRow}>
        <div style={s.sumCard('#f97316','#ea580c')}>
          <div style={s.sumLeft}>
            <div style={s.sumLabel}>Categories</div>
            <div style={s.sumValue}>{totalCategories}</div>
            <div style={s.sumSub}>Menu categories</div>
          </div>
          <div style={s.sumIcon}>📋</div>
        </div>
        <div style={s.sumCard('#6366f1','#4f46e5')}>
          <div style={s.sumLeft}>
            <div style={s.sumLabel}>Total Dishes</div>
            <div style={s.sumValue}>{totalItems}</div>
            <div style={s.sumSub}>Across all categories</div>
          </div>
          <div style={s.sumIcon}>🍽️</div>
        </div>
        <div style={s.sumCard('#16a34a','#15803d')}>
          <div style={s.sumLeft}>
            <div style={s.sumLabel}>Avg Price</div>
            <div style={s.sumValue}>₹{avgPrice}</div>
            <div style={s.sumSub}>Per dish average</div>
          </div>
          <div style={s.sumIcon}>💰</div>
        </div>
        <div style={s.sumCard('#06b6d4','#0891b2')}>
          <div style={s.sumLeft}>
            <div style={s.sumLabel}>Top Category</div>
            <div style={s.sumValue}>{maxCat?.icon || '🍽️'}</div>
            <div style={s.sumSub}>{maxCat?.category} ({maxCat?.items?.length} items)</div>
          </div>
          <div style={s.sumIcon}>🏆</div>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div style={s.tabRow}>
        {activeTab === 'items' ? (
          <>
            <button style={s.backBtn} onClick={() => { setActiveTab('overview'); setSelectedCat(null); }}>
              ← Back to Categories
            </button>
            <div style={{ flex: 1, fontWeight: '700', color: '#1a1a2e', fontSize: '14px', paddingLeft: '8px' }}>
              {selectedCat?.icon} {selectedCat?.category} — {selectedCat?.categoryTa}
              <span style={{ fontSize: '12px', color: '#aaa', fontWeight: '400', marginLeft: '8px' }}>
                {selectedCat?.items?.length} items
              </span>
            </div>
          </>
        ) : (
          <>
            <button style={s.tab(true)}>🍽️ Menu Categories</button>
          </>
        )}
      </div>

      {/* ══════════ OVERVIEW — Category Grid ══════════ */}
      {activeTab === 'overview' && (
        <>
          {/* Controls */}
          <div style={s.controls}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#555' }}>
              {totalCategories} Categories · {totalItems} Total Dishes
            </div>
            <div style={{ flex: 1 }} />
            <button style={s.addBtn} onClick={openAddCat}>＋ Add Category</button>
          </div>

          {/* Category Cards Grid */}
          <div style={s.catGrid}>
            {menu.map(cat => (
              <div
                key={cat.id}
                style={s.catCard}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 24px rgba(249,115,22,0.15)`; e.currentTarget.style.borderColor = O; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)'; e.currentTarget.style.borderColor = '#f0f0f0'; }}
              >
                {/* Card Head */}
                <div style={s.catCardHead}>
                  <div style={s.catIconBox}>{cat.icon}</div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontWeight: '800', fontSize: '15px', color: '#1a1a2e' }}>{cat.category}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{cat.categoryTa}</div>
                    <div style={{ fontSize: '11px', color: '#aaa', marginTop: '2px' }}>ID: <code style={{ background: '#f0f0f0', padding: '1px 6px', borderRadius: '4px' }}>{cat.id}</code></div>
                  </div>
                </div>

                {/* Card Body — item previews */}
                <div style={s.catCardBody}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#888', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {cat.items.length} Items
                  </div>
                  {cat.items.length === 0 ? (
                    <div style={{ color: '#ccc', fontSize: '12px', textAlign: 'center', padding: '12px 0' }}>
                      No items yet — click Manage to add
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      {cat.items.slice(0, 4).map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', padding: '4px 0', borderBottom: '1px dashed #f5f5f5' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {item.img ? (
                              <img src={item.img} alt={item.name}
                                style={{ width: '24px', height: '24px', borderRadius: '6px', objectFit: 'cover' }}
                                onError={e => { e.target.style.display = 'none'; }}
                              />
                            ) : <span style={{ fontSize: '14px' }}>{cat.icon}</span>}
                            <span style={{ fontWeight: '600', color: '#333' }}>{item.name}</span>
                          </div>
                          <span style={{ fontWeight: '700', color: O }}>₹{item.price}</span>
                        </div>
                      ))}
                      {cat.items.length > 4 && (
                        <div style={{ fontSize: '11px', color: '#aaa', textAlign: 'center', paddingTop: '4px' }}>
                          +{cat.items.length - 4} more items...
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div style={s.catCardFoot}>
                  <button style={s.smManageBtn} onClick={() => openManageItems(cat)}>
                    ✏ Manage Items
                  </button>
                  <button style={s.smEditBtn} onClick={() => openEditCat(cat)}>
                    Edit
                  </button>
                  <button style={s.smCopyBtn} onClick={() => copyFormat(cat)} title="Copy JS format">
                    📋
                  </button>
                  <button style={s.smDelBtn} onClick={() => setDeleteCatId(cat.id)}>
                    🗑
                  </button>
                </div>
              </div>
            ))}

            {/* Add new category card */}
            <div
              style={{ ...s.catCard, border: `2px dashed ${O}40`, background: `${O}06`, cursor: 'pointer', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}
              onClick={openAddCat}
              onMouseEnter={e => e.currentTarget.style.background = `${O}10`}
              onMouseLeave={e => e.currentTarget.style.background = `${O}06`}
            >
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>➕</div>
                <div style={{ fontWeight: '700', color: O, fontSize: '14px' }}>Add New Category</div>
                <div style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>Click to create</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════ ITEMS — Item Grid ══════════ */}
      {activeTab === 'items' && selectedCat && (
        <>
          {/* Controls */}
          <div style={s.controls}>
            <input
              style={s.searchInput}
              placeholder={`Search in ${selectedCat.category}...`}
              value={searchItem}
              onChange={e => setSearchItem(e.target.value)}
              onFocus={e => Object.assign(e.target.style, focusStyle)}
              onBlur={e  => Object.assign(e.target.style, blurStyle)}
            />
            <div style={{ fontSize: '13px', color: '#888' }}>
              {filteredItems.length} of {selectedCat.items.length} items
            </div>
            <button style={s.addBtn} onClick={openAddItem}>＋ Add Dish</button>
          </div>

          {/* Items Grid */}
          <div style={s.itemGrid}>
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                style={s.itemCard}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 20px rgba(249,115,22,0.15)`; e.currentTarget.style.borderColor = O; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.07)'; e.currentTarget.style.borderColor = '#f0f0f0'; }}
              >
                {/* Image */}
                {item.img ? (
                  <img
                    src={item.img} alt={item.name} style={s.itemImg}
                    onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                ) : null}
                <div style={{ ...s.itemImgFallback, display: item.img ? 'none' : 'flex' }}>
                  {selectedCat.icon}
                </div>

                {/* Body */}
                <div style={s.itemBody}>
                  <div style={{ fontWeight: '800', fontSize: '13px', color: '#1a1a2e', marginBottom: '2px' }}>{item.name}</div>
                  <div style={{ fontSize: '11px', color: '#888', marginBottom: '6px' }}>{item.nameTa}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '16px', fontWeight: '900', color: O }}>₹{item.price}</span>
                    <code style={{ fontSize: '10px', color: '#aaa', background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>{item.id}</code>
                  </div>
                  {/* Image URL preview */}
                  {item.img && (
                    <div style={{ fontSize: '10px', color: '#bbb', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      🔗 {item.img.split('/').pop()}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button style={s.smEditBtn} onClick={() => openEditItem(item)}>✏ Edit</button>
                    <button style={s.smDelBtn}  onClick={() => setDeleteItemId(item.id)}>🗑 Del</button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add dish card */}
            <div
              style={{ ...s.itemCard, border: `2px dashed ${O}40`, background: `${O}06`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}
              onClick={openAddItem}
              onMouseEnter={e => e.currentTarget.style.background = `${O}10`}
              onMouseLeave={e => e.currentTarget.style.background = `${O}06`}
            >
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>➕</div>
                <div style={{ fontWeight: '700', color: O, fontSize: '13px' }}>Add New Dish</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════ CATEGORY MODAL ══════════ */}
      {showCatModal && (
        <div style={s.overlay} onClick={e => e.target === e.currentTarget && closeCatModal()}>
          <div style={s.modal('500px')}>
            <div style={s.modalHeader}>
              <div style={s.modalTitle}>{editCat ? `✏ Edit — ${editCat.category}` : '➕ Add New Category'}</div>
              <button style={s.modalClose} onClick={closeCatModal}>✕</button>
            </div>
            <div style={s.modalBody}>

              {/* Category ID + Icon */}
              <div style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.label}>Category ID * <span style={{ fontWeight: '400', color: '#aaa' }}>(unique, no spaces)</span></label>
                  <input
                    style={s.input} placeholder="e.g. cooldrinks"
                    value={catForm.id}
                    onChange={e => setCatForm(p => ({ ...p, id: e.target.value.toLowerCase().replace(/\s+/g, '_') }))}
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e  => Object.assign(e.target.style, blurStyle)}
                    disabled={!!editCat}
                  />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Icon</label>
                  <button
                    style={{ ...s.input, cursor: 'pointer', textAlign: 'left', fontSize: '22px', background: '#fff' }}
                    onClick={() => setShowIconPicker(p => !p)}
                  >
                    {catForm.icon} <span style={{ fontSize: '12px', color: '#888', marginLeft: '8px' }}>Click to change</span>
                  </button>
                </div>
              </div>

              {/* Icon Picker */}
              {showIconPicker && (
                <div style={{ marginBottom: '14px' }}>
                  <label style={s.label}>Pick an Icon</label>
                  <div style={s.iconGrid}>
                    {ICONS.map(ic => (
                      <button
                        key={ic}
                        style={s.iconBtn(catForm.icon === ic)}
                        onClick={() => { setCatForm(p => ({ ...p, icon: ic })); setShowIconPicker(false); }}
                      >
                        {ic}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Name */}
              <div style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.label}>Category Name (English) *</label>
                  <input
                    style={s.input} placeholder="e.g. Cool Drinks"
                    value={catForm.category}
                    onChange={e => setCatForm(p => ({ ...p, category: e.target.value }))}
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e  => Object.assign(e.target.style, blurStyle)}
                  />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Tamil Name (தமிழ்)</label>
                  <input
                    style={s.input} placeholder="e.g. குளிர் பானங்கள்"
                    value={catForm.categoryTa}
                    onChange={e => setCatForm(p => ({ ...p, categoryTa: e.target.value }))}
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e  => Object.assign(e.target.style, blurStyle)}
                  />
                </div>
              </div>

              {/* Live Preview */}
              <div style={{ background: '#fff7ed', borderRadius: '12px', padding: '14px 16px', border: `1px solid #fed7aa` }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#888', marginBottom: '8px' }}>LIVE PREVIEW</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ ...s.catIconBox, width: '44px', height: '44px', fontSize: '22px' }}>{catForm.icon}</div>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '15px', color: '#1a1a2e' }}>{catForm.category || 'Category Name'}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{catForm.categoryTa || 'Tamil Name'}</div>
                    <code style={{ fontSize: '10px', color: '#aaa' }}>id: {catForm.id || 'category_id'}</code>
                  </div>
                </div>
              </div>

            </div>
            <div style={s.modalFooter}>
              <button style={s.cancelBtn} onClick={closeCatModal}>Cancel</button>
              <button style={s.saveBtn}   onClick={handleSaveCat}>
                {editCat ? '✓ Update Category' : '➕ Add Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ ITEM MODAL ══════════ */}
      {showItemModal && (
        <div style={s.overlay} onClick={e => e.target === e.currentTarget && closeItemModal()}>
          <div style={s.modal('520px')}>
            <div style={s.modalHeader}>
              <div style={s.modalTitle}>
                {selectedCat?.icon} {editItem ? `✏ Edit — ${editItem.name}` : `➕ Add Dish to ${selectedCat?.category}`}
              </div>
              <button style={s.modalClose} onClick={closeItemModal}>✕</button>
            </div>
            <div style={s.modalBody}>

              {/* Name row */}
              <div style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.label}>Dish Name (English) *</label>
                  <input
                    style={s.input} placeholder="e.g. Coca Cola"
                    value={itemForm.name}
                    onChange={e => setItemForm(p => ({ ...p, name: e.target.value }))}
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e  => Object.assign(e.target.style, blurStyle)}
                  />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Tamil Name (தமிழ்)</label>
                  <input
                    style={s.input} placeholder="e.g. கோகோ கோலா"
                    value={itemForm.nameTa}
                    onChange={e => setItemForm(p => ({ ...p, nameTa: e.target.value }))}
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e  => Object.assign(e.target.style, blurStyle)}
                  />
                </div>
              </div>

              {/* Price + ID row */}
              <div style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.label}>Price (₹) *</label>
                  <input
                    type="number" min="0"
                    style={s.input} placeholder="e.g. 40"
                    value={itemForm.price}
                    onChange={e => setItemForm(p => ({ ...p, price: e.target.value }))}
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e  => Object.assign(e.target.style, blurStyle)}
                  />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>Item ID</label>
                  <input
                    style={{ ...s.input, background: '#f5f5f5', color: '#888' }}
                    value={itemForm.id}
                    onChange={e => setItemForm(p => ({ ...p, id: e.target.value }))}
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e  => Object.assign(e.target.style, blurStyle)}
                  />
                </div>
              </div>

              {/* Image URL */}
              <div style={{ marginBottom: '14px' }}>
                <label style={s.label}>
                  Image URL
                  <span style={{ fontWeight: '400', color: '#aaa', marginLeft: '6px' }}>
                    (Unsplash or any image link)
                  </span>
                </label>
                <input
                  style={s.input} placeholder="https://images.unsplash.com/photo-...?w=400&q=80"
                  value={itemForm.img}
                  onChange={e => { setItemForm(p => ({ ...p, img: e.target.value })); setImgPreview(e.target.value); }}
                  onFocus={e => Object.assign(e.target.style, focusStyle)}
                  onBlur={e  => Object.assign(e.target.style, blurStyle)}
                />
                <div style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>
                  💡 Tip: Search <a href="https://unsplash.com" target="_blank" rel="noreferrer" style={{ color: O }}>unsplash.com</a>, click a photo → share → copy link, add <code>?w=400&q=80</code> at end
                </div>
              </div>

              {/* Image Preview */}
              {imgPreview && (
                <div style={{ marginBottom: '14px' }}>
                  <label style={s.label}>Image Preview</label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <img
                      src={imgPreview} alt="preview"
                      style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: '10px', border: '2px solid #e5e5e5' }}
                      onError={e => { e.target.src = ''; e.target.style.display = 'none'; }}
                    />
                    <div style={{ fontSize: '12px', color: '#888', flex: 1 }}>
                      <div style={{ fontWeight: '700', color: '#1a1a2e', marginBottom: '4px' }}>
                        {itemForm.name || 'Dish Name'}
                      </div>
                      <div>{itemForm.nameTa || 'Tamil name'}</div>
                      <div style={{ color: O, fontWeight: '700', fontSize: '14px', marginTop: '4px' }}>
                        ₹{itemForm.price || '0'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Live JS Format Preview */}
              <div style={{ marginBottom: '0' }}>
                <label style={s.label}>📋 JS Format Preview</label>
                <div style={s.codeBox}>
                  {`{
  id: '${itemForm.id}',
  name: '${itemForm.name}',
  nameTa: '${itemForm.nameTa}',
  price: ${itemForm.price || 0},
  img: '${itemForm.img}',
},`}
                </div>
              </div>

            </div>
            <div style={s.modalFooter}>
              <button style={s.cancelBtn} onClick={closeItemModal}>Cancel</button>
              <button style={s.saveBtn}   onClick={handleSaveItem}>
                {editItem ? '✓ Update Dish' : '➕ Add Dish'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Category Confirm ── */}
      {deleteCatId && (
        <div style={s.overlay}>
          <div style={s.confirmBox}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🗑️</div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#1a1a2e', marginBottom: '8px' }}>Delete Category?</div>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '6px' }}>
              <strong>{menu.find(c => c.id === deleteCatId)?.category}</strong> will be permanently deleted.
            </div>
            <div style={{ fontSize: '12px', color: '#dc2626', fontWeight: '600', marginBottom: '24px' }}>
              ⚠ This will also delete all {menu.find(c => c.id === deleteCatId)?.items?.length} items inside!
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button style={{ ...s.cancelBtn, padding: '10px 24px' }} onClick={() => setDeleteCatId(null)}>Cancel</button>
              <button style={{ padding: '10px 24px', fontSize: '14px', fontWeight: '700', border: 'none', borderRadius: '10px', cursor: 'pointer', background: '#ef4444', color: '#fff' }}
                onClick={() => handleDeleteCat(deleteCatId)}>Delete All</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Item Confirm ── */}
      {deleteItemId && (
        <div style={s.overlay}>
          <div style={s.confirmBox}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🍽️</div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#1a1a2e', marginBottom: '8px' }}>Remove Dish?</div>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '24px' }}>
              <strong>{selectedCat?.items?.find(i => i.id === deleteItemId)?.name}</strong> will be removed from {selectedCat?.category}.
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button style={{ ...s.cancelBtn, padding: '10px 24px' }} onClick={() => setDeleteItemId(null)}>Cancel</button>
              <button style={{ padding: '10px 24px', fontSize: '14px', fontWeight: '700', border: 'none', borderRadius: '10px', cursor: 'pointer', background: '#ef4444', color: '#fff' }}
                onClick={() => handleDeleteItem(deleteItemId)}>Remove</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
