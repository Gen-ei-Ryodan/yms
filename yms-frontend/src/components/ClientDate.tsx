"use client";

import { useEffect, useState } from "react";

export function ClientDate({ date, format = "datetime" }: { date: string | Date; format?: "date" | "datetime" | "time" }) {
  const [formatted, setFormatted] = useState("");

  useEffect(() => {
    const d = new Date(date);
    if (format === "date") {
      setFormatted(d.toLocaleDateString("id-ID"));
    } else if (format === "time") {
      setFormatted(d.toLocaleTimeString("id-ID"));
    } else {
      setFormatted(d.toLocaleString("id-ID"));
    }
  }, [date, format]);

  return <>{formatted}</>;
}

export function ClientNumber({ value, prefix }: { value?: number; prefix?: string }) {
  const [formatted, setFormatted] = useState("");

  useEffect(() => {
    if (value == null) return;
    setFormatted(value.toLocaleString("id-ID"));
  }, [value]);

  return <>{prefix}{formatted}</>;
}
