import { motion } from "framer-motion";
import { Navigation, Sparkles, ShieldCheck } from "lucide-react";
import { inferSource, classifySource, type SensorReading } from "@/lib/hppe/data";

export function SourceInference({ r }: { r: SensorReading }) {
  const inf = inferSource(r);
  const cls = classifySource(r);
  return (
    <div className="glass rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">AI Source Inference</h3>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Engine v2.1</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-28 h-28 rounded-full border border-primary/30 grid-bg flex items-center justify-center">
          <motion.div
            className="absolute inset-3 rounded-full border border-primary/40"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          />
          <motion.div
            initial={false}
            animate={{ rotate: inf.bearing }}
            transition={{ type: "spring", stiffness: 80 }}
            className="absolute inset-0 flex items-start justify-center pt-2"
          >
            <Navigation className="w-6 h-6 text-primary fill-primary" />
          </motion.div>
          <div className="text-center">
            <div className="text-2xl font-bold tabular-nums text-gradient">{inf.bearing}°</div>
            <div className="text-[9px] uppercase text-muted-foreground">bearing</div>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="text-xs text-muted-foreground">Probable source</div>
          <div className="font-semibold">{inf.industry?.name}</div>
          <div className="text-xs text-muted-foreground">{inf.industry?.type}</div>
          <div className="pt-2">
            <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
              <span>Confidence</span>
              <span className="font-mono text-primary">{inf.confidence}%</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: 0 }}
                animate={{ width: `${inf.confidence}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
          <ShieldCheck className="w-3 h-3" /> Reasoning chain
        </div>
        {inf.reasoning.map((line, i) => (
          <div key={i} className="text-xs flex gap-2">
            <span className="text-primary font-mono">{(i + 1).toString().padStart(2, "0")}</span>
            <span className="text-muted-foreground">{line}</span>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-border/40 space-y-2">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Source Classification</div>
        {cls.slice(0, 3).map((c) => (
          <div key={c.label} className="text-xs">
            <div className="flex justify-between">
              <span>{c.label}</span>
              <span className="font-mono text-muted-foreground">{Math.round(c.probability * 100)}%</span>
            </div>
            <div className="h-1 bg-secondary rounded-full overflow-hidden mt-0.5">
              <div className="h-full bg-primary/70" style={{ width: `${c.probability * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}