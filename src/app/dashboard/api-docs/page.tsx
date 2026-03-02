"use client";

import { useState } from "react";
import { Search, Code, ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { API_ENDPOINTS } from "@/features/api-docs/constants";
import { EndpointTable } from "@/features/api-docs/components/endpoint-table";
import { CategoryFilter } from "@/features/api-docs/components/category-filter";

export default function ApiDocsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = Array.from(new Set(API_ENDPOINTS.map((ep) => ep.category))).sort();

  const filteredEndpoints = API_ENDPOINTS.filter((ep) => {
    const matchesSearch =
      ep.path.toLowerCase().includes(search.toLowerCase()) ||
      ep.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || ep.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ── Header ────────────────────────────────────── */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-primary font-semibold tracking-wide uppercase text-[10px]">
            <Code className="h-3 w-3" />
            Developer Reference
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">API Documentation</h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Integrate with our platform using our RESTful API. Below is a comprehensive list of
            core endpoints available for external and internal use.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/swagger" target="_blank">
            <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5">
              <ExternalLink className="h-4 w-4" />
              Open Swagger UI
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Security Callout ──────────────────────────── */}
      <div className="flex items-start gap-4 p-5 rounded-2xl border border-blue-500/10 bg-blue-500/5 backdrop-blur-sm">
        <div className="bg-blue-500/10 rounded-xl p-2.5">
          <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="font-heading text-sm font-semibold text-blue-900 dark:text-blue-200">Security & Authentication</p>
          <p className="mt-1 text-xs text-blue-800/70 dark:text-blue-300/60 leading-relaxed max-w-3xl">
            All protected endpoints require a valid session or an API Key passed in the <code className="bg-blue-500/10 px-1 rounded">Authorization</code> header.
            Admins and SuperAdmins have elevated access to specific management endpoints.
          </p>
        </div>
      </div>

      {/* ── Filter Controls ───────────────────────────── */}
      <div className="space-y-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by path or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 bg-background/50 border-border/40 focus:border-primary/40 focus:ring-primary/10 transition-all rounded-xl shadow-sm"
          />
        </div>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* ── Table Implementation ──────────────────────── */}
      <EndpointTable endpoints={filteredEndpoints} />

      <div className="pt-10 border-t border-border/40">
        <p className="text-xs text-muted-foreground text-center">
          For full request/response schemas and interactive testing, please refer to the <Link href="/swagger" className="text-primary hover:underline font-semibold">Swagger Documentation</Link>.
        </p>
      </div>
    </div>
  );
}
