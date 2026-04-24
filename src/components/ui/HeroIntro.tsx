import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import logo from '../../assets/logo.png';

interface HeroIntroProps {
  onFinish: () => void;
}

export default function HeroIntro({ onFinish }: HeroIntroProps) {
  const container = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);


  useGSAP(() => {
    // 1. Creamos la línea de tiempo
    const tl = gsap.timeline({
      onComplete: onFinish,
    });

    // 2. Animamos el logo DESDE grande e invisible HACIA su estado normal
    tl.from(logoRef.current, {
      scale: 1.5,
      opacity: 0,
      duration: 1.5,
      ease: "expo.out" // Easing cinematográfico
    })
    // 3. Achicamos el logo y lo movemos a la izquierda
    .to(logoRef.current, {
      scale: 0.8,
      x: -50,
      duration: 1,
      ease: "power3.inOut"
    })
    // 4. Hacemos aparecer el texto. El "<" significa: "Arranca AL MISMO TIEMPO que la animación anterior"
    .from(textRef.current, {
      opacity: 0,
      x: 50,
      duration: 1,
      ease: "power3.out"
    }, "<");

  }, { scope: container }); // El scope limita las animaciones a este componente

  return (
    <div ref={container} className="h-screen flex items-center justify-center bg-black text-white">
      <img ref={logoRef} className="w-20 h-20 bg-blue-500 rounded-lg" src={logo} alt="Logo" />
      <h1 ref={textRef} className="text-4xl font-bold ml-4">Jhon Doe</h1>
    </div>
  );
}