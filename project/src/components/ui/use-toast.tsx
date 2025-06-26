import * as React from "react";
import { ToastActionElement, type ToastProps } from "./toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) return;

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: "REMOVE_TOAST", toastId });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

type Action =
  | { type: "ADD_TOAST"; toast: ToasterToast }
  | { type: "UPDATE_TOAST"; toast: Partial<ToasterToast> & { id: string } }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId: string };

const reducer = (state: ToasterToast[], action: Action): ToasterToast[] => {
  switch (action.type) {
    case "ADD_TOAST": {
      return [action.toast, ...state].slice(0, TOAST_LIMIT);
    }
    case "UPDATE_TOAST": {
      return state.map((t) =>
        t.id === action.toast.id ? { ...t, ...action.toast } : t
      );
    }
    case "DISMISS_TOAST": {
      const updatedState = state.map((t) =>
        t.id === action.toastId || action.toastId === undefined
          ? { ...t, open: false }
          : t
      );
      updatedState.forEach((t) => {
        if (t.id === action.toastId || action.toastId === undefined) {
          addToRemoveQueue(t.id);
        }
      });
      return updatedState;
    }
    case "REMOVE_TOAST": {
      return state.filter((t) => t.id !== action.toastId);
    }
    default:
      return state;
  }
};

const listeners: Array<(state: ToasterToast[]) => void> = [];
let memoryState: ToasterToast[] = [];

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

function useToast() {
  const [state, setState] = React.useState<ToasterToast[]>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  const toast = React.useCallback((props: ToastProps) => {
    const id = genId();

    const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
    const update = (updateProps: Partial<ToasterToast>) =>
      dispatch({ type: "UPDATE_TOAST", toast: { ...updateProps, id } });

    dispatch({
      type: "ADD_TOAST",
      toast: {
        ...props,
        id,
        open: true,
        onOpenChange: (open) => {
          if (!open) dismiss();
        },
      },
    });

    return { id, dismiss, update };
  }, []);

  const dismiss = React.useCallback((toastId?: string) => {
    dispatch({ type: "DISMISS_TOAST", toastId });
  }, []);

  return { toasts: state, toast, dismiss };
}

export { useToast, dispatch };
export type { ToasterToast };
