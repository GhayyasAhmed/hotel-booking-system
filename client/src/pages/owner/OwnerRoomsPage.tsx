import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  FiCamera,
  FiEdit2,
  FiLoader,
  FiPlus,
  FiSave,
  FiToggleLeft,
  FiToggleRight,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { ErrorState } from "../../components/feedback/ErrorState";
import { EmptyState } from "../../components/feedback/EmptyState";
import { Button } from "../../components/ui/Button";
import { PageShell } from "../../components/ui/PageShell";
import { useAuthToken } from "../../hooks/use-auth-token";
import { getErrorMessage } from "../../lib/api-error";
import { formatCurrency } from "../../lib/format";
import { getRoomImage } from "../../lib/images";
import { type RoomPayload, roomService } from "../../services/roomService";
import { queryKeys } from "../../services/queryKeys";
import { type Room } from "../../types/api";

// ─── Shared helpers ───────────────────────────────────────────────────────────

const inputClass =
  "h-11 w-full rounded-lg border border-[#ddc8a3] bg-white px-4 text-sm outline-none ring-[#d7a85f]/30 focus:ring-4";

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

type FormValues = {
  roomType: string;
  pricePerNight: number;
  amenities: string;
};

const parseAmenities = (raw: string): string[] =>
  raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

// ─── Image preview strip ──────────────────────────────────────────────────────
const ImagePreview = ({ files }: { files: FileList | null }) => {
  if (!files || files.length === 0) return null;
  const urls = Array.from(files).map((f) => URL.createObjectURL(f));
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {urls.map((url, i) => (
        <img
          key={i}
          src={url}
          alt={`Preview ${i + 1}`}
          className="h-20 w-28 rounded-lg object-cover border border-[#eadcc6]"
        />
      ))}
    </div>
  );
};

// ─── Create room form ─────────────────────────────────────────────────────────
const CreateRoomForm = ({ onClose }: { onClose: () => void }) => {
  const getToken = useAuthToken();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [previewFiles, setPreviewFiles] = useState<FileList | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { pricePerNight: 50 } });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const token = await getToken();
      const payload: RoomPayload = {
        roomType: values.roomType,
        pricePerNight: Number(values.pricePerNight),
        amenities: parseAmenities(values.amenities),
        images: fileRef.current?.files ?? undefined,
      };
      return roomService.create(payload, token);
    },
    onSuccess: () => {
      toast.success("Room created.");
      reset();
      setPreviewFiles(null);
      queryClient.invalidateQueries({ queryKey: queryKeys.ownerRooms });
      onClose();
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <form
      className="rounded-lg border border-[#eadcc6] bg-[#fffaf0] p-6 shadow-sm"
      onSubmit={handleSubmit((v) => mutation.mutate(v))}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#17201b]">New room</h2>
        <button
          type="button"
          className="rounded-full p-1 text-[#53645b] hover:bg-[#f3e8d4]"
          onClick={onClose}
          aria-label="Close form"
        >
          <FiX aria-hidden="true" />
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Room type" error={errors.roomType?.message}>
          <input
            className={inputClass}
            placeholder="Deluxe Double"
            {...register("roomType", { required: "Room type is required." })}
          />
        </Field>
        <Field label="Price per night (USD)" error={errors.pricePerNight?.message}>
          <input
            className={inputClass}
            type="number"
            min={1}
            {...register("pricePerNight", {
              required: "Price is required.",
              min: { value: 1, message: "Must be at least $1." },
            })}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Amenities (comma-separated)" error={undefined}>
            <input
              className={inputClass}
              placeholder="WiFi, Air Conditioning, Mini Bar"
              {...register("amenities")}
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-[#31423a]">
            Photos (up to 4)
          </label>
          <button
            type="button"
            className="mt-1.5 flex items-center gap-2 rounded-lg border border-dashed border-[#ddc8a3] bg-white px-4 py-3 text-sm text-[#8a642f] transition hover:bg-[#fdf6ec]"
            onClick={() => fileRef.current?.click()}
          >
            <FiCamera aria-hidden="true" />
            Choose images
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => setPreviewFiles(e.target.files)}
          />
          <ImagePreview files={previewFiles} />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending && <FiLoader className="animate-spin" aria-hidden="true" />}
          <FiSave aria-hidden="true" />
          Save room
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

// ─── Edit room form ───────────────────────────────────────────────────────────
const EditRoomForm = ({ room, onClose }: { room: Room; onClose: () => void }) => {
  const getToken = useAuthToken();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [previewFiles, setPreviewFiles] = useState<FileList | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      roomType: room.roomType,
      pricePerNight: room.pricePerNight,
      amenities: room.amenities.join(", "),
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const token = await getToken();
      const payload: Partial<RoomPayload> = {
        roomType: values.roomType,
        pricePerNight: Number(values.pricePerNight),
        amenities: parseAmenities(values.amenities),
      };
      if (fileRef.current?.files?.length) {
        payload.images = fileRef.current.files;
      }
      return roomService.update(room._id, payload, token);
    },
    onSuccess: () => {
      toast.success("Room updated.");
      queryClient.invalidateQueries({ queryKey: queryKeys.ownerRooms });
      onClose();
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <form
      className="rounded-lg border border-[#102f2f]/20 bg-[#fffaf0] p-6 shadow-sm"
      onSubmit={handleSubmit((v) => mutation.mutate(v))}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#17201b]">Edit room</h2>
        <button
          type="button"
          className="rounded-full p-1 text-[#53645b] hover:bg-[#f3e8d4]"
          onClick={onClose}
          aria-label="Close"
        >
          <FiX aria-hidden="true" />
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Room type" error={errors.roomType?.message}>
          <input
            className={inputClass}
            {...register("roomType", { required: "Required." })}
          />
        </Field>
        <Field label="Price per night (USD)" error={errors.pricePerNight?.message}>
          <input
            className={inputClass}
            type="number"
            min={1}
            {...register("pricePerNight", { required: "Required.", min: 1 })}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Amenities (comma-separated)" error={undefined}>
            <input className={inputClass} {...register("amenities")} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-[#31423a]">
            Replace photos (optional)
          </label>
          <button
            type="button"
            className="mt-1.5 flex items-center gap-2 rounded-lg border border-dashed border-[#ddc8a3] bg-white px-4 py-3 text-sm text-[#8a642f] transition hover:bg-[#fdf6ec]"
            onClick={() => fileRef.current?.click()}
          >
            <FiCamera aria-hidden="true" />
            Choose new images
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => setPreviewFiles(e.target.files)}
          />
          <ImagePreview files={previewFiles} />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending && <FiLoader className="animate-spin" aria-hidden="true" />}
          <FiSave aria-hidden="true" />
          Save changes
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

