import { useParams, Link } from "wouter";
import { useGetDoctor, useListAppointments } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Award, Clock, Phone, Mail, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DoctorDetail() {
  const { id } = useParams();
  const doctorId = parseInt(id || "0", 10);
  
  const { data: doctor, isLoading: doctorLoading } = useGetDoctor(doctorId);
  const { data: appointments, isLoading: apptsLoading } = useListAppointments({ doctorId });

  if (doctorLoading) {
    return <div className="space-y-6"><Skeleton className="h-32 w-full" /><Skeleton className="h-96 w-full" /></div>;
  }

  if (!doctor) {
    return <div className="p-8 text-center">Doctor not found</div>;
  }

  const completedAppts = appointments?.filter(a => a.status === 'completed').length || 0;
  const scheduledAppts = appointments?.filter(a => a.status === 'scheduled').length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/doctors"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">{doctor.name}</h2>
          <p className="text-muted-foreground">{doctor.specialization}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Professional Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 border-b pb-3">
              <div className="bg-primary/10 p-2 rounded-md"><Award className="h-4 w-4 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Qualification</p>
                <p className="font-medium text-sm">{doctor.qualification || "-"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-b pb-3">
              <div className="bg-primary/10 p-2 rounded-md"><Stethoscope className="h-4 w-4 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Experience</p>
                <p className="font-medium text-sm">{doctor.experience || 0} Years</p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-b pb-3">
              <div className="bg-primary/10 p-2 rounded-md"><Phone className="h-4 w-4 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="font-medium text-sm">{doctor.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-b pb-3">
              <div className="bg-primary/10 p-2 rounded-md"><Mail className="h-4 w-4 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium text-sm">{doctor.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-b pb-3">
              <div className="bg-primary/10 p-2 rounded-md"><Clock className="h-4 w-4 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Availability</p>
                <p className="font-medium text-sm">{doctor.availability || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Performance & Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-muted rounded-lg p-6 text-center border">
                <div className="text-3xl font-bold text-primary">{appointments?.length || 0}</div>
                <div className="text-sm text-muted-foreground mt-1">Total Appointments</div>
              </div>
              <div className="bg-muted rounded-lg p-6 text-center border">
                <div className="text-3xl font-bold text-green-600">{completedAppts}</div>
                <div className="text-sm text-muted-foreground mt-1">Completed</div>
              </div>
              <div className="bg-muted rounded-lg p-6 text-center border">
                <div className="text-3xl font-bold text-amber-600">{scheduledAppts}</div>
                <div className="text-sm text-muted-foreground mt-1">Scheduled</div>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-4">Recent Appointments</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apptsLoading ? (
                    <TableRow><TableCell colSpan={3}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                  ) : appointments?.length === 0 ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-6 text-muted-foreground">No appointments</TableCell></TableRow>
                  ) : (
                    appointments?.slice(0, 5).map(a => (
                      <TableRow key={a.id}>
                        <TableCell>{a.date} at {a.time}</TableCell>
                        <TableCell>
                          <Link href={`/patients/${a.patientId}`} className="text-primary hover:underline">{a.patientName}</Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant={a.status === 'completed' ? 'default' : a.status === 'cancelled' ? 'destructive' : 'secondary'} className={a.status === 'completed' ? 'bg-green-600 hover:bg-green-700' : ''}>
                            {a.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
