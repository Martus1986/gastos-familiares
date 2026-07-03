import { useState, useEffect, useRef } from "react";
import { supabase } from './supabase.js';
import { leerDato, guardarDato } from './supabase.js';

const MESES_HISTORICOS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio"];
const TODOS_LOS_MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

const GASTOS_FIJOS_2026 = {
  Enero:   { expensas_cdp547:99855, internet_cdp450:24087, seguro_up:140106, tarjeta_patagonia:590344.49, expensas_fitzroy:151534, luz_fitzroy:35552, internet_fitzroy:28021.5, guarderia:45000, fondo_coto:427000, expensas_cdp450:267612.18, luz_cdp450:66766.02, gas_cdp450:0, tarjeta_mp:423804.57, otros:484236, extras:368900 },
  Febrero: { expensas_cdp547:96529, internet_cdp450:24682, seguro_up:140106, tarjeta_patagonia:731127.7, expensas_fitzroy:135601, luz_fitzroy:19715, internet_fitzroy:28714.51, guarderia:333958, fondo_coto:257000, expensas_cdp450:160016.18, luz_cdp450:43550.67, gas_cdp450:0, tarjeta_mp:461921.16, otros:653422, extras:48900 },
  Marzo:   { expensas_cdp547:108490, internet_cdp450:24991, seguro_up:140106, tarjeta_patagonia:612410.11, expensas_fitzroy:166245, luz_fitzroy:21524, internet_fitzroy:0, guarderia:162676, fondo_coto:257000, expensas_cdp450:219732.18, luz_cdp450:48611.47, gas_cdp450:0, tarjeta_mp:421289.92, otros:801467, extras:48900 },
  Abril:   { expensas_cdp547:102074, internet_cdp450:25861, seguro_up:140106, tarjeta_patagonia:813658.98, expensas_fitzroy:158982.32, luz_fitzroy:22223, internet_fitzroy:0, guarderia:195176, fondo_coto:260426, expensas_cdp450:238818.18, luz_cdp450:35519.3, gas_cdp450:0, tarjeta_mp:106861.88, otros:364395, extras:48900 },
  Mayo:    { expensas_cdp547:91165, internet_cdp450:26800, seguro_up:140106, tarjeta_patagonia:868356.64, expensas_fitzroy:155245, luz_fitzroy:18089, internet_fitzroy:0, guarderia:169875, fondo_coto:307800, expensas_cdp450:255077.18, luz_cdp450:22134.89, gas_cdp450:0, tarjeta_mp:296421.05, otros:753237.2, extras:0 },
  Junio:   { expensas_cdp547:91711, internet_cdp450:27781, seguro_up:150025, tarjeta_patagonia:725471.4, expensas_fitzroy:201871, luz_fitzroy:15075, internet_fitzroy:29715, guarderia:202375, fondo_coto:285000, expensas_cdp450:259667.18, luz_cdp450:93810, gas_cdp450:0, tarjeta_mp:200601.92, otros:206262, extras:900000 },
};
const INGRESOS_2026 = {
  Enero:   { alq_sanmartin:520000, guarderia_coto:166594, alq_cdp547:905000, alq_fitzroy:0 },
  Febrero: { alq_sanmartin:520000, guarderia_coto:171122, alq_cdp547:981253, alq_fitzroy:1326259 },
  Marzo:   { alq_sanmartin:563813, guarderia_coto:176722, alq_cdp547:981253, alq_fitzroy:1021070 },
  Abril:   { alq_sanmartin:563813, guarderia_coto:176722, alq_cdp547:981253, alq_fitzroy:1262446 },
  Mayo:    { alq_sanmartin:563000, guarderia_coto:182064, alq_cdp547:1070908, alq_fitzroy:904320 },
  Junio:   { alq_sanmartin:615486, guarderia_coto:182064, alq_cdp547:1070908, alq_fitzroy:491745 },
};
const ADELANTOS_HISTORICOS = {
  Enero:   { vero:765857, martin:764193.57 },
  Febrero: { vero:1136457, martin:258818.51 },
  Marzo:   { vero:1081767, martin:121228 },
  Abril:   { vero:430237, martin:274881.88 },
  Mayo:    { vero:735178, martin:731515.25 },
  Junio:   { vero:535878, martin:369425.18 },
};
const MEP_HISTORICO = { Enero:1490, Febrero:1465, Marzo:1430, Abril:1400, Mayo:1415, Junio:1455 };
const PAGADOR_2026 = {
  expensas_cdp547:  { Enero:"vero", Febrero:"vero", Marzo:"vero", Abril:"vero", Mayo:"vero", Junio:"vero" },
  luz_cdp547:       { Enero:"fondo", Febrero:"fondo", Marzo:"fondo", Abril:"fondo", Mayo:"fondo", Junio:"fondo" },
  gas_cdp547:       { Enero:"fondo", Febrero:"fondo", Marzo:"fondo", Abril:"fondo", Mayo:"fondo", Junio:"fondo" },
  internet_cdp450:  { Enero:"vero", Febrero:"vero", Marzo:"vero", Abril:"vero", Mayo:"vero", Junio:"vero" },
  seguro_up:        { Enero:"fondo", Febrero:"fondo", Marzo:"fondo", Abril:"fondo", Mayo:"fondo", Junio:"fondo" },
  tarjeta_mp:       { Enero:"martin", Febrero:"fondo", Marzo:"fondo", Abril:"martin", Mayo:"martin", Junio:"fondo" },
  tarjeta_patagonia:{ Enero:"fondo", Febrero:"fondo", Marzo:"fondo", Abril:"fondo", Mayo:"fondo", Junio:"fondo" },
  expensas_fitzroy: { Enero:"vero", Febrero:"vero", Marzo:"vero", Abril:"fondo", Mayo:"vero", Junio:"vero" },
  luz_fitzroy:      { Enero:"vero", Febrero:"vero", Marzo:"vero", Abril:"vero", Mayo:"vero", Junio:"vero" },
  internet_fitzroy: { Enero:"fondo", Febrero:"martin", Marzo:"fondo", Abril:"fondo", Mayo:"fondo", Junio:"fondo" },
  guarderia:        { Enero:"vero", Febrero:"vero", Marzo:"fondo", Abril:"fondo", Mayo:"fondo", Junio:"fondo" },
  fondo_coto:       { Enero:"martin", Febrero:"martin", Marzo:"martin", Abril:"martin", Mayo:"martin", Junio:"martin" },
  expensas_cdp450:  { Enero:"fondo", Febrero:"fondo", Marzo:"fondo", Abril:"fondo", Mayo:"fondo", Junio:"martin" },
  luz_cdp450:       { Enero:"fondo", Febrero:"fondo", Marzo:"fondo", Abril:"fondo", Mayo:"fondo", Junio:"fondo" },
  luz_sanmartin:    { Enero:"fondo", Febrero:"fondo", Marzo:"fondo", Abril:"fondo", Mayo:"fondo", Junio:"fondo" },
  gas_sanmartin:    { Enero:"fondo", Febrero:"fondo", Marzo:"fondo", Abril:"fondo", Mayo:"fondo", Junio:"fondo" },
  gas_cdp450:       { Enero:"fondo", Febrero:"fondo", Marzo:"fondo", Abril:"fondo", Mayo:"fondo", Junio:"fondo" },
  otros:            { Enero:"mixto", Febrero:"mixto", Marzo:"mixto", Abril:"mixto", Mayo:"mixto", Junio:"mixto" },
  extras:           { Enero:"fondo", Febrero:"fondo", Marzo:"fondo", Abril:"fondo", Mayo:"fondo", Junio:"fondo" },
};
const CATEGORIAS = [
  { id:"expensas_cdp547", label:"Expensas CDP 547" },
  { id:"luz_cdp547",      label:"Luz CDP 547" },
  { id:"gas_cdp547",      label:"Gas CDP 547" },
  { id:"internet_cdp450", label:"Internet CDP 450" },
  { id:"seguro_up",       label:"Seguro UP" },
  { id:"tarjeta_mp",      label:"Tarjeta Mercado Pago" },
  { id:"tarjeta_patagonia",label:"Tarjeta Patagonia" },
  { id:"expensas_fitzroy",label:"Expensas Fitz Roy" },
  { id:"luz_fitzroy",     label:"Luz Fitz Roy" },
  { id:"internet_fitzroy",label:"Internet Fitz Roy" },
  { id:"guarderia",       label:"Guardería" },
  { id:"fondo_coto",      label:"Fondo Tarjeta Coto" },
  { id:"expensas_cdp450", label:"Expensas CDP 450" },
  { id:"luz_cdp450",      label:"Luz CDP 450" },
  { id:"luz_sanmartin",   label:"Luz San Martín" },
  { id:"gas_sanmartin",   label:"Gas San Martín" },
  { id:"gas_cdp450",      label:"Gas CDP 450" },
  { id:"extras",          label:"Extras" },
  { id:"otros",           label:"Otros del mes" },
];
const LIQ_INIT = {
  Enero:{saldado:true,nota:"ok",fecha:"Feb 2026"}, Febrero:{saldado:true,nota:"ok",fecha:"Mar 2026"},
  Marzo:{saldado:true,nota:"ok",fecha:"Abr 2026"}, Abril:{saldado:true,nota:"ok",fecha:"May 2026"},
  Mayo:{saldado:true,nota:"ok",fecha:"Jun 2026"},  Junio:{saldado:false},
};

