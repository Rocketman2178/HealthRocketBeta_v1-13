import { useEffect, useState } from "react";
import { User, X, Loader2, Check, Smartphone, Shield, Activity, Heart, Target } from "lucide-react";
import { useSupabase } from "../../contexts/SupabaseContext";
import { supabase } from "../../lib/supabase";
import LoadingSpinner from "../common/LoadingSpinner";

import { useNavigate } from "react-router-dom";
import { supportedProviders } from "../../constants";


interface VitalSetupProps {
  onComplete: () => void;
  onClose: () => void;
}

export function VitalSetup({ onComplete, onClose }: VitalSetupProps) {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [getVitalUserLoading, setGetVitalUserLoading] = useState(false);
  const [currentVitalUserId, setCurrentVitalUserId] = useState(null);
  const [step, setStep] = useState<"intro" | "setup" | "success">("intro");
  const { user, session: access_token } = useSupabase();

  // CHECK EXISTING VITAL USER
  const checkExistingVitalUser = async () => {
    if (!user) return null;

    try {
      setGetVitalUserLoading(true);
      // Get current vital user details
      const { data: vitalData, error: vitalError } = await supabase.rpc(
        "get_vital_user",
        {
          p_user_id: user.id,
        }
      );

      if (vitalError) throw vitalError;

      // If user has vital_user_id, return it
      if (vitalData?.vital_user_id) {
        setCurrentVitalUserId(vitalData?.vital_user_id);
      }

      // Try to sync vital user
      const { error: syncError } = await supabase.rpc("sync_vital_user", {
        p_user_id: user.id,
      });

      if (syncError) throw syncError;
    } catch (err) {
      setCurrentVitalUserId(null);
    } finally {
      setGetVitalUserLoading(false);
    }
  };

  useEffect(() => {
    checkExistingVitalUser();
  }, [user?.id]);

  // HANDLE SETUP
  const handleSetup = async () => {
    if (!user) return;

    try {
      setError(null);
      setStep("setup");
      try {
        // Only call create-vital-user if no existing ID
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-vital-user`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
              apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({ user_id: user.id }),
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to setup health tracking");
        }
        setStep("success");
        setTimeout(() => {
          onComplete();
        }, 1500);
      } catch (err) {
        throw err;
      }
    } catch (err) {
      console.error("Error setting up health tracking:", err);
      setError(
        err instanceof Error ? err.message : "Failed to setup health tracking"
      );
    } finally {
    }
  };
  const handleNext = () => {
    navigate("/connect-device");
  };
  

  if (getVitalUserLoading) return <LoadingSpinner />;

  //
  const handleGotoConnectDevices = () => {
    onComplete();
  };

  const renderStep = () => {
    switch (step) {
      case "intro":
        return (
          <div className="w-full space-y-8">
            <div className="bg-gray-700/50 rounded-lg p-6">
              <div className="flex flex-col gap-4">
                <p className="text-gray-300 text-xl font-medium leading-relaxed text-center mb-2">
                  Connect your health devices and apps to automatically track your progress:
                </p>
                <ul className="space-y-6 max-w-2xl mx-auto">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Activity size={14} className="text-orange-500" />
                    </div>
                    <span className="text-gray-300">Connect health tracking devices and apps</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Heart size={14} className="text-orange-500" />
                    </div>
                    <span className="text-gray-300">Sync sleep, activity, and other health metrics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Target size={14} className="text-orange-500" />
                    </div>
                    <span className="text-gray-300">Track your progress over time</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-700/50 rounded-lg p-6">
                <h4 className="text-lg font-medium text-white flex items-center gap-2 mb-4">
                  <Smartphone className="text-orange-500" size={20} />
                  Supported Devices
                </h4>

                <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {supportedProviders?.map((provider) => (
                    <li key={provider.name} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-600 flex-shrink-0">
                        <img
                          src={provider?.logo}
                          alt={provider.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-gray-300 text-sm">{provider.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="text-orange-500" size={20} />
                  <h4 className="text-lg font-medium text-white">
                    Data Security
                  </h4>
                </div>
                <p className="text-base text-gray-300 leading-relaxed">
                  Your health data is encrypted and only accessible by you
                </p>
              </div>
            </div>
          </div>
        );

      case "setup":
        return (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
            <p className="text-lg text-gray-300">Setting up health tracking...</p>
          </div>
        );

      case "success":
        return (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 bg-lime-500/20 rounded-full flex items-center justify-center mb-4">
              <Check className="text-lime-500" size={24} />
            </div>
            <p className="text-xl text-gray-300 mb-2">Setup complete!</p>
            <p className="text-base text-gray-400">
              You can now connect your devices
            </p>
          </div>
        );
    }
  };

  if (getVitalUserLoading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col w-full p-6 space-y-6">
      <div className="w-full flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <User className="text-orange-500" size={24} />
          <span>
            {currentVitalUserId
              ? "Connect Your Devices"
              : "Setup Health Tracking"}
          </span>
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
          <X size={20} />
        </button>
      </div>

      {renderStep()}

      {error && (
        <div className="w-full bg-red-500/10 text-red-400 p-3 rounded-lg text-sm text-center mt-4">
          {error}
        </div>
      )}

      <div className="w-full flex flex-col sm:flex-row justify-end items-center gap-2 mt-4">
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={onClose}
            className="px-6 py-3 text-base font-medium text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          {step === "intro" && !currentVitalUserId ? (
            <button
              onClick={handleSetup}
              className="flex-1 sm:flex-initial px-8 py-3 text-base font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Setup Health Tracking
            </button>
          ) : currentVitalUserId && (
            <button
              onClick={handleNext}
              className="flex-1 sm:flex-initial px-8 py-3 text-base font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Go To Connect Devices
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
