import { useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiArrowRight, FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { PageShell } from "../../components/ui/PageShell";
import { useAuthToken } from "../../hooks/use-auth-token";
import { getErrorMessage } from "../../lib/api-error";
import { queryKeys } from "../../services/queryKeys";
import { userService } from "../../services/userService";

export const OwnerSignupPage = () => {
  const navigate = useNavigate();
  const getToken = useAuthToken();
  const queryClient = useQueryClient();
  const { user, isLoaded } = useUser();
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const mutation = useMutation({ 
    mutationFn: async () => {
      const token = await getToken();
      return userService.updateRole("owner", token);
    },
    onSuccess: async () => {
      toast.success("Welcome! You're now a property owner.");
      // Force Clerk to re-fetch session so publicMetadata.role updates immediately
      await user?.reload();
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
      navigate("/owner/hotel");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  if (!isLoaded) return null;

  if (user?.publicMetadata?.role === "owner") {
    navigate("/owner");
    return null;
  }

  const onSubmit = () => {
    if (!agreedToTerms) {
      toast.error("Please agree to the terms.");
      return;
    }
    mutation.mutate();
  };

  return (
    <PageShell
      eyebrow="New Host"
      title="Become a property owner"
      description="List your hotel and start earning from bookings."
    >
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-lg border border-[#eadcc6] bg-[#fffaf0] p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#17201b]">What you'll get</h2>
          <ul className="mt-4 space-y-2 text-sm text-[#53645b]">
            <li className="flex items-start gap-3">
              <span className="text-[#d7a85f] font-bold">✓</span>
              <span>List one or more properties and manage availability</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d7a85f] font-bold">✓</span>
              <span>Track bookings and guest reviews in real-time</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d7a85f] font-bold">✓</span>
              <span>Get paid instantly for confirmed bookings</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d7a85f] font-bold">✓</span>
              <span>Access owner tools and analytics dashboard</span>
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-[#eadcc6] bg-[#fffaf0] p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#17201b]">Requirements</h2>
          <ul className="mt-4 space-y-2 text-sm text-[#53645b]">
            <li className="flex items-start gap-3">
              <span className="text-[#d7a85f] font-bold">•</span>
              <span>Valid email and phone number</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d7a85f] font-bold">•</span>
              <span>Property details (location, amenities, pricing)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#d7a85f] font-bold">•</span>
              <span>High-quality photos of your property</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4 rounded-lg border border-[#eadcc6] bg-[#fffaf0] p-6 shadow-sm">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 rounded border-[#ddc8a3] bg-white accent-[#d7a85f]"
            />
            <span className="text-sm text-[#53645b]">
              I agree that I own or have authority to list this property, and I accept the{" "}
              <span className="font-semibold text-[#17201b]">Host Terms & Conditions</span>
            </span>
          </label>

          <Button
            onClick={onSubmit}
            disabled={!agreedToTerms || mutation.isPending}
            className="w-full"
          >
            {mutation.isPending && <FiLoader className="animate-spin" aria-hidden="true" />}
            <FiArrowRight aria-hidden="true" />
            Become an owner
          </Button>
        </div>
      </div>
    </PageShell>
  );
};