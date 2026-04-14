import { CardPreview } from "@/components/custom-card-preview";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <main className="p-4">
      <h1>Hello World</h1>
      <Link to="/about">About</Link>
      <CardPreview />
    </main>
  );
}
