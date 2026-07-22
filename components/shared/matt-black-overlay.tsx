export default function MattBlackOverlay() {
  return (
    <>
      <style>
        {`
          .grainy-overlay {
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            pointer-events: none;
            transform: translateZ(0);

            &:before {
              content: "";
              top: -10rem;
              left: -10rem;
              width: calc(100% + 20rem);
              height: calc(100% + 20rem);
              z-index: 9999;
              position: fixed;
              background-image: url('data:image/svg+xml, <svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)" /></svg>');
              opacity: 0.5;
              pointer-events: none;
            }
          }
          `}
      </style>
      <div className="grainy-overlay z-99" />
    </>
  );
}
