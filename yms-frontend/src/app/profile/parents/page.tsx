"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, Users, Phone, Mail, MapPin } from "lucide-react";

export default function ParentProfilePage() {
  const { user } = useAuth();
  const [guardians, setGuardians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuardians = async () => {
      try {
        const studentId = user?.student?.id;
        if (studentId) {
          const response = await axios.get(`/students/${studentId}`);
          setGuardians(response.data.data?.guardians || []);
        }
      } catch (error) {
        console.error("Failed to fetch guardians:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGuardians();
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
          <h1 className="text-2xl font-bold text-gray-900">Data Orang Tua / Wali</h1>
          <p className="text-sm text-gray-500 mt-1">Your guardian information</p>
        </div>

        {guardians.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guardians.map((g) => (
              <div key={g.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{g.name}</h3>
                    <p className="text-sm text-gray-500">{g.relationship}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  {g.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" /> {g.phone}
                    </div>
                  )}
                  {g.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" /> {g.email}
                    </div>
                  )}
                  {g.address && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" /> {g.address}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">Belum ada data orang tua / wali</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
