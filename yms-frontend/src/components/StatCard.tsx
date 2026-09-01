import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: any;
  color?: "blue" | "green" | "red" | "yellow" | "purple" | "orange";
}

export function StatCard({ title, value, icon, color = "blue" }: StatCardProps) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
    green: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400",
    red: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400",
    yellow: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400",
    orange: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400",
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center", colorClasses[color])}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}