const C = {
  bg:"#0F1117",surface:"#1A1D27",card:"#222536",border:"#2E3147",
  accent:"#6C63FF",green:"#34D399",red:"#F87171",yellow:"#FBBF24",
  text:"#E8E9F3",muted:"#8B8FA8",martin:"#FB923C",vero:"#4ADE80",fondo:"#C084FC",mixto:"#60A5FA",
};
const PC = { martin:C.martin, vero:C.vero, fondo:C.fondo, mixto:C.mixto };
const PL = { martin:"Martus", vero:"Vero", fondo:"Fondo", mixto:"M+V" };
const fmt = n => new Intl.NumberFormat("es-AR",{style:"currency",currency:"ARS",maximumFractionDigits:0}).format(n||0);
const fmtUSD = n => `U$D ${Math.round(n||0).toLocaleString("es-AR")}`;
const getMep = (mes, mepExtra) => mepExtra[mes] || MEP_HISTORICO[mes] || 1400;

const CATEGORIAS_INGRESO = [
  { id:"alq_sanmartin",  label:"Alquiler San Martín", usd:false },
  { id:"guarderia_coto", label:"Guardería Coto", usd:false },
  { id:"alq_cdp547",    label:"Alquiler CDP 547", usd:false },
  { id:"alq_fitzroy",   label:"Alquiler Fitz Roy", usd:true },
];

function getIngresos(mes, ingresosCargados) {
  const esH = MESES_HISTORICOS.includes(mes);
  if (esH) return INGRESOS_2026[mes]||{};
  const ic = ingresosCargados[mes]||{};
  return ic;
}

function calcTotales(mes, gastosCargados, mepExtra, ingresosCargados={}) {
  const fijos = GASTOS_FIJOS_2026[mes]||{};
  const cargados = gastosCargados[mes]||[];
  const esH = MESES_HISTORICOS.includes(mes);
  const mep = getMep(mes, mepExtra);
  let totalGastos = 0;
  if (esH) {
    totalGastos = Object.values(fijos).reduce((a,b)=>a+(b||0),0);
    const otrosC = cargados.filter(g=>g.categoria==="otros");
    if (otrosC.length>0) totalGastos = totalGastos-(fijos.otros||0)+otrosC.reduce((a,b)=>a+b.monto,0);
  } else {
    totalGastos = cargados.filter(g=>!g.es_ingreso).reduce((a,b)=>a+b.monto,0);
  }
  const ing = getIngresos(mes, ingresosCargados);
  const totalIngresos = Object.values(ing).reduce((a,b)=>a+(b||0),0);
  return { totalGastos, totalGastosUSD:totalGastos/mep, totalIngresos, totalIngresosUSD:totalIngresos/mep, balance:totalIngresos-totalGastos, balanceUSD:(totalIngresos-totalGastos)/mep, mep };
}

function calcPagadores(mes, gastosCargados, liquidaciones) {
  const fijos = GASTOS_FIJOS_2026[mes]||{};
  const cargados = gastosCargados[mes]||[];
  const esH = MESES_HISTORICOS.includes(mes);
  const totales = { martin:0, vero:0, fondo:0 };
  if (esH) {
    CATEGORIAS.forEach(cat => {
      const otrosC = cargados.filter(g=>g.categoria==="otros");
      const val = cat.id==="otros" ? (otrosC.length>0 ? otrosC.reduce((a,b)=>a+b.monto,0) : (fijos.otros||0)) : (fijos[cat.id]||0);
      if (!val) return;
      const p = PAGADOR_2026[cat.id]?.[mes];
      if (p==="mixto") { totales.martin+=val/2; totales.vero+=val/2; }
      else if (p && totales[p]!==undefined) totales[p]+=val;
    });
  } else {
    cargados.forEach(g => {
      if (g.quien==="mixto") { totales.martin+=g.monto/2; totales.vero+=g.monto/2; }
      else if (totales[g.quien]!==undefined) totales[g.quien]+=g.monto;
    });
  }
  // Agregar liquidación por fondo si corresponde
  const liq = liquidaciones[mes];
  if (liq?.saldado && liq?.metodo==="fondo") {
    totales.fondo += liq.montoPagado||0;
  }
  return totales;
}

const S = {
  app:    { background:C.bg, minHeight:"100vh", color:C.text, fontFamily:"'Inter',system-ui,sans-serif", paddingBottom:80 },
  header: { background:`linear-gradient(135deg,${C.surface} 0%,#1E2035 100%)`, padding:"20px 16px 16px", borderBottom:`1px solid ${C.border}` },
  nav:    { display:"flex", gap:4, background:C.surface, padding:"0 12px", borderBottom:`1px solid ${C.border}`, overflowX:"auto" },
  navBtn: a => ({ padding:"12px 14px", background:"none", border:"none", color:a?C.accent:C.muted, fontWeight:a?700:400, fontSize:13, cursor:"pointer", borderBottom:`2px solid ${a?C.accent:"transparent"}`, whiteSpace:"nowrap" }),
  section:{ padding:"16px 14px" },
  card:   { background:C.card, borderRadius:14, padding:16, marginBottom:12, border:`1px solid ${C.border}` },
  row:    { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 },
  label:  { color:C.muted, fontSize:13 },
  select: { background:C.card, color:C.text, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", fontSize:14, width:"100%", marginBottom:14 },
  input:  { background:C.surface, color:C.text, border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 14px", fontSize:14, width:"100%", boxSizing:"border-box", marginBottom:10 },
  btn:    (color,outline) => ({ background:outline?"transparent":color||C.accent, color:outline?color||C.accent:"#fff", border:`2px solid ${color||C.accent}`, borderRadius:10, padding:"11px 20px", fontWeight:700, fontSize:14, cursor:"pointer", width:"100%" }),
  divider:{ height:1, background:C.border, margin:"12px 0" },
  badge:  color => ({ background:color+"22", color, borderRadius:6, padding:"2px 8px", fontSize:12, fontWeight:600 }),
  tag:    q => ({ background:(PC[q]||"#888")+"22", color:PC[q]||"#888", borderRadius:20, padding:"2px 8px", fontSize:10, fontWeight:700, whiteSpace:"nowrap" }),
};

function MiniBar({ label, value, max, pagador, onExpand, expandido, children }) {
  const pColor = PC[pagador]||C.accent;
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, flex:1, minWidth:0 }}>
          {onExpand && <button onClick={onExpand} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:13, padding:"0 2px" }}>{expandido?"▼":"▶"}</button>}
          <span style={{ fontSize:12, color:C.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{label}</span>
          {pagador && <span style={S.tag(pagador)}>{PL[pagador]}</span>}
        </div>
        <span style={{ fontSize:13, fontWeight:700, marginLeft:8, flexShrink:0, color:pColor }}>{fmt(value)}</span>
      </div>
      <div style={{ background:C.border, borderRadius:4, height:5 }}>
        <div style={{ width:`${Math.min(100,(value/max)*100)}%`, background:pColor, borderRadius:4, height:5 }} />
      </div>
      {expandido && children && <div style={{ background:C.surface, borderRadius:10, padding:"10px 12px", marginTop:8 }}>{children}</div>}
    </div>
  );
}

