import { useEffect, useMemo, useState } from "react";
import { Check, Search, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import PageHeader from "../components/PageHeader";
import type { Activity } from "../types";

type MemberName = { id: string; first_name: string; last_name: string };
type Mark = "Présent" | "Absent";

export default function Attendance() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [members, setMembers] = useState<MemberName[]>([]);
  const [selected, setSelected] = useState("");
  const [marks, setMarks] = useState<Record<string, Mark>>({});
  const [query, setQuery] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    supabase.from("activities").select("*").order("start_datetime", { ascending: false })
      .then(({ data }) => setActivities((data as Activity[]) || []));
    supabase.rpc("public_member_names")
      .then(({ data }) => setMembers((data as MemberName[]) || []));
  }, []);

  useEffect(() => {
    setMarks({});
    if (!selected) return;
    let cancelled = false;
    supabase.from("attendance").select("member_id,status").eq("activity_id", selected)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) { setInfo("Erreur de chargement : " + error.message); return; }
        const x: Record<string, Mark> = {};
        (data || []).forEach((r: any) => {
          if (r.status === "Présent" || r.status === "Absent") x[r.member_id] = r.status;
        });
        setMarks(x);
      });
    return () => { cancelled = true; };
  }, [selected]);

  // Enregistre immédiatement (pas de bouton « Enregistrer »)
  async function setMany(ids: string[], value: Mark) {
    if (!selected || !ids.length) return;
    const before = marks;
    setMarks((m) => {
      const n = { ...m };
      ids.forEach((id) => (n[id] = value));
      return n;
    });
    const rows = ids.map((id) => ({ activity_id: selected, member_id: id, status: value, method: "manual" }));
    const { error } = await supabase.from("attendance").upsert(rows, { onConflict: "activity_id,member_id" });
    if (error) {
      setMarks(before);
      setInfo("Erreur : " + error.message);
    } else {
      setInfo("✓ Enregistré");
      setTimeout(() => setInfo(""), 1500);
    }
  }

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? members.filter((m) => `${m.first_name} ${m.last_name}`.toLowerCase().includes(q)) : members;
  }, [members, query]);

  const present = members.filter((m) => marks[m.id] === "Présent").length;
  const absent = members.filter((m) => marks[m.id] === "Absent").length;
  const todo = members.length - present - absent;

  return (
    <>
      <PageHeader title="Présences" description="Choisis l'activité, puis coche Présent ou Absent. L'enregistrement est automatique." />
      <div className="panel">
        <label>Activité
          <select value={selected} onChange={(e) => setSelected(e.target.value)}>
            <option value="">— Sélectionner —</option>
            {activities.map((a) => (
              <option key={a.id} value={a.id}>{a.name} — {new Date(a.start_datetime).toLocaleDateString("fr-FR")}</option>
            ))}
          </select>
        </label>
      </div>

      {selected && (
        <>
          <div className="att-bar">
            <div className="att-counts">
              <span className="c-p">Présents : {present}</span>
              <span className="c-a">Absents : {absent}</span>
              <span className="c-n">Non marqués : {todo}</span>
              {info && <span className="att-info">{info}</span>}
            </div>
            <div className="att-actions">
              <button className="secondary" onClick={() => setMany(shown.map((m) => m.id), "Présent")}>Tous présents</button>
              <button className="secondary" onClick={() => setMany(shown.map((m) => m.id), "Absent")}>Tous absents</button>
            </div>
          </div>

          <div className="input-icon search" style={{ marginBottom: 14 }}>
            <Search size={18} />
            <input placeholder="Rechercher un membre…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>

          <div className="att-list">
            {shown.map((m) => {
              const v = marks[m.id];
              return (
                <div className="att-row" key={m.id}>
                  <span className="att-name">{m.last_name} {m.first_name}</span>
                  <div className="att-btns">
                    <button type="button" className={`att-btn p ${v === "Présent" ? "on" : ""}`}
                      aria-pressed={v === "Présent"} onClick={() => setMany([m.id], "Présent")}>
                      <Check size={18} /> Présent
                    </button>
                    <button type="button" className={`att-btn a ${v === "Absent" ? "on" : ""}`}
                      aria-pressed={v === "Absent"} onClick={() => setMany([m.id], "Absent")}>
                      <X size={18} /> Absent
                    </button>
                  </div>
                </div>
              );
            })}
            {!shown.length && <div className="empty">Aucun membre.</div>}
          </div>
        </>
      )}
    </>
  );
}
