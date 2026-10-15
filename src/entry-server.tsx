import { renderToString } from "react-dom/server";
import App from "./app/App";

// Runs only during the build. Hosting remains completely static.
export function render() {
  return renderToString(<App />);
}
