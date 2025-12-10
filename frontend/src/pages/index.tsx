// import type {ReactNode} from 'react';
// import clsx from 'clsx';
// import Link from '@docusaurus/Link';
// import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
// import Layout from '@theme/Layout';
// import Chatbot from '@site/src/components/Chatbot';
// import HomepageFeatures from '@site/src/components/HomepageFeatures';
// import Heading from '@theme/Heading';

// import styles from './index.module.css';

// function HomepageHeader() {
//   const {siteConfig} = useDocusaurusContext();
//   return (
//     <header className={clsx('hero hero--primary', styles.heroBanner)}>
//       <div className="container">
//         <Heading as="h1" className="hero__title">
//           {siteConfig.title}
//         </Heading>
//         <p className="hero__subtitle">{siteConfig.tagline}</p>
//         <div className={styles.buttons}>
//           <Link
//             className="button button--secondary button--lg"
//             to="/docs/intro">
//             Physical AI & Humanoid Robotics Video Tutorial 
//             🎥      CLICK HERE TO WATCH THE VIDEO ⏱️
//           </Link>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default function Home(): ReactNode {
//   const {siteConfig} = useDocusaurusContext();
//   return (
//     <Layout
//       title={` ${siteConfig.title}`}
//       description="Description will go into a meta tag in <head />">
//       <HomepageHeader />
//       <main>
//         <HomepageFeatures />
//         <Chatbot />
//       </main>
//     </Layout>
//   );
// }
import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Chatbot from '@site/src/components/Chatbot';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header
      className={clsx('hero hero--primary', styles.heroBanner)}
      style={{
        background: 'linear-gradient(90deg, #0D0D0D, #1a1a1a)', // dark background
        color: '#ff9f0d', // primary accent color
      }}
    >
      <div className="container">
        <Heading as="h1" className="hero__title" style={{ color: '#ff9f0d' }}>
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle" style={{ color: '#ffffff' }}>
          {siteConfig.tagline}
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            style={{
              backgroundColor: '#ff9f0d', // orange button
              color: '#0D0D0D',           // dark text
              borderRadius: '8px',
              border: '1px solid #ffb733',
            }}
            to="/docs/intro"
          >
            Physical AI & Humanoid Robotics Video Tutorial 🎥 CLICK HERE TO WATCH THE VIDEO ⏱️
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={` ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
      wrapperProps={{
        style: {
          backgroundColor: '#0D0D0D', // main page background
        },
      }}
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <Chatbot />
      </main>
    </Layout>
  );
}
