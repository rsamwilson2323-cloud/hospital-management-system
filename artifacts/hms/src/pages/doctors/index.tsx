import { useState } from "react";
import { Link } from "wouter";
import { useListDoctors, useCreateDoctor, useUpdateDoctor, useDeleteDoctor, getListDoctorsQueryKey } from "@workspace/api-client-react";
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
import { Search, Plus, Stethoscope, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const doctorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  specialization: z.string().min(1, "Specialization is required"),
  qualification: z.string().optional(),
  experience: z.coerce.number().min(0).optional(),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
  availability: z.string().optional(),
});

type DoctorFormValues = z.infer<typeof doctorSchema>;

export default function DoctorsList() {
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: doctors, isLoading } = useListDoctors({
    search: search || undefined,
    specialization: specialization !== "all" && specialization ? specialization : undefined,
  });

  const createDoctor = useCreateDoctor();
  const updateDoctor = useUpdateDoctor();
  const deleteDoctor = useDeleteDoctor();

  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: "", specialization: "", qualification: "", experience: 0, phone: "", email: "", availability: ""
    }
  });

  const editForm = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorSchema),
  });

  const onSubmit = (data: DoctorFormValues) => {
    createDoctor.mutate({ data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListDoctorsQueryKey() });
        setIsAddOpen(false);
        form.reset();
        toast({ title: "Doctor added successfully" });
      },
      onError: (err) => toast({ title: "Failed to add doctor", description: String(err), variant: "destructive" })
    });
  };

  const onEditSubmit = (data: DoctorFormValues) => {
    if (!editingDoctor) return;
    updateDoctor.mutate({ id: editingDoctor.id, data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListDoctorsQueryKey() });
        setIsEditOpen(false);
        setEditingDoctor(null);
        toast({ title: "Doctor updated successfully" });
      },
      onError: (err) => toast({ title: "Failed to update doctor", description: String(err), variant: "destructive" })
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;
    deleteDoctor.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListDoctorsQueryKey() });
        toast({ title: "Doctor deleted" });
      }
    });
  };

  const openEdit = (d: any) => {
    setEditingDoctor(d);
    editForm.reset({
      name: d.name,
      specialization: d.specialization,
      qualification: d.qualification || "",
      experience: d.experience || 0,
      phone: d.phone,
      email: d.email,
      availability: d.availability || "",
    });
    setIsEditOpen(true);
  };

  const specialties = ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "General", "Dermatology", "Oncology"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Doctors</h2>
          <p className="text-muted-foreground">Manage medical staff and specialists.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Doctor</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Doctor</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} placeholder="Dr. Jane Doe" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="specialization" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialization</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {specialties.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="qualification" render={({ field }) => (
                    <FormItem><FormLabel>Qualification</FormLabel><FormControl><Input {...field} placeholder="MD, MBBS" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="experience" render={({ field }) => (
                    <FormItem><FormLabel>Experience (Years)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="availability" render={({ field }) => (
                  <FormItem><FormLabel>Availability (e.g. Mon-Fri, 9am-5pm)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <DialogFooter>
                  <Button type="submit" disabled={createDoctor.isPending}>
                    {createDoctor.isPending ? "Adding..." : "Add Doctor"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-lg border shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search doctors..." 
            className="pl-9" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={specialization} onValueChange={setSpecialization}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by Specialty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specialties</SelectItem>
            {specialties.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Doctor</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : doctors?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  No doctors found
                </TableCell>
              </TableRow>
            ) : (
              doctors?.map(d => (
                <TableRow key={d.id}>
                  <TableCell>
                    <Link href={`/doctors/${d.id}`} className="flex items-center gap-2 hover:underline text-primary font-medium">
                      <Stethoscope className="h-4 w-4" /> {d.name}
                    </Link>
                  </TableCell>
                  <TableCell>{d.specialization}</TableCell>
                  <TableCell>
                    <div className="text-sm">{d.phone}</div>
                    <div className="text-xs text-muted-foreground">{d.email}</div>
                  </TableCell>
                  <TableCell>{d.experience} yrs</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(d)}>
                        <Edit className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(d.id)}>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Doctor</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={editForm.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={editForm.control} name="specialization" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialization</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {specialties.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={editForm.control} name="phone" render={({ field }) => (
                  <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={editForm.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={editForm.control} name="qualification" render={({ field }) => (
                  <FormItem><FormLabel>Qualification</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={editForm.control} name="experience" render={({ field }) => (
                  <FormItem><FormLabel>Experience (Years)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={editForm.control} name="availability" render={({ field }) => (
                <FormItem><FormLabel>Availability</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <DialogFooter>
                <Button type="submit" disabled={updateDoctor.isPending}>
                  {updateDoctor.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
