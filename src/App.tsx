
import { useTheme } from './hooks/useTheme';
import { Navbar } from './components/layout/Navbar';
import { GlowBackground } from './components/layout/GlowBackground';
import { Hero } from './components/sections/Hero';
import { Stack } from './components/sections/Stack';
// import { Projects } from './components/sections/Projects';
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
      {/* <Projects /> */}
      {/* <ProjectsV1 /> */}
      <ProjectsV2 />
    </>
  );
}

export default App;
