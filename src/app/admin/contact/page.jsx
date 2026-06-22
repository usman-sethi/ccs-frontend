"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Mail, RefreshCw, Search, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getContactMessages, updateContactMessage } from "@/lib/api";
import { DEMO_CONTACT_MESSAGES } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

const STATUS_VARIANTS = { new: "default", read: "secondary", archived: "outline" };

export default function AdminContactPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);
  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getContactMessages();
      setMessages(data);
      setUsingDemo(false);
    } catch {
      setMessages(DEMO_CONTACT_MESSAGES);
      setUsingDemo(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    if (usingDemo) {
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, status } : m));
      return;
    }
    try {
      await updateContactMessage(id, { status });
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, status } : m));
    } catch (e) {
      toast.error("Failed to update status", { description: e.message });
    }
  };

  const filtered = messages.filter((m) => {
    const s = q.toLowerCase();
    return !s || m.name?.toLowerCase().includes(s) || m.email?.toLowerCase().includes(s) || m.subject?.toLowerCase().includes(s);
  });

  const newCount = messages.filter((m) => m.status === "new").length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Contact messages</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{newCount} unread</p>
        </div>
        <Button size="sm" variant="outline" onClick={load} disabled={loading}>
          <RefreshCw className={`size-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {usingDemo && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
          <WifiOff className="size-4 shrink-0" />
          <span>Backend not connected — showing demo data.</span>
        </div>
      )}

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search messages…" className="pl-9" />
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Mail} title="No messages yet"
          description="Contact form submissions will appear here." />
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => (
            <div key={m.id}
              className={cn("rounded-xl border bg-card overflow-hidden transition-colors",
                m.status === "new" ? "border-primary/40" : "border-border")}>
              <button type="button"
                className="flex w-full items-start gap-4 px-5 py-4 text-left hover:bg-accent/30"
                onClick={() => {
                  setExpanded((p) => p === m.id ? null : m.id);
                  if (m.status === "new") updateStatus(m.id, "read");
                }}>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{m.name}</p>
                    <Badge variant={STATUS_VARIANTS[m.status] ?? "secondary"} className="text-[10px]">
                      {m.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.email}</p>
                  <p className="text-sm font-medium mt-1 truncate">{m.subject}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : ""}
                </span>
              </button>

              {expanded === m.id && (
                <div className="border-t border-border px-5 py-4 space-y-3">
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{m.message}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <a href={`mailto:${m.email}`} className="text-xs text-primary hover:underline">
                      Reply to {m.email}
                    </a>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Status:</span>
                      <Select value={m.status} onValueChange={(v) => updateStatus(m.id, v)}>
                        <SelectTrigger className="h-7 w-28 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="read">Read</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
