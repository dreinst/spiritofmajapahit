import { Scene } from "./Scene";

export default function App() {
  return (
    <>
      <Scene />
      <footer className="kredit">
        <span>Made by dreinst</span>
        <span className="kredit-garis" aria-hidden="true" />
        <span className="kredit-oleh">
          Organized by <img src="/logo-dpro-ringkas.svg" alt="D'PRO" />
        </span>
      </footer>
    </>
  );
}
