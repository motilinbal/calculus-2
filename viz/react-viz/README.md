# Mathematical Visualization Collection

This repository contains an interactive collection of mathematical visualizations built with React using Vite. The project is designed to make it easy to add and explore multiple visualizations through a simple menu interface.

## Table of Contents

- [Mathematical Visualization Collection](#mathematical-visualization-collection)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Setup Instructions](#setup-instructions)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Application](#running-the-application)
  - [Project Structure](#project-structure)
  - [Adding New Visualizations](#adding-new-visualizations)
  - [Customization](#customization)
    - [Changing the Theme](#changing-the-theme)
    - [Modifying the Layout](#modifying-the-layout)
  - [Troubleshooting](#troubleshooting)
    - [Common Issues](#common-issues)

## Overview

This application provides a framework for displaying interactive mathematical visualizations. It features:

- A dark-themed, responsive interface
- A dropdown menu to select different visualizations
- A centralized layout for optimal viewing
- An extensible architecture for adding new visualizations

The first visualization included is a Darboux integral demonstration that shows how upper and lower sums converge to the true integral value as partition size increases.

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or later)
- npm (comes with Node.js)

### Installation

Follow these steps to set up the visualization collection:

1. **Create a new Vite React application**

   ```bash
   npm create vite@latest visualization-collection -- --template react
   cd visualization-collection
   npm install
   ```

2. **Create a directory for visualizations**

   ```bash
   mkdir src/visualizations
   ```

3. **Create the visualization files**

   Create a file named `src/visualizations/DarbouxIntegralVisualization.jsx` and paste the Darboux visualization code into it.

4. **Update App.jsx**

   Replace the content of `src/App.jsx` with:

   ```jsx
   // src/App.jsx
   import React, { useState } from 'react';
   import './App.css';
   
   // Import all your visualizations here
   import DarbouxIntegralVisualization from './visualizations/DarbouxIntegralVisualization';
   
   // Add new visualizations to this object as you create them
   const visualizations = {
     'Darboux Integral': DarbouxIntegralVisualization,
     // Add more visualizations as you get them
   };
   
   function App() {
     const [selectedViz, setSelectedViz] = useState(Object.keys(visualizations)[0]);
   
     // Get the currently selected visualization component
     const SelectedVisualization = visualizations[selectedViz];
   
     return (
       <div className="App">
         <div className="content-wrapper">
           <header className="App-header">
             <h1>Mathematical Visualizations</h1>
             <div className="visualization-selector">
               <label htmlFor="viz-select">Choose a visualization: </label>
               <select 
                 id="viz-select" 
                 value={selectedViz}
                 onChange={(e) => setSelectedViz(e.target.value)}
                 className="viz-dropdown"
               >
                 {Object.keys(visualizations).map(viz => (
                   <option key={viz} value={viz}>{viz}</option>
                 ))}
               </select>
             </div>
           </header>
           
           <main className="visualization-container">
             <SelectedVisualization />
           </main>
           
           <footer className="App-footer">
             <p>Mathematical Visualization Collection</p>
           </footer>
         </div>
       </div>
     );
   }
   
   export default App;
   ```

5. **Update App.css**

   Replace the content of `src/App.css` with:

   ```css
   /* src/App.css */
   body, html {
     margin: 0;
     padding: 0;
     height: 100%;
     width: 100%;
     display: flex;
     justify-content: center;
     background-color: #1e1e1e;
   }
   
   #root {
     width: 100%;
     display: flex;
     justify-content: center;
   }
   
   .App {
     text-align: center;
     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
     width: 100%;
     display: flex;
     justify-content: center;
     color: #f5f5f5;
   }
   
   .content-wrapper {
     width: 100%;
     max-width: 1200px;
     box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
     background-color: #202020;
     min-height: 100vh;
     display: flex;
     flex-direction: column;
   }
   
   .App-header {
     background-color: #282c34;
     padding: 20px;
     color: white;
   }
   
   .App-header h1 {
     margin: 0;
     margin-bottom: 15px;
   }
   
   .visualization-selector {
     margin: 10px 0;
   }
   
   .viz-dropdown {
     margin-left: 10px;
     padding: 8px;
     border-radius: 4px;
     font-size: 16px;
     background-color: #333;
     color: white;
     border: 1px solid #444;
   }
   
   .visualization-container {
     flex: 1;
     padding: 20px;
     margin: 0 auto;
     width: 100%;
     max-width: 1000px;
     box-sizing: border-box;
     display: flex;
     justify-content: center;
   }
   
   .App-footer {
     padding: 15px;
     background-color: #282c34;
     color: #aaa;
     font-size: 0.8rem;
     margin-top: auto;
   }
   ```

6. **Install any additional dependencies**

   If your visualizations use specific libraries, you may need to install them:

   ```bash
   npm install react react-dom
   ```

### Running the Application

To start the development server:

```bash
npm run dev
```

The application should be available in your browser at `http://localhost:5173` (or another port if 5173 is already in use).

## Project Structure

```
visualization-collection/
├── public/
│   └── ...
├── src/
│   ├── visualizations/
│   │   ├── DarbouxIntegralVisualization.jsx
│   │   └── ... (other visualization components)
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── ...
├── package.json
├── vite.config.js
└── README.md
```

## Adding New Visualizations

To add a new visualization to the collection:

1. **Create a new file** in the `src/visualizations` directory:

   ```bash
   touch src/visualizations/NewVisualization.jsx
   ```

2. **Add your visualization component** to the new file:

   ```jsx
   import React, { useState } from 'react';
   
   export default function NewVisualization() {
     // Your visualization code here
     return (
       <div>
         {/* Your visualization markup here */}
       </div>
     );
   }
   ```

3. **Import and register the new visualization** in `App.jsx`:

   ```jsx
   import NewVisualization from './visualizations/NewVisualization';
   
   const visualizations = {
     'Darboux Integral': DarbouxIntegralVisualization,
     'New Visualization Name': NewVisualization,
     // Add more as needed
   };
   ```

Your new visualization will automatically appear in the dropdown menu.

## Customization

### Changing the Theme

To change the color scheme, edit the color values in `src/App.css`. For a light theme, you might want to use:

```css
body, html {
  background-color: #f5f5f5;
}

.App {
  color: #333;
}

.content-wrapper {
  background-color: white;
}

/* And so on for other elements */
```

### Modifying the Layout

To adjust the layout width or spacing:

- Change `max-width` values in `.content-wrapper` and `.visualization-container`
- Adjust padding and margin values as needed

## Troubleshooting

### Common Issues

1. **"Module not found" errors**
   
   Ensure all required dependencies are installed:
   
   ```bash
   npm install
   ```

2. **Blank screen with no errors**
   
   Check the browser console for errors. Ensure your visualization components are properly exported and imported.

3. **Scripts not found error**
   
   If you get a "Missing script" error when trying to run `npm run dev`, make sure your package.json contains the correct scripts section. In a Vite project, it should look like:
   
   ```json
   "scripts": {
     "dev": "vite",
     "build": "vite build",
     "preview": "vite preview"
   }
   ```

4. **Visualization not rendering correctly**
   
   Ensure your visualization component is properly structured and doesn't rely on external libraries that aren't installed.