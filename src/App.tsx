
import { useTheme } from './hooks/useTheme';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/sections/Hero';
import { Footer } from './components/layout/Footer';
import HeroIntro from './components/ui/HeroIntro';
import { useState } from 'react';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Hero introDone={introDone} />
      <Footer />
      {!introDone && (
        <HeroIntro onFinish={() => setIntroDone(true)} />
      )}
    </>
  );
}

export default App;
