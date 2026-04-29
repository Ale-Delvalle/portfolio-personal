
import { useTheme } from './hooks/useTheme';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/sections/Hero';
import HeroIntro from './components/ui/HeroIntro';
import { useState } from 'react';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Hero introDone={introDone} />
      {!introDone && (
        <HeroIntro onFinish={() => setIntroDone(true)} />
      )}
    </>
  );
}

export default App;
