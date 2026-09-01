import { cn } from "@/lib/utils";
import { Music2 } from "lucide-react";

interface SidebarProps {
  role: string;
  isOpen: boolean;
  onClose: () => void;
}

const menuItems: Record<string, { label: string; href: string; icon: string }[]> = {
  super_admin: [
    { label: "Dashboard", href: "/dashboard", icon: "📊" },
    { label: "Students", href: "/students", icon: "🎓" },
    { label: "Guardians", href: "/guardians", icon: "👨‍👩‍👧" },
    { label: "Membership", href: "/memberships", icon: "📋" },
    { label: "Teachers", href: "/teachers", icon: "👨‍🏫" },
    { label: "Courses", href: "/courses", icon: "🎹" },
    { label: "Levels", href: "/levels", icon: "📈" },
    { label: "Classes", href: "/classes", icon: "🏫" },
    { label: "Enrollments", href: "/enrollments", icon: "📝" },
    { label: "Schedules", href: "/schedules", icon: "⏰" },
    { label: "Rooms", href: "/rooms", icon: "🚪" },
    { label: "Attendance", href: "/attendance", icon: "✅" },
    { label: "Teacher Attendance", href: "/teacher-attendance", icon: "📅" },
    { label: "Tuition", href: "/tuition", icon: "💰" },
    { label: "Subscriptions", href: "/subscriptions", icon: "💳" },
    { label: "Invoices", href: "/invoices", icon: "🧾" },
    { label: "Payments", href: "/payments", icon: "💵" },
    { label: "Loyalty", href: "/loyalty", icon: "⭐" },
    { label: "Rewards", href: "/rewards", icon: "🎁" },
    { label: "Redemptions", href: "/redemptions", icon: "🔄" },
    { label: "Vouchers", href: "/vouchers", icon: "🎫" },
    { label: "Leaves", href: "/leaves", icon: " Vacation" },
    { label: "Transfers", href: "/transfers", icon: "🔄" },
    { label: "Reports", href: "/reports", icon: "📊" },
    { label: "Settings", href: "/settings", icon: "⚙️" },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard", icon: "📊" },
    { label: "Students", href: "/students", icon: "🎓" },
    { label: "Guardians", href: "/guardians", icon: "👨‍👩‍👧" },
    { label: "Membership", href: "/memberships", icon: "📋" },
    { label: "Teachers", href: "/teachers", icon: "👨‍🏫" },
    { label: "Courses", href: "/courses", icon: "🎹" },
    { label: "Levels", href: "/levels", icon: "📈" },
    { label: "Classes", href: "/classes", icon: "🏫" },
    { label: "Enrollments", href: "/enrollments", icon: "📝" },
    { label: "Schedules", href: "/schedules", icon: "⏰" },
    { label: "Rooms", href: "/rooms", icon: "🚪" },
    { label: "Attendance", href: "/attendance", icon: "✅" },
    { label: "Teacher Attendance", href: "/teacher-attendance", icon: "📅" },
    { label: "Tuition", href: "/tuition", icon: "💰" },
    { label: "Subscriptions", href: "/subscriptions", icon: "💳" },
    { label: "Invoices", href: "/invoices", icon: "🧾" },
    { label: "Payments", href: "/payments", icon: "💵" },
    { label: "Loyalty", href: "/loyalty", icon: "⭐" },
    { label: "Rewards", href: "/rewards", icon: "🎁" },
    { label: "Redemptions", href: "/redemptions", icon: "🔄" },
    { label: "Vouchers", href: "/vouchers", icon: "🎫" },
    { label: "Leaves", href: "/leaves", icon: " Vacation" },
    { label: "Transfers", href: "/transfers", icon: "🔄" },
    { label: "Reports", href: "/reports", icon: "📊" },
  ],
  teacher: [
    { label: "Dashboard", href: "/dashboard", icon: "📊" },
    { label: "My Classes", href: "/my-classes", icon: "🏫" },
    { label: "My Schedule", href: "/my-schedule", icon: "⏰" },
    { label: "Student List", href: "/students", icon: "🎓" },
    { label: "Attendance", href: "/attendance", icon: "✅" },
    { label: "Attendance History", href: "/attendance-history", icon: "📅" },
  ],
  student: [
    { label: "Dashboard", href: "/dashboard", icon: "📊" },
    { label: "My Profile", href: "/profile", icon: "👤" },
    { label: "My Class", href: "/my-class", icon: "🏫" },
    { label: "Attendance", href: "/attendance", icon: "✅" },
    { label: "Payment", href: "/payments", icon: "💳" },
    { label: "Loyalty", href: "/loyalty", icon: "⭐" },
    { label: "Rewards", href: "/rewards", icon: "🎁" },
    { label: "Requests", href: "/requests", icon: "📝" },
    { label: "Notifications", href: "/notifications", icon: "🔔" },
  ],
};

export function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const items = menuItems[role] || menuItems.student;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center gap-2 p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <Music2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Yamaha</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Music School</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <a href="/profile" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                U
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">User</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {role.replace("_", " ")}
              </p>
            </div>
          </a>
        </div>
      </aside>
    </>
  );
}