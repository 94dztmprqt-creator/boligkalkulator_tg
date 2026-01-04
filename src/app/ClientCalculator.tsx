"use client";

import { useState } from "react";
import { calculate } from "@/lib/calculations";

export default function Home() {
  const [input, setInput] = useState<any>({});
  const [result, setResult] = useState<any>(null);
  const [ai, setAi] = useState("");

  function calc() {
    setResult(calculate(input));
  }

  async function analyze() {
    const res = await fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify({ input, result }),
    });
    const data = await res.json();
    setAi(data.text);
  }

  const fields = [
    ["price", "Kjøpesum"],
    ["equity", "Egenkapital"],
    ["interest", "Rente (%)"],
    ["loanYears", "Løpetid (år)"],
    ["rent", "Månedlig leie"],
    ["vacancy", "Ledighet (%)"],
    ["commonCosts", "Felleskostnader (mnd)"],
    ["municipal", "Kommunale avgifter (år)"],
    ["insurance", "Forsikring (år)"],
    ["maintenance", "Vedlikehold (år)"],
    ["taxRate", "Skatt (%)"],
    ["appreciation", "Verdistigning (%)"],
  ];

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold">
        Privat bolig- og utleiekalkulator
      </h1>

      <div className="grid grid-cols-2 gap-3">
        {fields.map(([k, label]) => (
          <input
            key={k}
            placeholder={label}
            type="number"
            className="border p-2"
            onChange={(e) =>
              setInput({ ...input, [k]: Number(e.target.value) })
            }
          />
        ))}
      </div>

      <button
        onClick={calc}
        className="bg-black text-white px-4 py-2"
      >
        Beregn
      </button>

      {result && (
        <div className="space-y-2">
          <p>Årlig leie: {result.yearlyRent.toFixed(0)} kr</p>
          <p>Årlig lån (renter+avdrag): {result.annuity.toFixed(0)} kr</p>
          <p>Skatt: {result.tax.toFixed(0)} kr</p>
          <p><strong>Netto kontantstrøm:</strong> {result.netCashflow.toFixed(0)} kr</p>
          <p>Brutto yield: {result.grossYield.toFixed(2)} %</p>
          <p>ROI (kontant): {result.roi.toFixed(2)} %</p>
          <p>Totalavkastning (scenario): {result.totalReturn.toFixed(0)} kr</p>

          <button onClick={analyze} className="underline">
            AI-vurdering
          </button>

          {ai && (
            <div className="border p-3 text-sm whitespace-pre-wrap">
              {ai}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
