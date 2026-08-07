import { useCallback, useEffect, useReducer, useRef } from "react";

type SetStateActionFunc<S> = (prevState: S) => Partial<S>;
type SetStateAction<S> = Partial<S> | SetStateActionFunc<S>;
type SetStateCallback = () => void;

type ReducerState<S> = S extends object ? S : Record<string, unknown>;

function useSetState<S extends object>(initialState: S) {
	const callbackRef = useRef<SetStateCallback | undefined>(undefined);
	const [state, dispatch] = useReducer((prevState: S, action: SetStateAction<S>): S => {
		const patch = typeof action === "function" ? action(prevState) : action;
		return { ...prevState, ...patch };
	}, initialState);

	useEffect(() => {
		if (!callbackRef.current) {
			return;
		}
		const callback = callbackRef.current;
		callbackRef.current = undefined;
		callback();
	}, [state]);

	const setState = useCallback((action: SetStateAction<S>, callback?: SetStateCallback) => {
		callbackRef.current = callback;
		dispatch(action);
	}, []);

	return [state, setState] as const;
}

export default useSetState;
