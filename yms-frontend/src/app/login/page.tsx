"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Music } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-paper px-4 py-12">
      {/* Decorative background shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute -bottom-48 -left-24 h-[500px] w-[500px] rounded-full bg-gold/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/[0.02] blur-2xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo & Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-ink shadow-lift">
            <Music className="h-8 w-8 text-gold" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
            Yamaha Music School
          </h1>
          <p className="mt-1 text-sm text-slate">
            Sistem Manajemen Sekolah Musik
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-ink/10 bg-white/80 p-8 shadow-card backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="font-mono text-xs font-medium uppercase tracking-wider text-ink-mute"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@contoh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 rounded-xl border-ink/15 bg-paper/50 px-4 text-sm text-ink placeholder:text-slate-soft focus:border-gold focus:ring-gold/30"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="font-mono text-xs font-medium uppercase tracking-wider text-ink-mute"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 rounded-xl border-ink/15 bg-paper/50 px-4 text-sm text-ink placeholder:text-slate-soft focus:border-gold focus:ring-gold/30"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-ember/20 bg-ember/5 px-4 py-3 text-sm font-medium text-ember">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-xl bg-ink text-sm font-semibold text-paper shadow-lift transition-all hover:bg-ink-soft hover:shadow-card focus:ring-2 focus:ring-gold/40 disabled:opacity-50"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Memproses…" : "Masuk"}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-soft">
          Butuh bantuan?{" "}
          <a
            href="https://wa.me/62811290689"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-gold-deep underline decoration-gold/30 underline-offset-2 transition-colors hover:text-gold hover:decoration-gold"
          >
            Hubungi Admin
          </a>
        </p>
      </div>
    </div>
  );
}