function TabResumen({ mes, setMes, mesesActivos, gastosCargados, mepExtra, ingresosCargados, setMepEditMes, setMepEditValor, setModalMep }) {
  const [expandOtros, setExpandOtros] = useState(false);
  const t = calcTotales(mes, gastosCargados, mepExtra, ingresosCargados);
  const fijos = GASTOS_FIJOS_2026[mes]||{};
  const ing = getIngresos(mes, ingresosCargados);
  const ad = ADELANTOS_HISTORICOS[mes]||{};
  const esH = MESES_HISTORICOS.includes(mes);
  const cargados = gastosCargados[mes]||[];
  const otrosC = cargados.filter(g=>g.categoria==="otros");
  const otrosTotal = esH&&otrosC.length===0 ? (fijos.otros||0) : otrosC.reduce((a,b)=>a+b.monto,0);
  const adelantosM = esH?(ad.martin||0):cargados.filter(g=>g.quien==="martin"&&!g.es_ingreso).reduce((a,b)=>a+b.monto,0);
  const adelantosV = esH?(ad.vero||0):cargados.filter(g=>g.quien==="vero"&&!g.es_ingreso).reduce((a,b)=>a+b.monto,0);
  const diff = adelantosM-adelantosV;
  const ingItems = CATEGORIAS_INGRESO.map(ci=>({l:ci.label, v:ing[ci.id]||0})).filter(r=>r.v>0);

  return (
    <div style={S.section}>
      <select style={S.select} value={mes} onChange={e=>{setMes(e.target.value);sessionStorage.setItem("ultimoMes",e.target.value);}}>
        {mesesActivos.map(m=><option key={m}>{m}</option>)}
      </select>
      <div style={{ display:"flex", gap:8, marginBottom:8 }}>
        {[{l:"GASTOS",v:fmt(t.totalGastos),s:fmtUSD(t.totalGastosUSD),c:C.red},{l:"INGRESOS",v:fmt(t.totalIngresos),s:fmtUSD(t.totalIngresosUSD),c:C.green}].map(x=>(
          <div key={x.l} style={{ ...S.card, flex:1, marginBottom:0 }}>
            <div style={{ color:C.muted, fontSize:11, marginBottom:3 }}>{x.l}</div>
            <div style={{ fontWeight:800, fontSize:15, color:x.c }}>{x.v}</div>
            <div style={{ color:C.muted, fontSize:11 }}>{x.s}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        <div style={{ ...S.card, flex:1, marginBottom:0 }}>
          <div style={{ color:C.muted, fontSize:11, marginBottom:3 }}>BALANCE</div>
          <div style={{ fontWeight:800, fontSize:15, color:t.balance>=0?C.green:C.red }}>{fmt(t.balance)}</div>
          <div style={{ color:C.muted, fontSize:11 }}>{fmtUSD(t.balanceUSD)}</div>
        </div>
        <div style={{ ...S.card, flex:1, marginBottom:0 }}>
          <div style={{ color:C.muted, fontSize:11, marginBottom:3 }}>MEP</div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontWeight:800, fontSize:15, color:C.yellow }}>${getMep(mes,mepExtra)}</div>
            <button onClick={()=>{ setMepEditMes(mes); setMepEditValor(String(getMep(mes,mepExtra))); setModalMep(true); }} style={{ background:C.yellow+"22", color:C.yellow, border:"none", borderRadius:6, padding:"3px 8px", fontSize:11, fontWeight:600, cursor:"pointer" }}>✏️</button>
          </div>
          <div style={{ color:C.muted, fontSize:11 }}>ARS/USD</div>
        </div>
      </div>

      <div style={S.card}>
        <div style={{ fontWeight:700, fontSize:14, marginBottom:12 }}>Gastos del mes</div>
        {esH ? (
          CATEGORIAS.filter(cat=>(fijos[cat.id]&&fijos[cat.id]>0)||cargados.some(g=>g.categoria===cat.id)).map(cat=>{
            const esO = cat.id==="otros";
            const valor = esO ? otrosTotal : (fijos[cat.id]||0);
            if (!valor&&!esO) return null;
            return (
              <MiniBar key={cat.id} label={cat.label} value={valor} max={t.totalGastos} pagador={PAGADOR_2026[cat.id]?.[mes]||null}
                onExpand={esO?()=>setExpandOtros(e=>!e):null} expandido={esO&&expandOtros}>
                {otrosC.length>0 ? (<>
                  {otrosC.map((g,i)=>(
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}><span style={S.tag(g.quien)}>{PL[g.quien]}</span><span style={{ fontSize:12 }}>{g.descripcion}</span></div>
                      <span style={{ fontSize:12, fontWeight:700 }}>{fmt(g.monto)}</span>
                    </div>
                  ))}
                  <div style={S.divider}/>
                  {["martin","vero","fondo"].map(q=>{ const tot=otrosC.filter(g=>g.quien===q).reduce((a,b)=>a+b.monto,0); return tot?<div key={q} style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:3 }}><span style={{ color:PC[q], fontWeight:600 }}>{PL[q]}</span><span style={{ fontWeight:700 }}>{fmt(tot)}</span></div>:null; })}
                </>) : <div style={{ color:C.muted, fontSize:12 }}>Sin detalle — valor del Excel</div>}
              </MiniBar>
            );
          })
        ) : (
          (() => {
            const gastosNoIngreso = cargados.filter(g=>!g.es_ingreso);
            const otrosNuevos = gastosNoIngreso.filter(g=>g.categoria==="otros");
            const otrosTotal = otrosNuevos.reduce((a,b)=>a+b.monto,0);
            const resto = gastosNoIngreso.filter(g=>g.categoria!=="otros");
            return (<>
              {resto.map((g,i)=>(
                <MiniBar key={i} label={CATEGORIAS.find(c=>c.id===g.categoria)?.label||g.categoria} value={g.monto} max={t.totalGastos||1} pagador={g.quien} />
              ))}
              {otrosNuevos.length>0 && (
                <MiniBar label="Otros del mes" value={otrosTotal} max={t.totalGastos||1} pagador={null}
                  onExpand={()=>setExpandOtros(e=>!e)} expandido={expandOtros}>
                  {otrosNuevos.map((g,i)=>(
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}><span style={S.tag(g.quien)}>{PL[g.quien]}</span><span style={{ fontSize:12 }}>{g.descripcion}</span></div>
                      <span style={{ fontSize:12, fontWeight:700 }}>{fmt(g.monto)}</span>
                    </div>
                  ))}
                  <div style={S.divider}/>
                  {["martin","vero","fondo"].map(q=>{ const tot=otrosNuevos.filter(g=>g.quien===q).reduce((a,b)=>a+b.monto,0); return tot?<div key={q} style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:3 }}><span style={{ color:PC[q], fontWeight:600 }}>{PL[q]}</span><span style={{ fontWeight:700 }}>{fmt(tot)}</span></div>:null; })}
                </MiniBar>
              )}
              {gastosNoIngreso.length===0 && <div style={{ color:C.muted, fontSize:13 }}>Sin gastos cargados este mes</div>}
            </>);
          })()
        )}
      </div>

      <div style={S.card}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <span style={{ fontWeight:700, fontSize:14 }}>Ingresos</span>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontWeight:800, fontSize:14, color:C.green }}>{fmt(t.totalIngresos)}</div>
            <div style={{ color:C.muted, fontSize:11 }}>{fmtUSD(t.totalIngresosUSD)}</div>
          </div>
        </div>
        {ingItems.map(r=><div key={r.l} style={S.row}><span style={S.label}>{r.l}</span><span style={{ fontWeight:600, color:C.green }}>{fmt(r.v)}</span></div>)}
      </div>

      <div style={S.card}>
        <div style={{ fontWeight:700, fontSize:14, marginBottom:10 }}>Adelantos</div>
        <div style={{ display:"flex", gap:8, marginBottom:10 }}>
          {[["martin",adelantosM],["vero",adelantosV]].map(([k,v])=>(
            <div key={k} style={{ flex:1, background:PC[k]+"11", borderRadius:10, padding:"8px 10px", textAlign:"center" }}>
              <div style={{ color:PC[k], fontSize:11, marginBottom:2 }}>{PL[k]}</div>
              <div style={{ fontWeight:700 }}>{fmt(v)}</div>
            </div>
          ))}
        </div>
        {(adelantosM||adelantosV)?<div style={{ background:C.surface, borderRadius:10, padding:"10px 12px", textAlign:"center" }}>
          <div style={{ color:C.muted, fontSize:12, marginBottom:4 }}>
            <span style={{ color:PC[diff>0?"vero":"martin"], fontWeight:700 }}>{PL[diff>0?"vero":"martin"]}</span>{" le debe a "}
            <span style={{ color:PC[diff>0?"martin":"vero"], fontWeight:700 }}>{PL[diff>0?"martin":"vero"]}</span>
          </div>
          <div style={{ fontWeight:800, fontSize:18, color:C.accent }}>{fmt(Math.abs(diff)/2)}</div>
        </div>:null}
      </div>
    </div>
  );
}

