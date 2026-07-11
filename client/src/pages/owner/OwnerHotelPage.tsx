import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  FiEdit2,
  FiLoader,
  FiMapPin,
  FiPhone,
  FiPlus,
  FiSave,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ErrorState } from "../../components/feedback/ErrorState";
import { Button } from "../../components/ui/Button";
import { PageShell } from "../../components/ui/PageShell";
import { useAuthToken } from "../../hooks/use-auth-token";
import { ApiRequestError, getErrorMessage } from "../../lib/api-error";
import { type HotelPayload, hotelService } from "../../services/hotelService";
import { queryKeys } from "../../services/queryKeys";

type FormValues = HotelPayload;

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-sm font-medium text-[#31423a]">{label}</label>
    <div className="mt-1.5">{children}</div>
    {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
  </div>
);

const inputClass =
  "h-11 w-full rounded-lg border border-[#ddc8a3] bg-white px-4 text-sm outline-none ring-[#d7a85f]/30 focus:ring-4";




const DeleteHotelModal = ({
  isOpen,
  onConfirm,
  onCancel,
  isLoading
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-[#17201b]">Delete hotel?</h2>
        <p className="mt-3 text-sm text-[#53645b]">
          This will permanently remove your hotel, all rooms, bookings, and associated reviews.
          <strong> This action cannot be undone.</strong>
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-[#ddc8a3] px-4 py-2 text-sm font-medium text-[#53645b] hover:bg-[#f3e8d4] transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 transition disabled:opacity-50"
          >
            {/* <FiLoader className="animate-spin" aria-hidden="true" /> */}
            {isLoading ? "Deleting..." : "Delete permanently"}
          </button>
        </div>
      </div>
    </div>
  );
};


// ─── Register form (no hotel yet) ────────────────────────────────────────────
const RegisterHotelForm = () => {
  const getToken = useAuthToken();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const token = await getToken();
      return hotelService.register(values, token);
    },
    onSuccess: () => {
      toast.success("Hotel registered successfully.");
      reset();
      queryClient.invalidateQueries({ queryKey: queryKeys.myHotel });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <form
      className="rounded-lg border border-[#eadcc6] bg-[#fffaf0] p-6 shadow-sm"
      onSubmit={handleSubmit((v) => mutation.mutate(v))}
    >
      <h2 className="flex items-center gap-2 text-lg font-semibold text-[#17201b]">
        <FiPlus aria-hidden="true" className="text-[#8a642f]" />
        Register your hotel
      </h2>
      <p className="mt-1 text-sm text-[#53645b]">
        Add your property so guests can discover your rooms.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Hotel name" error={errors.name?.message}>
          <input
            className={inputClass}
            placeholder="Grand Palace Hotel"
            {...register("name", { required: "Hotel name is required." })}
          />
        </Field>
        <Field label="City" error={errors.city?.message}>
          <input
            className={inputClass}
            placeholder="Lahore"
            {...register("city", { required: "City is required." })}
          />
        </Field>
        <Field label="Address" error={errors.address?.message}>
          <input
            className={inputClass}
            placeholder="123 Main Street"
            {...register("address", { required: "Address is required." })}
          />
        </Field>
        <Field label="Contact number" error={errors.contact?.message}>
          <input
            className={inputClass}
            placeholder="+92 300 0000000"
            {...register("contact", { required: "Contact number is required." })}
          />
        </Field>
      </div>

      <Button className="mt-6" type="submit" disabled={mutation.isPending}>
        {mutation.isPending && <FiLoader className="animate-spin" aria-hidden="true" />}
        Register hotel
      </Button>
    </form>
  );
};

// ─── Edit form (inline) ───────────────────────────────────────────────────────
const EditHotelForm = ({
  hotel,
  onCancel,
}: {
  hotel: { _id: string; name: string; city: string; address: string; contact: string };
  onCancel: () => void;
}) => {
  const getToken = useAuthToken();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: hotel.name,
      city: hotel.city,
      address: hotel.address,
      contact: hotel.contact,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: Partial<FormValues>) => {
      const token = await getToken();
      return hotelService.update(hotel._id, values, token);
    },
    onSuccess: () => {
      toast.success("Hotel updated.");
      queryClient.invalidateQueries({ queryKey: queryKeys.myHotel });
      onCancel();
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <form
      className="rounded-lg border border-[#eadcc6] bg-[#fffaf0] p-6 shadow-sm"
      onSubmit={handleSubmit((v) => mutation.mutate(v))}
    >
      <h2 className="text-lg font-semibold text-[#17201b]">Edit hotel</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Hotel name" error={errors.name?.message}>
          <input className={inputClass} {...register("name", { required: "Required." })} />
        </Field>
        <Field label="City" error={errors.city?.message}>
          <input className={inputClass} {...register("city", { required: "Required." })} />
        </Field>
        <Field label="Address" error={errors.address?.message}>
          <input className={inputClass} {...register("address", { required: "Required." })} />
        </Field>
        <Field label="Contact" error={errors.contact?.message}>
          <input className={inputClass} {...register("contact", { required: "Required." })} />
        </Field>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending && <FiLoader className="animate-spin" aria-hidden="true" />}
          <FiSave aria-hidden="true" />
          Save changes
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          <FiX aria-hidden="true" />
          Cancel
        </Button>
      </div>
    </form>
  );
};

