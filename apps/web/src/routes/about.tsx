import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <main className="p-4">
      <h1>About</h1>
      <Link to="/">Home</Link>
    </main>
  );
}
