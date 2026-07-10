import { useState } from "react";
import { useListMedicalRecords, useCreateMedicalRecord, useUpdateMedicalRecord, getListMedicalRecordsQueryKey, useListPatients, useListDoctors } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const recordSchema = z.object({
  patientId: z.coerce.number().min(1, "Patient is required"),
  doctorId: z.coerce.number().min(1, "Doctor is required"),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  prescription: z.string().optional(),
  treatment: z.string().optional(),
  notes: z.string().optional(),
});

type RecordFormValues = z.infer<typeof recordSchema>;

export default function MedicalRecordsList() {
  const [patientFilter, setPatientFilter] = useState<string>("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: records, isLoading } = useListMedicalRecords({
    patientId: patientFilter !== "all" ? parseInt(patientFilter) : undefined,
  });

  const { data: patients } = useListPatients();
  const { data: doctors } = useListDoctors();

  const createRecord = useCreateMedicalRecord();
  const updateRecord = useUpdateMedicalRecord();

  const form = useForm<RecordFormValues>({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      patientId: 0, doctorId: 0, diagnosis: "", prescription: "", treatment: "", notes: ""
    }
  });

  const editForm = useForm<RecordFormValues>({
    resolver: zodResolver(recordSchema),
  });

  const onSubmit = (data: RecordFormValues) => {
    createRecord.mutate({ data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMedicalRecordsQueryKey() });
        setIsAddOpen(false);
        form.reset();
        toast({ title: "Medical record created successfully" });
      },
      onError: (err) => toast({ title: "Failed to create record", description: String(err), variant: "destructive" })
    });
  };

  const onEditSubmit = (data: RecordFormValues) => {
    if (!editingRecord) return;
    updateRecord.mutate({ id: editingRecord.id, data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMedicalRecordsQueryKey() });
        setIsEditOpen(false);
        setEditingRecord(null);
        toast({ title: "Medical record updated successfully" });
      },
      onError: (err) => toast({ title: "Failed to update record", description: String(err), variant: "destructive" })
    });
  };

  const openEdit = (r: any) => {
    setEditingRecord(r);
    editForm.reset({
      patientId: r.patientId,
      doctorId: r.doctorId || 0,
      diagnosis: r.diagnosis || "",
      prescription: r.prescription || "",
      treatment: r.treatment || "",
      notes: r.notes || "",
    });
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Medical Records</h2>
          <p className="text-muted-foreground">Manage EMR and clinical documentation.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Create Record</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create Medical Record</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="patientId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value ? field.value.toString() : ""}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {patients?.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="doctorId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doctor</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value ? field.value.toString() : ""}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {doctors?.map(d => <SelectItem key={d.id} value={d.id.toString()}>{d.name} ({d.specialization})</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="diagnosis" render={({ field }) => (
                  <FormItem><FormLabel>Diagnosis</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="treatment" render={({ field }) => (
                  <FormItem><FormLabel>Treatment Plan</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="prescription" render={({ field }) => (
                  <FormItem><FormLabel>Prescription</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="notes" render={({ field }) => (
                  <FormItem><FormLabel>Clinical Notes</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <DialogFooter>
                  <Button type="submit" disabled={createRecord.isPending}>
                    {createRecord.isPending ? "Creating..." : "Save Record"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-lg border shadow-sm">
        <Select value={patientFilter} onValueChange={setPatientFilter}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Filter by Patient" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Patients</SelectItem>
            {patients?.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Diagnosis</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : records?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  No medical records found
                </TableCell>
              </TableRow>
            ) : (
              records?.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="whitespace-nowrap">{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{r.patientName}</TableCell>
                  <TableCell>{r.doctorName}</TableCell>
                  <TableCell className="max-w-[300px] truncate" title={r.diagnosis || ""}>{r.diagnosis}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(r)}>
                      <Edit className="h-4 w-4 text-muted-foreground hover:text-primary" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Medical Record</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={editForm.control} name="patientId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient</FormLabel>
                    <Select disabled onValueChange={field.onChange} defaultValue={field.value ? field.value.toString() : ""}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {patients?.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={editForm.control} name="doctorId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doctor</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value ? field.value.toString() : ""}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {doctors?.map(d => <SelectItem key={d.id} value={d.id.toString()}>{d.name} ({d.specialization})</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={editForm.control} name="diagnosis" render={({ field }) => (
                <FormItem><FormLabel>Diagnosis</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={editForm.control} name="treatment" render={({ field }) => (
                <FormItem><FormLabel>Treatment Plan</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={editForm.control} name="prescription" render={({ field }) => (
                <FormItem><FormLabel>Prescription</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={editForm.control} name="notes" render={({ field }) => (
                <FormItem><FormLabel>Clinical Notes</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <DialogFooter>
                <Button type="submit" disabled={updateRecord.isPending}>
                  {updateRecord.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