// ─── Room card ────────────────────────────────────────────────────────────────
const RoomCard = ({ room }: { room: Room }) => {
  const [editing, setEditing] = useState(false);
  const getToken = useAuthToken();
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return roomService.toggleAvailability(room._id, token);
    },
    onSuccess: (data) => {
      toast.success(
        data.room.isAvailable ? "Room is now available." : "Room marked unavailable.",
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.ownerRooms });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return roomService.delete(room._id, token);
    },
    onSuccess: () => {
      toast.success("Room deleted.");
      queryClient.invalidateQueries({ queryKey: queryKeys.ownerRooms });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const handleDelete = () => {
    if (!window.confirm("Delete this room? All its bookings and reviews will be removed."))
      return;
    deleteMutation.mutate();
  };

  if (editing) return <EditRoomForm room={room} onClose={() => setEditing(false)} />;

  return (
    <div className="overflow-hidden rounded-lg border border-[#eadcc6] bg-[#fffaf0] shadow-sm">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={getRoomImage(room.images)}
          alt={room.roomType}
          className="size-full object-cover"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            room.isAvailable
              ? "bg-emerald-100 text-emerald-800"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {room.isAvailable ? "Available" : "Unavailable"}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-[#17201b]">{room.roomType}</h3>
            <p className="mt-0.5 text-sm font-semibold text-[#102f2f]">
              {formatCurrency(room.pricePerNight)}
              <span className="font-normal text-[#53645b]"> / night</span>
            </p>
          </div>
        </div>

        {room.amenities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {room.amenities.slice(0, 3).map((a) => (
              <span
                key={a}
                className="rounded-full bg-[#f3e8d4] px-2 py-0.5 text-xs font-medium text-[#5f4a31]"
              >
                {a}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="rounded-full bg-[#f3e8d4] px-2 py-0.5 text-xs font-medium text-[#5f4a31]">
                +{room.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => toggleMutation.mutate()}
            disabled={toggleMutation.isPending}
          >
            {toggleMutation.isPending ? (
              <FiLoader className="animate-spin" aria-hidden="true" />
            ) : room.isAvailable ? (
              <FiToggleRight aria-hidden="true" />
            ) : (
              <FiToggleLeft aria-hidden="true" />
            )}
            {room.isAvailable ? "Mark unavailable" : "Mark available"}
          </Button>
          <Button variant="ghost" onClick={() => setEditing(true)}>
            <FiEdit2 aria-hidden="true" />
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <FiLoader className="animate-spin" aria-hidden="true" />
            ) : (
              <FiTrash2 aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export const OwnerRoomsPage = () => {
  const [showCreate, setShowCreate] = useState(false);
  const getToken = useAuthToken();

  const roomsQuery = useQuery({
    queryKey: queryKeys.ownerRooms,
    queryFn: async () => {
      const token = await getToken();
      return roomService.getOwnerRooms(token);
    },
  });
  
  console.log("roomsQuery", roomsQuery)
  console.log("roomsQuery?.error?.message", roomsQuery?.error?.message)
    // console.log("roomsQuery?.error?.status", roomsQuery?.error?.status)
  return (
    <PageShell
      eyebrow="Owner"
      title="Manage rooms"
      description="Create polished room listings with photos, amenities, pricing, and availability."
      actions={
        !showCreate ? (
          <Button onClick={() => setShowCreate(true)}>
            <FiPlus aria-hidden="true" />
            Add room
          </Button>
        ) : undefined
      }
    >
      <div className="space-y-6">
        {showCreate && <CreateRoomForm onClose={() => setShowCreate(false)} />}

        {roomsQuery.isLoading && (
          <div className="flex items-center gap-2 text-sm text-[#53645b]">
            <FiLoader className="animate-spin" aria-hidden="true" />
            Loading rooms…
          </div>
        )}


        {roomsQuery.isError && <ErrorState message={roomsQuery?.error?.message}/>}

        {!roomsQuery.isLoading && roomsQuery.data?.rooms.length === 0 && !showCreate && (
          <EmptyState
            title="No rooms listed yet"
            message="Add your first room to start accepting reservations."
          />
        )}

        {roomsQuery.data?.rooms.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {roomsQuery.data.rooms.map((room) => (
              <RoomCard room={room} key={room._id} />
            ))}
          </div>
        ) : null}
      </div>
    </PageShell>
  );
};