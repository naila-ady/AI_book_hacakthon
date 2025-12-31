import React from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import { AuthProvider } from '../contexts/AuthContext';

// A completely minimal layout without navbar and footer
export default function MinimalLayout({ children, title, description, image, keywords, permalink }) {
  console.log('=== MINIMAL LAYOUT DEBUG ===');
  console.log('MinimalLayout is being used - completely minimal without navbar or footer');
  console.log('Props received:', { title, description, image, keywords, permalink });
  console.log('==========================');

  const { siteConfig } = useDocusaurusContext();
  const { withBaseUrl } = useBaseUrlUtils();

  // Construct the full page title
  const pageTitle = title ? `${title} | ${siteConfig.title}` : siteConfig.title;

  // Determine image URL
  const imageUrl = image ? withBaseUrl(image, { absolute: true }) : siteConfig.image;

  return (
    <AuthProvider>
      <div>
        <Head>
          {/* Standard meta tags */}
          {title && <title>{pageTitle}</title>}
          {description && <meta name="description" content={description} />}
          {keywords && <meta name="keywords" content={keywords.join(', ')} />}
          {permalink && <link rel="canonical" href={siteConfig.url + permalink} />}

          {/* Open Graph meta tags */}
          {title && <meta property="og:title" content={title} />}
          {description && <meta property="og:description" content={description} />}
          {imageUrl && <meta property="og:image" content={imageUrl} />}
          {permalink && <meta property="og:url" content={siteConfig.url + permalink} />}
          <meta property="og:type" content="website" />

          {/* Twitter Card meta tags */}
          <meta name="twitter:card" content="summary_large_image" />
          {title && <meta name="twitter:title" content={title} />}
          {description && <meta name="twitter:description" content={description} />}
        </Head>

        {/* Completely minimal structure */}
        <div className="auth-container">
          <div id="minimal-layout-debug" style={{ display: 'none' }}>
            Minimal Layout Active
          </div>
          {children}
        </div>
      </div>
    </AuthProvider>
  );
}