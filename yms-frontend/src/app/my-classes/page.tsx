"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, GraduationCap, BookOpen, User, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MyClassesPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const teacherId = user?.teacher?.id;
        if (teacherId) {
          const response = await axios.get("/classes", { params: { teacher_id: teacherId, per_page: 50 } });
          setClasses(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [user]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Classes</h1>
          <p className="text-gray-500 dark:text-gray-400">Classes assigned to you</p>
        </div>

        {classes.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8 text-center">
            <GraduationCap className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">No classes assigned</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classes.map((c) => (
              <div key={c.id} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold">{c.course?.name}</h3>
                    <p className="text-sm text-gray-500">{c.class_code} · {c.level?.name}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">{c.status}</Badge>
                </div>
                <div className="mt-3 space-y-1 text-sm text-gray-500">
                  <p className="flex items-center gap-1"><MapPin className="h-3 w-3" />{c.room?.name} (Cap: {c.capacity})</p>
                  <p className="flex items-center gap-1"><Users className="h-3 w-3" />{c.enrolled_count || 0} students</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

function MapPin({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
}

function Users({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 8.292M15 21H3a4 4 0 01-4-4V5a4 4 0 014-4h8a4 4 0 014 4v8a4 4 0 01-4 4z" /></svg>;
}
