# 🐶 Dogesh

An interactive 3D dog viewer built with React, Vite, and Three.js. Drop a Draco-compressed GLB model into a scene and orbit around it right in the browser.

## Features

- 3D model rendering with [react-three-fiber](https://docs.pmnd.rs/react-three-fiber) and [drei](https://github.com/pmndrs/drei)
- Draco-compressed `.glb` model loading for a smaller asset footprint
- Orbit controls for rotating, panning, and zooming around the model
- Directional lighting for a clean, well-lit render

## Tech Stack

- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/) with the React Compiler enabled
- [Three.js](https://threejs.org/)
- [@react-three/fiber](https://github.com/pmndrs/react-three-fiber) & [@react-three/drei](https://github.com/pmndrs/drei)
- ESLint for linting

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm

### Installation

```bash
git clone https://github.com/hs150/Dogesh.git
cd Dogesh
npm install
```

### Development

```bash
npm run dev
```

This starts the Vite dev server with hot module replacement.

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```
Dogesh/
├── public/
│   └── model/
│       └── dog.drc.glb    # Draco-compressed 3D dog model
├── src/
│   ├── components/
│   │   └── Dog.jsx        # Loads and renders the 3D model with orbit controls
│   ├── App.jsx             # Canvas setup
│   └── main.jsx             # App entry point
└── package.json
```

## License

No license specified yet.
