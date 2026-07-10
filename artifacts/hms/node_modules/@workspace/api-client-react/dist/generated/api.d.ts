import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { ActivityItem, Appointment, AppointmentInput, AppointmentTrend, AppointmentUpdate, Bill, BillInput, BillUpdate, DashboardStats, Doctor, DoctorInput, DoctorStat, DoctorUpdate, HealthStatus, LabReport, LabReportInput, LabReportUpdate, ListAppointmentsParams, ListBillsParams, ListDoctorsParams, ListLabReportsParams, ListMedicalRecordsParams, ListMedicinesParams, ListPatientsParams, MedicalRecord, MedicalRecordInput, MedicalRecordUpdate, Medicine, MedicineInput, MedicineUpdate, Patient, PatientInput, PatientUpdate, RevenueMonth } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListPatientsUrl: (params?: ListPatientsParams) => string;
/**
 * @summary List all patients
 */
export declare const listPatients: (params?: ListPatientsParams, options?: RequestInit) => Promise<Patient[]>;
export declare const getListPatientsQueryKey: (params?: ListPatientsParams) => readonly ["/api/patients", ...ListPatientsParams[]];
export declare const getListPatientsQueryOptions: <TData = Awaited<ReturnType<typeof listPatients>>, TError = ErrorType<unknown>>(params?: ListPatientsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPatients>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listPatients>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListPatientsQueryResult = NonNullable<Awaited<ReturnType<typeof listPatients>>>;
export type ListPatientsQueryError = ErrorType<unknown>;
/**
 * @summary List all patients
 */
export declare function useListPatients<TData = Awaited<ReturnType<typeof listPatients>>, TError = ErrorType<unknown>>(params?: ListPatientsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPatients>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreatePatientUrl: () => string;
/**
 * @summary Create a patient
 */
export declare const createPatient: (patientInput: PatientInput, options?: RequestInit) => Promise<Patient>;
export declare const getCreatePatientMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPatient>>, TError, {
        data: BodyType<PatientInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createPatient>>, TError, {
    data: BodyType<PatientInput>;
}, TContext>;
export type CreatePatientMutationResult = NonNullable<Awaited<ReturnType<typeof createPatient>>>;
export type CreatePatientMutationBody = BodyType<PatientInput>;
export type CreatePatientMutationError = ErrorType<unknown>;
/**
* @summary Create a patient
*/
export declare const useCreatePatient: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPatient>>, TError, {
        data: BodyType<PatientInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createPatient>>, TError, {
    data: BodyType<PatientInput>;
}, TContext>;
export declare const getGetPatientUrl: (id: number) => string;
/**
 * @summary Get a patient
 */
export declare const getPatient: (id: number, options?: RequestInit) => Promise<Patient>;
export declare const getGetPatientQueryKey: (id: number) => readonly [`/api/patients/${number}`];
export declare const getGetPatientQueryOptions: <TData = Awaited<ReturnType<typeof getPatient>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPatient>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPatient>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPatientQueryResult = NonNullable<Awaited<ReturnType<typeof getPatient>>>;
export type GetPatientQueryError = ErrorType<void>;
/**
 * @summary Get a patient
 */
export declare function useGetPatient<TData = Awaited<ReturnType<typeof getPatient>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPatient>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdatePatientUrl: (id: number) => string;
/**
 * @summary Update a patient
 */
export declare const updatePatient: (id: number, patientUpdate: PatientUpdate, options?: RequestInit) => Promise<Patient>;
export declare const getUpdatePatientMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updatePatient>>, TError, {
        id: number;
        data: BodyType<PatientUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updatePatient>>, TError, {
    id: number;
    data: BodyType<PatientUpdate>;
}, TContext>;
export type UpdatePatientMutationResult = NonNullable<Awaited<ReturnType<typeof updatePatient>>>;
export type UpdatePatientMutationBody = BodyType<PatientUpdate>;
export type UpdatePatientMutationError = ErrorType<unknown>;
/**
* @summary Update a patient
*/
export declare const useUpdatePatient: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updatePatient>>, TError, {
        id: number;
        data: BodyType<PatientUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updatePatient>>, TError, {
    id: number;
    data: BodyType<PatientUpdate>;
}, TContext>;
export declare const getDeletePatientUrl: (id: number) => string;
/**
 * @summary Delete a patient
 */
export declare const deletePatient: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeletePatientMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deletePatient>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deletePatient>>, TError, {
    id: number;
}, TContext>;
export type DeletePatientMutationResult = NonNullable<Awaited<ReturnType<typeof deletePatient>>>;
export type DeletePatientMutationError = ErrorType<unknown>;
/**
* @summary Delete a patient
*/
export declare const useDeletePatient: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deletePatient>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deletePatient>>, TError, {
    id: number;
}, TContext>;
export declare const getListDoctorsUrl: (params?: ListDoctorsParams) => string;
/**
 * @summary List all doctors
 */
export declare const listDoctors: (params?: ListDoctorsParams, options?: RequestInit) => Promise<Doctor[]>;
export declare const getListDoctorsQueryKey: (params?: ListDoctorsParams) => readonly ["/api/doctors", ...ListDoctorsParams[]];
export declare const getListDoctorsQueryOptions: <TData = Awaited<ReturnType<typeof listDoctors>>, TError = ErrorType<unknown>>(params?: ListDoctorsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listDoctors>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listDoctors>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListDoctorsQueryResult = NonNullable<Awaited<ReturnType<typeof listDoctors>>>;
export type ListDoctorsQueryError = ErrorType<unknown>;
/**
 * @summary List all doctors
 */
export declare function useListDoctors<TData = Awaited<ReturnType<typeof listDoctors>>, TError = ErrorType<unknown>>(params?: ListDoctorsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listDoctors>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateDoctorUrl: () => string;
/**
 * @summary Create a doctor
 */
export declare const createDoctor: (doctorInput: DoctorInput, options?: RequestInit) => Promise<Doctor>;
export declare const getCreateDoctorMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createDoctor>>, TError, {
        data: BodyType<DoctorInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createDoctor>>, TError, {
    data: BodyType<DoctorInput>;
}, TContext>;
export type CreateDoctorMutationResult = NonNullable<Awaited<ReturnType<typeof createDoctor>>>;
export type CreateDoctorMutationBody = BodyType<DoctorInput>;
export type CreateDoctorMutationError = ErrorType<unknown>;
/**
* @summary Create a doctor
*/
export declare const useCreateDoctor: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createDoctor>>, TError, {
        data: BodyType<DoctorInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createDoctor>>, TError, {
    data: BodyType<DoctorInput>;
}, TContext>;
export declare const getGetDoctorUrl: (id: number) => string;
/**
 * @summary Get a doctor
 */
export declare const getDoctor: (id: number, options?: RequestInit) => Promise<Doctor>;
export declare const getGetDoctorQueryKey: (id: number) => readonly [`/api/doctors/${number}`];
export declare const getGetDoctorQueryOptions: <TData = Awaited<ReturnType<typeof getDoctor>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDoctor>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDoctor>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDoctorQueryResult = NonNullable<Awaited<ReturnType<typeof getDoctor>>>;
export type GetDoctorQueryError = ErrorType<void>;
/**
 * @summary Get a doctor
 */
export declare function useGetDoctor<TData = Awaited<ReturnType<typeof getDoctor>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDoctor>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateDoctorUrl: (id: number) => string;
/**
 * @summary Update a doctor
 */
export declare const updateDoctor: (id: number, doctorUpdate: DoctorUpdate, options?: RequestInit) => Promise<Doctor>;
export declare const getUpdateDoctorMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateDoctor>>, TError, {
        id: number;
        data: BodyType<DoctorUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateDoctor>>, TError, {
    id: number;
    data: BodyType<DoctorUpdate>;
}, TContext>;
export type UpdateDoctorMutationResult = NonNullable<Awaited<ReturnType<typeof updateDoctor>>>;
export type UpdateDoctorMutationBody = BodyType<DoctorUpdate>;
export type UpdateDoctorMutationError = ErrorType<unknown>;
/**
* @summary Update a doctor
*/
export declare const useUpdateDoctor: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateDoctor>>, TError, {
        id: number;
        data: BodyType<DoctorUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateDoctor>>, TError, {
    id: number;
    data: BodyType<DoctorUpdate>;
}, TContext>;
export declare const getDeleteDoctorUrl: (id: number) => string;
/**
 * @summary Delete a doctor
 */
export declare const deleteDoctor: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteDoctorMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteDoctor>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteDoctor>>, TError, {
    id: number;
}, TContext>;
export type DeleteDoctorMutationResult = NonNullable<Awaited<ReturnType<typeof deleteDoctor>>>;
export type DeleteDoctorMutationError = ErrorType<unknown>;
/**
* @summary Delete a doctor
*/
export declare const useDeleteDoctor: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteDoctor>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteDoctor>>, TError, {
    id: number;
}, TContext>;
export declare const getListAppointmentsUrl: (params?: ListAppointmentsParams) => string;
/**
 * @summary List appointments
 */
export declare const listAppointments: (params?: ListAppointmentsParams, options?: RequestInit) => Promise<Appointment[]>;
export declare const getListAppointmentsQueryKey: (params?: ListAppointmentsParams) => readonly ["/api/appointments", ...ListAppointmentsParams[]];
export declare const getListAppointmentsQueryOptions: <TData = Awaited<ReturnType<typeof listAppointments>>, TError = ErrorType<unknown>>(params?: ListAppointmentsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAppointments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAppointments>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAppointmentsQueryResult = NonNullable<Awaited<ReturnType<typeof listAppointments>>>;
export type ListAppointmentsQueryError = ErrorType<unknown>;
/**
 * @summary List appointments
 */
export declare function useListAppointments<TData = Awaited<ReturnType<typeof listAppointments>>, TError = ErrorType<unknown>>(params?: ListAppointmentsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAppointments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateAppointmentUrl: () => string;
/**
 * @summary Book an appointment
 */
export declare const createAppointment: (appointmentInput: AppointmentInput, options?: RequestInit) => Promise<Appointment>;
export declare const getCreateAppointmentMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAppointment>>, TError, {
        data: BodyType<AppointmentInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createAppointment>>, TError, {
    data: BodyType<AppointmentInput>;
}, TContext>;
export type CreateAppointmentMutationResult = NonNullable<Awaited<ReturnType<typeof createAppointment>>>;
export type CreateAppointmentMutationBody = BodyType<AppointmentInput>;
export type CreateAppointmentMutationError = ErrorType<unknown>;
/**
* @summary Book an appointment
*/
export declare const useCreateAppointment: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAppointment>>, TError, {
        data: BodyType<AppointmentInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createAppointment>>, TError, {
    data: BodyType<AppointmentInput>;
}, TContext>;
export declare const getGetAppointmentUrl: (id: number) => string;
/**
 * @summary Get an appointment
 */
export declare const getAppointment: (id: number, options?: RequestInit) => Promise<Appointment>;
export declare const getGetAppointmentQueryKey: (id: number) => readonly [`/api/appointments/${number}`];
export declare const getGetAppointmentQueryOptions: <TData = Awaited<ReturnType<typeof getAppointment>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAppointment>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAppointment>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAppointmentQueryResult = NonNullable<Awaited<ReturnType<typeof getAppointment>>>;
export type GetAppointmentQueryError = ErrorType<unknown>;
/**
 * @summary Get an appointment
 */
export declare function useGetAppointment<TData = Awaited<ReturnType<typeof getAppointment>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAppointment>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateAppointmentUrl: (id: number) => string;
/**
 * @summary Update appointment
 */
export declare const updateAppointment: (id: number, appointmentUpdate: AppointmentUpdate, options?: RequestInit) => Promise<Appointment>;
export declare const getUpdateAppointmentMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAppointment>>, TError, {
        id: number;
        data: BodyType<AppointmentUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateAppointment>>, TError, {
    id: number;
    data: BodyType<AppointmentUpdate>;
}, TContext>;
export type UpdateAppointmentMutationResult = NonNullable<Awaited<ReturnType<typeof updateAppointment>>>;
export type UpdateAppointmentMutationBody = BodyType<AppointmentUpdate>;
export type UpdateAppointmentMutationError = ErrorType<unknown>;
/**
* @summary Update appointment
*/
export declare const useUpdateAppointment: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAppointment>>, TError, {
        id: number;
        data: BodyType<AppointmentUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateAppointment>>, TError, {
    id: number;
    data: BodyType<AppointmentUpdate>;
}, TContext>;
export declare const getDeleteAppointmentUrl: (id: number) => string;
/**
 * @summary Cancel/delete appointment
 */
export declare const deleteAppointment: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteAppointmentMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteAppointment>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteAppointment>>, TError, {
    id: number;
}, TContext>;
export type DeleteAppointmentMutationResult = NonNullable<Awaited<ReturnType<typeof deleteAppointment>>>;
export type DeleteAppointmentMutationError = ErrorType<unknown>;
/**
* @summary Cancel/delete appointment
*/
export declare const useDeleteAppointment: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteAppointment>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteAppointment>>, TError, {
    id: number;
}, TContext>;
export declare const getListMedicalRecordsUrl: (params?: ListMedicalRecordsParams) => string;
/**
 * @summary List medical records
 */
export declare const listMedicalRecords: (params?: ListMedicalRecordsParams, options?: RequestInit) => Promise<MedicalRecord[]>;
export declare const getListMedicalRecordsQueryKey: (params?: ListMedicalRecordsParams) => readonly ["/api/medical-records", ...ListMedicalRecordsParams[]];
export declare const getListMedicalRecordsQueryOptions: <TData = Awaited<ReturnType<typeof listMedicalRecords>>, TError = ErrorType<unknown>>(params?: ListMedicalRecordsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMedicalRecords>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listMedicalRecords>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListMedicalRecordsQueryResult = NonNullable<Awaited<ReturnType<typeof listMedicalRecords>>>;
export type ListMedicalRecordsQueryError = ErrorType<unknown>;
/**
 * @summary List medical records
 */
export declare function useListMedicalRecords<TData = Awaited<ReturnType<typeof listMedicalRecords>>, TError = ErrorType<unknown>>(params?: ListMedicalRecordsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMedicalRecords>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateMedicalRecordUrl: () => string;
/**
 * @summary Create a medical record
 */
export declare const createMedicalRecord: (medicalRecordInput: MedicalRecordInput, options?: RequestInit) => Promise<MedicalRecord>;
export declare const getCreateMedicalRecordMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createMedicalRecord>>, TError, {
        data: BodyType<MedicalRecordInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createMedicalRecord>>, TError, {
    data: BodyType<MedicalRecordInput>;
}, TContext>;
export type CreateMedicalRecordMutationResult = NonNullable<Awaited<ReturnType<typeof createMedicalRecord>>>;
export type CreateMedicalRecordMutationBody = BodyType<MedicalRecordInput>;
export type CreateMedicalRecordMutationError = ErrorType<unknown>;
/**
* @summary Create a medical record
*/
export declare const useCreateMedicalRecord: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createMedicalRecord>>, TError, {
        data: BodyType<MedicalRecordInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createMedicalRecord>>, TError, {
    data: BodyType<MedicalRecordInput>;
}, TContext>;
export declare const getGetMedicalRecordUrl: (id: number) => string;
/**
 * @summary Get a medical record
 */
export declare const getMedicalRecord: (id: number, options?: RequestInit) => Promise<MedicalRecord>;
export declare const getGetMedicalRecordQueryKey: (id: number) => readonly [`/api/medical-records/${number}`];
export declare const getGetMedicalRecordQueryOptions: <TData = Awaited<ReturnType<typeof getMedicalRecord>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMedicalRecord>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMedicalRecord>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMedicalRecordQueryResult = NonNullable<Awaited<ReturnType<typeof getMedicalRecord>>>;
export type GetMedicalRecordQueryError = ErrorType<unknown>;
/**
 * @summary Get a medical record
 */
export declare function useGetMedicalRecord<TData = Awaited<ReturnType<typeof getMedicalRecord>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMedicalRecord>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateMedicalRecordUrl: (id: number) => string;
/**
 * @summary Update a medical record
 */
export declare const updateMedicalRecord: (id: number, medicalRecordUpdate: MedicalRecordUpdate, options?: RequestInit) => Promise<MedicalRecord>;
export declare const getUpdateMedicalRecordMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMedicalRecord>>, TError, {
        id: number;
        data: BodyType<MedicalRecordUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateMedicalRecord>>, TError, {
    id: number;
    data: BodyType<MedicalRecordUpdate>;
}, TContext>;
export type UpdateMedicalRecordMutationResult = NonNullable<Awaited<ReturnType<typeof updateMedicalRecord>>>;
export type UpdateMedicalRecordMutationBody = BodyType<MedicalRecordUpdate>;
export type UpdateMedicalRecordMutationError = ErrorType<unknown>;
/**
* @summary Update a medical record
*/
export declare const useUpdateMedicalRecord: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMedicalRecord>>, TError, {
        id: number;
        data: BodyType<MedicalRecordUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateMedicalRecord>>, TError, {
    id: number;
    data: BodyType<MedicalRecordUpdate>;
}, TContext>;
export declare const getListBillsUrl: (params?: ListBillsParams) => string;
/**
 * @summary List bills
 */
export declare const listBills: (params?: ListBillsParams, options?: RequestInit) => Promise<Bill[]>;
export declare const getListBillsQueryKey: (params?: ListBillsParams) => readonly ["/api/bills", ...ListBillsParams[]];
export declare const getListBillsQueryOptions: <TData = Awaited<ReturnType<typeof listBills>>, TError = ErrorType<unknown>>(params?: ListBillsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listBills>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listBills>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListBillsQueryResult = NonNullable<Awaited<ReturnType<typeof listBills>>>;
export type ListBillsQueryError = ErrorType<unknown>;
/**
 * @summary List bills
 */
export declare function useListBills<TData = Awaited<ReturnType<typeof listBills>>, TError = ErrorType<unknown>>(params?: ListBillsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listBills>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateBillUrl: () => string;
/**
 * @summary Create a bill
 */
export declare const createBill: (billInput: BillInput, options?: RequestInit) => Promise<Bill>;
export declare const getCreateBillMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createBill>>, TError, {
        data: BodyType<BillInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createBill>>, TError, {
    data: BodyType<BillInput>;
}, TContext>;
export type CreateBillMutationResult = NonNullable<Awaited<ReturnType<typeof createBill>>>;
export type CreateBillMutationBody = BodyType<BillInput>;
export type CreateBillMutationError = ErrorType<unknown>;
/**
* @summary Create a bill
*/
export declare const useCreateBill: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createBill>>, TError, {
        data: BodyType<BillInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createBill>>, TError, {
    data: BodyType<BillInput>;
}, TContext>;
export declare const getGetBillUrl: (id: number) => string;
/**
 * @summary Get a bill
 */
export declare const getBill: (id: number, options?: RequestInit) => Promise<Bill>;
export declare const getGetBillQueryKey: (id: number) => readonly [`/api/bills/${number}`];
export declare const getGetBillQueryOptions: <TData = Awaited<ReturnType<typeof getBill>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBill>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getBill>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetBillQueryResult = NonNullable<Awaited<ReturnType<typeof getBill>>>;
export type GetBillQueryError = ErrorType<unknown>;
/**
 * @summary Get a bill
 */
export declare function useGetBill<TData = Awaited<ReturnType<typeof getBill>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBill>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateBillUrl: (id: number) => string;
/**
 * @summary Update bill / record payment
 */
export declare const updateBill: (id: number, billUpdate: BillUpdate, options?: RequestInit) => Promise<Bill>;
export declare const getUpdateBillMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateBill>>, TError, {
        id: number;
        data: BodyType<BillUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateBill>>, TError, {
    id: number;
    data: BodyType<BillUpdate>;
}, TContext>;
export type UpdateBillMutationResult = NonNullable<Awaited<ReturnType<typeof updateBill>>>;
export type UpdateBillMutationBody = BodyType<BillUpdate>;
export type UpdateBillMutationError = ErrorType<unknown>;
/**
* @summary Update bill / record payment
*/
export declare const useUpdateBill: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateBill>>, TError, {
        id: number;
        data: BodyType<BillUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateBill>>, TError, {
    id: number;
    data: BodyType<BillUpdate>;
}, TContext>;
export declare const getListMedicinesUrl: (params?: ListMedicinesParams) => string;
/**
 * @summary List medicines
 */
export declare const listMedicines: (params?: ListMedicinesParams, options?: RequestInit) => Promise<Medicine[]>;
export declare const getListMedicinesQueryKey: (params?: ListMedicinesParams) => readonly ["/api/medicines", ...ListMedicinesParams[]];
export declare const getListMedicinesQueryOptions: <TData = Awaited<ReturnType<typeof listMedicines>>, TError = ErrorType<unknown>>(params?: ListMedicinesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMedicines>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listMedicines>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListMedicinesQueryResult = NonNullable<Awaited<ReturnType<typeof listMedicines>>>;
export type ListMedicinesQueryError = ErrorType<unknown>;
/**
 * @summary List medicines
 */
export declare function useListMedicines<TData = Awaited<ReturnType<typeof listMedicines>>, TError = ErrorType<unknown>>(params?: ListMedicinesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMedicines>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateMedicineUrl: () => string;
/**
 * @summary Add a medicine
 */
export declare const createMedicine: (medicineInput: MedicineInput, options?: RequestInit) => Promise<Medicine>;
export declare const getCreateMedicineMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createMedicine>>, TError, {
        data: BodyType<MedicineInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createMedicine>>, TError, {
    data: BodyType<MedicineInput>;
}, TContext>;
export type CreateMedicineMutationResult = NonNullable<Awaited<ReturnType<typeof createMedicine>>>;
export type CreateMedicineMutationBody = BodyType<MedicineInput>;
export type CreateMedicineMutationError = ErrorType<unknown>;
/**
* @summary Add a medicine
*/
export declare const useCreateMedicine: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createMedicine>>, TError, {
        data: BodyType<MedicineInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createMedicine>>, TError, {
    data: BodyType<MedicineInput>;
}, TContext>;
export declare const getGetMedicineUrl: (id: number) => string;
/**
 * @summary Get a medicine
 */
export declare const getMedicine: (id: number, options?: RequestInit) => Promise<Medicine>;
export declare const getGetMedicineQueryKey: (id: number) => readonly [`/api/medicines/${number}`];
export declare const getGetMedicineQueryOptions: <TData = Awaited<ReturnType<typeof getMedicine>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMedicine>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMedicine>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMedicineQueryResult = NonNullable<Awaited<ReturnType<typeof getMedicine>>>;
export type GetMedicineQueryError = ErrorType<unknown>;
/**
 * @summary Get a medicine
 */
export declare function useGetMedicine<TData = Awaited<ReturnType<typeof getMedicine>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMedicine>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateMedicineUrl: (id: number) => string;
/**
 * @summary Update medicine stock/details
 */
export declare const updateMedicine: (id: number, medicineUpdate: MedicineUpdate, options?: RequestInit) => Promise<Medicine>;
export declare const getUpdateMedicineMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMedicine>>, TError, {
        id: number;
        data: BodyType<MedicineUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateMedicine>>, TError, {
    id: number;
    data: BodyType<MedicineUpdate>;
}, TContext>;
export type UpdateMedicineMutationResult = NonNullable<Awaited<ReturnType<typeof updateMedicine>>>;
export type UpdateMedicineMutationBody = BodyType<MedicineUpdate>;
export type UpdateMedicineMutationError = ErrorType<unknown>;
/**
* @summary Update medicine stock/details
*/
export declare const useUpdateMedicine: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMedicine>>, TError, {
        id: number;
        data: BodyType<MedicineUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateMedicine>>, TError, {
    id: number;
    data: BodyType<MedicineUpdate>;
}, TContext>;
export declare const getDeleteMedicineUrl: (id: number) => string;
/**
 * @summary Delete a medicine
 */
export declare const deleteMedicine: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteMedicineMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteMedicine>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteMedicine>>, TError, {
    id: number;
}, TContext>;
export type DeleteMedicineMutationResult = NonNullable<Awaited<ReturnType<typeof deleteMedicine>>>;
export type DeleteMedicineMutationError = ErrorType<unknown>;
/**
* @summary Delete a medicine
*/
export declare const useDeleteMedicine: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteMedicine>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteMedicine>>, TError, {
    id: number;
}, TContext>;
export declare const getListLabReportsUrl: (params?: ListLabReportsParams) => string;
/**
 * @summary List lab reports
 */
export declare const listLabReports: (params?: ListLabReportsParams, options?: RequestInit) => Promise<LabReport[]>;
export declare const getListLabReportsQueryKey: (params?: ListLabReportsParams) => readonly ["/api/lab-reports", ...ListLabReportsParams[]];
export declare const getListLabReportsQueryOptions: <TData = Awaited<ReturnType<typeof listLabReports>>, TError = ErrorType<unknown>>(params?: ListLabReportsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listLabReports>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listLabReports>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListLabReportsQueryResult = NonNullable<Awaited<ReturnType<typeof listLabReports>>>;
export type ListLabReportsQueryError = ErrorType<unknown>;
/**
 * @summary List lab reports
 */
export declare function useListLabReports<TData = Awaited<ReturnType<typeof listLabReports>>, TError = ErrorType<unknown>>(params?: ListLabReportsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listLabReports>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateLabReportUrl: () => string;
/**
 * @summary Create a lab report
 */
export declare const createLabReport: (labReportInput: LabReportInput, options?: RequestInit) => Promise<LabReport>;
export declare const getCreateLabReportMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createLabReport>>, TError, {
        data: BodyType<LabReportInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createLabReport>>, TError, {
    data: BodyType<LabReportInput>;
}, TContext>;
export type CreateLabReportMutationResult = NonNullable<Awaited<ReturnType<typeof createLabReport>>>;
export type CreateLabReportMutationBody = BodyType<LabReportInput>;
export type CreateLabReportMutationError = ErrorType<unknown>;
/**
* @summary Create a lab report
*/
export declare const useCreateLabReport: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createLabReport>>, TError, {
        data: BodyType<LabReportInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createLabReport>>, TError, {
    data: BodyType<LabReportInput>;
}, TContext>;
export declare const getGetLabReportUrl: (id: number) => string;
/**
 * @summary Get a lab report
 */
export declare const getLabReport: (id: number, options?: RequestInit) => Promise<LabReport>;
export declare const getGetLabReportQueryKey: (id: number) => readonly [`/api/lab-reports/${number}`];
export declare const getGetLabReportQueryOptions: <TData = Awaited<ReturnType<typeof getLabReport>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLabReport>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getLabReport>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetLabReportQueryResult = NonNullable<Awaited<ReturnType<typeof getLabReport>>>;
export type GetLabReportQueryError = ErrorType<unknown>;
/**
 * @summary Get a lab report
 */
export declare function useGetLabReport<TData = Awaited<ReturnType<typeof getLabReport>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLabReport>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateLabReportUrl: (id: number) => string;
/**
 * @summary Update a lab report
 */
export declare const updateLabReport: (id: number, labReportUpdate: LabReportUpdate, options?: RequestInit) => Promise<LabReport>;
export declare const getUpdateLabReportMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateLabReport>>, TError, {
        id: number;
        data: BodyType<LabReportUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateLabReport>>, TError, {
    id: number;
    data: BodyType<LabReportUpdate>;
}, TContext>;
export type UpdateLabReportMutationResult = NonNullable<Awaited<ReturnType<typeof updateLabReport>>>;
export type UpdateLabReportMutationBody = BodyType<LabReportUpdate>;
export type UpdateLabReportMutationError = ErrorType<unknown>;
/**
* @summary Update a lab report
*/
export declare const useUpdateLabReport: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateLabReport>>, TError, {
        id: number;
        data: BodyType<LabReportUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateLabReport>>, TError, {
    id: number;
    data: BodyType<LabReportUpdate>;
}, TContext>;
export declare const getGetDashboardStatsUrl: () => string;
/**
 * @summary Overall admin dashboard statistics
 */
export declare const getDashboardStats: (options?: RequestInit) => Promise<DashboardStats>;
export declare const getGetDashboardStatsQueryKey: () => readonly ["/api/dashboard/stats"];
export declare const getGetDashboardStatsQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardStats>>>;
export type GetDashboardStatsQueryError = ErrorType<unknown>;
/**
 * @summary Overall admin dashboard statistics
 */
export declare function useGetDashboardStats<TData = Awaited<ReturnType<typeof getDashboardStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetRevenueStatsUrl: () => string;
/**
 * @summary Monthly revenue breakdown
 */
export declare const getRevenueStats: (options?: RequestInit) => Promise<RevenueMonth[]>;
export declare const getGetRevenueStatsQueryKey: () => readonly ["/api/dashboard/revenue"];
export declare const getGetRevenueStatsQueryOptions: <TData = Awaited<ReturnType<typeof getRevenueStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRevenueStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRevenueStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetRevenueStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getRevenueStats>>>;
export type GetRevenueStatsQueryError = ErrorType<unknown>;
/**
 * @summary Monthly revenue breakdown
 */
export declare function useGetRevenueStats<TData = Awaited<ReturnType<typeof getRevenueStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRevenueStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetAppointmentTrendsUrl: () => string;
/**
 * @summary Appointment trends by status
 */
export declare const getAppointmentTrends: (options?: RequestInit) => Promise<AppointmentTrend[]>;
export declare const getGetAppointmentTrendsQueryKey: () => readonly ["/api/dashboard/appointment-trends"];
export declare const getGetAppointmentTrendsQueryOptions: <TData = Awaited<ReturnType<typeof getAppointmentTrends>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAppointmentTrends>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAppointmentTrends>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAppointmentTrendsQueryResult = NonNullable<Awaited<ReturnType<typeof getAppointmentTrends>>>;
export type GetAppointmentTrendsQueryError = ErrorType<unknown>;
/**
 * @summary Appointment trends by status
 */
export declare function useGetAppointmentTrends<TData = Awaited<ReturnType<typeof getAppointmentTrends>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAppointmentTrends>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetDoctorStatsUrl: () => string;
/**
 * @summary Per-doctor workload stats
 */
export declare const getDoctorStats: (options?: RequestInit) => Promise<DoctorStat[]>;
export declare const getGetDoctorStatsQueryKey: () => readonly ["/api/dashboard/doctor-stats"];
export declare const getGetDoctorStatsQueryOptions: <TData = Awaited<ReturnType<typeof getDoctorStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDoctorStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDoctorStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDoctorStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getDoctorStats>>>;
export type GetDoctorStatsQueryError = ErrorType<unknown>;
/**
 * @summary Per-doctor workload stats
 */
export declare function useGetDoctorStats<TData = Awaited<ReturnType<typeof getDoctorStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDoctorStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetRecentActivityUrl: () => string;
/**
 * @summary Recent hospital activity feed
 */
export declare const getRecentActivity: (options?: RequestInit) => Promise<ActivityItem[]>;
export declare const getGetRecentActivityQueryKey: () => readonly ["/api/dashboard/recent-activity"];
export declare const getGetRecentActivityQueryOptions: <TData = Awaited<ReturnType<typeof getRecentActivity>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRecentActivity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRecentActivity>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetRecentActivityQueryResult = NonNullable<Awaited<ReturnType<typeof getRecentActivity>>>;
export type GetRecentActivityQueryError = ErrorType<unknown>;
/**
 * @summary Recent hospital activity feed
 */
export declare function useGetRecentActivity<TData = Awaited<ReturnType<typeof getRecentActivity>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRecentActivity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map