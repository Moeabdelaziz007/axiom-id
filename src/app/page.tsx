import Hero from "./Hero";
import Problem from "./Problem";
import Solution from "./Solution";
import UseCases from "./UseCases";
import CTA from "./CTA";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero />
      <Problem />
      <Solution />
      <UseCases />
      <CTA />
    </main>
  );
}