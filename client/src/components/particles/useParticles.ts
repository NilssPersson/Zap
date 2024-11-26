import { useState, useEffect } from "react";

import { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim";

export function useInitParticles() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
      setInit(true);
    });
  }, []);

  return init;
}
