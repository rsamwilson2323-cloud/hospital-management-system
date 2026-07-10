import { useGetDashboardStats, useGetRevenueStats, useGetAppointmentTrends, useGetDoctorStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, AreaChart, Area } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: revenue, isLoading: revenueLoading } = useGetRevenueStats();
  const { data: trends, isLoading: trendsLoading } = useGetAppointmentTrends();
  const { data: doctorStats, isLoading: docStatsLoading } = useGetDoctorStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Analytics & Reports</h2>
          <p className="text-muted-foreground">Comprehensive insights into hospital performance.</p>
        </div>
        <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export Report</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-primary text-primary-foreground border-primary">
          <CardContent className="p-6">
            <p className="text-primary-foreground/80 text-sm font-medium mb-1">Total Revenue (YTD)</p>
            {statsLoading ? <Skeleton className="h-8 w-24 bg-primary-foreground/20" /> : (
              <h3 className="text-3xl font-bold">${stats?.totalRevenue.toLocaleString() || 0}</h3>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground text-sm font-medium mb-1">Total Patients</p>
            {statsLoading ? <Skeleton className="h-8 w-24" /> : (
              <h3 className="text-3xl font-bold">{stats?.totalPatients || 0}</h3>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground text-sm font-medium mb-1">Total Appointments</p>
            {statsLoading ? <Skeleton className="h-8 w-24" /> : (
              <h3 className="text-3xl font-bold">{stats?.completedAppointments || 0} <span className="text-sm font-normal text-muted-foreground">completed</span></h3>
            )}
          </CardContent>
        </Card>
        <Card className={stats?.lowStockMedicines && stats.lowStockMedicines > 0 ? "border-amber-200 bg-amber-50 dark:bg-amber-900/10" : ""}>
          <CardContent className="p-6">
            <p className="text-muted-foreground text-sm font-medium mb-1">Pharmacy Alerts</p>
            {statsLoading ? <Skeleton className="h-8 w-24" /> : (
              <h3 className={`text-3xl font-bold ${stats?.lowStockMedicines && stats.lowStockMedicines > 0 ? "text-amber-600" : ""}`}>
                {stats?.lowStockMedicines || 0} <span className="text-sm font-normal text-muted-foreground">items low</span>
              </h3>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Financial Performance</CardTitle>
            <CardDescription>Monthly revenue breakdown.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {revenueLoading ? (
              <Skeleton className="w-full h-full" />
            ) : revenue && revenue.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clinical Volume</CardTitle>
            <CardDescription>Appointments over time.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {trendsLoading ? (
              <Skeleton className="w-full h-full" />
            ) : trends && trends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Line type="monotone" dataKey="scheduled" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Scheduled" />
                  <Line type="monotone" dataKey="completed" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Completed" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Doctor Performance</CardTitle>
          <CardDescription>Patient load and appointment completion rates per physician.</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          {docStatsLoading ? (
            <Skeleton className="w-full h-full" />
          ) : doctorStats && doctorStats.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={doctorStats} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="doctorName" type="category" width={150} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                />
                <Legend />
                <Bar dataKey="completedAppointments" stackId="a" fill="hsl(var(--chart-1))" name="Completed" radius={[0, 0, 0, 0]} />
                <Bar dataKey="totalAppointments" stackId="a" fill="hsl(var(--muted))" name="Total Scheduled" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">No data available</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
