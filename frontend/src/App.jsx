import React, { useEffect, useState } from "react";
function parseErr(t){ try{ const j=JSON.parse(t); return j.error||t; }catch{ return t||"Request failed"; } }
async function api(path, opts={}) {
  const token = localStorage.getItem("token");
  const res = await fetch((import.meta.env.VITE_API_URL||"")+"/api"+path, {
    ...opts,
    headers: { "Content-Type":"application/json", ...(token?{Authorization:"Bearer "+token}:{}), ...(opts.headers||{}) }
  });
  const text = await res.text();
  if(!res.ok) throw new Error(parseErr(text));
  if(!text) return null;
  return JSON.parse(text);
}
function HoldersPage(){
  const [rows,setRows]=useState([]);
  const [form,setForm]=useState({});
  const [err,setErr]=useState("");
  const load=()=>api("/holders").then(setRows).catch(e=>setErr(e.message));
  useEffect(()=>{load();},[]);
  const save=async ev=>{ev.preventDefault(); setErr(""); try{ await api("/holders",{method:"POST",body:JSON.stringify(form)}); setForm({}); load(); }catch(e){ setErr(e.message); }};
  const remove=id=>api("/holders/"+id,{method:"DELETE"}).then(load).catch(e=>setErr(e.message));
  return (<section className="card">
    <h2>Holders</h2>
    <p className="muted">Add directors and authorised signatories.</p>
    <form className="grid-form" onSubmit={save}>
        <label>Name<input value={form.name ?? ""} onChange={ev => setForm({...form, name: ev.target.value})} /></label>
        <label>PAN<input value={form.pan ?? ""} onChange={ev => setForm({...form, pan: ev.target.value})} /></label>
        <label>Phone<input value={form.phone ?? ""} onChange={ev => setForm({...form, phone: ev.target.value})} /></label>
      <button type="submit">Save</button>
    </form>
    {err && <p className="err">{err}</p>}
    {rows.length===0 ? <div className="empty">Add directors and authorised signatories.</div> : (
    <div className="table-wrap"><table><thead><tr><th>Name</th><th>PAN</th><th>Phone</th><th></th></tr></thead>
    <tbody>{rows.map(row=><tr key={row.id}><td>{String(row.name ?? "")}</td><td>{String(row.pan ?? "")}</td><td>{String(row.phone ?? "")}</td><td><button className="danger" onClick={()=>remove(row.id)}>Remove</button></td></tr>)}</tbody></table></div>)}
  </section>);
}

