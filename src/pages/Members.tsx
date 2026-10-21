import { FormEvent, useEffect, useMemo, useState } from "react";
import { MessageCircle, Phone, Plus, Search, Trash2, UserCheck, UserRoundPen, UserX, Upload } from "lucide-react";
import * as XLSX from "xlsx";
import { supabase } from "../lib/supabase";
import PageHeader from "../components/PageHeader";
import type { Member } from "../types";
import { fmtDate, GOUDI, loadStats, type StatsData } from "../lib/stats";

export default function Members() {
  const [members,setMembers]=useState<Member[]>([]);
  const [q,setQ]=useState("");
  const [view,setView]=useState<"active"|"inactive"|"all">("active");
  const [open,setOpen]=useState(false);
  const [form,setForm]=useState({first_name:"",last_name:"",email:"",phone:"",locality:"",function_name:"",status:"active"});

  // ----- Fiche détaillée d'un membre -----
  type Own={status:string;check_in_at:string|null;method:string};
  const [detail,setDetail]=useState<Member|null>(null);
  const [stats,setStats]=useState<StatsData|null>(null);
  const [statsErr,setStatsErr]=useState(false);
  const [own,setOwn]=useState<Record<string,Own>|null>(null);
  type EditForm={first_name:string;last_name:string;gender:string;birth_date:string;phone:string;email:string;locality:string;function_name:string;status:string;notes:string};
  const [editing,setEditing]=useState(false);
  const [edit,setEdit]=useState<EditForm>({first_name:"",last_name:"",gender:"",birth_date:"",phone:"",email:"",locality:"",function_name:"",status:"active",notes:""});
  useEffect(()=>{loadStats().then(setStats).catch(()=>setStatsErr(true));},[]);

  async function openDetail(m:Member){
    setDetail(m);setOwn(null);setEditing(false);
    const {data}=await supabase.from("attendance").select("activity_id,status,check_in_at,method").eq("member_id",m.id);
    const map:Record<string,Own>={};
    ((data||[]) as (Own&{activity_id:string})[]).forEach(r=>{map[r.activity_id]=r;});
    setOwn(map);
  }

  function startEdit(m:Member){
    setEdit({first_name:m.first_name,last_name:m.last_name,gender:m.gender||"",birth_date:m.birth_date||"",phone:m.phone||"",email:m.email||"",locality:m.locality||"",function_name:m.function_name||"",status:m.status,notes:m.notes||""});
    setEditing(true);
  }
  async function saveEdit(e:FormEvent){
    e.preventDefault();
    if(!detail)return;
    const n=(v:string)=>v.trim()||null;
    const payload={first_name:edit.first_name.trim(),last_name:edit.last_name.trim(),gender:n(edit.gender),birth_date:edit.birth_date||null,phone:n(edit.phone),email:n(edit.email),locality:n(edit.locality),function_name:n(edit.function_name),status:edit.status,notes:n(edit.notes)};
    const {data,error}=await supabase.from("members").update(payload).eq("id",detail.id).select();
    if(error){alert("Impossible de modifier le membre : "+error.message);return;}
    if(!data||!data.length){alert("Modification refusée : seuls les administrateurs et les responsables peuvent modifier un membre.");return;}
    setDetail(data[0] as Member);setEditing(false);load();
  }

  const history=useMemo(()=>{
    if(!detail||!stats||!own)return null;
    const list=stats.acts.filter(a=>a.marked).sort((a,b)=>b.start.localeCompare(a.start))
      .map(a=>({id:a.id,name:a.name,start:a.start,typeName:a.typeName,status:own[a.id]?.status||"Absent"}));
    const present=list.filter(x=>x.status==="Présent").length;
    const excused=list.filter(x=>x.status==="Excusé").length;
    let streak=0;
    for(const x of list){if(x.typeName!==GOUDI)continue;if(x.status==="Absent")streak++;else break;}
    return {list,present,excused,absent:list.length-present-excused,rate:list.length?Math.round(present/list.length*100):0,streak};
  },[detail,stats,own]);

  const ageOf=(d:string|null)=>{if(!d)return null;const b=new Date(d),n=new Date();let a=n.getFullYear()-b.getFullYear();if(n.getMonth()<b.getMonth()||(n.getMonth()===b.getMonth()&&n.getDate()<b.getDate()))a--;return a>=0&&a<120?a:null;};
  const waLink=(p:string)=>{const d=p.replace(/\D/g,"");return `https://wa.me/${d.length===9?"221"+d:d}`;};
  const rateColor=(r:number)=>r>=70?"#18794e":r>=40?"#b54708":"#b42318";
  const stColor:Record<string,string>={"Présent":"#18794e","Absent":"#b42318","Excusé":"#b54708"};
  const linkBtn={display:"inline-flex",alignItems:"center",gap:6,padding:"9px 14px",border:"1px solid #d7dce3",borderRadius:10,color:"#172033",textDecoration:"none",fontWeight:600,fontSize:14,background:"#fff"} as const;

  async function load() {
    const {data}=await supabase.from("members").select("*").order("created_at",{ascending:false});
    setMembers((data as Member[])||[]);
  }
  useEffect(()=>{load()},[]);

  async function add(e:FormEvent){
    e.preventDefault();
    const {error}=await supabase.from("members").insert(form);
    if(error){alert("Impossible d'enregistrer le membre : "+error.message);return;}
    setForm({first_name:"",last_name:"",email:"",phone:"",locality:"",function_name:"",status:"active"});
    setOpen(false); load();
  }
  async function setStatus(m:Member,status:"active"|"inactive"){
    const msg=status==="inactive"
      ?`Masquer ${m.first_name} ${m.last_name} ?\n\nCe membre ne sera plus compté dans les statistiques, les relances et les listes de présence. Son historique est conservé et vous pourrez le réactiver à tout moment.`
      :`Réactiver ${m.first_name} ${m.last_name} ?\n\nIl sera de nouveau compté dans les statistiques et les listes de présence.`;
    if(!confirm(msg))return;
    const {data,error}=await supabase.from("members").update({status}).eq("id",m.id).select();
    if(error){alert("Impossible de modifier le statut : "+error.message);return;}
    if(!data||!data.length){alert("Modification refusée : seuls les administrateurs et les responsables peuvent modifier un membre.");return;}
    if(detail&&detail.id===m.id)setDetail(data[0] as Member);
    load();
    loadStats().then(setStats).catch(()=>setStatsErr(true));
  }
  async function remove(id:string){
    if(!confirm("Supprimer ce membre ?")) return;
    await supabase.from("members").delete().eq("id",id); load();
  }

  // ----- Import Excel / CSV -----
  type Imp={first_name:string;last_name:string;email:string|null;phone:string|null;gender:string|null;birth_date:string|null;locality:string|null;function_name:string|null};
  const [imp,setImp]=useState<{rows:Imp[];dup:number;bad:number}|null>(null);
  const [impOpen,setImpOpen]=useState(false);
  const [impMsg,setImpMsg]=useState("");
  const norm=(v:unknown)=>String(v??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z]/g,"");
  const FIELDS:Record<string,string[]>={first_name:["prenom","firstname","prenoms"],last_name:["nom","lastname","nomdefamille"],email:["email","mail","courriel"],phone:["telephone","tel","phone","numero","portable"],gender:["sexe","genre","gender"],birth_date:["datenaissance","naissance","birthdate","datedenaissance"],locality:["localite","adresse","ville","quartier"],function_name:["fonction","poste","role"]};
  const toDate=(v:unknown)=>{if(!v)return null;if(v instanceof Date&&!isNaN(+v))return new Date(v.getTime()-v.getTimezoneOffset()*60000).toISOString().slice(0,10);const t=String(v).trim();const m=t.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/);if(m)return `${m[3]}-${m[2].padStart(2,"0")}-${m[1].padStart(2,"0")}`;return /^\d{4}-\d{2}-\d{2}$/.test(t)?t:null;};
  async function readFile(f:File){
    setImpMsg("");setImp(null);
    try{
      const wb=XLSX.read(await f.arrayBuffer(),{type:"array",cellDates:true});
      const raw=XLSX.utils.sheet_to_json<Record<string,unknown>>(wb.Sheets[wb.SheetNames[0]],{defval:""});
      const seen=new Set(members.map(m=>`${norm(m.first_name)}|${norm(m.last_name)}`));
      const rows:Imp[]=[];let dup=0,bad=0;
      raw.forEach(r=>{
        const g=(k:string)=>{const key=Object.keys(r).find(c=>FIELDS[k].includes(norm(c)));return key?r[key]:"";};
        const first=String(g("first_name")).trim(),last=String(g("last_name")).trim();
        if(!first||!last){bad++;return;}
        const id=`${norm(first)}|${norm(last)}`;
        if(seen.has(id)){dup++;return;}
        seen.add(id);
        const t=(k:string)=>String(g(k)).trim()||null;
        rows.push({first_name:first,last_name:last,email:t("email"),phone:t("phone"),gender:t("gender"),birth_date:toDate(g("birth_date")),locality:t("locality"),function_name:t("function_name")});
      });
      setImp({rows,dup,bad});
    }catch{setImpMsg("Fichier illisible. Utilise un fichier .xlsx, .xls ou .csv.");}
  }
  async function confirmImport(){
    if(!imp?.rows.length)return;
    for(let i=0;i<imp.rows.length;i+=200){
      const {error}=await supabase.from("members").insert(imp.rows.slice(i,i+200).map(r=>({...r,status:"active"})));
      if(error){setImpMsg("Erreur : "+error.message);return;}
    }
    setImpMsg(`${imp.rows.length} membre(s) ajouté(s).`);setImp(null);load();
  }
  function template(){
    const ws=XLSX.utils.aoa_to_sheet([["Prénom","Nom","Email","Téléphone","Sexe","Date de naissance","Localité","Fonction"],["Awa","Fall","","770000000","F","01/01/2005","Saint-Louis",""]]);
    const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,"Membres");XLSX.writeFile(wb,"modele-import-membres.xlsx");
  }

  const counts={active:members.filter(m=>m.status==="active").length,inactive:members.filter(m=>m.status==="inactive").length};
  const filtered=members.filter(m=>(view==="all"||m.status===view)&&`${m.first_name} ${m.last_name} ${m.phone||""} ${m.email||""}`.toLowerCase().includes(q.toLowerCase()));

  return <><PageHeader title="Membres" description={`${counts.active} membre(s) actif(s)${counts.inactive?` · ${counts.inactive} ancien(s) membre(s) masqué(s)`:""}.`} action={<div className="att-actions"><button className="secondary" onClick={()=>{setImpOpen(true);setImp(null);setImpMsg("");}}><Upload size={18}/> Importer</button><button className="primary" onClick={()=>setOpen(true)}><Plus size={18}/> Ajouter un membre</button></div>}/>
    <div className="toolbar"><div className="input-icon search"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Rechercher…"/></div></div>
    <div className="type-tabs">{([["active",`Membres actifs (${counts.active})`],["inactive",`Anciens membres (${counts.inactive})`],["all","Tous"]] as ["active"|"inactive"|"all",string][]).map(([k,l])=><button type="button" key={k} className={`type-tab${view===k?" on":""}`} onClick={()=>setView(k)}>{l}</button>)}</div>
    <div className="panel table-wrap"><table><thead><tr><th>N°</th><th>Prénom</th><th>Nom</th><th>Téléphone</th><th>E-mail</th><th>Statut</th><th>Actions</th></tr></thead>
    <tbody>{filtered.map(m=><tr key={m.id} onClick={()=>openDetail(m)} style={{cursor:"pointer",opacity:m.status==="inactive"?.6:1}} title="Voir la fiche du membre"><td>{m.member_number}</td><td>{m.first_name}</td><td>{m.last_name}</td><td>{m.phone||"—"}</td><td>{m.email||"—"}</td><td><span className={`badge ${m.status}`}>{m.status==="active"?"Actif":"Ancien membre"}</span></td><td><button className="icon-btn" title="Voir la fiche" onClick={e=>{e.stopPropagation();openDetail(m);}}><UserRoundPen size={17}/></button><button className="icon-btn" title={m.status==="active"?"Masquer (ancien membre)":"Réactiver"} onClick={e=>{e.stopPropagation();setStatus(m,m.status==="active"?"inactive":"active");}}>{m.status==="active"?<UserX size={17}/>:<UserCheck size={17}/>}</button><button className="icon-btn danger" title="Supprimer" onClick={e=>{e.stopPropagation();remove(m.id);}}><Trash2 size={17}/></button></td></tr>)}</tbody></table>{!filtered.length&&<div className="empty">{view==="inactive"&&!q?"Aucun ancien membre masqué.":"Aucun membre trouvé."}</div>}</div>
    {open&&<div className="modal-backdrop"><form className="modal" onSubmit={add}><div className="modal-head"><h2>Nouveau membre</h2><button type="button" className="icon-btn" onClick={()=>setOpen(false)}>×</button></div>
      <div className="form-grid">{[["first_name","Prénom"],["last_name","Nom"],["email","E-mail"],["phone","Téléphone"],["locality","Localité"],["function_name","Fonction"]].map(([k,l])=><label key={k}>{l}<input required={k==="first_name"||k==="last_name"} value={form[k as keyof typeof form]} onChange={e=>setForm({...form,[k]:e.target.value})}/></label>)}</div>
      <div className="modal-actions"><button type="button" className="secondary" onClick={()=>setOpen(false)}>Annuler</button><button className="primary">Enregistrer</button></div>
    </form></div>}
    {impOpen&&<div className="modal-backdrop"><div className="modal"><div className="modal-head"><h2>Importer des membres</h2><button type="button" className="icon-btn" onClick={()=>setImpOpen(false)}>×</button></div>
      <div className="import-box"><p style={{marginTop:0}}>Fichier Excel (.xlsx, .xls) ou CSV avec les colonnes : <b>Prénom, Nom</b> (obligatoires), Email, Téléphone, Sexe, Date de naissance, Localité, Fonction.</p>
      <input type="file" accept=".xlsx,.xls,.csv" onChange={e=>{const f=e.target.files?.[0];if(f)readFile(f);}}/>
      <p style={{marginBottom:0}}><button type="button" className="secondary" onClick={template}>Télécharger le modèle</button></p></div>
      {imp&&<div className="success-box"><b>{imp.rows.length}</b> membre(s) à ajouter · {imp.dup} doublon(s) ignoré(s) · {imp.bad} ligne(s) sans nom/prénom ignorée(s)</div>}
      {impMsg&&<div className={impMsg.startsWith("Erreur")||impMsg.startsWith("Fichier")?"error-box":"success-box"}>{impMsg}</div>}
      <div className="modal-actions"><button type="button" className="secondary" onClick={()=>setImpOpen(false)}>Fermer</button><button type="button" className="primary" disabled={!imp?.rows.length} onClick={confirmImport}>Ajouter {imp?.rows.length||0} membre(s)</button></div>
    </div></div>}
    {detail&&<div className="modal-backdrop" onClick={()=>setDetail(null)}><div className="modal" style={{width:"min(760px,100%)",maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
      <div className="modal-head"><div><h2 style={{margin:0}}>{detail.first_name} {detail.last_name}</h2><div style={{marginTop:6,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}><span className="muted">N° {detail.member_number}</span><span className={`badge ${detail.status}`}>{detail.status==="active"?"Actif":"Ancien membre"}</span></div></div><button type="button" className="icon-btn" onClick={()=>setDetail(null)}>×</button></div>

      {detail.status==="inactive"&&<div className="error-box" style={{marginBottom:14,background:"#fff8e6",borderColor:"#f5d78a",color:"#8a5a00"}}>Ancien membre : masqué, non compté dans les statistiques, les relances ni les listes de présence. Son historique est conservé.</div>}
      {editing?(<form onSubmit={saveEdit}>
        <div className="form-grid">{([["first_name","Prénom",true],["last_name","Nom",true],["gender","Sexe (M ou F)",false],["birth_date","Date de naissance",false],["phone","Téléphone",false],["email","E-mail",false],["locality","Localité",false],["function_name","Fonction",false]] as [keyof EditForm,string,boolean][]).map(([k,l,req])=><label key={k}>{l}<input required={req} type={k==="birth_date"?"date":k==="email"?"email":"text"} value={edit[k]} onChange={e=>setEdit({...edit,[k]:e.target.value})}/></label>)}
          <label>Statut<select value={edit.status} onChange={e=>setEdit({...edit,status:e.target.value})}><option value="active">Actif</option><option value="inactive">Ancien membre (masqué)</option></select></label>
          <label>Notes<textarea rows={3} value={edit.notes} onChange={e=>setEdit({...edit,notes:e.target.value})}/></label>
        </div>
        <div className="modal-actions"><button type="button" className="secondary" onClick={()=>setEditing(false)}>Annuler</button><button className="primary">Enregistrer les modifications</button></div>
      </form>):(<>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14}}>{([
        ["Prénom",detail.first_name],
        ["Nom",detail.last_name],
        ["Sexe",detail.gender==="F"?"Féminin":detail.gender==="M"?"Masculin":detail.gender],
        ["Date de naissance",detail.birth_date?`${fmtDate(detail.birth_date)}${ageOf(detail.birth_date)!==null?` (${ageOf(detail.birth_date)} ans)`:""}`:null],
        ["Téléphone",detail.phone],
        ["E-mail",detail.email],
        ["Localité",detail.locality],
        ["Fonction",detail.function_name],
        ["Membre depuis",fmtDate(detail.created_at)],
      ] as [string,string|null][]).map(([l,v])=><div key={l}><div style={{fontSize:12,color:"#667085"}}>{l}</div><div style={{fontWeight:600,wordBreak:"break-word"}}>{v||"—"}</div></div>)}</div>
      {detail.notes&&<div className="panel" style={{marginTop:14,marginBottom:0}}><div style={{fontSize:12,color:"#667085"}}>Notes</div><div>{detail.notes}</div></div>}

      {(detail.phone||detail.email)&&<div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:14}}>
        {detail.phone&&<a style={linkBtn} href={`tel:${detail.phone}`}><Phone size={16}/> Appeler</a>}
        {detail.phone&&<a style={linkBtn} href={waLink(detail.phone)} target="_blank" rel="noreferrer"><MessageCircle size={16}/> WhatsApp</a>}
        {detail.email&&<a style={linkBtn} href={`mailto:${detail.email}`}>E-mail</a>}
      </div>}

      {detail.status==="active"&&<>
      <h3 style={{margin:"22px 0 10px"}}>Participation</h3>
      {statsErr&&<div className="error-box">Historique indisponible. Recharge la page.</div>}
      {!statsErr&&!history&&<p className="muted">Chargement de l'historique…</p>}
      {history&&<>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:10}}>{[
          ["Présences",history.present,"#18794e"],
          ["Absences",history.absent,"#b42318"],
          ["Excusés",history.excused,"#b54708"],
          ["Taux de présence",history.list.length?`${history.rate}%`:"—",history.list.length?rateColor(history.rate):"#667085"],
          ["Absences GOUDI d'affilée",history.streak,history.streak>=3?"#b42318":"#172033"],
        ].map(([l,v,c])=><div key={String(l)} style={{border:"1px solid #e6e8ec",borderRadius:12,padding:"10px 12px"}}><div style={{fontSize:12,color:"#667085"}}>{l}</div><div style={{fontSize:22,fontWeight:700,color:String(c)}}>{v}</div></div>)}</div>

        <h3 style={{margin:"20px 0 8px"}}>Historique des appels</h3>
        {!history.list.length&&<div className="empty">Aucun appel effectué pour le moment.</div>}
        {history.list.length>0&&<div style={{maxHeight:280,overflowY:"auto",border:"1px solid #e6e8ec",borderRadius:12}}><table><thead><tr><th>Date</th><th>Activité</th><th>Type</th><th>Statut</th></tr></thead><tbody>{history.list.map(x=><tr key={x.id}><td>{fmtDate(x.start)}</td><td>{x.name}</td><td><span className="badge">{x.typeName}</span></td><td style={{fontWeight:700,color:stColor[x.status]||"#172033"}}>{x.status}</td></tr>)}</tbody></table></div>}
      </>}
      </>}

      <div className="modal-actions"><button type="button" className="secondary" onClick={()=>setDetail(null)}>Fermer</button><button type="button" className="secondary" onClick={()=>setStatus(detail,detail.status==="active"?"inactive":"active")}>{detail.status==="active"?"Masquer (ancien membre)":"Réactiver"}</button><button type="button" className="primary" onClick={()=>startEdit(detail)}>Modifier</button></div>
      </>)}
    </div></div>}
  </>;
}