import { useState } from "react";
import { useParams, Link } from "wouter";
import { useGetPatient, useListAppointments, useListMedicalRecords, useListBills, useListLabReports } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, Calendar, FileText, Receipt, ArrowLeft, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PatientDetail() {
  const { id } = useParams();
  const patientId = parseInt(id || "0", 10);
  
  const { data: patient, isLoading: patientLoading } = useGetPatient(patientId);
  const { data: appointments, isLoading: apptsLoading } = useListAppointments({ patientId });
  const { data: records, isLoading: recordsLoading } = useListMedicalRecords({ patientId });
  const { data: bills, isLoading: billsLoading } = useListBills({ patientId });
  const { data: labReports, isLoading: labLoading } = useListLabReports({ patientId });

  if (patientLoading) {
    return <div className="space-y-6"><Skeleton className="h-32 w-full" /><Skeleton className="h-96 w-full" /></div>;
  }

  if (!patient) {
    return <div className="p-8 text-center">Patient not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/patients"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">{patient.name}</h2>
          <p className="text-muted-foreground">Patient ID: PT-{patient.id.toString().padStart(4, '0')}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Age/Gender</span>
              <span className="font-medium">{patient.age} yrs / {patient.gender}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Blood Group</span>
              <span className="font-medium">
                {patient.bloodGroup ? (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    <Droplet className="h-3 w-3 mr-1" /> {patient.bloodGroup}
                  </Badge>
                ) : "-"}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Phone</span>
              <span className="font-medium">{patient.phone}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{patient.email || "-"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Address</span>
              <span className="font-medium text-right max-w-[200px] truncate" title={patient.address || ""}>{patient.address || "-"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Emergency</span>
              <span className="font-medium">{patient.emergencyContact || "-"}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Clinical Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Disease History</h4>
              <p className="text-foreground">{patient.diseaseHistory || "No significant history recorded."}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-muted p-4 rounded-lg text-center">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{appointments?.length || 0}</div>
                <div className="text-xs text-muted-foreground">Appointments</div>
              </div>
              <div className="bg-muted p-4 rounded-lg text-center">
                <Activity className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{records?.length || 0}</div>
                <div className="text-xs text-muted-foreground">Records</div>
              </div>
              <div className="bg-muted p-4 rounded-lg text-center">
                <FileText className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{labReports?.length || 0}</div>
                <div className="text-xs text-muted-foreground">Lab Reports</div>
              </div>
              <div className="bg-muted p-4 rounded-lg text-center">
                <Receipt className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{bills?.length || 0}</div>
                <div className="text-xs text-muted-foreground">Bills</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="grid w-full md:w-[600px] grid-cols-4">
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="records">Records</TabsTrigger>
          <TabsTrigger value="lab">Lab Reports</TabsTrigger>
          <TabsTrigger value="bills">Bills</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appointments" className="mt-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apptsLoading ? (
                  <TableRow><TableCell colSpan={4}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                ) : appointments?.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No appointments</TableCell></TableRow>
                ) : (
                  appointments?.map(a => (
                    <TableRow key={a.id}>
                      <TableCell>{a.date} at {a.time}</TableCell>
                      <TableCell>{a.doctorName}</TableCell>
                      <TableCell>
                        <Badge variant={a.status === 'completed' ? 'default' : a.status === 'cancelled' ? 'destructive' : 'secondary'} className={a.status === 'completed' ? 'bg-green-600 hover:bg-green-700' : ''}>
                          {a.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{a.notes || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="mt-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Prescription</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recordsLoading ? (
                  <TableRow><TableCell colSpan={4}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                ) : records?.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No records</TableCell></TableRow>
                ) : (
                  records?.map(r => (
                    <TableRow key={r.id}>
                      <TableCell>{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{r.doctorName}</TableCell>
                      <TableCell>{r.diagnosis}</TableCell>
                      <TableCell>{r.prescription || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="lab" className="mt-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Test</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {labLoading ? (
                  <TableRow><TableCell colSpan={4}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                ) : labReports?.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No lab reports</TableCell></TableRow>
                ) : (
                  labReports?.map(l => (
                    <TableRow key={l.id}>
                      <TableCell>{l.reportDate}</TableCell>
                      <TableCell>{l.testName}</TableCell>
                      <TableCell>{l.result || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={l.status === 'completed' ? 'default' : 'secondary'} className={l.status === 'completed' ? 'bg-green-600 hover:bg-green-700' : ''}>
                          {l.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="bills" className="mt-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billsLoading ? (
                  <TableRow><TableCell colSpan={4}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                ) : bills?.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No bills</TableCell></TableRow>
                ) : (
                  bills?.map(b => (
                    <TableRow key={b.id}>
                      <TableCell>{new Date(b.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{b.description || "General Consultation"}</TableCell>
                      <TableCell>${b.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={b.paymentStatus === 'paid' ? 'default' : b.paymentStatus === 'cancelled' ? 'destructive' : 'secondary'} className={b.paymentStatus === 'paid' ? 'bg-green-600 hover:bg-green-700' : ''}>
                          {b.paymentStatus}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
