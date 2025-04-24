import { useEffect } from "react";
import { useOneSignalSetup } from "./hook/use-signal";

function App() {
  const { subscribe } = useOneSignalSetup(import.meta.env.VITE_ONE_SIGNAL);

  useEffect(() => {
    const handleOneSignal = async () => {
      await subscribe().then(async (res) => {
        console.log("RES", res);
      });
    };
    handleOneSignal();
  }, []);

  return <></>;
}

export default App;
