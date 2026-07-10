import { useState } from "react";
import { useListMedicines, useCreateMedicine, useUpdateMedicine, useDeleteMedicine, getListMedicinesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Edit, Trash2, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const medicineSchema = z.object({
  name: z.string().min(1, "Name is required"),
  quantity: z.coerce.number().min(0, "Quantity must be positive"),
  price: z.coerce.number().min(0, "Price must be positive"),
  expiryDate: z.string().optional(),
  manufacturer: z.string().optional(),
  category: z.string().optional(),
});

type MedicineFormValues = z.infer<typeof medicineSchema>;

export default function PharmacyList() {
  const [search, setSearch] = useState("");
  const [lowStockFilter, setLowStockFilter] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: medicines, isLoading } = useListMedicines({
    search: search || undefined,
    lowStock: lowStockFilter ? true : undefined,
  });

  const createMedicine = useCreateMedicine();
  const updateMedicine = useUpdateMedicine();
  const deleteMedicine = useDeleteMedicine();

  const form = useForm<MedicineFormValues>({
    resolver: zodResolver(medicineSchema),
    defaultValues: {
      name: "", quantity: 0, price: 0, expiryDate: "", manufacturer: "", category: "Tablet"
    }
  });

  const editForm = useForm<MedicineFormValues>({
    resolver: zodResolver(medicineSchema),
  });

  const onSubmit = (data: MedicineFormValues) => {
    createMedicine.mutate({ data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMedicinesQueryKey() });
        setIsAddOpen(false);
        form.reset();
        toast({ title: "Medicine added to inventory" });
      },
      onError: (err) => toast({ title: "Failed to add medicine", description: String(err), variant: "destructive" })
    });
  };

  const onEditSubmit = (data: MedicineFormValues) => {
    if (!editingMedicine) return;
    updateMedicine.mutate({ id: editingMedicine.id, data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMedicinesQueryKey() });
        setIsEditOpen(false);
        setEditingMedicine(null);
        toast({ title: "Medicine updated" });
      },
      onError: (err) => toast({ title: "Failed to update medicine", description: String(err), variant: "destructive" })
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to remove this medicine?")) return;
    deleteMedicine.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMedicinesQueryKey() });
        toast({ title: "Medicine removed" });
      }
    });
  };

  const openEdit = (m: any) => {
    setEditingMedicine(m);
    editForm.reset({
      name: m.name,
      quantity: m.quantity,
      price: m.price,
      expiryDate: m.expiryDate || "",
      manufacturer: m.manufacturer || "",
      category: m.category || "",
    });
    setIsEditOpen(true);
  };

  const categories = ["Tablet", "Syrup", "Injection", "Ointment", "Drops", "Inhaler", "Other"];

  // Calculate stats
  const lowStockCount = medicines?.filter(m => m.quantity < 50).length || 0;
  const outOfStockCount = medicines?.filter(m => m.quantity === 0).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Pharmacy</h2>
          <p className="text-muted-foreground">Manage medicine inventory and stock alerts.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Medicine</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Medicine</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Medicine Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem><FormLabel>Price ($)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="quantity" render={({ field }) => (
                    <FormItem><FormLabel>Stock Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="expiryDate" render={({ field }) => (
                    <FormItem><FormLabel>Expiry Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="manufacturer" render={({ field }) => (
                  <FormItem><FormLabel>Manufacturer</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <DialogFooter>
                  <Button type="submit" disabled={createMedicine.isPending}>
                    {createMedicine.isPending ? "Adding..." : "Add to Inventory"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        {(lowStockCount > 0 || outOfStockCount > 0) && (
          <div className="bg-destructive/10 border-destructive/20 border text-destructive px-4 py-3 rounded-lg flex items-center gap-3 w-full">
            <AlertTriangle className="h-5 w-5" />
            <div className="text-sm font-medium">
              Inventory Alert: {outOfStockCount > 0 ? `${outOfStockCount} items out of stock. ` : ''}
              {lowStockCount > 0 ? `${lowStockCount} items running low (< 50 units).` : ''}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search medicine name..." 
            className="pl-9" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button 
          variant={lowStockFilter ? "default" : "outline"} 
          onClick={() => setLowStockFilter(!lowStockFilter)}
          className={lowStockFilter ? "bg-amber-600 hover:bg-amber-700" : ""}
        >
          <AlertTriangle className="mr-2 h-4 w-4" /> 
          Low Stock Only
        </Button>
      </div>

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medicine</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : medicines?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No medicines found
                </TableCell>
              </TableRow>
            ) : (
              medicines?.map(m => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="font-medium text-foreground">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.manufacturer}</div>
                  </TableCell>
                  <TableCell>{m.category}</TableCell>
                  <TableCell>
                    {m.quantity === 0 ? (
                      <Badge variant="destructive">Out of Stock</Badge>
                    ) : m.quantity < 50 ? (
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400">Low: {m.quantity}</Badge>
                    ) : (
                      <span className="font-medium">{m.quantity}</span>
                    )}
                  </TableCell>
                  <TableCell>${m.price.toFixed(2)}</TableCell>
                  <TableCell>
                    {m.expiryDate ? (
                      <span className={new Date(m.expiryDate) < new Date() ? "text-destructive font-medium" : ""}>
                        {new Date(m.expiryDate).toLocaleDateString()}
                      </span>
                    ) : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(m)}>
                        <Edit className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
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
            <DialogTitle>Edit Medicine</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField control={editForm.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Medicine Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={editForm.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={editForm.control} name="price" render={({ field }) => (
                  <FormItem><FormLabel>Price ($)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={editForm.control} name="quantity" render={({ field }) => (
                  <FormItem><FormLabel>Stock Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={editForm.control} name="expiryDate" render={({ field }) => (
                  <FormItem><FormLabel>Expiry Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={editForm.control} name="manufacturer" render={({ field }) => (
                <FormItem><FormLabel>Manufacturer</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <DialogFooter>
                <Button type="submit" disabled={updateMedicine.isPending}>
                  {updateMedicine.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
