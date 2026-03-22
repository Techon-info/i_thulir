// src/data/mockOrders.js
const names = ['Murugan','Priya','Ravi','Selvi','Kumar','Anitha','Vijay','Lakshmi','Suresh','Meena','Karthik','Divya'];
const modes = ['DINE IN','TAKE AWAY','DINING OUT'];
const statuses = ['paid','paid','paid','paid','pending','refunded'];

const allDishes = [
  { name:'Idli',       nameTa:'இட்லி',        category:'Breakfast', price:30  },
  { name:'Dosa',       nameTa:'தோசை',          category:'Breakfast', price:40  },
  { name:'Pongal',     nameTa:'பொங்கல்',       category:'Breakfast', price:45  },
  { name:'Upma',       nameTa:'உப்மா',          category:'Breakfast', price:35  },
  { name:'Meals',      nameTa:'சாப்பாடு',       category:'Lunch',     price:90  },
  { name:'Sambar Rice',nameTa:'சாம்பார் சாதம்', category:'Lunch',     price:70  },
  { name:'Curd Rice',  nameTa:'தயிர் சாதம்',    category:'Lunch',     price:60  },
  { name:'Biryani',    nameTa:'பிரியாணி',       category:'Dinner',    price:150 },
  { name:'Fried Rice', nameTa:'பிரைட் ரைஸ்',   category:'Dinner',    price:120 },
  { name:'Chapati',    nameTa:'சப்பாத்தி',       category:'Dinner',    price:80  },
  { name:'Vada',       nameTa:'வடை',            category:'Snacks',    price:25  },
  { name:'Bajji',      nameTa:'பஜ்ஜி',          category:'Snacks',    price:30  },
  { name:'Samosa',     nameTa:'சமோசா',          category:'Snacks',    price:20  },
  { name:'Tea',        nameTa:'தேநீர்',          category:'Beverages', price:15  },
  { name:'Coffee',     nameTa:'காபி',            category:'Beverages', price:20  },
  { name:'Coca Cola',  nameTa:'கோகோ கோலா',      category:'Cool Drinks',price:40 },
  { name:'Rose Milk',  nameTa:'ரோஸ் மில்க்',    category:'Cool Drinks',price:35 },
  { name:'Vanilla Scoop',nameTa:'வெண்ணிலா ஸ்கூப்',category:'Ice Cream',price:40},
  { name:'Chocolate Scoop',nameTa:'சாக்லேட் ஸ்கூப்',category:'Ice Cream',price:45},
];

// Time slots
const timeSlots = [
  { label:'Morning',   start:6,  end:11  },
  { label:'Afternoon', start:11, end:15  },
  { label:'Evening',   start:15, end:19  },
  { label:'Night',     start:19, end:23  },
];

let billCounter = 1000;

// Generate 120 orders across last 60 days
export const mockOrders = Array.from({ length: 120 }, (_, i) => {
  const daysAgo  = Math.floor(Math.random() * 60);
  const date     = new Date();
  date.setDate(date.getDate() - daysAgo);

  // Random time slot
  const slot     = timeSlots[Math.floor(Math.random() * timeSlots.length)];
  const hour     = slot.start + Math.floor(Math.random() * (slot.end - slot.start));
  const minute   = Math.floor(Math.random() * 60);
  date.setHours(hour, minute, 0, 0);

  // Random 1–5 items
  const itemCount = Math.floor(Math.random() * 5) + 1;
  const shuffled  = [...allDishes].sort(() => Math.random() - 0.5).slice(0, itemCount);
  const items     = shuffled.map(d => ({ ...d, qty: Math.floor(Math.random() * 3) + 1 }));
  const subtotal  = items.reduce((s, it) => s + it.price * it.qty, 0);
  const gst       = Math.round(subtotal * 0.05);
  const total     = subtotal + gst;

  return {
    id:         ++billCounter,
    billNo:     `B${billCounter}`,
    customer:   names[Math.floor(Math.random() * names.length)],
    mode:       modes[Math.floor(Math.random() * modes.length)],
    status:     statuses[Math.floor(Math.random() * statuses.length)],
    date:       date.toISOString().split('T')[0],
    time:       `${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`,
    timeSlot:   slot.label,
    hour,
    items,
    subtotal,
    gst,
    total,
    cashier:    'Counter 1',
  };
}).sort((a, b) => new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`));
