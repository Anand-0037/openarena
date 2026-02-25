'use client';

import React, { useState, useEffect } from 'react';
import { Play, Terminal, Database, ShieldAlert, Cpu, CheckCircle2, Users, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Mermaid from '../components/Mermaid';

export default function Home() {
  const [activeTab, setActiveTab] = useState('live');
  const [logs, setLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(true);

  // Simulation effect for the hero terminal
  useEffect(() => {
    if (!isSimulating) return;

    const initialLogs = [
      "// Epoch 4829 - Subnet 99 (OpenArena)",
      "> Awaiting Validator Task Broadcast...",
    ];

    setLogs(initialLogs);

    const sequence = [
      { text: "> [TASK RECEIVED] Source: LiveBench API | Category: Reasoning", delay: 1500, color: "text-brand-yellow" },
      { text: "> Committing solution hash to chain...", delay: 2500, color: "" },
      { text: "> Hash: 0x8f2a9...d31e", delay: 3000, color: "" },
      { text: "// Wait for Reveal Window...", delay: 4500, color: "text-gray-500" },
      { text: "> Revealing plain-text solution...", delay: 5500, color: "" },
      { text: "> [SUCCESS] Validator confirmed structure.", delay: 6500, color: "text-brand-green" },
    ];

    const timeouts: NodeJS.Timeout[] = [];

    sequence.forEach((step) => {
      const timeout = setTimeout(() => {
        setLogs(prev => [...prev, `<span class="${step.color}">${step.text}</span>`]);
      }, step.delay);
      timeouts.push(timeout);
    });

    const resetTimeout = setTimeout(() => {
      setLogs([]);
      setIsSimulating(false);
      setTimeout(() => setIsSimulating(true), 100);
    }, 9000);

    timeouts.push(resetTimeout);

    return () => timeouts.forEach(clearTimeout);
  }, [isSimulating]);

  const architectureDiagram = `
    graph TD
      classDef val fill:#fde047,stroke:#121212,stroke-width:4px,color:#121212,font-weight:bold
      classDef miner fill:#3b82f6,stroke:#121212,stroke-width:4px,color:#fff,font-weight:bold
      classDef chain fill:#ef4444,stroke:#121212,stroke-width:4px,color:#fff,font-weight:bold

      Val[Validator: Task Generator]:::val -->|Broadcast Synapse| Miner[Miner Pool]:::miner
      Miner -->|Commit Hash| Chain[Bittensor Chain]:::chain
      Miner -->|Reveal Solution| Val
      Val -->|Score & Set Weights| Chain
      Val -.->|Cross-Check| OtherVals[Other Validators]:::val
  `;

  return (
    <div className="min-h-screen pb-24 font-sans selection:bg-brand-yellow selection:text-black">
      {/* Navigation */}
      <nav className="border-b-4 border-black bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-brand-red border-2 border-black flex items-center justify-center brutal-shadow-hover">
                <Flame size={20} className="text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight uppercase">OpenArena</span>
            </div>
            <div className="flex space-x-4">
              <Link href="https://kaggleingest.com" target="_blank" className="hidden md:flex font-bold px-4 py-2 border-2 border-black bg-brand-yellow brutal-shadow-hover hover:-translate-y-1 items-center justify-center">
                KaggleIngest Portal
              </Link>
              <Link href="/whitepaper" className="font-bold px-4 py-2 border-2 border-black bg-black text-white brutal-shadow-hover hover:-translate-y-1 flex items-center justify-center">
                Read Whitepaper
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-24">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block px-4 py-2 bg-brand-yellow border-4 border-black font-bold mb-6 brutal-shadow rotate-1 transform">
              #1 BITTENSOR IDEATHON SUBMISSION
            </div>
            <div className="mb-6 border-4 border-black p-4 bg-brand-blue text-white brutal-shadow transform -rotate-1">
               <p className="font-bold text-lg md:text-xl uppercase">OpenArena — Live Bittensor Ideathon Submission</p>
               <p className="font-medium mt-2 text-md">Powered by <span className="font-black bg-brand-yellow text-black px-1 py-0.5">LiveBench-2026-01-08</span> (private delayed questions) + KaggleIngest</p>
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-none mb-6 tracking-tighter uppercase relative">
              The Truth <br />
              <span className="text-white text-shadow-solid relative inline-block">
                Machine
                <span className="absolute inset-0 text-white text-shadow-[4px_4px_0_#121212] -z-10">Machine</span>
              </span> <br />
              For AI.
            </h1>
            <p className="text-xl md:text-2xl font-medium mb-8 border-l-8 border-brand-red pl-6 py-2 bg-white brutual-border p-4 shadow-[4px_4px_0_#121212]">
              Static benchmarks are dead. Models memorize the test set. We built the first decentralized adversarial evaluation protocol to score <span className="font-bold underline decoration-brand-blue decoration-4">generalization</span>, not memorization.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="#network" className="flex items-center justify-center space-x-2 font-black text-lg px-8 py-4 border-4 border-black bg-brand-blue text-white brutal-shadow brutal-shadow-hover">
                <Terminal size={24} />
                <span>View Live Network</span>
              </Link>
              <Link href="https://youtu.be/_O0feQQ9lzM" target="_blank" className="flex items-center justify-center space-x-2 font-black text-lg px-8 py-4 border-4 border-black bg-white brutal-shadow brutal-shadow-hover">
                <Play size={24} />
                <span>Watch Demo</span>
              </Link>
              <Link href="#network" className="flex items-center justify-center space-x-2 font-black text-lg px-8 py-4 border-4 border-black bg-brand-yellow text-black brutal-shadow brutal-shadow-hover">
                <Cpu size={24} />
                <span>Submit your miner</span>
              </Link>
            </div>
          </motion.div>

          {/* Hero Graphic / Code Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="border-4 border-black bg-[#1E1E1E] brutal-shadow overflow-hidden flex flex-col h-[500px]"
          >
            <div className="bg-black text-white px-4 py-2 flex items-center justify-between border-b-4 border-black">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-brand-red border border-white"></div>
                <div className="w-3 h-3 rounded-full bg-brand-yellow border border-white"></div>
                <div className="w-3 h-3 rounded-full bg-brand-green border border-white"></div>
              </div>
              <span className="font-mono text-sm font-bold text-gray-400">mining_loop.rs</span>
            </div>
            <div className="p-6 font-mono text-sm md:text-md text-green-400 overflow-y-auto flex-1 h-full">
              <AnimatePresence>
                {logs.map((log, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-2"
                    dangerouslySetInnerHTML={{ __html: log }}
                  />
                ))}
              </AnimatePresence>
              <p className="text-white animate-pulse mt-2">_</p>
            </div>
          </motion.div>
        </div>

        {/* The Protocol Section */}
        <div className="mb-24">
          <h2 className="text-4xl md:text-6xl font-black uppercase mb-12 text-center border-b-8 border-black pb-4 inline-block mx-auto">
            How The Protocol Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border-4 border-black brutal-shadow brutal-shadow-hover">
              <div className="w-16 h-16 bg-brand-yellow border-4 border-black flex items-center justify-center mb-6 brutal-shadow transform -rotate-3">
                <Database size={32} />
              </div>
              <h3 className="text-2xl font-black uppercase mb-4">1. Livebench Task Generation</h3>
              <p className="text-lg font-medium">Validators act as &quot;Game Masters,&quot; pulling verified, contamination-free tasks from the <strong>LiveBench</strong> dataset every epoch. No static datasets. No memorization.</p>
            </div>
            <div className="bg-white p-8 border-4 border-black brutal-shadow brutal-shadow-hover">
              <div className="w-16 h-16 bg-brand-blue text-white border-4 border-black flex items-center justify-center mb-6 brutal-shadow transform rotate-3">
                <Cpu size={32} />
              </div>
              <h3 className="text-2xl font-black uppercase mb-4">2. Miner Inference Loop</h3>
              <p className="text-lg font-medium">Miners receive the prompt and must instantly generalize. We utilize a cryptographic Commit-Reveal scheme to prevent front-running.</p>
            </div>
            <div className="bg-white p-8 border-4 border-black brutal-shadow brutal-shadow-hover">
              <div className="w-16 h-16 bg-brand-green text-black border-4 border-black flex items-center justify-center mb-6 brutal-shadow">
                <ShieldAlert size={32} />
              </div>
              <h3 className="text-2xl font-black uppercase mb-4">3. Brier Scoring Consensus</h3>
              <p className="text-lg font-medium">Validators grade solutions using strict Brier Scores that penalize &quot;hallucination&quot; and heavily reward well-calibrated confidence and correctness.</p>
            </div>
          </div>
        </div>

        {/* Architecture Section */}
        <div className="mb-24 bg-white border-4 border-black brutal-shadow p-8">
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-8 text-center bg-brand-yellow inline-block px-4 py-2 border-4 border-black transform -rotate-1 brutal-shadow">
            System Architecture
          </h2>
          <div className="w-full overflow-x-auto">
            <Mermaid chart={architectureDiagram} />
          </div>
        </div>

        {/* Live Dashboard/Leaderboard Section */}
        <div id="network" className="mb-24 scroll-mt-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-black uppercase mb-2">Live Miner Leaderboard</h2>
              <p className="text-xl font-bold bg-black text-white px-3 py-1 inline-block">Epoch 4829 • Generalization Score (S)</p>
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0">
              <button
                onClick={() => setActiveTab('live')}
                className={`px-6 py-2 font-bold border-4 border-black brutal-shadow-hover ${activeTab === 'live' ? 'bg-brand-red text-white' : 'bg-white'}`}
              >
                Top Miners
              </button>
              <button
                onClick={() => setActiveTab('validators')}
                className={`px-6 py-2 font-bold border-4 border-black brutal-shadow-hover ${activeTab === 'validators' ? 'bg-brand-yellow text-black' : 'bg-white'}`}
              >
                Validators
              </button>
            </div>
          </div>

          <div className="bg-white border-4 border-black brutal-shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-black text-white text-lg font-bold uppercase border-b-4 border-black">
                    <th className="p-4 border-r-4 border-black">Rank</th>
                    <th className="p-4 border-r-4 border-black">Miner UID / Coldkey</th>
                    <th className="p-4 border-r-4 border-black bg-brand-blue text-white">Generalization (S)</th>
                    <th className="p-4 border-r-4 border-black">Accuracy</th>
                    <th className="p-4">Calibration</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-lg font-medium">
                  {[
                    { rank: 1, uid: "4091", key: "5HeR...x9P", score: "0.942", acc: "96.4%", cal: "0.02 Brier", bg: "bg-brand-yellow" },
                    { rank: 2, uid: "882", key: "5Ca1...yZ2", score: "0.915", acc: "94.1%", cal: "0.05 Brier", bg: "bg-white" },
                    { rank: 3, uid: "1104", key: "5Ff9...kK1", score: "0.889", acc: "90.2%", cal: "0.08 Brier", bg: "bg-white" },
                    { rank: 4, uid: "77", key: "5Jj2...pQ8", score: "0.851", acc: "88.7%", cal: "0.11 Brier", bg: "bg-gray-100" },
                    { rank: 5, uid: "305", key: "5Oo4...rR5", score: "0.812", acc: "85.0%", cal: "0.15 Brier", bg: "bg-gray-100" },
                  ].map((row, i) => (
                    <tr key={i} className={`border-b-4 border-black hover:bg-gray-200 transition-colors ${row.bg}`}>
                      <td className="p-4 border-r-4 border-black font-black text-xl text-center">{row.rank}</td>
                      <td className="p-4 border-r-4 border-black flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full border-2 border-black bg-gradient-to-tr from-brand-red to-brand-yellow"></div>
                        <span>UID: {row.uid} <span className="text-sm text-gray-500">[{row.key}]</span></span>
                      </td>
                      <td className="p-4 border-r-4 border-black text-brand-blue font-black">{row.score}</td>
                      <td className="p-4 border-r-4 border-black text-green-600 font-bold">{row.acc}</td>
                      <td className="p-4 text-brand-red font-bold">{row.cal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* KaggleIngest Promo */}
        <div className="bg-brand-red text-white border-4 border-black brutal-shadow p-8 md:p-12 mb-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-20 transform rotate-12">
            <Users size={120} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-6">The Unfair Advantage:<br/>KaggleIngest</h2>
            <p className="text-xl font-medium mb-8">
              Most subnets fail because they lack skilled miners. We solve this by bridging the 15M+ data scientists from Kaggle directly into the OpenArena ecosystem.
            </p>
            <div className="bg-black p-4 inline-flex items-center space-x-4 border-4 border-white brutal-shadow transform -rotate-2">
              <span className="font-mono text-brand-yellow font-bold text-lg">{`!pip install openarena-kaggle`}</span>
              <CheckCircle2 className="text-brand-green" />
            </div>
            <p className="mt-6 text-lg font-bold underline decoration-brand-yellow decoration-4 underline-offset-4">Cold Start Solved. Instant liquidity of intelligence.</p>
          </div>
        </div>

      </main>
    </div>
  );
}
