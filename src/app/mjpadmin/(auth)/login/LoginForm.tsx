"use client";
import { useActionState, useState } from "react";
import Icon from "@/components/Icon";
import { loginAction } from "../../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);
  const [show, setShow] = useState(false);
  return (
    <form action={action} className="card" style={{ width: "min(420px,100%)", padding: 34, borderRadius: 28 }}>
      <div className="row"><Icon name="lock" /><h2 style={{ fontSize: 30 }}>Masuk</h2></div>
      <p className="muted small" style={{ marginTop: 6 }}>Akun panitia dibuat oleh superadmin.</p>
      <div className="field" style={{ marginTop: 20 }}><label htmlFor="u">Username</label><input id="u" name="username" className="input" autoComplete="username" autoCapitalize="none" spellCheck={false} required maxLength={60} /></div>
      <div className="field" style={{ marginTop: 14 }}><label htmlFor="p">Kata sandi</label>
        <div style={{ position: "relative" }}><input id="p" name="password" type={show ? "text" : "password"} className="input" autoComplete="current-password" required maxLength={200} style={{ paddingRight: 70 }} />
          <button type="button" onClick={() => setShow(!show)} className="small" style={{ position: "absolute", right: 4, top: 4, height: 44, padding: "0 12px", fontWeight: 600 }}>{show ? "Sembunyi" : "Lihat"}</button></div></div>
      {state?.message && <p className="err" role="alert" style={{ marginTop: 12 }}>{state.message}</p>}
      <button className="btn r full lg" style={{ marginTop: 22 }} disabled={pending}>{pending ? "Memeriksa..." : "Masuk"}</button>
    </form>
  );
}
