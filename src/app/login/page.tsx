"use client";

import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      window.location.href = "/";
    } else {
      setError("Feil passord");
    }
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-80 space-y-4">
        <h1 className="text-xl font-semibold">Tilgang</h1>
        <input
          type="password"
          className="w-full border p-2"
          placeholder="Passord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          onClick={handleLogin}
          className="w-full bg-black text-white p-2"
        >
          Logg inn
        </button>
      </div>
    </div>
  );
}
