import { useNavigate } from 'react-router-dom';
const O = '#f97316';
export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:"'Inter',sans-serif", background:'#fff7ed' }}>
      <div style={{ fontSize:'80px', marginBottom:'16px' }}>🍽️</div>
      <div style={{ fontSize:'28px', fontWeight:'900', color:'#1a1a2e', marginBottom:'8px' }}>404 — Page Not Found</div>
      <div style={{ fontSize:'15px', color:'#888', marginBottom:'28px' }}>This page doesn't exist in our menu!</div>
      <button onClick={() => navigate('/')} style={{ padding:'12px 28px', background:`linear-gradient(135deg,${O},#ea580c)`, color:'#fff', border:'none', borderRadius:'12px', fontSize:'15px', fontWeight:'700', cursor:'pointer', boxShadow:`0 4px 14px rgba(249,115,22,0.4)` }}>
        Back to Home
      </button>
    </div>
  );
}
