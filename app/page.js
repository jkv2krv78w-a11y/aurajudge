"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(12482);

  const cardRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(Math.floor(Math.random() * 5000) + 8000);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const handleImageUpload = (file) => {
    if (!file) return;

    setImage(URL.createObjectURL(file));
    setResult(null);

    const reader = new FileReader();
    reader.onloadend = () => setImageBase64(reader.result);
    reader.readAsDataURL(file);
  };

  const judgeAura = async () => {
    if (!imageBase64) return;

    setLoading(true);
    setResult(null);

    const steps = [
      "Scanning facial aura...",
      "Analyzing villain energy...",
      "Calculating meme potential...",
      "Consulting the aura council...",
      "Detecting main character syndrome...",
      "Reading background energy..."
    ];

    let stepIndex = 0;
    setLoadingStep(steps[0]);

    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) setLoadingStep(steps[stepIndex]);
    }, 700);

    try {
      const res = await fetch("/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64 })
      });

      const data = await res.json();
      clearInterval(interval);

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setResult(data);
    } catch (error) {
      clearInterval(interval);

      setResult({
        nickname: "Broken Scanner",
        rank: "Aura Scanner Crashed",
        rarity: "Error • try another photo",
        aura: 0,
        npc: 100,
        villain: 0,
        impression: "The AI tripped over the WiFi cable.",
        roast: "Even the scanner got confused 💀",
        lore: "A mysterious error appeared and blocked the aura reading.",
        advice: "Try again before the aura council notices."
      });
    }

    setLoading(false);
  };

  const saveResult = () => {
    alert("For now, take a normal screenshot of the result card. We’ll build a proper clean export system later.");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="absolute top-6 right-6 text-sm text-zinc-500">
        🔴 {onlineUsers.toLocaleString()} judging aura right now
      </div>

      <h1 className="text-6xl md:text-7xl leading-tight font-black mb-3 text-white animate-pulse text-center">
        AuraJudge.ai
      </h1>

      <p className="text-zinc-400 mb-8 text-center max-w-md">
        Upload one picture and let AI create your aura nickname, rank, roast, and villain lore 💀
      </p>

      <label className="mb-6 cursor-pointer bg-zinc-900 hover:bg-zinc-800 transition px-6 py-8 rounded-3xl flex flex-col items-center gap-3 w-full max-w-md shadow-2xl">
        <span className="text-2xl">📸</span>
        <p className="font-bold">Upload your picture</p>
        <p className="text-zinc-400 text-sm">JPG, PNG or JPEG</p>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files[0])}
          className="hidden"
        />
      </label>

      {image && (
        <img
          src={image}
          alt="preview"
          className="w-64 h-64 object-cover rounded-3xl mb-6 shadow-2xl"
        />
      )}

      <button
        onClick={judgeAura}
        disabled={loading || !imageBase64}
        className="bg-white text-black px-7 py-3 rounded-2xl font-black hover:scale-105 hover:bg-zinc-200 transition shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "Judging..." : "Judge My Aura"}
      </button>

      {loading && (
        <div className="mt-6 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-zinc-700 border-t-white rounded-full animate-spin mb-4"></div>
          <p className="text-zinc-400 animate-pulse text-lg text-center">
            {loadingStep}
          </p>
        </div>
      )}

      {result && !loading && (
        <>
          <div
            ref={cardRef}
            className="mt-8 w-[390px] max-w-full bg-black text-white rounded-[32px] overflow-hidden shadow-2xl"
          >
            <div className="p-5 bg-gradient-to-b from-zinc-900 to-black">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-black tracking-wide">AuraJudge.ai</p>
                <p className="text-xs text-zinc-500">AI AURA REPORT</p>
              </div>

              {image && (
                <img
                  src={image}
                  alt="aura result"
                  className="w-full h-72 object-cover rounded-3xl mb-5"
                />
              )}

              <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">
                AI Nickname
              </p>

              <h2 className="text-4xl font-black leading-tight mb-2">
                {result.nickname}
              </h2>

              <p className="text-xl font-bold text-zinc-300 mb-2">
                {result.rank}
              </p>

              <p className="text-green-400 text-sm mb-5">{result.rarity}</p>

              <div className="grid grid-cols-3 gap-2 mb-5">
                <div className="bg-zinc-900 rounded-2xl p-3">
                  <p className="text-zinc-500 text-xs">Aura</p>
                  <p className="text-xl font-black">{result.aura}</p>
                </div>

                <div className="bg-zinc-900 rounded-2xl p-3">
                  <p className="text-zinc-500 text-xs">NPC</p>
                  <p className="text-xl font-black">{result.npc}%</p>
                </div>

                <div className="bg-zinc-900 rounded-2xl p-3">
                  <p className="text-zinc-500 text-xs">Villain</p>
                  <p className="text-xl font-black">{result.villain}%</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">
                    First Impression
                  </p>
                  <p className="text-zinc-300 text-sm">{result.impression}</p>
                </div>

                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">
                    Roast
                  </p>
                  <p className="text-zinc-300 text-sm">{result.roast}</p>
                </div>

                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">
                    Villain Lore
                  </p>
                  <p className="text-zinc-400 text-sm italic">{result.lore}</p>
                </div>

                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">
                    Final Advice
                  </p>
                  <p className="text-zinc-300 text-sm">{result.advice}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 flex items-center justify-between">
                <p className="text-xs text-zinc-600">Share your aura</p>
                <p className="text-xs text-zinc-500">AuraJudge.ai</p>
              </div>
            </div>
          </div>

          <button
            onClick={saveResult}
            className="mt-4 bg-zinc-100 text-black px-6 py-3 rounded-2xl font-black hover:scale-105 transition"
          >
            Save Result 📸
          </button>
        </>
      )}
    </main>
  );
}