"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

export default function SearchAdmin() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    
    // Gunakan startTransition agar Next.js tidak nge-block UI saat routing
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div style={s.container}>
      <span style={s.icon}>🔍</span>
      <input
        type="text"
        placeholder="Cari berdasarkan nama pelapor atau lokasi..."
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
        style={s.input}
      />
      {isPending && <span style={s.spinner}>⏳</span>}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    padding: "8px 16px",
    width: "100%",
    maxWidth: "400px",
    marginBottom: "20px",
    position: "relative",
  },
  icon: {
    marginRight: "8px",
    color: "#6b7280",
  },
  input: {
    border: "none",
    outline: "none",
    width: "100%",
    fontSize: "14px",
    color: "#111827",
  },
  spinner: {
    marginLeft: "8px",
    fontSize: "14px",
  }
};