function TabAlquileres({ mes, setMes, mesesActivos, mepExtra, ingresosCargados }) {
  const props = [{id:"alq_sanmartin",label:"San Martín",costoKey:null},{id:"alq_cdp547",label:"CDP 547",costoKey:null},{id:"alq_fitzroy",label:"Fitz Roy",costoKeys:["expensas_fitzroy","luz_fitzroy","internet_fitzroy"]},{id:"guarderia_coto",label:"Guardería Coto",costoKey:null}];
  const ing=getIngresos(mes,ingresosCargados), fijos=GASTOS_FIJOS_2026[mes]||{}, mep=getMep(mes,mepExtra);
  return (
    <div style={S.section}>
      <select style={S.select} value={mes} onChange={e=>setMes(e.target.value)}>{mesesActivos.map(m=><option key={m}>{m}</option>)}</select>
      {props.map(p=>{ 
        const i=ing[p.id]||0;
        const c = p.costoKeys ? p.costoKeys.reduce((a,k)=>a+(fijos[k]||0),0) : (p.costoKey?(fijos[p.costoKey]||0):0);
        const n=i-c; 
        return (
          <div key={p.id} style={S.card}>
            <div style={{ fontWeight:700, fontSize:15, marginBottom:10 }}>{p.label}</div>
            <div style={S.row}><span style={S.label}>Ingreso</span><span style={{ fontWeight:600, color:C.green }}>{fmt(i)}</span></div>
            {p.costoKeys && p.costoKeys.map(k=> fijos[k]>0 ? <div key={k} style={S.row}><span style={S.label}>{CATEGORIAS.find(c=>c.id===k)?.label||k}</span><span style={{ fontWeight:600, color:C.red }}>-{fmt(fijos[k])}</span></div> : null)}
            {p.costoKey && c>0 && <div style={S.row}><span style={S.label}>Expensas</span><span style={{ fontWeight:600, color:C.red }}>-{fmt(c)}</span></div>}
            <div style={S.divider}/>
            <div style={S.row}><span style={{ fontWeight:700 }}>Neto</span><div style={{ textAlign:"right" }}><div style={{ fontWeight:800, color:n>=0?C.green:C.red }}>{fmt(n)}</div><div style={{ color:C.muted, fontSize:11 }}>{fmtUSD(n/mep)}</div></div></div>
          </div>
        );
      })}
    </div>
  );
}

function TabBalance({ mesesActivos, gastosCargados, mepExtra, ingresosCargados }) {
  return (
    <div style={S.section}>
      <div style={{ fontWeight:800, fontSize:16, marginBottom:14 }}>Todos los meses</div>
      {mesesActivos.map(m=>{ const t=calcTotales(m,gastosCargados,mepExtra), ad=ADELANTOS_HISTORICOS[m]||{}; return (
        <div key={m} style={S.card}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <span style={{ fontWeight:700, fontSize:15 }}>{m}</span>
            <span style={S.badge(t.balance>=0?C.green:C.red)}>{t.balance>=0?"+":""}{fmtUSD(t.balanceUSD)}</span>
          </div>
          <div style={S.row}><span style={S.label}>Gastos</span><span style={{ color:C.red, fontWeight:600 }}>{fmt(t.totalGastos)}</span></div>
          <div style={S.row}><span style={S.label}>Ingresos</span><span style={{ color:C.green, fontWeight:600 }}>{fmt(t.totalIngresos)}</span></div>
          {(ad.martin||ad.vero)&&<><div style={S.divider}/><div style={{ display:"flex", gap:8 }}>{[["martin",ad.martin],["vero",ad.vero]].map(([k,v])=><div key={k} style={{ flex:1, textAlign:"center" }}><div style={{ color:PC[k], fontSize:11 }}>{PL[k]}</div><div style={{ fontWeight:700, fontSize:13 }}>{fmt(v)}</div></div>)}</div></>}
        </div>
      );})}
    </div>
  );
}

function TabGraficos({ mesesActivos, gastosCargados, mepExtra, liquidaciones, ingresosCargados }) {
  const vals = mesesActivos.map(m=>calcTotales(m,gastosCargados,mepExtra,ingresosCargados));
  const pags = mesesActivos.map(m=>calcPagadores(m,gastosCargados,liquidaciones));
  const maxVal = Math.max(...vals.map(v=>Math.max(v.totalGastos,v.totalIngresos)),1);
  return (
    <div style={S.section}>
      <div style={S.card}>
        <div style={{ fontWeight:700, fontSize:14, marginBottom:12 }}>Gastos vs Ingresos</div>
        {mesesActivos.map((m,i)=>{ const t=vals[i]; return (
          <div key={m} style={{ marginBottom:12 }}>
            <div style={{ fontSize:12, color:C.muted, marginBottom:4 }}>{m}</div>
            {[{l:"Gastos",v:t.totalGastos,c:C.red},{l:"Ing",v:t.totalIngresos,c:C.green}].map(r=>(
              <div key={r.l} style={{ display:"flex", gap:4, alignItems:"center", marginBottom:3 }}>
                <div style={{ width:42, fontSize:11, color:r.c, textAlign:"right" }}>{r.l}</div>
                <div style={{ flex:1, background:C.border, borderRadius:4, height:8 }}><div style={{ width:`${(r.v/maxVal)*100}%`, background:r.c, borderRadius:4, height:8 }} /></div>
                <div style={{ fontSize:10, color:C.muted, width:50, textAlign:"right" }}>{Math.round(r.v/1000)}k</div>
              </div>
            ))}
          </div>
        );})}
      </div>

      <div style={S.card}>
        <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>Quién pagó cada mes</div>
        <div style={{ display:"flex", gap:12, marginBottom:12 }}>
          {[["martin","Martus+Vero"],["fondo","Fondo"]].map(([k,l])=>(
            <div key={k} style={{ display:"flex", alignItems:"center", gap:4 }}>
              <div style={{ width:10, height:10, borderRadius:2, background:PC[k] }} />
              <span style={{ fontSize:11, color:C.muted }}>{l}</span>
            </div>
          ))}
        </div>
        {mesesActivos.map((m,i)=>{ const p=pags[i], mv=p.martin+p.vero, fo=p.fondo, total=mv+fo||1; return (
          <div key={m} style={{ marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ fontSize:12, color:C.muted }}>{m}</span>
              <div style={{ display:"flex", gap:10 }}>
                <span style={{ fontSize:11, color:C.martin }}>{fmt(mv)}</span>
                <span style={{ fontSize:11, color:C.fondo }}>{fmt(fo)}</span>
              </div>
            </div>
            <div style={{ display:"flex", borderRadius:4, overflow:"hidden", height:12 }}>
              <div style={{ width:`${(mv/total)*100}%`, background:C.martin }} />
              <div style={{ width:`${(fo/total)*100}%`, background:C.fondo }} />
            </div>
          </div>
        );})}
      </div>

      <div style={S.card}>
        <div style={{ fontWeight:700, fontSize:14, marginBottom:12 }}>Balance USD por mes</div>
        {mesesActivos.map((m,i)=>{ const t=vals[i]; return (
          <div key={m} style={{ ...S.row, marginBottom:10 }}>
            <span style={{ fontSize:13, minWidth:60 }}>{m}</span>
            <div style={{ flex:1, height:8, background:C.border, borderRadius:4, margin:"0 10px" }}><div style={{ width:`${Math.min(100,Math.abs(t.balanceUSD)/20)}%`, background:t.balanceUSD>=0?C.green:C.red, borderRadius:4, height:8 }} /></div>
            <span style={{ color:t.balanceUSD>=0?C.green:C.red, fontWeight:700, fontSize:13 }}>{fmtUSD(t.balanceUSD)}</span>
          </div>
        );})}
      </div>
    </div>
  );
}

