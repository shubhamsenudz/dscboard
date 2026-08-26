import React, { useEffect, useState } from "react";
async function api(path, opts={}) {
  const token = localStorage.getItem("token");
  const res = await fetch((import.meta.env.VITE_API_URL||"")+"/api"+path, { ...opts, headers: { "Content-Type":"application/json", ...(token?{Authorization:"Bearer "+token}:{}), ...(opts.headers||{}) } });
  if(!res.ok) throw new Error(await res.text());
  const text = await res.text();
  if(!text) return null;
  return JSON.parse(text);
}
function HolderPage(){
  const [rows,setRows]=useState([]);
  const [form,setForm]=useState({});
  const load=()=>api("/holders").then(setRows);
  useEffect(()=>{load();},[]);
  const save=async ev=>{ev.preventDefault(); await api("/holders",{method:"POST",body:JSON.stringify(form)}); setForm({}); load();};
  const remove=id=>api("/holders/"+id,{method:"DELETE"}).then(load);
  return (<div className="card"><h2>Holders</h2>
    <form className="grid-form" onSubmit={save}>
        <label>name<input value={form.name ?? ""} onChange={ev => setForm({...form, name: ev.target.value})} /></label>
        <label>pan<input value={form.pan ?? ""} onChange={ev => setForm({...form, pan: ev.target.value})} /></label>
        <label>phone<input value={form.phone ?? ""} onChange={ev => setForm({...form, phone: ev.target.value})} /></label>
      <button type="submit">Add</button>
    </form>
    <div className="table-wrap"><table><thead><tr><th>name</th><th>pan</th><th>phone</th><th></th></tr></thead>
    <tbody>{rows.map(row=><tr key={row.id}><td>{String(row.name ?? "")}</td><td>{String(row.pan ?? "")}</td><td>{String(row.phone ?? "")}</td><td><button className="link" onClick={()=>remove(row.id)}>Delete</button></td></tr>)}</tbody></table></div>
  </div>);
}

function CertificatePage(){
  const [rows,setRows]=useState([]);
  const [form,setForm]=useState({});
  const load=()=>api("/certificates").then(setRows);
  useEffect(()=>{load();},[]);
  const save=async ev=>{ev.preventDefault(); await api("/certificates",{method:"POST",body:JSON.stringify(form)}); setForm({}); load();};
  const remove=id=>api("/certificates/"+id,{method:"DELETE"}).then(load);
  return (<div className="card"><h2>Certificates</h2>
    <form className="grid-form" onSubmit={save}>
        <label>holderId<input value={form.holderId ?? ""} onChange={ev => setForm({...form, holderId: ev.target.value})} /></label>
        <label>serialNo<input value={form.serialNo ?? ""} onChange={ev => setForm({...form, serialNo: ev.target.value})} /></label>
        <label>tokenSerial<input value={form.tokenSerial ?? ""} onChange={ev => setForm({...form, tokenSerial: ev.target.value})} /></label>
        <label>dscClass<input value={form.dscClass ?? ""} onChange={ev => setForm({...form, dscClass: ev.target.value})} /></label>
        <label>expiresOn<input value={form.expiresOn ?? ""} onChange={ev => setForm({...form, expiresOn: ev.target.value})} /></label>
        <label>portal<input value={form.portal ?? ""} onChange={ev => setForm({...form, portal: ev.target.value})} /></label>
      <button type="submit">Add</button>
    </form>
    <div className="table-wrap"><table><thead><tr><th>holderId</th><th>serialNo</th><th>tokenSerial</th><th>dscClass</th><th>expiresOn</th><th>portal</th><th></th></tr></thead>
    <tbody>{rows.map(row=><tr key={row.id}><td>{String(row.holderId ?? "")}</td><td>{String(row.serialNo ?? "")}</td><td>{String(row.tokenSerial ?? "")}</td><td>{String(row.dscClass ?? "")}</td><td>{String(row.expiresOn ?? "")}</td><td>{String(row.portal ?? "")}</td><td><button className="link" onClick={()=>remove(row.id)}>Delete</button></td></tr>)}</tbody></table></div>
  </div>);
}
function Dashboard(){
  const [data,setData]=useState(null);
  useEffect(()=>{ api("/dashboard").then(setData).catch(()=>{}); },[]);
  return (<div>
    <div className="hero">
      <div className="stat"><span className="muted">Product</span><b>DscBoard</b></div>
      <div className="stat"><span className="muted">Workspace</span><b>{data?.tenant || "—"}</b></div>
      <div className="stat"><span className="muted">Region</span><b>ap-south-1</b></div>
    </div>
    <div className="card"><p>{data?.tag || "Class-3 DSC and USB token register for CA firms and DSC agents."}</p></div>
  </div>);
}
export default function App(){
  const [token,setToken]=useState(localStorage.getItem("token"));
  const [menu,setMenu]=useState(false);
  const [page,setPage]=useState("dashboard");
  const [mode,setMode]=useState("login");
  const [form,setForm]=useState({tenantName:"",city:"Mumbai",fullName:"",email:"",password:""});
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
    return (<div className="auth card">
      <h1>DscBoard</h1><p className="muted">Class-3 DSC and USB token register for CA firms and DSC agents.</p>
      <form onSubmit={submit} className="grid-form">
        {mode==="register" && <>
          <label>Workspace<input value={form.tenantName} onChange={e=>setForm({...form,tenantName:e.target.value})} required /></label>
          <label>City<input value={form.city} onChange={e=>setForm({...form,city:e.target.value})} /></label>
          <label>Your name<input value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})} required /></label>
        </>}
        <label>Email<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required /></label>
        <label>Password<input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required /></label>
        <button type="submit">{mode==="register"?"Create workspace":"Log in"}</button>
      </form>
      {err && <p className="muted">{err}</p>}
      <button className="link" onClick={()=>setMode(mode==="login"?"register":"login")}>{mode==="login"?"Create a workspace":"Have an account? Log in"}</button>
    </div>);
  }
  let body = <Dashboard />;
  if(page==="holders") body = <HolderPage />;
  if(page==="certificates") body = <CertificatePage />;
  return (<div>
    <div className="top"><button type="button" className="burger" onClick={()=>setMenu(v=>!v)}>Menu</button><div className="brand">DscBoard</div><button onClick={()=>{localStorage.removeItem("token"); setToken(null);}}>Log out</button></div>
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
