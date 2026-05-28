"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const FREE_SCAN_LIMIT = 3;

export default function Home() {
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(12482);
  const [scanCount, setScanCount] = useState(0);
  const [showPremium, setShowPremium] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  const scansLeft = Math.max(FREE_SCAN_LIMIT - scanCount, 0);
  const isLocked = !isPremium && scansLeft <= 0;

  const fetchLeaderboard = async () => {
  const now = new Date();

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  ).toISOString();

  const { data } = await supabase
    .from("aura_scans")
    .select("*")
    .gte("created_at", startOfMonth)
    .order("aura", { ascending: false })
    .limit(5);

  if (data) setLeaderboard(data);
};

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("premium") === "success") {
      localStorage.setItem("aurajudge_premium", "true");
      setIsPremium(true);
      window.history.replaceState({}, "", "/");
    } else {
      setIsPremium(localStorage.getItem("aurajudge_premium") === "true");
    }

    const today = new Date().toDateString();
    const savedDate = localStorage.getItem("aurajudge_scan_date");
    const savedCount = localStorage.getItem("aurajudge_scans");

    if (savedDate === today && savedCount) {
      setScanCount(Number(savedCount));
    } else {
      localStorage.setItem("aurajudge_scan_date", today);
      localStorage.setItem("aurajudge_scans", "0");
      setScanCount(0);
    }

    fetchLeaderboard();

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

  const startCheckout = async () => {
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
      });

      const data = await res.json();

      if (data.url) window.location.href = data.url;
      else alert("Payment failed to start.");
    } catch {
      alert("Payment failed to start.");
    }
  };

  const judgeAura = async () => {
    if (!imageBase64 || isLocked) return;

    setLoading(true);
    setResult(null);

    const steps = [
      "Scanning facial aura...",
      "Analyzing villain energy...",
      "Calculating meme potential...",
      "Consulting the aura council...",
      "Detecting main character syndrome...",
      "Reading background energy...",
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
        body: JSON.stringify({ imageBase64 }),
      });

      const data = await res.json();
      clearInterval(interval);

      if (!res.ok) throw new Error("AI failed");

      if (!isPremium) {
        const newCount = scanCount + 1;
        setScanCount(newCount);
        localStorage.setItem("aurajudge_scans", String(newCount));
      }

      setResult(data);

      try {
        const fileName = `${Date.now()}.png`;
        const response = await fetch(imageBase64);
        const blob = await response.blob();

        const { error: uploadError } = await supabase.storage
          .from("aura-images")
          .upload(fileName, blob);

        if (!uploadError) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("aura-images").getPublicUrl(fileName);

          await supabase.from("aura_scans").insert([
            {
              nickname: data.nickname,
              rank: data.rank,
              rarity: data.rarity,
              aura: data.aura,
              npc: data.npc,
              villain: data.villain,
              image_url: publicUrl,
            },
          ]);

          fetchLeaderboard();
        }
      } catch {
        console.log("Leaderboard save failed");
      }
    } catch {
      clearInterval(interval);

      setResult({
        nickname: "Aura Glitch",
        rank: "Reality Bender",
        rarity: "Corrupted Output",
        aura: 77,
        npc: 12,
        villain: 84,
        impression: "AI lost its mind.",
        roast: "Even the algorithm got cooked 💀",
        lore: "The scanner entered forbidden territory.",
        advice: "Try another image.",
        tips: [
          "Stop posing like an NPC.",
          "Better lighting = instant aura buff.",
          "Background currently lowering rank.",
        ],
      });
    }

    setLoading(false);
  };

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const words = String(text || "").split(" ");
    let line = "";

    words.forEach((word, index) => {
      const testLine = line + word + " ";
      if (ctx.measureText(testLine).width > maxWidth && index > 0) {
        ctx.fillText(line, x, y);
        line = word + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    });

    ctx.fillText(line, x, y);
    return y + lineHeight;
  };

  const roundRect = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  const drawCoverImage = (ctx, img, x, y, width, height, radius) => {
    ctx.save();
    roundRect(ctx, x, y, width, height, radius);
    ctx.clip();

    const imgRatio = img.width / img.height;
    const boxRatio = width / height;

    let drawWidth = width;
    let drawHeight = height;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > boxRatio) {
      drawHeight = height;
      drawWidth = height * imgRatio;
      offsetX = (width - drawWidth) / 2;
    } else {
      drawWidth = width;
      drawHeight = width / imgRatio;
      offsetY = (height - drawHeight) / 2;
    }

    ctx.drawImage(img, x + offsetX, y + offsetY, drawWidth, drawHeight);
    ctx.restore();
  };

  const saveResult = async () => {
    if (!result || !imageBase64) return;

    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;

    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 1920);
    gradient.addColorStop(0, "#18181b");
    gradient.addColorStop(0.45, "#050505");
    gradient.addColorStop(1, "#000000");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1920);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 42px Arial";
    ctx.fillText("AuraJudge.ai", 70, 90);

    ctx.fillStyle = "#71717a";
    ctx.font = "700 26px Arial";
    ctx.fillText("AI AURA REPORT", 760, 90);

    const uploaded = await loadImage(imageBase64);
    drawCoverImage(ctx, uploaded, 70, 140, 940, 620, 44);

    ctx.fillStyle = "#71717a";
    ctx.font = "700 24px Arial";
    ctx.fillText("AI NICKNAME", 70, 830);

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 72px Arial";
    wrapText(ctx, result.nickname, 70, 910, 940, 78);

    ctx.fillStyle = "#d4d4d8";
    ctx.font = "800 42px Arial";
    ctx.fillText(result.rank || "", 70, 1030);

    ctx.fillStyle = "#4ade80";
    ctx.font = "700 28px Arial";
    ctx.fillText(result.rarity || "", 70, 1080);

    const link = document.createElement("a");
    link.download = "aurajudge-result.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const Leaderboard = () => (
    <div className="bg-zinc-900 rounded-3xl p-5 shadow-2xl w-full">
      <h2 className="text-2xl font-black mb-4">🏆 Global Aura</h2>

      <div className="space-y-3">
        {leaderboard.length === 0 && (
          <p className="text-zinc-500 text-sm">No scans yet. Be the first.</p>
        )}

        {leaderboard.map((user, index) => (
          <div
            key={user.id}
            className="flex items-center gap-3 bg-black rounded-2xl p-3"
          >
            <div className="text-lg font-black w-7">#{index + 1}</div>

            <img
              src={user.image_url}
              alt="leaderboard"
              className="w-12 h-12 rounded-xl object-cover"
            />

            <div className="flex-1">
              <p className="font-black text-sm">{user.nickname}</p>
              <p className="text-zinc-500 text-xs">{user.rarity}</p>
            </div>

            <p className="text-yellow-300 font-black text-xl">{user.aura}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white p-6 overflow-x-hidden">
      <div className="absolute top-6 right-6 text-sm text-zinc-500">
        🔴 {onlineUsers} judging aura right now
      </div>

      <div className="mx-auto max-w-6xl grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-6 items-start">
        <aside className="hidden xl:block sticky top-6">
          <Leaderboard />
        </aside>

        <section className="flex flex-col items-center justify-center">
          <h1 className="text-6xl md:text-7xl leading-tight font-black mb-3 text-white animate-pulse text-center">
            AuraJudge.ai
          </h1>

          {isPremium && (
            <div className="mb-4 bg-yellow-400 text-black px-4 py-2 rounded-full font-black text-sm shadow-lg">
              👑 Premium Unlocked
            </div>
          )}

          <p className="text-zinc-400 mb-3 text-center max-w-md">
            Upload one picture and let AI create your aura nickname, rank,
            roast, and villain lore 💀
          </p>

          <p className="text-zinc-500 mb-8 text-center text-sm">
            {isPremium
              ? "Premium unlocked • unlimited scans"
              : `${scansLeft} free scans left`}
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

          {isLocked ? (
            <div className="bg-zinc-900 p-6 rounded-3xl w-full max-w-md text-center shadow-2xl">
              <p className="text-3xl mb-2">🔒</p>
              <h2 className="text-2xl font-black mb-2">Free scans used</h2>
              <p className="text-zinc-400 mb-5">
                Unlock premium to continue judging aura.
              </p>

              <button
                type="button"
                onClick={() => setShowPremium(true)}
                className="bg-white text-black px-7 py-3 rounded-2xl font-black hover:scale-105 transition"
              >
                Unlock Premium
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={judgeAura}
              disabled={loading || !imageBase64}
              className="bg-white text-black px-7 py-3 rounded-2xl font-black hover:scale-105 hover:bg-zinc-200 transition shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Judging..." : "Judge My Aura"}
            </button>
          )}

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
                className={`mt-8 w-[390px] max-w-full text-white rounded-[32px] overflow-hidden shadow-2xl transition-all duration-500 ${
                  result.aura >= 90
                    ? "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 animate-pulse scale-[1.02]"
                    : "bg-black"
                }`}
              >
                <div className="p-5 bg-gradient-to-b from-zinc-900 to-black">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-black tracking-wide">
                      AuraJudge.ai
                    </p>
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

                  <p
                    className={`text-sm mb-5 font-bold ${
                      result.aura >= 90
                        ? "text-yellow-200 animate-pulse"
                        : "text-green-400"
                    }`}
                  >
                    {result.rarity}
                  </p>

                  {result.aura >= 90 && (
                    <div className="mb-5 bg-yellow-300 text-black text-xs font-black px-3 py-2 rounded-full inline-block animate-bounce">
                      ⚡ MYTHIC AURA DETECTED
                    </div>
                  )}

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
                      <p className="text-zinc-300 text-sm">
                        {result.impression}
                      </p>
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
                      <p className="text-zinc-400 text-sm italic">
                        {result.lore}
                      </p>
                    </div>

                    <div>
                      <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">
                        Final Advice
                      </p>
                      <p className="text-zinc-300 text-sm">{result.advice}</p>
                    </div>

                    <div>
                      <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2">
                        Aura Improvement Tips
                      </p>

                      <div className="space-y-2">
                        {result.tips?.map((tip, index) => (
                          <div
                            key={index}
                            className="bg-zinc-900 rounded-2xl p-3 text-sm text-zinc-300"
                          >
                            ✨ {tip}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 flex items-center justify-between">
                    <p className="text-xs text-zinc-600">Share your aura</p>
                    <p className="text-xs text-zinc-500">AuraJudge.ai</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={saveResult}
                className="mt-4 bg-zinc-100 text-black px-6 py-3 rounded-2xl font-black hover:scale-105 transition"
              >
                Save Result 📸
              </button>
            </>
          )}

          <div className="xl:hidden mt-8 w-full max-w-md">
            <Leaderboard />
          </div>
        </section>
      </div>

      {showPremium && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50 pointer-events-auto">
          <div className="bg-zinc-900 rounded-3xl p-6 max-w-md w-full shadow-2xl relative z-[60]">
            <h2 className="text-3xl font-black mb-2">AuraJudge Premium</h2>

            <p className="text-zinc-400 mb-5">
              Unlock the full aura experience.
            </p>

            <div className="space-y-3 mb-6 text-zinc-300">
              <p>✅ Unlimited aura scans</p>
              <p>✅ Global Aura Leaderboard</p>
              <p>✅ Deep Villain Analysis</p>
              <p>✅ Compare aura with friends</p>
              <p>✅ Rare mythic ranks</p>
              <p>✅ Premium result cards</p>
            </div>

            <button
              type="button"
              onClick={startCheckout}
              className="w-full bg-white text-black py-3 rounded-2xl font-black mb-3"
            >
              Unlock Premium — $4.99/month
            </button>

            <button
              type="button"
              onClick={() => setShowPremium(false)}
              className="w-full bg-zinc-800 text-white py-3 rounded-2xl font-bold"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
    </main>
  );
}