function TabCargar({ mesesActivos, gastosCargados, setGastosCargados, ingresosCargados, setIngresosCargados }) {
  const mesDefault = mesesActivos[mesesActivos.length-1];
  const [modo, setModo] = useState("gasto"); // "gasto" | "ingreso"
  const [form, setForm] = useState({ mes:mesDefault, categoria:"otros", descripcion:"", monto:"", quien:"martin" });
  const [formIng, setFormIng] = useState({ mes:mesDefault, tipo:"alq_sanmartin", monto:"" });
  const [editando, setEditando] = useState(null);
  const [saved, setSaved] = useState(false);
  const [savedIng, setSavedIng] = useState(false);
  const formRef = useRef(null);

  const guardarIngreso = async () => {
    if (!formIng.monto||parseFloat(formIng.monto)<=0) return;
    const catIng = CATEGORIAS_INGRESO.find(c=>c.id===formIng.tipo);
    const mep = getMep(formIng.mes, mepExtra);
    // If USD, convert to ARS for storage
    const montoARS = catIng?.usd ? parseFloat(formIng.monto)*mep : parseFloat(formIng.monto);
    const updated = { ...ingresosCargados, [formIng.mes]: { ...(ingresosCargados[formIng.mes]||{}), [formIng.tipo]: montoARS }};
    setIngresosCargados(updated);
    await guardarDato('ingresos_cargados', updated);
    setSavedIng(true);
    setFormIng(f=>({...f, monto:""}));
    setTimeout(()=>setSavedIng(false), 2000);
  };

  const editarIngreso = (mes, tipo, valorARS) => {
    const catIng = CATEGORIAS_INGRESO.find(c=>c.id===tipo);
    const mep = getMep(mes, mepExtra);
    const valorMostrar = catIng?.usd ? (valorARS/mep).toFixed(0) : valorARS;
    setFormIng({ mes, tipo, monto: String(valorMostrar) });
    setModo("ingreso");
    window.scrollTo({top:0,behavior:"smooth"});
  };

  const eliminarIngreso = async (mes, tipo) => {
    const updated = { ...ingresosCargados, [mes]: { ...(ingresosCargados[mes]||{}) }};
    delete updated[mes][tipo];
    setIngresosCargados(updated);
    await guardarDato('ingresos_cargados', updated);
  };

  const guardar = async () => {
    if (!form.monto||isNaN(parseFloat(form.monto))) return;
    if (form.categoria==="otros"&&!form.descripcion.trim()) return;
    const item = { categoria:form.categoria, descripcion:form.descripcion.trim()||CATEGORIAS.find(c=>c.id===form.categoria)?.label, monto:parseFloat(form.monto), quien:form.quien, fecha:new Date().toLocaleDateString("es-AR") };
    let updated;
    if (editando) {
      const lista=[...(gastosCargados[editando.mes]||[])]; lista[editando.idx]=item;
      updated={...gastosCargados,[editando.mes]:lista}; setEditando(null);
    } else {
      updated={...gastosCargados,[form.mes]:[...(gastosCargados[form.mes]||[]),item]};
    }
    setGastosCargados(updated);
    await guardarDato('gastos_cargados', updated);
    setSaved(true); setForm(f=>({...f,descripcion:"",monto:""}));
    setTimeout(()=>setSaved(false),2000);
  };

  const editar = (mes,idx) => {
    const g=gastosCargados[mes][idx];
    setForm({mes,categoria:g.categoria,descripcion:g.descripcion,monto:String(g.monto),quien:g.quien});
    setEditando({mes,idx});
    formRef.current?.scrollIntoView({behavior:"smooth"});
  };

  const eliminar = async (mes,idx) => {
    const updated={...gastosCargados,[mes]:(gastosCargados[mes]||[]).filter((_,i)=>i!==idx)};
    setGastosCargados(updated);
    await guardarDato('gastos_cargados', updated);
  };

  return (
    <div style={S.section}>
      {/* Tab switcher gasto/ingreso */}
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {[["gasto","💸 Gasto"],["ingreso","💰 Ingreso"]].map(([m,l])=>(
          <button key={m} onClick={()=>setModo(m)} style={{ flex:1, padding:"11px 0", borderRadius:10, border:`2px solid ${modo===m?C.accent:C.border}`, background:modo===m?C.accent+"22":"transparent", color:modo===m?C.accent:C.muted, fontWeight:700, cursor:"pointer", fontSize:14 }}>{l}</button>
        ))}
      </div>

      {modo==="ingreso" ? (
        <div style={S.card}>
          <div style={{ fontWeight:700, fontSize:15, marginBottom:14 }}>Cargar ingreso</div>
          <select style={S.select} value={formIng.mes} onChange={e=>setFormIng(f=>({...f,mes:e.target.value}))}>{mesesActivos.map(m=><option key={m}>{m}</option>)}</select>
          <select style={S.select} value={formIng.tipo} onChange={e=>setFormIng(f=>({...f,tipo:e.target.value,monto:""}))}>
            {CATEGORIAS_INGRESO.map(c=><option key={c.id} value={c.id}>{c.label}{c.usd?" (USD)":""}</option>)}
          </select>
          {(() => { const catIng=CATEGORIAS_INGRESO.find(c=>c.id===formIng.tipo); const mep=getMep(formIng.mes,mepExtra); return (<>
            <input style={S.input} type="text" inputMode="decimal" placeholder={catIng?.usd?"Monto USD":"Monto $"} value={formIng.monto} onChange={e=>setFormIng(f=>({...f,monto:e.target.value}))} />
            {catIng?.usd && formIng.monto && parseFloat(formIng.monto)>0 && <div style={{ color:C.muted, fontSize:12, marginBottom:10 }}>= {fmt(parseFloat(formIng.monto)*mep)} (MEP ${mep})</div>}
          </>); })()}
          <button style={{ background:savedIng?C.green:C.accent, color:"#fff", border:"none", borderRadius:10, padding:"11px 20px", fontWeight:700, fontSize:14, cursor:"pointer", width:"100%" }} onClick={guardarIngreso}>
            {savedIng?"✓ Guardado":"Guardar ingreso"}
          </button>
          {/* Mostrar ingresos cargados */}
          {Object.keys(ingresosCargados).filter(m=>mesesActivos.includes(m)).reverse().map(m=>(
            <div key={m} style={{ marginTop:16 }}>
              <div style={{ fontWeight:700, marginBottom:8, color:C.muted, fontSize:13 }}>{m}</div>
              {CATEGORIAS_INGRESO.map(ci=>{ const v=ingresosCargados[m]?.[ci.id]; return v?(
                <div key={ci.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                  <div>
                    <span style={{ fontSize:13, color:C.text }}>{ci.label}</span>
                    {ci.usd && <span style={{ fontSize:11, color:C.muted }}> · {fmtUSD(v/getMep(m,mepExtra))}</span>}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontWeight:700, color:C.green }}>{fmt(v)}</span>
                    <button onClick={()=>editarIngreso(m,ci.id,v)} style={{ background:"none", border:"none", color:C.accent, cursor:"pointer", fontSize:16, padding:0 }}>✏️</button>
                    <button onClick={()=>eliminarIngreso(m,ci.id)} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:18, padding:0 }}>×</button>
                  </div>
                </div>
              ):null;})}
            </div>
          ))}
        </div>
      ) : (
      <div ref={formRef} style={{ ...S.card, borderColor:editando?C.yellow+"88":C.border }}>
        <div style={{ fontWeight:700, fontSize:15, marginBottom:14, color:editando?C.yellow:C.text }}>{editando?"✏️ Editando gasto":"Cargar gasto"}</div>
        <select style={S.select} value={form.mes} onChange={e=>setForm(f=>({...f,mes:e.target.value}))} disabled={!!editando}>{mesesActivos.map(m=><option key={m}>{m}</option>)}</select>
        <select style={S.select} value={form.categoria} onChange={e=>setForm(f=>({...f,categoria:e.target.value}))}>{CATEGORIAS.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select>
        {(form.categoria==="otros"||editando) && <input style={S.input} placeholder={form.categoria==="otros"?"Descripción (obligatorio)":"Descripción (opcional)"} value={form.descripcion} onChange={e=>setForm(f=>({...f,descripcion:e.target.value}))} />}
        <div style={{ display:"flex", gap:8, marginBottom:10 }}>
          <button onClick={()=>setForm(f=>({...f,monto:f.monto.startsWith("-")?f.monto.slice(1):"-"+f.monto}))} style={{ background:form.monto.startsWith("-")?C.red+"33":"transparent", color:form.monto.startsWith("-")?C.red:C.muted, border:`2px solid ${form.monto.startsWith("-")?C.red:C.border}`, borderRadius:10, padding:"10px 14px", fontWeight:800, fontSize:18, cursor:"pointer", flexShrink:0 }}>−</button>
          <input style={{ ...S.input, marginBottom:0, flex:1 }} type="text" inputMode="decimal" placeholder="Monto $" value={form.monto.startsWith("-")?form.monto.slice(1):form.monto} onChange={e=>setForm(f=>({...f,monto:f.monto.startsWith("-")?"-"+e.target.value:e.target.value}))} />
        </div>
        <div style={{ display:"flex", gap:8, marginBottom:14 }}>
          {[["martin","Martus"],["vero","Vero"],["fondo","Fondo"]].map(([q,l])=>(
            <button key={q} onClick={()=>setForm(f=>({...f,quien:q}))} style={{ flex:1, padding:"10px 4px", borderRadius:10, border:`2px solid ${form.quien===q?PC[q]:C.border}`, background:form.quien===q?PC[q]+"22":"transparent", color:PC[q], fontWeight:700, cursor:"pointer", fontSize:13 }}>{l}</button>
          ))}
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {editando&&<button style={S.btn(C.muted,true)} onClick={()=>{setEditando(null);setForm(f=>({...f,descripcion:"",monto:""}));}}>Cancelar</button>}
          <button style={{ background:saved?C.green:editando?C.yellow:C.accent, color:"#fff", border:"none", borderRadius:10, padding:"11px 20px", fontWeight:700, fontSize:14, cursor:"pointer", flex:2 }} onClick={guardar}>
            {saved?"✓ Guardado":editando?"Guardar cambios":"Guardar gasto"}
          </button>
        </div>
      </div>
      )}

      {modo==="gasto" && mesesActivos.filter(m=>(gastosCargados[m]||[]).length>0).slice().reverse().map(m=>(
        <div key={m} style={S.card}>
          <div style={{ fontWeight:700, marginBottom:10 }}>{m}</div>
          {(gastosCargados[m]||[]).map((g,i)=>(
            <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:C.surface, borderRadius:8, padding:"8px 10px", marginBottom:8 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600 }}>{CATEGORIAS.find(c=>c.id===g.categoria)?.label||g.categoria}</div>
                <div style={{ display:"flex", gap:6, marginTop:3, alignItems:"center", flexWrap:"wrap" }}>
                  <span style={S.tag(g.quien)}>{PL[g.quien]}</span>
                  {g.descripcion&&<span style={{ fontSize:11, color:C.muted }}>{g.descripcion}</span>}
                  <span style={{ fontSize:10, color:C.border }}>{g.fecha}</span>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginLeft:8 }}>
                <span style={{ fontWeight:700, color:C.red }}>{fmt(g.monto)}</span>
                <button onClick={()=>editar(m,i)} style={{ background:"none", border:"none", color:C.accent, cursor:"pointer", fontSize:16, padding:0 }}>✏️</button>
                <button onClick={()=>eliminar(m,i)} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:18, padding:0 }}>×</button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function TabLiquidar({ mesesActivos, gastosCargados, liquidaciones, setLiquidaciones }) {
  const [modal, setModal] = useState(null);
  const [metodo, setMetodo] = useState("transferencia");
  const [nota, setNota] = useState("");

  const calcLiq = mes => {
    const esH=MESES_HISTORICOS.includes(mes), ad=ADELANTOS_HISTORICOS[mes]||{}, c=gastosCargados[mes]||[];
    const tm=esH?(ad.martin||0):c.filter(g=>g.quien==="martin").reduce((a,b)=>a+b.monto,0);
    const tv=esH?(ad.vero||0):c.filter(g=>g.quien==="vero").reduce((a,b)=>a+b.monto,0);
    const d=tm-tv;
    return { totalMartin:tm, totalVero:tv, monto:Math.abs(d)/2, deudor:d>0?"vero":"martin", acreedor:d>0?"martin":"vero" };
  };

  const saldar = async mes => {
    const liq = calcLiq(mes);
    // Si paga el fondo, monto es el doble (porque el fondo es de los dos)
    const montoPagado = metodo==="fondo" ? liq.monto*2 : liq.monto;
    const upd={...liquidaciones,[mes]:{saldado:true,nota:nota||metodo,metodo,montoPagado,fecha:new Date().toLocaleDateString("es-AR")}};
    setLiquidaciones(upd);
    await guardarDato('liquidaciones', upd);
    setModal(null); setNota("");
  };

  const reabrir = async mes => {
    const upd={...liquidaciones,[mes]:{saldado:false}};
    setLiquidaciones(upd);
    await guardarDato('liquidaciones', upd);
  };

  const pendientes=mesesActivos.filter(m=>!liquidaciones[m]?.saldado);
  return (
    <div style={S.section}>
      <div style={{ ...S.card, borderColor:pendientes.length>0?C.yellow+"55":C.green+"55", background:pendientes.length>0?C.yellow+"11":C.green+"11", marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:22 }}>{pendientes.length>0?"⏳":"✅"}</span>
          <div><div style={{ fontWeight:700, color:pendientes.length>0?C.yellow:C.green }}>{pendientes.length>0?"Pendiente de saldar":"Todo al día"}</div>{pendientes.length>0&&<div style={{ color:C.muted, fontSize:13 }}>{pendientes.join(", ")}</div>}</div>
        </div>
      </div>
      {mesesActivos.map(m=>{ const liq=calcLiq(m), est=liquidaciones[m]||{}; return (
        <div key={m} style={{ ...S.card, borderColor:est.saldado?C.green+"55":C.yellow+"55" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <span style={{ fontWeight:800, fontSize:16 }}>{m}</span>
            <span style={S.badge(est.saldado?C.green:C.yellow)}>{est.saldado?"✓ Saldado":"Pendiente"}</span>
          </div>
          <div style={{ display:"flex", gap:8, marginBottom:10 }}>
            {[["martin",liq.totalMartin],["vero",liq.totalVero]].map(([k,v])=>(
              <div key={k} style={{ flex:1, background:PC[k]+"11", borderRadius:10, padding:"8px 10px", textAlign:"center" }}>
                <div style={{ color:PC[k], fontSize:11, marginBottom:2 }}>{PL[k]}</div>
                <div style={{ fontWeight:700 }}>{fmt(v)}</div>
              </div>
            ))}
          </div>
          <div style={{ background:C.surface, borderRadius:10, padding:"10px 12px", marginBottom:10, textAlign:"center" }}>
            <div style={{ color:C.muted, fontSize:12, marginBottom:4 }}>
              <span style={{ color:PC[liq.deudor], fontWeight:700 }}>{PL[liq.deudor]}</span>{" le transfiere a "}
              <span style={{ color:PC[liq.acreedor], fontWeight:700 }}>{PL[liq.acreedor]}</span>
            </div>
            <div style={{ fontSize:20, fontWeight:800, color:C.accent }}>{fmt(liq.monto)}</div>
          </div>
          {est.saldado&&(
            <div style={{ background:C.surface, borderRadius:8, padding:"8px 12px", marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12 }}>
                <span style={{ color:C.muted }}>Método: <span style={{ color:est.metodo==="fondo"?C.fondo:C.text, fontWeight:600 }}>{est.metodo}</span></span>
                {est.metodo==="fondo"&&<span style={{ color:C.fondo, fontWeight:600 }}>Fondo pagó {fmt(est.montoPagado)}</span>}
                <span style={{ color:C.muted }}>{est.fecha}</span>
              </div>
            </div>
          )}
          {!est.saldado?<button style={{ ...S.btn(C.green), border:"none" }} onClick={()=>setModal(m)}>Marcar como saldado</button>:<button style={S.btn(C.muted,true)} onClick={()=>reabrir(m)}>Reabrir mes</button>}
        </div>
      );})}
      {modal&&(
        <div style={{ position:"fixed", inset:0, background:"#000a", zIndex:100, display:"flex", alignItems:"flex-end" }}>
          <div style={{ background:C.surface, borderRadius:"20px 20px 0 0", padding:24, width:"100%", boxSizing:"border-box", border:`1px solid ${C.border}` }}>
            <div style={{ fontWeight:800, fontSize:17, marginBottom:8 }}>Saldar {modal}</div>
            <div style={{ color:C.muted, fontSize:13, marginBottom:16 }}>Si paga el Fondo, se registra el doble porque el fondo es de los dos.</div>
            <div style={{ display:"flex", gap:8, marginBottom:14 }}>
              {[["transferencia","Martus transfiere"],["efectivo","Efectivo"],["fondo","Fondo paga doble"]].map(([k,l])=>(
                <button key={k} onClick={()=>setMetodo(k)} style={{ flex:1, padding:"9px 4px", borderRadius:10, border:`2px solid ${metodo===k?(k==="fondo"?C.fondo:C.accent):C.border}`, background:metodo===k?(k==="fondo"?C.fondo:C.accent)+"22":"transparent", color:metodo===k?(k==="fondo"?C.fondo:C.accent):C.muted, fontWeight:600, cursor:"pointer", fontSize:11 }}>{l}</button>
              ))}
            </div>
            <input style={S.input} placeholder="Nota opcional..." value={nota} onChange={e=>setNota(e.target.value)} />
            <div style={{ display:"flex", gap:10 }}>
              <button style={S.btn(C.muted,true)} onClick={()=>setModal(null)}>Cancelar</button>
              <button style={{ ...S.btn(metodo==="fondo"?C.fondo:C.green), border:"none", flex:2 }} onClick={()=>saldar(modal)}>Confirmar ✓</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !pass) return;
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) { setError("Email o contraseña incorrectos"); setLoading(false); }
    else onLogin();
  };

  return (
    <div style={{ background:"#0F1117", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"'Inter',system-ui,sans-serif" }}>
      <div style={{ background:"#1A1D27", borderRadius:20, padding:32, width:"100%", maxWidth:360, border:"1px solid #2E3147" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontSize:40, marginBottom:8 }}>💰</div>
          <div style={{ fontWeight:800, fontSize:22, color:"#E8E9F3" }}>Gastos Familiares</div>
          <div style={{ color:"#8B8FA8", fontSize:13, marginTop:4 }}>Martus & Vero · 2026</div>
        </div>
        <input
          style={{ background:"#222536", color:"#E8E9F3", border:"1px solid #2E3147", borderRadius:10, padding:"12px 14px", fontSize:14, width:"100%", boxSizing:"border-box", marginBottom:10 }}
          type="email" placeholder="Email" value={email}
          onChange={e=>setEmail(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&login()}
        />
        <input
          style={{ background:"#222536", color:"#E8E9F3", border:"1px solid #2E3147", borderRadius:10, padding:"12px 14px", fontSize:14, width:"100%", boxSizing:"border-box", marginBottom:16 }}
          type="password" placeholder="Contraseña" value={pass}
          onChange={e=>setPass(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&login()}
        />
        {error && <div style={{ color:"#F87171", fontSize:13, marginBottom:12, textAlign:"center" }}>{error}</div>}
        <button
          onClick={login} disabled={loading}
          style={{ background:"#6C63FF", color:"#fff", border:"none", borderRadius:10, padding:"13px 0", fontWeight:700, fontSize:15, cursor:"pointer", width:"100%", opacity:loading?0.7:1 }}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </div>
    </div>
  );
}


// ── EXPORTAR EXCEL ────────────────────────────────────────────────────────────
function exportarExcel(mesesActivos, gastosCargados, ingresosCargados, liquidaciones, mepExtra) {
  const rows = [];
  // Header
  rows.push(['Mes','Categoría','Descripción','Monto ARS','Quién pagó','Fecha']);
  mesesActivos.forEach(mes => {
    const fijos = GASTOS_FIJOS_2026[mes]||{};
    const esH = MESES_HISTORICOS.includes(mes);
    if (esH) {
      CATEGORIAS.forEach(cat => {
        const v = fijos[cat.id];
        if (v) rows.push([mes, cat.label, '', v, PAGADOR_2026[cat.id]?.[mes]||'', '']);
      });
    }
    (gastosCargados[mes]||[]).forEach(g => {
      rows.push([mes, CATEGORIAS.find(c=>c.id===g.categoria)?.label||g.categoria, g.descripcion||'', g.monto, PL[g.quien]||g.quien, g.fecha||'']);
    });
    // Ingresos
    const ing = getIngresos(mes, ingresosCargados);
    CATEGORIAS_INGRESO.forEach(ci => {
      if (ing[ci.id]) rows.push([mes, 'INGRESO - '+ci.label, '', ing[ci.id], '', '']);
    });
    // Liquidación
    const liq = liquidaciones[mes];
    if (liq?.saldado) rows.push([mes, 'LIQUIDACIÓN', liq.nota||'', liq.montoPagado||'', liq.metodo||'', liq.fecha||'']);
  });

  // Build CSV
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF'+csv], { type:'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'gastos-familiares-2026.csv';
  a.click(); URL.revokeObjectURL(url);
}

// ── TAB RENTABILIDAD ──────────────────────────────────────────────────────────
function TabRentabilidad({ mesesActivos, mepExtra, ingresosCargados, gastosCargados, valorProps, setValorProps }) {
  const [editando, setEditando] = useState(false);
  const [formVP, setFormVP] = useState({ cdp547:'', sanmartin:'', fitzroy:'' });

  const guardarValores = async () => {
    const upd = { cdp547: parseFloat(formVP.cdp547)||valorProps.cdp547, sanmartin: parseFloat(formVP.sanmartin)||valorProps.sanmartin, fitzroy: parseFloat(formVP.fitzroy)||valorProps.fitzroy };
    setValorProps(upd);
    await guardarDato('valor_propiedades', upd);
    setEditando(false);
  };

  const propiedades = [
    { id:'cdp547', label:'CDP 547', ingKey:'alq_cdp547', costoKeys:[] },
    { id:'sanmartin', label:'San Martín', ingKey:'alq_sanmartin', costoKeys:[] },
    { id:'fitzroy', label:'Fitz Roy', ingKey:'alq_fitzroy', costoKeys:['expensas_fitzroy','luz_fitzroy','internet_fitzroy'] },
  ];

  // Calcular promedio de ingresos netos por propiedad
  const calcRent = (prop) => {
    const valores = mesesActivos.map(mes => {
      const ing = getIngresos(mes, ingresosCargados);
      const fijos = GASTOS_FIJOS_2026[mes]||{};
      const ingreso = ing[prop.ingKey]||0;
      const costos = prop.costoKeys.reduce((a,k)=>a+(fijos[k]||0),0);
      return ingreso - costos;
    }).filter(v=>v>0);
    const promMensual = valores.length ? valores.reduce((a,b)=>a+b,0)/valores.length : 0;
    const mep = getMep(mesesActivos[mesesActivos.length-1], mepExtra);
    const valorUSD = valorProps[prop.id]||0;
    const promMensualUSD = promMensual/mep;
    const rentMensual = valorUSD ? (promMensualUSD/valorUSD)*100 : 0;
    const rentAnual = rentMensual*12;
    return { promMensual, promMensualUSD, rentMensual, rentAnual, valorUSD };
  };

  return (
    <div style={S.section}>
      <div style={{ fontWeight:800, fontSize:16, marginBottom:4 }}>Rentabilidad de alquileres</div>
      <div style={{ color:C.muted, fontSize:12, marginBottom:14 }}>Basado en el promedio de meses con datos</div>

      {/* Valores de propiedades */}
      <div style={S.card}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <span style={{ fontWeight:700, fontSize:14 }}>Valor de propiedades (USD)</span>
          <button onClick={()=>{ setFormVP({cdp547:valorProps.cdp547||'',sanmartin:valorProps.sanmartin||'',fitzroy:valorProps.fitzroy||''}); setEditando(true); }} style={{ background:C.accent+"22", color:C.accent, border:`1px solid ${C.accent}`, borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:600, cursor:"pointer" }}>
            {editando?"Cancelar":"✏️ Editar"}
          </button>
        </div>
        {editando ? (<>
          {[['cdp547','CDP 547'],['sanmartin','San Martín'],['fitzroy','Fitz Roy']].map(([k,l])=>(
            <div key={k} style={{ marginBottom:8 }}>
              <div style={{ color:C.muted, fontSize:12, marginBottom:4 }}>{l}</div>
              <input style={S.input} type="number" placeholder={`Valor en USD`} value={formVP[k]} onChange={e=>setFormVP(f=>({...f,[k]:e.target.value}))} />
            </div>
          ))}
          <button style={{ ...S.btn(C.accent), border:"none", marginTop:4 }} onClick={guardarValores}>Guardar valores</button>
        </>) : (
          [['cdp547','CDP 547'],['sanmartin','San Martín'],['fitzroy','Fitz Roy']].map(([k,l])=>(
            <div key={k} style={S.row}>
              <span style={S.label}>{l}</span>
              <span style={{ fontWeight:700 }}>{valorProps[k] ? fmtUSD(valorProps[k]) : <span style={{ color:C.muted, fontSize:12 }}>Sin valor</span>}</span>
            </div>
          ))
        )}
      </div>

      {/* Rentabilidad por propiedad */}
      {propiedades.map(prop => {
        const r = calcRent(prop);
        const sinValor = !r.valorUSD;
        return (
          <div key={prop.id} style={S.card}>
            <div style={{ fontWeight:700, fontSize:15, marginBottom:10 }}>{prop.label}</div>
            <div style={S.row}><span style={S.label}>Ingreso neto promedio</span><span style={{ fontWeight:600, color:C.green }}>{fmt(r.promMensual)}</span></div>
            <div style={S.row}><span style={S.label}>En USD</span><span style={{ fontWeight:600, color:C.green }}>{fmtUSD(r.promMensualUSD)}</span></div>
            {prop.costoKeys.length>0 && <div style={{ color:C.muted, fontSize:11, marginBottom:8 }}>* Neto de expensas, luz e internet</div>}
            <div style={S.divider}/>
            {sinValor ? (
              <div style={{ color:C.yellow, fontSize:13, textAlign:"center" }}>Cargá el valor de la propiedad para ver la rentabilidad</div>
            ) : (<>
              <div style={S.row}>
                <span style={S.label}>Valor propiedad</span>
                <span style={{ fontWeight:600 }}>{fmtUSD(r.valorUSD)}</span>
              </div>
              <div style={{ display:"flex", gap:8, marginTop:8 }}>
                <div style={{ flex:1, background:C.accent+"11", borderRadius:10, padding:"10px", textAlign:"center" }}>
                  <div style={{ color:C.muted, fontSize:11 }}>Rent. mensual</div>
                  <div style={{ fontWeight:800, fontSize:18, color:C.accent }}>{r.rentMensual.toFixed(2)}%</div>
                </div>
                <div style={{ flex:1, background:C.green+"11", borderRadius:10, padding:"10px", textAlign:"center" }}>
                  <div style={{ color:C.muted, fontSize:11 }}>Rent. anual</div>
                  <div style={{ fontWeight:800, fontSize:18, color:C.green }}>{r.rentAnual.toFixed(2)}%</div>
                </div>
              </div>
            </>)}
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [tab, setTab] = useState("resumen");
  const [mes, setMes] = useState(MESES_HISTORICOS[MESES_HISTORICOS.length-1]);
  const [gastosCargados, setGastosCargados] = useState({});
  const [ingresosCargados, setIngresosCargados] = useState({});
  const [mesesActivos, setMesesActivos] = useState(MESES_HISTORICOS);
  const [mepExtra, setMepExtra] = useState({});
  const [liquidaciones, setLiquidaciones] = useState(LIQ_INIT);
  const [valorProps, setValorProps] = useState({ cdp547:0, sanmartin:0, fitzroy:0 });
  const [modalMes, setModalMes] = useState(false);
  const [mepNuevoMes, setMepNuevoMes] = useState("");
  const [modalMep, setModalMep] = useState(false);
  const [mepEditMes, setMepEditMes] = useState("");
  const [mepEditValor, setMepEditValor] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(()=>{
    // Check auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCheckingAuth(false);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(()=>{
    if (!session) return;
    (async()=>{
      try {
        const [gc,ic,ma,me,lq,vp] = await Promise.all([
          leerDato('gastos_cargados'), leerDato('ingresos_cargados'),
          leerDato('meses_activos'), leerDato('mep_extra'), leerDato('liquidaciones'),
          leerDato('valor_propiedades')
        ]);
        if(gc) setGastosCargados(gc);
        if(ic) setIngresosCargados(ic);
        if(ma) { setMesesActivos(ma); const lastMes=sessionStorage.getItem("ultimoMes"); setMes(lastMes&&ma.includes(lastMes)?lastMes:ma[ma.length-1]); }
        if(me) setMepExtra(me);
        if(lq) setLiquidaciones({...LIQ_INIT,...lq});
        if(vp) setValorProps(vp);
      } catch(e){ console.error(e); }
      setCargando(false);
    })();
  },[session]);

  const proximoMes = TODOS_LOS_MESES[TODOS_LOS_MESES.indexOf(mesesActivos[mesesActivos.length-1])+1];

  const activarMes = async () => {
    if (!proximoMes) return;
    const updMeses=[...mesesActivos,proximoMes];
    setMesesActivos(updMeses);
    setMes(proximoMes);
    await guardarDato('meses_activos', updMeses);
    if (mepNuevoMes&&parseFloat(mepNuevoMes)>0) {
      const updMep={...mepExtra,[proximoMes]:parseFloat(mepNuevoMes)};
      setMepExtra(updMep);
      await guardarDato('mep_extra', updMep);
    }
    setModalMes(false); setMepNuevoMes("");
  };

  const guardarMep = async () => {
    if (!mepEditValor || parseFloat(mepEditValor) <= 0) return;
    const updMep = { ...mepExtra, [mepEditMes]: parseFloat(mepEditValor) };
    setMepExtra(updMep);
    await guardarDato('mep_extra', updMep);
    setModalMep(false); setMepEditValor("");
  };

  if (checkingAuth) return <div style={{ background:C.bg, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", color:C.muted, fontFamily:"Inter,system-ui,sans-serif" }}>Cargando...</div>;
  if (!session) return <LoginScreen onLogin={()=>{}} />;
  if (cargando) return <div style={{ background:C.bg, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", color:C.muted, fontFamily:"Inter,system-ui,sans-serif" }}>Cargando...</div>;

  const TABS=[{id:"resumen",label:"Resumen"},{id:"cargar",label:"+ Cargar"},{id:"alq",label:"Alquileres"},{id:"rent",label:"📈 Rent."},{id:"balance",label:"Balance"},{id:"graficos",label:"Gráficos"},{id:"liquidar",label:"💸 Liquidar"}];

  return (
    <div style={S.app}>
      <div style={S.header}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontWeight:800, fontSize:20, letterSpacing:-0.5 }}>💰 Gastos Familiares</div>
            <div style={{ color:C.muted, fontSize:12, marginTop:2 }}>Martus & Vero · 2026</div>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            {proximoMes&&<button onClick={()=>setModalMes(true)} style={{ background:C.accent+"22", color:C.accent, border:`1px solid ${C.accent}`, borderRadius:10, padding:"8px 12px", fontSize:12, fontWeight:700, cursor:"pointer" }}>+ {proximoMes}</button>}

            <button onClick={()=>exportarExcel(mesesActivos, gastosCargados, ingresosCargados, liquidaciones, mepExtra)} style={{ background:C.green+"22", color:C.green, border:`1px solid ${C.green}`, borderRadius:10, padding:"8px 10px", fontSize:11, fontWeight:600, cursor:"pointer" }}>📥 Excel</button>
            <button onClick={()=>supabase.auth.signOut()} style={{ background:"transparent", color:C.muted, border:`1px solid ${C.border}`, borderRadius:10, padding:"8px 10px", fontSize:11, fontWeight:600, cursor:"pointer" }}>Salir</button>
          </div>
        </div>
      </div>
      <div style={S.nav}>{TABS.map(t=><button key={t.id} style={S.navBtn(tab===t.id)} onClick={()=>setTab(t.id)}>{t.label}</button>)}</div>
      {tab==="resumen"  && <TabResumen mes={mes} setMes={setMes} mesesActivos={mesesActivos} gastosCargados={gastosCargados} mepExtra={mepExtra} ingresosCargados={ingresosCargados} setMepEditMes={setMepEditMes} setMepEditValor={setMepEditValor} setModalMep={setModalMep} />}
      {tab==="alq"      && <TabAlquileres mes={mes} setMes={setMes} mesesActivos={mesesActivos} mepExtra={mepExtra} ingresosCargados={ingresosCargados} />}
      {tab==="rent"      && <TabRentabilidad mesesActivos={mesesActivos} mepExtra={mepExtra} ingresosCargados={ingresosCargados} gastosCargados={gastosCargados} valorProps={valorProps} setValorProps={setValorProps} />}
      {tab==="balance"  && <TabBalance mesesActivos={mesesActivos} gastosCargados={gastosCargados} mepExtra={mepExtra} ingresosCargados={ingresosCargados} />}
      {tab==="graficos" && <TabGraficos mesesActivos={mesesActivos} gastosCargados={gastosCargados} mepExtra={mepExtra} liquidaciones={liquidaciones} ingresosCargados={ingresosCargados} />}
      {tab==="cargar"   && <TabCargar mesesActivos={mesesActivos} gastosCargados={gastosCargados} setGastosCargados={setGastosCargados} ingresosCargados={ingresosCargados} setIngresosCargados={setIngresosCargados} />}
      {tab==="liquidar" && <TabLiquidar mesesActivos={mesesActivos} gastosCargados={gastosCargados} liquidaciones={liquidaciones} setLiquidaciones={setLiquidaciones} />}
      {modalMes&&proximoMes&&(
        <div style={{ position:"fixed", inset:0, background:"#000a", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div style={{ background:C.surface, borderRadius:20, padding:24, width:"100%", maxWidth:360, border:`1px solid ${C.border}` }}>
            <div style={{ fontWeight:800, fontSize:18, marginBottom:8 }}>Activar {proximoMes}</div>
            <div style={{ color:C.muted, fontSize:14, marginBottom:16 }}>Ingresá el valor del dólar MEP del mes.</div>
            <input style={S.input} type="number" placeholder="Valor MEP (ej: 1450)" value={mepNuevoMes} onChange={e=>setMepNuevoMes(e.target.value)} />
            <div style={{ color:C.muted, fontSize:12, marginBottom:16 }}>Podés dejarlo vacío y cargarlo después.</div>
            <div style={{ display:"flex", gap:10 }}>
              <button style={S.btn(C.muted,true)} onClick={()=>setModalMes(false)}>Cancelar</button>
              <button style={{ ...S.btn(C.accent), border:"none", flex:2 }} onClick={activarMes}>Activar {proximoMes}</button>
            </div>
          </div>
        </div>
      )}
      {modalMep&&(
        <div style={{ position:"fixed", inset:0, background:"#000a", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div style={{ background:C.surface, borderRadius:20, padding:24, width:"100%", maxWidth:360, border:`1px solid ${C.border}` }}>
            <div style={{ fontWeight:800, fontSize:18, marginBottom:8 }}>Editar MEP</div>
            <div style={{ color:C.muted, fontSize:14, marginBottom:14 }}>Mes:</div>
            <select style={S.select} value={mepEditMes} onChange={e=>{ setMepEditMes(e.target.value); setMepEditValor(String(getMep(e.target.value,mepExtra))); }}>
              {mesesActivos.map(m=><option key={m}>{m}</option>)}
            </select>
            <input style={S.input} type="text" inputMode="decimal" placeholder="Valor MEP (ej: 1450)" value={mepEditValor} onChange={e=>setMepEditValor(e.target.value)} />
            <div style={{ color:C.muted, fontSize:12, marginBottom:16 }}>Valor actual: ${getMep(mepEditMes,mepExtra)}</div>
            <div style={{ display:"flex", gap:10 }}>
              <button style={S.btn(C.muted,true)} onClick={()=>setModalMep(false)}>Cancelar</button>
              <button style={{ ...S.btn(C.yellow), border:"none", flex:2, color:"#000" }} onClick={guardarMep}>Guardar MEP</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
