import { RouterProvider } from "react-router/dom";
import { AppProviders } from "./providers/AppProviders";
import { router } from "./routes/app-router";

const App = () => (
  <AppProviders>
    <RouterProvider router={router} />
  </AppProviders>
);

export default App;
