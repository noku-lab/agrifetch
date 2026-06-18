import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 p-16 text-center">
      <h1 className="text-3xl font-semibold">404</h1>
      <p className="text-sm opacity-70">This terminal node does not exist.</p>
      <Link to="/" className="underline">
        Return to Landing Hub
      </Link>
    </section>
  );
}
