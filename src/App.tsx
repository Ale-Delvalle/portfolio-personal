
import { useTheme } from './hooks/useTheme';
import { Navbar } from './components/layout/Navbar';
import { GlowBackground } from './components/layout/GlowBackground';
import { Hero } from './components/sections/Hero';
import { Stack } from './components/sections/Stack';
import { Projects } from './components/sections/Projects';
import { HeroImproved } from './components/sections/HeroImproved';
import { HeroV3 } from './components/sections/HeroV3';
// import { ProjectsV1 } from './components/sections/ProjectsV1';
import { ProjectsV2 } from './components/sections/ProjectsV2';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <GlowBackground />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Hero />
      <Stack />
      <Projects />
      <HeroImproved />
      <HeroV3 />
      {/* <ProjectsV1 /> */}
      <ProjectsV2 />
    </>
  );
}

export default App;
