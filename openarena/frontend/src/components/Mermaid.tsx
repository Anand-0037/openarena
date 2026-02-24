'use client';

import React, { useEffect, useState, useRef } from 'react';
import mermaid from 'mermaid';

export default function Mermaid({ chart }: { chart: string }) {
  const svgId = React.useId().replace(/:/g, '');
  const [svg, setSvg] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        fontFamily: 'var(--font-space-mono)',
        primaryColor: '#fde047',
        primaryBorderColor: '#121212',
        primaryTextColor: '#121212',
        secondaryColor: '#ef4444',
        tertiaryColor: '#3b82f6',
        lineColor: '#121212',
      },
      flowchart: {
        htmlLabels: true,
        curve: 'stepAfter',
      }
    });

    const renderChart = async () => {
      if (containerRef.current) {
        try {
          const { svg } = await mermaid.render(svgId, chart);
          setSvg(svg);
        } catch (error) {
          console.error('Mermaid rendering failed', error);
        }
      }
    };

    renderChart();
  }, [chart, svgId]);

  return (
    <div
      ref={containerRef}
      className="mermaid-container flex justify-center w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
