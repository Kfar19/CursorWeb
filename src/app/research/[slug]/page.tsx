import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Research paper metadata
const researchPapers = {
  'from-rails-to-returns': {
    title: 'From Rails to Returns: Payments Circle',
    description: 'Comprehensive analysis of payment infrastructure evolution and investment opportunities in fintech',
    fileName: 'From Rails to Returns_ Payments Circle.pdf',
    image: '/api/og?title=From%20Rails%20to%20Returns&subtitle=Payments%20Circle'
  },
  'from-wires-to-wallets': {
    title: 'From Wires to Wallets',
    description: 'Mental model shift for how we should think about Bitcoin relative to past innovations',
    fileName: 'From-Wires-to-Wallets.pdf',
    image: '/api/og?title=From%20Wires%20to%20Wallets&subtitle=Bitcoin%20Mental%20Model'
  }
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const paper = researchPapers[slug as keyof typeof researchPapers];
  
  if (!paper) {
    return {
      title: 'Research Paper Not Found',
    };
  }

  return {
    title: `${paper.title} - Birdai Research`,
    description: paper.description,
    alternates: {
      canonical: `/research/${slug}`,
    },
    openGraph: {
      title: `${paper.title} - Birdai Research`,
      description: paper.description,
      type: 'article',
      url: `/research/${slug}`,
      images: [
        {
          url: paper.image,
          width: 1200,
          height: 630,
          alt: paper.title,
        },
      ],
      siteName: 'Birdai',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${paper.title} - Birdai Research`,
      description: paper.description,
      images: [paper.image],
    },
  };
}

export default async function ResearchPaperPage({ params }: Props) {
  const { slug } = await params;
  const paper = researchPapers[slug as keyof typeof researchPapers];
  
  if (!paper) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h1 className="text-3xl font-bold text-white mb-4">{paper.title}</h1>
            <p className="text-gray-300 mb-6">{paper.description}</p>
            
            <div className="bg-white/10 rounded-xl p-6">
              <iframe
                src={`/research/${paper.fileName}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-96 rounded-lg border border-white/10"
                title={paper.title}
              />
            </div>
            
            <div className="mt-6 flex items-center justify-between">
              <p className="text-gray-400 text-sm">
                Research paper by Birdai - See What Others Miss
              </p>
              <a
                href={`/research/${paper.fileName}`}
                download
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300"
              >
                Download PDF
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 