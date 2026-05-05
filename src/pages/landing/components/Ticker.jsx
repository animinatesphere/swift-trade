import { C } from "../constants";

const TICKER_ITEMS = [
  { sym:"BTC/NGN",  price:"₦98,240,000", change:"+2.4%", up:true  },
  { sym:"ETH/NGN",  price:"₦3,420,000",  change:"+1.8%", up:true  },
  { sym:"USDT/NGN", price:"₦1,592",      change:"-0.3%", up:false },
  { sym:"USDC/NGN", price:"₦1,590",      change:"+0.1%", up:true  },
  { sym:"BNB/NGN",  price:"₦920,000",    change:"+3.1%", up:true  },
  { sym:"SOL/NGN",  price:"₦218,400",    change:"-1.2%", up:false },
  { sym:"XRP/NGN",  price:"₦860",        change:"+0.8%", up:true  },
  { sym:"DOGE/NGN", price:"₦262",        change:"+5.2%", up:true  },
];

export function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="ticker-wrap"
      style={{ width:"100%", overflow:"hidden", borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:"14px 0" }}>
      <div className="ticker-track" style={{ display:"flex", width:"max-content" }}>
        {doubled.map((item, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"0 32px", borderRight:`1px solid ${C.border}`, whiteSpace:"nowrap" }}>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:13, fontWeight:500, color:"#fff" }}>{item.sym}</span>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:13, color:C.muted }}>{item.price}</span>
            <span style={{ fontSize:12, fontWeight:500, color: item.up ? C.green : C.red }}>{item.change}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
