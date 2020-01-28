import { useState, useEffect } from "react";

/** useDidMount is used as componentDidMount  */
export function useDidMount() {
  const [didMount, setDidMount] = useState(false);
  useEffect(() => setDidMount(true), []);
  return didMount;
}
