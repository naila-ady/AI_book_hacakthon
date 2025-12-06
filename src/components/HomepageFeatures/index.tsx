import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Read-Aloud Agent',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
       Highlight any section of the book and let the Read-Aloud Agent speak it for you,
       so you can listen to Physical AI concepts instead of only reading them. </>
    ),
  },
  {
    title: 'AI Quiz & Practice Agents',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Dedicated quiz agents generate chapter-specific questions and practice tasks,
        helping you actively test what you learned instead of just reading.
      </>
    ),
  },
  {
    title: 'Interactive Book Chatbot',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
       A custom chatbot trained on the book content lets you ask follow-up questions,
       clarify concepts, and explore Physical AI topics in your own words..
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