function CertificatesPage(){
  const [rows,setRows]=useState([]);
  const [form,setForm]=useState({});
  const [err,setErr]=useState("");
  const load=()=>api("/certificates").then(setRows).catch(e=>setErr(e.message));
  useEffect(()=>{load();},[]);
  const save=async ev=>{ev.preventDefault(); setErr(""); try{ await api("/certificates",{method:"POST",body:JSON.stringify(form)}); setForm({}); load(); }catch(e){ setErr(e.message); }};
  const remove=id=>api("/certificates/"+id,{method:"DELETE"}).then(load).catch(e=>setErr(e.message));
  return (<section className="card">
    <h2>Certificates</h2>
    <p className="muted">Add serial, token and expiry.</p>
    <form className="grid-form" onSubmit={save}>
        <label>Holder id<input value={form.holderId ?? ""} onChange={ev => setForm({...form, holderId: ev.target.value})} /></label>
        <label>Serial<input value={form.serialNo ?? ""} onChange={ev => setForm({...form, serialNo: ev.target.value})} /></label>
        <label>Token<input value={form.tokenSerial ?? ""} onChange={ev => setForm({...form, tokenSerial: ev.target.value})} /></label>
        <label>Class<input value={form.dscClass ?? ""} onChange={ev => setForm({...form, dscClass: ev.target.value})} /></label>
        <label>Expires<input value={form.expiresOn ?? ""} onChange={ev => setForm({...form, expiresOn: ev.target.value})} /></label>
        <label>Portal<input value={form.portal ?? ""} onChange={ev => setForm({...form, portal: ev.target.value})} /></label>
      <button type="submit">Save</button>
    </form>
    {err && <p className="err">{err}</p>}
    {rows.length===0 ? <div className="empty">Add serial, token and expiry.</div> : (
    <div className="table-wrap"><table><thead><tr><th>Holder id</th><th>Serial</th><th>Token</th><th>Class</th><th>Expires</th><th>Portal</th><th></th></tr></thead>
    <tbody>{rows.map(row=><tr key={row.id}><td>{String(row.holderId ?? "")}</td><td>{String(row.serialNo ?? "")}</td><td>{String(row.tokenSerial ?? "")}</td><td>{String(row.dscClass ?? "")}</td><td>{String(row.expiresOn ?? "")}</td><td>{String(row.portal ?? "")}</td><td><button className="danger" onClick={()=>remove(row.id)}>Remove</button></td></tr>)}</tbody></table></div>)}
  </section>);
}
function Dashboard(){
  const [w,setW]=useState(null);
  useEffect(()=>{ api("/work").then(setW).catch(()=>{}); },[]);
  const rows=[...(w?.expired||[]).map(r=>({...r,flag:"Expired"})), ...(w?.expiring30||[]).map(r=>({...r,flag:"30 days"}))];
  return (<div>
    <div className="hero-panel">
      <div className="kicker">Today</div>
      <h1>Tokens that will stop signing</h1>
      <p>MCA and GST will reject expired Class-3 DSCs. Renew before the date.</p>
    </div>
    <div className="hero">
      <div className="stat"><span>Alerts</span><b>{w?.alerts ?? 0}</b></div>
      <div className="stat"><span>Expired</span><b>{(w?.expired||[]).length}</b></div>
      <div className="stat"><span>Expiring</span><b>{(w?.expiring30||[]).length}</b></div>
    </div>
    <section className="card">
      <h2>Renewal queue</h2>
      {rows.length===0 ? <div className="empty">No DSC expiring in 30 days. Add certificates with YYYY-MM-DD.</div> : (
        <div className="table-wrap"><table><thead><tr><th>Flag</th><th>Holder</th><th>Serial</th><th>Portal</th><th>Expires</th><th>Days</th></tr></thead>
        <tbody>{rows.map(r=><tr key={r.id}><td>{r.flag}</td><td>{r.holder}</td><td>{r.serialNo}</td><td>{r.portal}</td><td>{r.expiresOn}</td><td>{r.daysLeft}</td></tr>)}</tbody></table></div>
      )}
    </section>
  </div>);
}
export default function App(){
  const [token,setToken]=useState(localStorage.getItem("token"));
  const [menu,setMenu]=useState(false);
  const [page,setPage]=useState("dashboard");
  const [mode,setMode]=useState("login");
  const [form,setForm]=useState({tenantName:"",city:"Pune",fullName:"",email:"",password:""});
  const [err,setErr]=useState("");
  async function submit(ev){
    ev.preventDefault(); setErr("");
    try{
      const path = mode==="register"?"/auth/register":"/auth/login";
      const body = mode==="register"?form:{email:form.email,password:form.password};
      const out = await api(path,{method:"POST",body:JSON.stringify(body)});
      localStorage.setItem("token", out.token); setToken(out.token);
    }catch(e){ setErr(e.message); }
  }
  if(!token){
    return (<div className="auth-wrap">
      <div className="auth">
        <div className="kicker">For CA firms and DSC agents</div>
        <h1>DscBoard</h1>
        <p className="muted">Track Class-3 tokens before MCA or GST signing stops.</p>
        <form onSubmit={submit} className="grid-form">
          {mode==="register" && <>
            <label>Workspace<input value={form.tenantName} onChange={e=>setForm({...form,tenantName:e.target.value})} required /></label>
            <label>City<input value={form.city} onChange={e=>setForm({...form,city:e.target.value})} /></label>
            <label>Your name<input value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})} required /></label>
          </>}
          <label>Email<input type="email" autoComplete="username" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required /></label>
          <label>Password<input type="password" autoComplete={mode==="login"?"current-password":"new-password"} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required minLength={8} /></label>
          <button type="submit">{mode==="register"?"Open workspace":"Log in"}</button>
        </form>
        {err && <p className="err">{err}</p>}
        <button className="ghost-ink" onClick={()=>setMode(mode==="login"?"register":"login")}>{mode==="login"?"Create a workspace":"Have an account? Log in"}</button>
      </div>
    </div>);
  }
  let body = <Dashboard />;
  if(page==="holders") body = <HoldersPage />;
  if(page==="certificates") body = <CertificatesPage />;
  return (<div className="shell">
    <div className="top">
      <button type="button" className="burger" onClick={()=>setMenu(v=>!v)}>Menu</button>
      <div className="brand">DscBoard</div>
      <button className="ghost" onClick={()=>{localStorage.removeItem("token"); setToken(null);}}>Log out</button>
    </div>
    <div className="layout">
      {menu && <button className="scrim" onClick={()=>setMenu(false)} />}
      <nav className={"side"+(menu?" open":"")} onClick={()=>setMenu(false)}>
          <button className={page==="dashboard"?"active":""} onClick={()=>setPage("dashboard")}>Home</button>
          <button className={page==="holders"?"active":""} onClick={()=>setPage("holders")}>Holders</button>
          <button className={page==="certificates"?"active":""} onClick={()=>setPage("certificates")}>Certificates</button>
      </nav>
      <main>{body}</main>
      <nav className="tabs">
          <button className={page==="dashboard"?"active":""} onClick={()=>setPage("dashboard")}>Home</button>
          <button className={page==="holders"?"active":""} onClick={()=>setPage("holders")}>Holders</button>
          <button className={page==="certificates"?"active":""} onClick={()=>setPage("certificates")}>Certificates</button>
      </nav>
    </div>
  </div>);
}
