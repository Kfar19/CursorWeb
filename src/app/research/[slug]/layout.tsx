import type { Metadata } from 'next';

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
  children: React.ReactNode;
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

export default function ResearchLayout({ children }: Props) {
  return children;
} 