// ─── Hotel detail card ────────────────────────────────────────────────────────
const HotelCard = ({
  hotel,
}: {
  hotel: { _id: string; name: string; city: string; address: string; contact: string };
}) => {
  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const getToken = useAuthToken();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return hotelService.delete(hotel._id, token);
    },
    onSuccess: () => {
      toast.success("Hotel deleted.");
      queryClient.invalidateQueries({ queryKey: queryKeys.myHotel });
      navigate("/owner");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate();
    setShowDeleteModal(false);
  };

  // const handleDelete = () => {
  //   if (
  //     !window.confirm(
  //       "Delete this hotel? All rooms and bookings associated with it will also be removed. This cannot be undone.",
  //     )
  //   )
  //     return;
  //   deleteMutation.mutate();
  // };

  if (editing) return <EditHotelForm hotel={hotel} onCancel={() => setEditing(false)} />;

  return (
    <div className="rounded-lg border border-[#eadcc6] bg-[#fffaf0] p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a642f]">
            {hotel.city}
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-[#17201b]">{hotel.name}</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setEditing(true)}>
            <FiEdit2 aria-hidden="true" />
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteClick}
            disabled={deleteMutation.isPending}
          >
            <FiTrash2 aria-hidden="true" />
            Delete hotel
          </Button>

          {/* Add modal at end of return JSX */}
          <DeleteHotelModal
            isOpen={showDeleteModal}
            onConfirm={handleConfirmDelete}
            onCancel={() => setShowDeleteModal(false)}
            isLoading={deleteMutation.isPending}
          />
          {/* <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <FiLoader className="animate-spin" aria-hidden="true" />
            ) : (
              <FiTrash2 aria-hidden="true" />
            )}
            Delete
          </Button> */}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <p className="flex items-center gap-2 text-sm text-[#53645b]">
          <FiMapPin aria-hidden="true" className="shrink-0 text-[#8a642f]" />
          {hotel.address}
        </p>
        <p className="flex items-center gap-2 text-sm text-[#53645b]">
          <FiPhone aria-hidden="true" className="shrink-0 text-[#8a642f]" />
          {hotel.contact}
        </p>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export const OwnerHotelPage = () => {
  const getToken = useAuthToken();
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  const hotelQuery = useQuery<Awaited<ReturnType<typeof hotelService.getMyHotel>>, ApiRequestError>({
    queryKey: queryKeys.myHotel,
    queryFn: async () => {
      const token = await getToken();
      return hotelService.getMyHotel(token);
    },
  });
  const isLoading = hotelQuery.isLoading;
  const hasHotel = Boolean(hotelQuery.data?.hotel);
  const noHotel =
    !isLoading &&
    (hotelQuery.isError || !hasHotel);

  return (
    <PageShell
      eyebrow="Owner"
      title="Manage hotel"
      description="Register your property, update its details, or remove it from the platform."
    >
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-[#53645b]">
          <FiLoader className="animate-spin" aria-hidden="true" />
          Loading hotel…
        </div>
      )}

      {hotelQuery.isError && hotelQuery?.error?.status !== 404 && !hotelQuery.data && (
        <ErrorState message="Could not load hotel data. Please try again." />
      )}

      {hasHotel && hotelQuery.data?.hotel && (
        <HotelCard hotel={hotelQuery.data.hotel} />
      )}

      {noHotel && !hotelQuery.isError && <RegisterHotelForm />}

      {/* After a failed load that might just mean "no hotel yet", show register */}
      {hotelQuery.isError && <RegisterHotelForm />}
    </PageShell>
  );
};