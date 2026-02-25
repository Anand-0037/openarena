import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { ArrowLeft } from 'lucide-react';
import Mermaid from '../../components/Mermaid';
import 'katex/dist/katex.min.css';

export default function WhitepaperPage() {
  const filePath = path.join(process.cwd(), 'src/content/whitepaper.md');
  const fileContent = fs.readFileSync(filePath, 'utf8');

  return (
    <div className="min-h-screen pb-24 font-sans selection:bg-brand-yellow selection:text-black">
      {/* Navigation */}
      <nav className="border-b-4 border-black bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center space-x-2 brutal-shadow-hover hover:-translate-x-1">
              <div className="w-8 h-8 bg-brand-red border-2 border-black flex items-center justify-center">
                <ArrowLeft size={20} className="text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight uppercase">Back to Arena</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16">
        <div className="bg-white border-4 border-black brutal-shadow p-8 md:p-12 prose prose-lg prose-black max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeRaw, rehypeKatex]}
            components={{
              code({ inline, className, children, ...props }: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { inline?: boolean }) {
                const match = /language-(\w+)/.exec(className || '');
                if (!inline && match && match[1] === 'mermaid') {
                  return <Mermaid chart={String(children).replace(/\n$/, '')} />;
                }
                return !inline ? (
                  <pre className="bg-black text-green-400 p-4 font-mono text-sm overflow-x-auto brutal-shadow">
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                ) : (
                  <code className="bg-gray-200 px-1 py-0.5 rounded text-sm text-red-600" {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {fileContent}
          </ReactMarkdown>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="inline-flex items-center justify-center space-x-2 font-black text-lg px-8 py-4 border-4 border-black bg-brand-yellow text-black brutal-shadow brutal-shadow-hover">
            <span>Return to Home</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
