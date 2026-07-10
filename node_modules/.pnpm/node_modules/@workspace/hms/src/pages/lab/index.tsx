import { useState } from "react";
import { useListLabReports, useCreateLabReport, useUpdateLabReport, getListLabReportsQueryKey, useListPatients } from "@workspace/api-client-react";
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
import { Plus, TestTube, Edit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const reportSchema = z.object({
  patientId: z.coerce.number().min(1, "Patient is required"),
  testName: z.string().min(1, "Test name is required"),
  result: z.string().optional(),
  status: z.string().optional(),
  reportDate: z.string().min(1, "Date is required"),
});

type ReportFormValues = z.infer<typeof reportSchema>;

export default function LabReportsList() {
  const [patientFilter, setPatientFilter] = useState<string>("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: reports, isLoading } = useListLabReports({
    patientId: patientFilter !== "all" ? parseInt(patientFilter) : undefined,
  });

  const { data: patients } = useListPatients();

  const createReport = useCreateLabReport();
  const updateReport = useUpdateLabReport();

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      patientId: 0, testName: "", result: "", status: "pending", reportDate: new Date().toISOString().split('T')[0]
    }
  });

  const editForm = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
  });

  const onSubmit = (data: ReportFormValues) => {
    createReport.mutate({ data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListLabReportsQueryKey() });
        setIsAddOpen(false);
        form.reset();
        toast({ title: "Lab request created successfully" });
      },
      onError: (err) => toast({ title: "Failed to create request", description: String(err), variant: "destructive" })
    });
  };

  const onEditSubmit = (data: ReportFormValues) => {
    if (!editingReport) return;
    updateReport.mutate({ id: editingReport.id, data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListLabReportsQueryKey() });
        setIsEditOpen(false);
        setEditingReport(null);
        toast({ title: "Results updated successfully" });
      },
      onError: (err) => toast({ title: "Failed to update results", description: String(err), variant: "destructive" })
    });
  };

  const openEdit = (r: any) => {
    setEditingReport(r);
    editForm.reset({
      patientId: r.patientId,
      testName: r.testName,
      result: r.result || "",
      status: r.status || "pending",
      reportDate: r.reportDate || "",
    });
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Lab Reports</h2>
          <p className="text-muted-foreground">Manage pathology and diagnostic test results.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> New Test Request</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Order New Test</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <FormField control={form.control} name="testName" render={({ field }) => (
                  <FormItem><FormLabel>Test Name</FormLabel><FormControl><Input {...field} placeholder="e.g. Complete Blood Count (CBC)" /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="reportDate" render={({ field }) => (
                    <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="result" render={({ field }) => (
                  <FormItem><FormLabel>Initial Results (Optional)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <DialogFooter>
                  <Button type="submit" disabled={createReport.isPending}>
                    {createReport.isPending ? "Creating..." : "Order Test"}
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
              <TableHead>Test Name</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Status</TableHead>
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
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : reports?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No lab reports found
                </TableCell>
              </TableRow>
            ) : (
              reports?.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="whitespace-nowrap">{r.reportDate}</TableCell>
                  <TableCell className="font-medium">{r.patientName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TestTube className="h-4 w-4 text-muted-foreground" />
                      {r.testName}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={r.result || ""}>
                    {r.result || <span className="text-muted-foreground italic">Awaiting results</span>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={r.status === 'completed' ? 'default' : 'secondary'} className={r.status === 'completed' ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400'}>
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(r)}>
                      {r.status === 'completed' ? 'View/Edit' : 'Enter Results'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Lab Results</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Patient</p>
                  <p className="font-medium">{patients?.find(p => p.id === editForm.getValues().patientId)?.name}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Test Name</p>
                  <p className="font-medium">{editForm.getValues().testName}</p>
                </div>
              </div>
              <FormField control={editForm.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={editForm.control} name="result" render={({ field }) => (
                <FormItem><FormLabel>Test Results</FormLabel><FormControl><Textarea className="min-h-[150px]" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <DialogFooter>
                <Button type="submit" disabled={updateReport.isPending}>
                  {updateReport.isPending ? "Saving..." : "Save Results"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
