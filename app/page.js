"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(12482);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(Math.floor(Math.random() * 5000) + 8000);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const ranks = [
    { name: "Background NPC", rarity: "Common • 42.1% of users get this" },
    { name: "Low Battery Menace", rarity: "Common • 35.7% of users get this" },
    { name: "Side Quest Merchant", rarity: "Common • 31.4% of users get this" },
    { name: "Loading Screen Warrior", rarity: "Common • 28.9% of users get this" },
    { name: "Gym NPC", rarity: "Common • 25.2% of users get this" },

    { name: "Anime Rival", rarity: "Rare • Top 14% aura detected" },
    { name: "Aura Merchant", rarity: "Rare • Top 12% aura detected" },
    { name: "Side Quest Villain", rarity: "Rare • Top 10% aura detected" },
    { name: "Mystery Transfer Student", rarity: "Rare • Top 9% aura detected" },
    { name: "Silent Main Character", rarity: "Rare • Top 8% aura detected" },

    { name: "Villain Arc Survivor", rarity: "Epic • Only 4.8% get this rank" },
    { name: "Shadow Boss", rarity: "Epic • Only 3.7% get this rank" },
    { name: "Main Character", rarity: "Epic • Only 3.1% get this rank" },
    { name: "Final Episode Rival", rarity: "Epic • Only 2.6% get this rank" },

    { name: "Final Boss", rarity: "Legendary • Only 0.9% get this rank" },
    { name: "Chosen One", rarity: "Legendary • Only 0.6% get this rank" },
    { name: "Mythic Aura Entity", rarity: "Legendary • Only 0.3% get this rank" },
    { name: "Unskippable Cutscene", rarity: "Legendary • Extremely rare aura outcome" }
  ];

  const roasts = [
    "Bro looks like he says ‘lock in’ then scrolls TikTok for 4 hours 💀",
    "Main character confidence, side character decisions.",
    "Aura detected. Stability not detected.",
    "Looks like a final boss who got distracted halfway through the villain arc.",
    "This fit is fighting for its life.",
    "Your aura loaded in 144p but the confidence is somehow 4K.",
    "The AI tried to scan your aura and requested emotional support.",
    "You look like you say ‘one more game’ and lose six in a row.",
    "Your aura has potential, but it needs a software update.",
    "Bro has side quest energy but walks like the main boss.",
    "This picture says ‘I’m locked in’ but the eyes say ‘I need sleep.’",
    "Your aura is giving free trial version.",
    "You look like your villain arc started because someone stole your charger.",
    "The confidence is premium, the execution is beta testing.",
    "Bro looks like he gives advice he personally does not follow.",
    "This is the type of aura that joins the group project and says ‘we got this’ then vanishes.",
    "AI detected 82% potential and 18% questionable decisions.",
    "Your aura is trying to be mysterious but forgot to turn off location sharing.",
    "You look like you own three unfinished business plans.",
    "This picture has ‘trust me bro’ written in invisible ink.",
    "Bro got the aura of a side character who accidentally became important.",
    "The fit is calm, but the aura is doing parkour.",
    "You look like you’d start a podcast after one deep conversation.",
    "Your NPC level is low, but your chaos level is concerning.",
    "This aura has been left on delivered since 2021.",
    "Bro looks like he says ‘watch this’ before something goes wrong.",
    "Your energy is rare, but not necessarily safe.",
    "The AI says you have aura, but also recommends supervision.",
    "This picture smells like late-night motivation and bad sleep.",
    "Bro has the facial expression of someone about to make a financially dangerous decision."
  ];

  const lore = [
    "Once lost a ranked game and never emotionally recovered.",
    "Became the final boss after being left on delivered for 3 days.",
    "Rumored to disappear every night to train aura in silence.",
    "Was once a normal civilian before discovering gym edits.",
    "The prophecy says he will either become a millionaire or start a podcast.",
    "Unlocked villain energy after saying ‘it is what it is’ too many times.",
    "Was banned from the village for excessive main character behavior.",
    "Once stared at the moon and decided to change everything.",
    "Gained aura after surviving a group chat argument.",
    "Started as an NPC but accidentally picked up legendary confidence.",
    "Trained for 100 nights under LED lights and phonk music.",
    "Lost all fear after refreshing TikTok analytics at 3am.",
    "The ancient scrolls say this person cannot be humbled easily.",
    "Once disappeared for a week and came back with a business idea.",
    "Carries emotional damage like a rare item.",
    "Was chosen by the algorithm but ignored the tutorial.",
    "Built different, but possibly assembled incorrectly.",
    "The aura council is still reviewing this case.",
    "A mysterious figure who arrives late but acts like it was planned.",
    "Their villain arc was sponsored by overthinking."
  ];

  const impressions = [
    "Looks like someone who says ‘trust me bro’ before disaster.",
    "Definitely has an unfinished villain arc.",
    "Acts mysterious after listening to one phonk playlist.",
    "Could either become a billionaire or disappear into the mountains.",
    "Main character energy detected.",
    "Looks calm, but the aura has 47 browser tabs open.",
    "Definitely laughs first, explains later.",
    "Looks like the friend who randomly says ‘I have an idea’ and everyone gets scared.",
    "Gives off ‘I’m fine’ but clearly planning world domination.",
    "Probably has elite confidence after midnight.",
    "Seems chill, but would absolutely start a side quest.",
    "Looks like a limited-time character skin.",
    "Has the energy of someone who either locks in or fully disappears.",
    "Probably says ‘bro listen’ before the worst plan ever.",
    "Lowkey intimidating, highkey unserious.",
    "Looks like the tutorial boss who becomes important later.",
    "Definitely has aura, but it needs charging.",
    "Looks like they have lore nobody asked for.",
    "This person has plot armor, but only on weekends.",
    "Gives ‘quiet until provoked’ energy."
  ];

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const judgeAura = () => {
    if (!image) return;

    setLoading(true);

    setTimeout(() => {
      const chosenRank = pick(ranks);

      setResult({
        aura: Math.floor(Math.random() * 41) + 60,
        npc: Math.floor(Math.random() * 100),
        villain: Math.floor(Math.random() * 100),
        roast: pick(roasts),
        rank: chosenRank.name,
        rarity: chosenRank.rarity,
        lore: pick(lore),
        impression: pick(impressions)
      });

      setLoading(false);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="absolute top-6 right-6 text-sm text-zinc-400">
        🔴 {onlineUsers.toLocaleString()} judging aura right now
      </div>

      <h1 className="text-6xl md:text-7xl leading-tight font-black mb-3 text-white animate-pulse text-center">
        AuraJudge.ai
      </h1>

      <p className="text-zinc-400 mb-8 text-center max-w-md">
        Upload one picture and let AI judge your aura 💀
      </p>

      <label className="mb-6 cursor-pointer border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 transition px-6 py-8 rounded-3xl flex flex-col items-center gap-3 w-full max-w-md">
        <span className="text-2xl">📸</span>
        <p className="font-bold">Upload your picture</p>
        <p className="text-zinc-400 text-sm">JPG, PNG or JPEG</p>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];

            if (file) {
              setImage(URL.createObjectURL(file));
              setResult(null);
            }
          }}
          className="hidden"
        />
      </label>

      {image && (
        <img
          src={image}
          alt="preview"
          className="w-64 h-64 object-cover rounded-2xl mb-6 border border-zinc-800 shadow-2xl"
        />
      )}

      <button
        onClick={judgeAura}
        className="bg-white text-black px-7 py-3 rounded-2xl font-black hover:scale-105 hover:bg-zinc-200 transition shadow-lg"
      >
        Judge My Aura
      </button>

      {loading && (
        <p className="mt-6 text-zinc-400 animate-pulse text-lg">
          Scanning aura...
        </p>
      )}

      {result && !loading && (
        <div className="mt-8 bg-zinc-900 p-6 rounded-3xl w-full max-w-md border border-zinc-700 shadow-2xl">
          <h2 className="text-3xl font-black mb-2 text-white">
            {result.rank}
          </h2>

          <p className="text-green-400 text-sm mb-5">
            {result.rarity}
          </p>

          <div className="space-y-2 mb-5">
            <p className="text-lg">Aura Score: {result.aura}/100</p>
            <p className="text-lg">NPC Level: {result.npc}%</p>
            <p className="text-lg">Villain Energy: {result.villain}%</p>
          </div>

          <div className="mb-5">
            <p className="text-zinc-500 text-sm mb-1">First Impression</p>
            <p className="text-zinc-300">{result.impression}</p>
          </div>

          <div className="mb-5">
            <p className="text-zinc-500 text-sm mb-1">Roast</p>
            <p className="text-zinc-300">{result.roast}</p>
          </div>

          <div>
            <p className="text-zinc-500 text-sm mb-1">Villain Lore</p>
            <p className="text-zinc-500 italic">{result.lore}</p>
          </div>
        </div>
      )}
    </main>
  );
}