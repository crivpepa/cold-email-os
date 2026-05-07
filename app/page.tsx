import { Header } from "@/components/header";
import { GenerateFlow } from "@/components/generate-flow";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-5 sm:px-6">
          <Header />
          <div className="pb-24">
            <GenerateFlow />
          </div>
        </div>
      </main>

      <footer className="border-t border-border/40 mt-auto">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 py-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>Cold Email OS</span>
          <span>
            Built with{" "}
            <a
              href="https://www.anthropic.com/claude"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              Claude
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
