import React, { useEffect } from "react";

const RE_CPS_2026_URL = "https://reactor-model.org/events/recps-2026/";

export default function ReCPS2026Redirect() {
  useEffect(() => {
    window.location.replace(RE_CPS_2026_URL);
  }, []);

  return null;
}
