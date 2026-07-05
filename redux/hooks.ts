import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  useStore,
} from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Gives components read access to the current store without subscribing to it,
// so reading state inside a callback (e.g. a WebSocket handler) doesn't cause
// re-renders or re-run the effect.
export const useAppStore = () => useStore<RootState>();