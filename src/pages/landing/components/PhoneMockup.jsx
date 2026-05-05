import { C } from "../constants";

export function PhoneMockup() {
  const assets = [
    { icon:"₿", bg:"rgba(247,147,26,0.15)", color:"#F7931A", name:"Bitcoin",  chain:"BTC",          amount:"0.00421 BTC",  ngn:"≈ ₦280,440" },
    { icon:"₮", bg:"rgba(38,161,123,0.15)",  color:"#26A17B", name:"Tether",   chain:"USDT · TRC20", amount:"122.44 USDT",  ngn:"≈ ₦196,300" },
    { icon:"Ξ", bg:"rgba(98,126,234,0.15)",  color:"#627EEA", name:"Ethereum", chain:"ETH",           amount:"0.018 ETH",    ngn:"≈ ₦6,160"   },
  ];
  return (
    <div style={{ display:"flex", justifyContent:"center" }}>
      <div style={{ width:300, background:C.card, borderRadius:40,
        border:`1px solid ${C.border2}`, padding:20,
        boxShadow:`0 40px 80px rgba(0,0,0,0.6),0 0 0 1px ${C.border}` }}>
        <div style={{ width:100, height:28, background:C.bg, borderRadius:100, margin:"0 auto 20px" }} />
        {/* Balance */}
        <div style={{ textAlign:"center", padding:"20px 0 24px", borderBottom:`1px solid ${C.border}`, marginBottom:20 }}>
          <div style={{ fontSize:11, color:C.muted, letterSpacing:2, marginBottom:8 }}>TOTAL BALANCE</div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:42, letterSpacing:1 }}>₦482,900</div>
          <div style={{ fontSize:13, color:C.muted, marginTop:4 }}>≈ 312.44 USDT</div>
        </div>
        {/* Assets */}
        {assets.map(a => (
          <div key={a.name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
            padding:"12px 8px", borderRadius:10, marginBottom:4 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:"50%", display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:11, fontWeight:700, background:a.bg, color:a.color }}>
                {a.icon}
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:500 }}>{a.name}</div>
                <div style={{ fontSize:10, color:C.muted }}>{a.chain}</div>
              </div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:12 }}>{a.amount}</div>
              <div style={{ fontSize:10, color:C.muted }}>{a.ngn}</div>
            </div>
          </div>
        ))}
        {/* Actions */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginTop:20 }}>
          {[
            { icon:"↓", label:"Deposit", active:false },
            { icon:"⇄", label:"Convert", active:true  },
            { icon:"↑", label:"Withdraw", active:false },
          ].map(a => (
            <div key={a.label} style={{ background: a.active ? "rgba(14,203,129,0.06)" : "rgba(255,255,255,0.04)",
              border: a.active ? "1px solid rgba(14,203,129,0.25)" : `1px solid ${C.border}`,
              borderRadius:10, padding:"12px 6px", textAlign:"center",
              fontSize:10, color: a.active ? C.green : C.muted }}>
              <div style={{ fontSize:18, marginBottom:6 }}>{a.icon}</div>
              {a.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
