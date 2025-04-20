// src/App.js
import React, { useState } from 'react';
import './App.css';

// Import all your visualizations here
import DarbouxIntegralVisualization from '../library/Riemann1.jsx';
import DarbouxVisualizer from '../library/Riemann2.jsx';
import TriangleInequalityVisualization from '../library/triangle_inequality.jsx';


// Add new visualizations to this object as you create them
const visualizations = {
  'Darboux Integral': DarbouxIntegralVisualization,
  'Darboux Visualizer': DarbouxVisualizer,
  'Triangle Inequality': TriangleInequalityVisualization,
  // Add more visualizations as you get them, for example:
  // 'Taylor Series': TaylorSeriesVisualization,
  // 'Fourier Transform': FourierTransformVisualization,
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