"use client";

import { Provider } from "react-redux";
import { ThemeProvider, CssBaseline } from "@mui/material";

import { store } from "@/redux/store";
import theme from "@/styles/theme";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {children}
      </ThemeProvider>
    </Provider>
  );
}
