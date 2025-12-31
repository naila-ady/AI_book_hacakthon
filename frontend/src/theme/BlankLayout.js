import React from 'react';
import Head from '@docusaurus/Head';
import { useLocation } from '@docusaurus/router';
import { useSiteData } from '@docusaurus/useSiteData';
import { useBaseUrl } from '@docusaurus/useBaseUrl';
import { AuthProvider } from '../contexts/AuthContext';

// A layout without navbar and footer
export default function BlankLayout({ children, title, description, image, keywords, permalink }) {
  console.log('BlankLayout is being used - should not have navbar or footer');
  const location = useLocation();
  const siteData = useSiteData();

  // Construct the full page title
  const pageTitle = title ? `${title} | ${siteData.title}` : siteData.title;

  // Determine image URL
  const imageUrl = image ? useBaseUrl(image, { absolute: true }) : siteData.image;

  return (
    <AuthProvider>
      <Head>
        {/* Standard meta tags */}
        {title && <title>{pageTitle}</title>}
        {description && <meta name="description" content={description} />}
        {keywords && <meta name="keywords" content={keywords.join(', ')} />}
        {permalink && <link rel="canonical" href={siteData.url + permalink} />}

        {/* Open Graph meta tags */}
        {title && <meta property="og:title" content={title} />}
        {description && <meta property="og:description" content={description} />}
        {imageUrl && <meta property="og:image" content={imageUrl} />}
        {permalink && <meta property="og:url" content={siteData.url + permalink} />}
        <meta property="og:type" content="website" />

        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        {title && <meta name="twitter:title" content={title} />}
        {description && <meta name="twitter:description" content={description} />}
      </Head>

      <div className="container">
        <main id="main" className="main-wrapper">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}