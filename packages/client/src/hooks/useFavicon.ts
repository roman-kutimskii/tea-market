import { useColorScheme } from "@mui/material";
import { useEffect } from "react";
import lightLogo from "/light-logo.svg";
import darkLogo from "/dark-logo.svg";

export const useFavicon = () => {
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    const favicon = document.querySelector<HTMLLinkElement>("link[rel=icon]");
    if (favicon) {
      favicon.href = colorScheme === "light" ? lightLogo : darkLogo;
    }
  }, [colorScheme]);
};
