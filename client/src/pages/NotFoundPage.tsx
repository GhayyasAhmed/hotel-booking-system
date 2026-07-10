import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export const NotFoundPage = () => (
  <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
    <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">404</p>
    <h1 className="mt-3 text-3xl font-semibold text-slate-950">Page not found</h1>
    <p className="mt-3 text-sm leading-6 text-slate-600">
      The page you opened does not exist or may have moved.
    </p>
    <Link className="mt-6" to="/">
      <Button>Go home</Button>
    </Link>
  </main>
);
