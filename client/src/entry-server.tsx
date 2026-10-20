import { renderToString } from "react-dom/server";
import App from "./App";

export function render(url: string): string {
  const pathname = url.split("?")[0] || "/";
  return renderToString(<App ssrPath={pathname} />);
}
