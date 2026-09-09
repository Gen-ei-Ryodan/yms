import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatShortDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    super_admin: "Super Admin",
    admin: "Admin",
    teacher: "Teacher",
    student: "Student",
    parent: "Parent",
  };
  return labels[role] || role;
}

export function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    super_admin: "bg-red-100 text-red-800",
    admin: "bg-purple-100 text-purple-800",
    teacher: "bg-blue-100 text-blue-800",
    student: "bg-green-100 text-green-800",
    parent: "bg-yellow-100 text-yellow-800",
  };
  return colors[role] || "bg-gray-100 text-gray-800";
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-800",
    INACTIVE: "bg-gray-100 text-gray-800",
    SUSPENDED: "bg-yellow-100 text-yellow-800",
    GRADUATED: "bg-blue-100 text-blue-800",
    TRANSFERRED: "bg-indigo-100 text-indigo-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-100 text-gray-800",
    COMPLETED: "bg-blue-100 text-blue-800",
    DROPPED: "bg-red-100 text-red-800",
    ON_LEAVE: "bg-orange-100 text-orange-800",
    PRESENT: "bg-green-100 text-green-800",
    LATE: "bg-yellow-100 text-yellow-800",
    ABSENT: "bg-red-100 text-red-800",
    EXCUSED: "bg-blue-100 text-blue-800",
    PAID: "bg-green-100 text-green-800",
    UNPAID: "bg-yellow-100 text-yellow-800",
    OVERDUE: "bg-red-100 text-red-800",
    DRAFT: "bg-gray-100 text-gray-800",
    PARTIAL: "bg-orange-100 text-orange-800",
    FULL: "bg-purple-100 text-purple-800",
    EXPIRED: "bg-red-100 text-red-800",
    FULFILLED: "bg-green-100 text-green-800",
    USED: "bg-blue-100 text-blue-800",
    AVAILABLE: "bg-green-100 text-green-800",
    MAINTENANCE: "bg-orange-100 text-orange-800",
    LEAVE: "bg-purple-100 text-purple-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export function truncate(text: string, length: number = 50): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}