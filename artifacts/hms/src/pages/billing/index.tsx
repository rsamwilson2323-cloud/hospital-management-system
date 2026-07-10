import { useState } from "react";
import { useListBills, useCreateBill, useUpdateBill, getListBillsQueryKey, useListPatients } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const billSchema = z.object({
  patientId: z.coerce.number().min(1, "Patient is required"),
  consultationFee: z.coerce.number().min(0).optional(),
  labCharges: z.coerce.number().min(0).optional(),
  medicineCharges: z.coerce.number().min(0).optional(),
  amount: z.coerce.number().min(0),
  description: z.string().optional(),
});

type BillFormValues = z.infer<typeof billSchema>;

export default function BillingList() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: bills, isLoading } = useListBills({
    paymentStatus: statusFilter !== "all" ? statusFilter : undefined,
  });

  const { data: patients } = useListPatients();

  const createBill = useCreateBill();
  const updateBill = useUpdateBill();

  const form = useForm<BillFormValues>({
    resolver: zodResolver(billSchema),
    defaultValues: {
      patientId: 0, consultationFee: 0, labCharges: 0, medicineCharges: 0, amount: 0, description: ""
    }
  });

  // Auto-calculate total
  const consultationFee = form.watch("consultationFee") || 0;
  const labCharges = form.watch("labCharges") || 0;
  const medicineCharges = form.watch("medicineCharges") || 0;
  
  // Update amount when parts change
  form.setValue("amount", Number(consultationFee) + Number(labCharges) + Number(medicineCharges));

  const onSubmit = (data: BillFormValues) => {
    createBill.mutate({ data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBillsQueryKey() });
        setIsAddOpen(false);
        form.reset();
        toast({ title: "Invoice created successfully" });
      },
      onError: (err) => toast({ title: "Failed to create invoice", description: String(err), variant: "destructive" })
    });
  };

  const handleMarkPaid = (id: number) => {
    updateBill.mutate({ id, data: { paymentStatus: 'paid', paymentDate: new Date().toISOString() } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBillsQueryKey() });
        toast({ title: "Invoice marked as paid" });
      }
    });
  };

  const handleCancel = (id: number) => {
    if(!confirm("Cancel this invoice?")) return;
    updateBill.mutate({ id, data: { paymentStatus: 'cancelled' } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBillsQueryKey() });
        toast({ title: "Invoice cancelled" });
      }
    });
  };

  const totalRevenue = bills?.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.amount, 0) || 0;
  const pendingRevenue = bills?.filter(b => b.paymentStatus === 'pending').reduce((sum, b) => sum + b.amount, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Billing</h2>
          <p className="text-muted-foreground">Manage patient invoices and payments.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Create Invoice</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Invoice</DialogTitle>
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
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} placeholder="e.g. Consultation & Blood Test" /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="consultationFee" render={({ field }) => (
                    <FormItem><FormLabel>Consultation Fee</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="labCharges" render={({ field }) => (
                    <FormItem><FormLabel>Lab Charges</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="medicineCharges" render={({ field }) => (
                    <FormItem><FormLabel>Medicine Charges</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="amount" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-primary">Total Amount</FormLabel>
                      <FormControl><Input type="number" disabled {...field} className="font-bold bg-muted" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={createBill.isPending}>
                    {createBill.isPending ? "Creating..." : "Create Invoice"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Collected Revenue</p>
              <h3 className="text-3xl font-bold text-green-600 mt-1">${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Collection</p>
              <h3 className="text-3xl font-bold text-amber-600 mt-1">${pendingRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
            </div>
            <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-lg border shadow-sm">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Invoices</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : bills?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No invoices found
                </TableCell>
              </TableRow>
            ) : (
              bills?.map(b => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium text-muted-foreground">INV-{b.id.toString().padStart(5, '0')}</TableCell>
                  <TableCell>{new Date(b.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{b.patientName}</TableCell>
                  <TableCell className="font-bold">${b.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={b.paymentStatus === 'paid' ? 'default' : b.paymentStatus === 'cancelled' ? 'destructive' : 'secondary'} className={b.paymentStatus === 'paid' ? 'bg-green-600 hover:bg-green-700' : b.paymentStatus === 'pending' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400' : ''}>
                      {b.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {b.paymentStatus === 'pending' && (
                      <div className="flex justify-end gap-2 items-center">
                        <Button variant="outline" size="sm" className="h-8 text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleMarkPaid(b.id)}>
                          Mark Paid
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 text-muted-foreground hover:text-destructive" onClick={() => handleCancel(b.id)}>
                          Cancel
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
