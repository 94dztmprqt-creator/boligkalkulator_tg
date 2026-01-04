"use client";

import { useState } from "react";
import { calculate } from "@/lib/calculations";

export default function Home() {
  const [input, setInput] = useState<any>({});
  const [result, setResult] = useState<any>(null);
  const [ai, setAi] = useState("");
  const [tooltip, setTooltip] = useState<Record<string, boolean>>({});

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

  const numberFields: [string, string, string][] = [
    ["price", "Kjøpesum", "Prisen du betaler for boligen."],
    ["equity", "Egenkapital", "Pengene du selv legger inn som startkapital."],
    ["loanYears", "Løpetid (år)", "Antall år lånet skal nedbetales."],
    ["rent", "Månedlig leie", "Leieinntekten du forventer å få per måned."],
    ["commonCosts", "Felleskostnader (mnd)", "Fellesutgifter som sameie, borettslag etc."],
    ["municipal", "Kommunale avgifter (år)", "Eiendomsskatt og andre offentlige avgifter per år."],
    ["insurance", "Forsikring (år)", "Årlig kostnad for boligforsikring."],
    ["maintenance", "Vedlikehold (år)", "Årlige utgifter til vedlikehold."],
  ];

  const percentFields: [string, string, string][] = [
    ["interest", "Rente (%)", "Prosent banken krever for lånet per år."],
    ["vacancy", "Ledighet (%)", "Forventet prosent av året boligen står tom."],
    ["taxRate", "Skatt (%)", "Skattesats på nettoinntekten fra eiendom."],
    ["appreciation", "Verdistigning (%)", "Forventet årlig økning i boligverdi."],
  ];

  return (
    <main className="bg-white min-h-screen p-6 max-w-4xl mx-auto font-sans space-y-8">
      <h1 className="text-4xl font-bold text-center text-black">
        Privat bolig- og utleiekalkulator
      </h1>

      {/* INPUT-SEKSJON */}
      <section className="bg-gray-50 p-6 rounded-xl shadow-md space-y-6">
        <h2 className="text-2xl font-semibold text-black">Fyll inn tall</h2>

        {/* Vanlige tallfelt */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {numberFields.map(([k, label, explanation]) => (
            <div key={k} className="flex flex-col relative">
              <label className="text-sm font-medium mb-1 text-black flex items-center space-x-1">
                <span>{label}</span>
                <button
                  type="button"
                  onClick={() => setTooltip((t) => ({ ...t, [k]: !t[k] }))}
                  className="text-blue-500 hover:text-blue-700 text-lg font-bold"
                >
                  ℹ️
                </button>
              </label>
              {tooltip[k] && (
                <div className="absolute bg-white border border-gray-300 shadow-md p-2 text-sm rounded w-64 z-10 mt-1 text-black">
                  <div className="flex justify-between items-start">
                    <span>{explanation}</span>
                    <button
                      onClick={() => setTooltip((t) => ({ ...t, [k]: false }))}
                      className="ml-2 text-gray-500 hover:text-gray-700 font-bold"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
              <input
                type="number"
                className="border border-gray-300 rounded p-2 text-black focus:ring-2 focus:ring-blue-400 focus:outline-none"
                onChange={(e) => setInput({ ...input, [k]: Number(e.target.value) })}
              />
            </div>
          ))}
        </div>

        {/* Prosentfelter med slider + input */}
        <div className="space-y-4">
          {percentFields.map(([k, label, explanation]) => (
            <div key={k} className="flex flex-col relative">
              <label className="text-sm font-medium mb-1 text-black flex items-center space-x-1">
                <span>{label}</span>
                <button
                  type="button"
                  onClick={() => setTooltip((t) => ({ ...t, [k]: !t[k] }))}
                  className="text-blue-500 hover:text-blue-700 text-lg font-bold"
                >
                  ℹ️
                </button>
              </label>
              {tooltip[k] && (
                <div className="absolute bg-white border border-gray-300 shadow-md p-2 text-sm rounded w-64 z-10 mt-1 text-black">
                  <div className="flex justify-between items-start">
                    <span>{explanation}</span>
                    <button
                      onClick={() => setTooltip((t) => ({ ...t, [k]: false }))}
                      className="ml-2 text-gray-500 hover:text-gray-700 font-bold"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={input[k] || 0}
                  onChange={(e) => setInput({ ...input, [k]: Number(e.target.value) })}
                  className="flex-1 h-2 bg-gray-200 rounded-lg accent-blue-600"
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={input[k] || 0}
                  onChange={(e) => {
                    let val = Number(e.target.value);
                    if (val < 0) val = 0;
                    if (val > 100) val = 100;
                    setInput({ ...input, [k]: val });
                  }}
                  className="w-16 text-black border border-gray-300 rounded p-1 text-center"
                />
                <span className="text-black font-medium">%</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={calc}
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition text-lg font-medium"
        >
          Beregn
        </button>
      </section>

      {/* RESULTATER */}
      {result && (
        <section className="bg-white p-6 rounded-xl shadow-md space-y-3 border border-gray-200">
          <h2 className="text-2xl font-semibold text-black">Resultater</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-black text-base">
            <p>Årlig leie: {result.yearlyRent.toFixed(0)} kr</p>
            <p>Årlig lån (renter+avdrag): {result.annuity.toFixed(0)} kr</p>
            <p>Skatt: {result.tax.toFixed(0)} kr</p>
            <p>
              <strong className="font-semibold">Netto kontantstrøm:</strong> {result.netCashflow.toFixed(0)} kr
            </p>
            <p>Brutto yield: {result.grossYield.toFixed(2)} %</p>
            <p>ROI (kontant): {result.roi.toFixed(2)} %</p>
            <p>Totalavkastning (scenario): {result.totalReturn.toFixed(0)} kr</p>
          </div>
          <button
            onClick={analyze}
            className="underline text-blue-600 hover:text-blue-800 mt-2 text-base"
          >
            AI-vurdering
          </button>
        </section>
      )}

      {/* AI-VURDERING */}
      {ai && (
        <section className="bg-yellow-50 p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold mb-2 text-black">AI-vurdering</h2>
          <div className="whitespace-pre-wrap text-sm text-black">{ai}</div>
        </section>
      )}
    </main>
  );
}
