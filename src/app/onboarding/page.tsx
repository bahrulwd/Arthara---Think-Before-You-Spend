"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion, faPlus, faSpinner, faCircleCheck, faTrashCan } from "@fortawesome/free-solid-svg-icons";

export default function OnboardingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customPriorityName, setCustomPriorityName] = useState("");

  // Default priorities state
  const [priorities, setPriorities] = useState([
    { id: "1", name: "Emergency Fund", weight: 5 },
    { id: "2", name: "Education / Career", weight: 4 },
    { id: "3", name: "Family / Dependents", weight: 5 },
    { id: "4", name: "Traveling / Leisure", weight: 2 },
  ]);

  // Handle changing a weight rating
  const handleWeightChange = (id: string, weight: number) => {
    setPriorities(
      priorities.map((p) => (p.id === id ? { ...p, weight } : p))
    );
  };

  // Add custom priority
  const addCustomPriority = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPriorityName.trim()) return;

    const newPriority = {
      id: Math.random().toString(),
      name: customPriorityName.trim(),
      weight: 3, // default neutral rating
    };

    setPriorities([...priorities, newPriority]);
    setCustomPriorityName("");
    setShowAddCustom(false);
  };

  // Delete a priority
  const deletePriority = (id: string) => {
    setPriorities(priorities.filter((p) => p.id !== id));
  };

  // Submit onboarding priorities
  const handleContinue = async () => {
    setIsSubmitting(true);

    // Calculate mindset dynamically based on priority weights
    let mindset = "SECURE";
    const emergencyWeight = priorities.find(p => p.name.includes("Emergency"))?.weight || 3;
    const travelWeight = priorities.find(p => p.name.includes("Traveling"))?.weight || 3;

    if (travelWeight > emergencyWeight) {
      mindset = "IMPULSIVE";
    } else if (emergencyWeight >= 4) {
      mindset = "SECURE";
    } else {
      mindset = "ANXIOUS";
    }

    try {
      const res = await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mindset }),
      });
      if (!res.ok) {
        throw new Error("Failed to save onboarding info");
      }
      router.push("/dashboard");
    } catch (err) {
      console.error("Onboarding submission failed:", err);
      // Fallback to push user forward anyway so flow is not fully blocked
      router.push("/dashboard");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative select-none">
      
      {/* Top Fixed Logo bar */}
      <header className="fixed top-0 w-full z-50">
        <div className="flex justify-between items-center w-full px-6 py-4 mx-auto max-w-7xl">
          <div>
            <img
              src="/images/artharalogo.png"
              alt="Arthara Logo"
              className="h-8 w-auto object-contain"
            />
          </div>
          <button className="text-text-secondary hover:text-white transition-colors">
            <FontAwesomeIcon icon={faCircleQuestion} className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Card Canvas */}
      <main className="w-full max-w-[600px] mt-16 mb-16">
        <div className="bg-[#1E212B] rounded-[24px] p-6 md:p-8 border border-border shadow-2xl space-y-6">
          
          {/* Progress Tracker */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Step 2 of 4</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">50% Complete</span>
            </div>
            <div className="w-full bg-[#12141D] h-2 rounded-full overflow-hidden border border-border/30">
              <div
                className="bg-primary h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: "50%" }}
              ></div>
            </div>
          </div>

          {/* Intro Headers */}
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-2">Set Your Financial Priorities</h1>
            <p className="text-xs text-text-secondary leading-relaxed">
              Assign weights (1-5) to what matters most. We&apos;ll use this to analyze if your spending aligns with your goals.
            </p>
          </div>

          {/* List of priority rows */}
          <div className="space-y-2">
            {priorities.map((priority) => (
              <div
                key={priority.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-2xl hover:bg-background/25 transition-colors group"
              >
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  {priority.name}
                  {/* Option to delete custom priorities */}
                  {priority.id !== "1" && priority.id !== "2" && priority.id !== "3" && priority.id !== "4" && (
                    <button
                      onClick={() => deletePriority(priority.id)}
                      className="opacity-0 group-hover:opacity-100 text-text-secondary hover:text-red-400 transition-opacity"
                    >
                      <FontAwesomeIcon icon={faTrashCan} className="w-4 h-4" />
                    </button>
                  )}
                </span>
                
                {/* Weight Rating Chips */}
                <div className="flex bg-[#12141D] p-1 rounded-full border border-border/40 gap-1 w-fit">
                  {[1, 2, 3, 4, 5].map((num) => {
                    const isActive = priority.weight === num;
                    return (
                      <button
                        key={num}
                        onClick={() => handleWeightChange(priority.id, num)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-lg scale-105"
                            : "text-text-secondary hover:text-white"
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Add custom priority module */}
          {showAddCustom ? (
            <form onSubmit={addCustomPriority} className="p-4 bg-background/40 border border-border rounded-2xl space-y-3 animate-fade-in">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block ml-2">Priority Name</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={customPriorityName}
                  onChange={(e) => setCustomPriorityName(e.target.value)}
                  className="flex-1 h-10 bg-background border border-border rounded-full px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-text-secondary"
                  placeholder="e.g. Buying a House"
                  required
                />
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground font-bold px-4 rounded-full text-xs hover:brightness-105 active:scale-95 transition-all"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCustom(false)}
                  className="border border-border text-text-secondary px-4 rounded-full text-xs hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowAddCustom(true)}
              className="w-full py-3.5 border border-border rounded-full text-text-secondary hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-1.5 group active:scale-95"
            >
              <FontAwesomeIcon icon={faPlus} className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-xs font-semibold">Add another priority</span>
            </button>
          )}

          {/* Form control buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4">
            <button
              onClick={() => router.back()}
              className="w-full sm:w-auto px-10 py-3 rounded-full text-text-secondary font-bold hover:bg-background/40 hover:text-white text-xs transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleContinue}
              disabled={isSubmitting}
              className="w-full sm:w-[200px] px-10 py-3 rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 animate-spin text-primary-foreground" />
                  Saving...
                </>
              ) : (
                "Continue"
              )}
            </button>
          </div>

        </div>

        {/* Dynamic Graphic Asset Banner */}
        <div className="mt-8 flex justify-center opacity-40 hover:opacity-100 transition-opacity duration-700">
          <div className="relative w-36 h-36 border border-border rounded-full overflow-hidden">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCT6SHbCCCcjfOApdYLshQ4ZVK-f8PoTkYQi6XfKSDRKqr0j1U5trlIM2vvHl-vdYLCpBmxS3fv-CVrjpm3xy7b23OGy-7o2UtfeBGhv2CNG_QTb68mzjkmi-6ugU5zdj4M22SWjxR9KOh8ibKxOh52Ey3UcC9JovzOYgm4VMXipbFkw4SerUnkELQ9tNYhS_A4j0hHzh8kHpLapdOQbrV8mOJeWMcHaRS1fRz7upmf77Gc6LTqJYiOx3IW94vlt-VSnr65MqTsz54')` }}
            ></div>
          </div>
        </div>
      </main>

    </div>
  );
}
