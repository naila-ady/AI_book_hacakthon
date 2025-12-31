import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  image: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Read-Aloud Agent',
    image: require('@site/static/img/three.jpg').default,
    description: (
      <>
       Highlight any section of the book and let the Read-Aloud Agent speak it for you,
       so you can listen to Physical AI concepts instead of only reading them. </>
    ),
  },
  {
    title: 'AI Quiz & Practice Agents',
    image: require('@site/static/img/two.jpg').default,
    description: (
      <>
        Dedicated quiz agents generate chapter-specific questions and practice tasks,
        helping you actively test what you learned instead of just reading.
      </>
    ),
  },
  {
    title: 'Interactive Book Chatbot',
    image: require('@site/static/img/one.jpg').default,
    description: (
      <>
       A custom chatbot trained on the book content lets you ask follow-up questions,
       clarify concepts, and explore Physical AI topics in your own words..
      </>
    ),
  },
];

function Feature({title, image, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img src={image} className={styles.featureSvg} alt={title} />
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
