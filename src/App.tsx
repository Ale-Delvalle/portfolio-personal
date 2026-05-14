
import { useTheme } from './hooks/useTheme';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/sections/Hero';
import { Stack } from './components/sections/Stack';
import { Projects } from './components/sections/Projects';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Hero />
      <Stack />
      <Projects />
    </>
  );
}

export default App;
