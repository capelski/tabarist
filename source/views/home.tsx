import React, { PropsWithChildren } from 'react';
import browseTabs from '../assets/browse-tabs.png';
import create from '../assets/create.png';
import playAlong from '../assets/play-along.png';
import { MetaTags } from './common/meta-tags';

export type FullScreenSectionProps = PropsWithChildren<{}>;

export const FullScreenSection: React.FC<FullScreenSectionProps> = (props) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 70px)',
      }}
    >
      {props.children}
    </div>
  );
};

export type WideSectionProps = { description: string; imageSrc: string; title: string };

export const WideSection: React.FC<WideSectionProps> = (props) => {
  return (
    <div style={{ padding: '20px 20px 80px 20px', textAlign: 'center' }}>
      <h2 style={{ color: '#666' }}>{props.title}</h2>
      <p>{props.description}</p>
      <HomeImage src={props.imageSrc} alt={props.title} />
    </div>
  );
};

const HomeImage: React.FC<
  React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>
> = (props) => {
  return <img src={props.src} alt={props.alt} style={{ maxWidth: '100%', width: '600px' }} />;
};

export const HomeView: React.FC = () => {
  return (
    <React.Fragment>
      <MetaTags title="Tabarist" />

      <FullScreenSection>
        <h1>Tabarist 🎸</h1>
        <p>Guitar tabs made easy. Browse. Play along. Create.</p>
      </FullScreenSection>

      <WideSection
        title="Browse"
        description="Find the tab you are looking for among our extensive collection."
        imageSrc={browseTabs}
      />

      <WideSection
        title="Play along"
        description="Choose your tempo and play along while the tab guides you."
        imageSrc={playAlong}
      />

      <WideSection
        title="Create"
        description="The simple editor makes it easier than ever to edit guitar tabs. No need to know music
          theory!"
        imageSrc={create}
      />
    </React.Fragment>
  );
};
