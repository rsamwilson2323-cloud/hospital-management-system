import { useState } from "react";
import { Link } from "wouter";
import { useGetDashboardStats, useGetRevenueStats, useGetAppointmentTrends, useGetDoctorStats, useGetRecentActivity } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Stethoscope, Calendar, Receipt, AlertTriangle, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: revenue, isLoading: revenueLoading } = useGetRevenueStats();
  const { data: trends, isLoading: trendsLoading } = useGetAppointmentTrends();
  const { data: doctorStats, isLoading: docStatsLoading } = useGetDoctorStats();
  const { data: activities, isLoading: activitiesLoading } = useGetRecentActivity();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Overview of hospital operations and key metrics.</p>
      </div>

      {statsLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPatients}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDoctors}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayAppointments}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.pendingAppointments} pending, {stats.completedAppointments} completed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">{stats.pendingBills} pending bills</p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue and bills count.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {revenueLoading ? (
              <Skeleton className="w-full h-full" />
            ) : revenue && revenue.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenue}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" fill="hsl(var(--primary))" name="Revenue ($)" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="bills" fill="hsl(var(--chart-2))" name="Bills" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Appointment Trends</CardTitle>
            <CardDescription>Daily appointments over time.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {trendsLoading ? (
              <Skeleton className="w-full h-full" />
            ) : trends && trends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="scheduled" stroke="hsl(var(--chart-4))" strokeWidth={2} name="Scheduled" />
                  <Line type="monotone" dataKey="completed" stroke="hsl(var(--chart-3))" strokeWidth={2} name="Completed" />
                  <Line type="monotone" dataKey="cancelled" stroke="hsl(var(--destructive))" strokeWidth={2} name="Cancelled" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Doctor Workload</CardTitle>
            <CardDescription>Appointments and patient load per doctor.</CardDescription>
          </CardHeader>
          <CardContent>
            {docStatsLoading ? (
              <Skeleton className="w-full h-[200px]" />
            ) : doctorStats && doctorStats.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                    <tr>
                      <th className="px-4 py-3">Doctor</th>
                      <th className="px-4 py-3">Specialization</th>
                      <th className="px-4 py-3 text-right">Patients</th>
                      <th className="px-4 py-3 text-right">Total Appts</th>
                      <th className="px-4 py-3 text-right">Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctorStats.map((doc) => (
                      <tr key={doc.doctorId} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-3 font-medium text-foreground">
                          <Link href={`/doctors/${doc.doctorId}`} className="hover:underline">{doc.doctorName}</Link>
                        </td>
                        <td className="px-4 py-3">{doc.specialization}</td>
                        <td className="px-4 py-3 text-right">{doc.patients}</td>
                        <td className="px-4 py-3 text-right">{doc.totalAppointments}</td>
                        <td className="px-4 py-3 text-right text-green-600 font-medium">{doc.completedAppointments}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : activities && activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((act) => (
                  <div key={act.id} className="flex items-start space-x-3">
                    <div className="bg-muted p-2 rounded-full mt-0.5">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">{act.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(act.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center text-muted-foreground">No recent activity</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
