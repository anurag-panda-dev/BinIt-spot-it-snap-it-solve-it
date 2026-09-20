"use client";

import { Bot, ChevronRight, Leaf, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useState } from "react";

const SUGGESTIONS = [
    "How do I report a dump?",
    "What does the AI detect?",
    "Is my location private?",
];

const ANSWERS: Record<string, string> = {
    "How do I report a dump?": "Tap Report waste, add one photo, and confirm the map pin. Binit classifies the material, scores urgency, and sends it to the right crew.",
    "What does the AI detect?": "Binit recognises 11 waste types, including plastic, organic, e-waste and hazardous waste. Low-confidence results are always sent for human review.",
    "Is my location private?": "Yes. Public maps fuzz citizen locations to a neighbourhood level. Only authorised operations teams see exact coordinates for dispatch.",
};

export function CivicCopilot() {
    const [open, setOpen] = useState(false);
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState<{ from: "bot" | "user"; text: string }[]>([
        { from: "bot", text: "Hi! I’m Binit Copilot. I can help you report waste or understand how the clean-up loop works." },
    ]);

    const ask = (text: string) => {
        const answer = ANSWERS[text] || "I can help with reporting waste, AI classification, privacy, and tracking a clean-up. Try one of the suggestions below.";
        setMessages((current) => [...current, { from: "user", text }, { from: "bot", text: answer }]);
        setQuestion("");
    };

    return (
        <>
            {open && (
                <div className="fixed bottom-24 right-5 z-50 w-[min(380px,calc(100vw-2.5rem))] overflow-hidden rounded-3xl border border-white/10 bg-[#0b1d14]/95 shadow-2xl shadow-black/40 backdrop-blur-2xl">
                    <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-5 py-4">
                        <div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-xl bg-forest-500/20 text-forest-300"><Bot className="size-5" /></span><div><p className="text-sm font-bold text-white">Binit Copilot</p><p className="text-[11px] text-forest-100/50">Civic guidance, instantly</p></div></div>
                        <button onClick={() => setOpen(false)} aria-label="Close Copilot" className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white"><X className="size-4" /></button>
                    </div>
                    <div className="max-h-72 space-y-3 overflow-y-auto p-4">
                        {messages.map((message, index) => <div key={index} className={`flex ${message.from === "user" ? "justify-end" : "justify-start"}`}><p className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${message.from === "user" ? "bg-forest-500 text-white" : "bg-white/[0.06] text-forest-100/75"}`}>{message.text}</p></div>)}
                    </div>
                    <div className="flex flex-wrap gap-1.5 px-4 pb-3">{SUGGESTIONS.map((suggestion) => <button key={suggestion} onClick={() => ask(suggestion)} className="rounded-full bg-white/[0.05] px-2.5 py-1.5 text-[10px] text-forest-100/60 ring-1 ring-white/10 transition hover:bg-forest-500/15 hover:text-forest-200">{suggestion}</button>)}</div>
                    <form onSubmit={(event) => { event.preventDefault(); if (question.trim()) ask(question.trim()); }} className="flex gap-2 border-t border-white/10 p-3"><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about Binit…" className="min-w-0 flex-1 rounded-xl bg-white/[0.06] px-3 py-2 text-xs text-white outline-none placeholder:text-white/30" /><button aria-label="Send question" className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-forest-500 text-white transition hover:bg-forest-400"><Send className="size-3.5" /></button></form>
                </div>
            )}
            <button onClick={() => setOpen((value) => !value)} className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-3 text-sm font-bold text-white shadow-glow-forest transition hover:-translate-y-0.5 hover:brightness-110" aria-label="Open Binit Copilot"><Sparkles className="size-4" /> Copilot <MessageCircle className="size-4" /></button>
        </>
    );
}

export function AIStatusPill() {
    return <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-500/10 px-3 py-1.5 text-[11px] font-semibold text-forest-300 ring-1 ring-forest-500/25"><span className="size-1.5 rounded-full bg-forest-400 shadow-[0_0_10px_#4cbb7f]" /> AI engine online <Leaf className="size-3" /></span>;
}

export function ArrowPill() { return <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />; }