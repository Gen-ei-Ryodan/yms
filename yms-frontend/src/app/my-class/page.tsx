"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, GraduationCap, Clock, MapPin, User, BookOpen, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MyClassPage() {
  const { user } = useAuth();
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyClass = async () => {
      try {
        const studentId = user?.student?.id;
        if (studentId) {
          const response = await axios.get("/enrollments", {
            params: { student_id: studentId, status: "ACTIVE", per_page: 1 },
          });
          setEnrollment(response.data.data[0] || null);
        }
      } catch (error) {
        console.error("Failed to fetch my class:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyClass();
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Class</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your current class information</p>
        </div>

        {enrollment ? (
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">{enrollment.class?.course?.name}</h3>
                <p className="text-gray-500">{enrollment.class?.class_code} · {enrollment.class?.level?.name}</p>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Teacher: {enrollment.class?.teacher?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Room: {enrollment.class?.room?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Start: {enrollment.start_date}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Capacity: {enrollment.class?.capacity}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8 text-center">
            <GraduationCap className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">No active class enrollment</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
