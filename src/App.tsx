
import { useTheme } from './hooks/useTheme';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/sections/Hero';
import { Stack } from './components/sections/Stack';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <div className="scroll-wrapper" style={{ height: "400vh", position: "relative" }}>
        <div className="sticky-container" style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", display: "grid" }}>
          <div style={{ gridArea: "1 / 1" }}>
            <Hero />
          </div>
          <div style={{ gridArea: "1 / 1", zIndex: 10 }}>
            <Stack />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
