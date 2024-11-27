import { useState, useEffect } from "react";

import { initParticlesEngine } from "@tsparticles/react"
import { loadAll } from "@tsparticles/all"

export function useInitParticles() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadAll(engine);
      setInit(true);
    });
  }, []);

  return init;
}
