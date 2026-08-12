import { useEffect } from "react";
import { ElevateBrandWizard } from "@/features/elevate-wizard/ElevateBrandWizard";
import { updateSeoMeta } from "@/lib/seo";

const StartYourBrand = () => {
  useEffect(() => {
    updateSeoMeta({
      title: "Start Your Brand | FluxFom",
      description:
        "Start your brand with FluxFom. We help founders and teams sharpen positioning, creative systems, and growth strategy for measurable market momentum.",
      pathname: "/start",
    });
  }, []);

  return (
    <div className="bg-flux-void text-white">
      <ElevateBrandWizard />
    </div>
  );
};

export default StartYourBrand;
