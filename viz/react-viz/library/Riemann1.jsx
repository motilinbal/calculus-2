import { useState, useEffect } from 'react';

export default function DarbouxIntegralVisualization() {
  // Function to integrate: x^2 + sin(2x)
  const f = (x) => Math.pow(x, 2) + Math.sin(2 * x);
  
  // Integration range
  const [a, b] = [0, 3];
  
  // Number of subintervals (controllable by slider)
  const [n, setN] = useState(4);
  
  // Calculate subinterval width
  const deltaX = (b - a) / n;
  
  // Calculate the partition points
  const partitionPoints = Array.from({ length: n + 1 }, (_, i) => a + i * deltaX);
  
  // Generate points for the function curve
  const numPoints = 200;
  const dx = (b - a) / numPoints;
  const curvePoints = Array.from({ length: numPoints + 1 }, (_, i) => {
    const x = a + i * dx;
    return { x, y: f(x) };
  });
  
  // Calculate upper and lower Darboux sums
  const calculateDarbouxSums = () => {
    let upperSum = 0;
    let lowerSum = 0;
    
    for (let i = 1; i <= n; i++) {
      const x0 = partitionPoints[i - 1];
      const x1 = partitionPoints[i];
      
      // Find supremum and infimum in the subinterval
      // For simplicity, we'll sample the function at multiple points
      const samplingPoints = 20;
      const samplingDx = (x1 - x0) / samplingPoints;
      
      let M = -Infinity;
      let m = Infinity;
      
      for (let j = 0; j <= samplingPoints; j++) {
        const x = x0 + j * samplingDx;
        const y = f(x);
        M = Math.max(M, y);
        m = Math.min(m, y);
      }
      
      upperSum += M * (x1 - x0);
      lowerSum += m * (x1 - x0);
    }
    
    return { upperSum, lowerSum };
  };
  
  const { upperSum, lowerSum } = calculateDarbouxSums();
  
  // Calculate the true integral value (for this function we can use numerical approximation)
  const trueIntegral = 9 + (Math.sin(6) - Math.sin(0))/2;
  
  // Generate rectangle data for visualization
  const rectangles = partitionPoints.slice(0, -1).map((x0, i) => {
    const x1 = partitionPoints[i + 1];
    
    // Find supremum and infimum in the subinterval
    const samplingPoints = 20;
    const samplingDx = (x1 - x0) / samplingPoints;
    
    let M = -Infinity;
    let m = Infinity;
    
    for (let j = 0; j <= samplingPoints; j++) {
      const x = x0 + j * samplingDx;
      const y = f(x);
      M = Math.max(M, y);
      m = Math.min(m, y);
    }
    
    return {
      x0,
      x1,
      upperY: M,
      lowerY: m
    };
  });
  
  // SVG viewport settings
  const svgWidth = 600;
  const svgHeight = 400;
  const padding = 40;
  
  // Maximum function value for scaling
  const maxY = Math.max(...curvePoints.map(p => p.y)) * 1.1;
  
  // Scaling functions
  const scaleX = (x) => padding + (x - a) * (svgWidth - 2 * padding) / (b - a);
  const scaleY = (y) => svgHeight - padding - y * (svgHeight - 2 * padding) / maxY;
  
  // Generate SVG path for the function curve
  const curvePath = curvePoints.reduce((path, point, i) => {
    const command = i === 0 ? 'M' : 'L';
    return path + `${command} ${scaleX(point.x)} ${scaleY(point.y)} `;
  }, '');
  
  // Toggle for showing upper or lower sum
  const [showUpper, setShowUpper] = useState(true);
  const [showLower, setShowLower] = useState(true);
  
  // Format numbers to 4 decimal places
  const formatNumber = (num) => num.toFixed(4);
  
  // Error calculations
  const upperError = upperSum - trueIntegral;
  const lowerError = trueIntegral - lowerSum;
  
  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Darboux Integral Visualization</h2>
      <div className="mb-4 text-lg">
        f(x) = x² + sin(2x), [{a}, {b}]
      </div>
      
      <div className="w-full max-w-xl mb-6">
        <div className="flex justify-between mb-2">
          <span>Partitions: {n}</span>
          <span>Δx = {formatNumber((b-a)/n)}</span>
        </div>
        <input
          type="range"
          min="1"
          max="50"
          value={n}
          onChange={(e) => setN(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="mb-4 flex space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showUpper}
            onChange={() => setShowUpper(!showUpper)}
            className="mr-2"
          />
          <span className="text-red-600 font-medium">Upper Sum</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showLower}
            onChange={() => setShowLower(!showLower)}
            className="mr-2"
          />
          <span className="text-blue-600 font-medium">Lower Sum</span>
        </label>
      </div>
      
      <svg width={svgWidth} height={svgHeight} className="bg-white border border-gray-300">
        {/* X and Y axes */}
        <line 
          x1={padding} 
          y1={svgHeight - padding} 
          x2={svgWidth - padding} 
          y2={svgHeight - padding} 
          stroke="black" 
          strokeWidth="1"
        />
        <line 
          x1={padding} 
          y1={padding} 
          x2={padding} 
          y2={svgHeight - padding} 
          stroke="black" 
          strokeWidth="1"
        />
        
        {/* X-axis labels */}
        {[a, (a+b)/2, b].map((val, i) => (
          <text 
            key={i} 
            x={scaleX(val)} 
            y={svgHeight - padding/2} 
            textAnchor="middle" 
            fontSize="12"
          >
            {val}
          </text>
        ))}
        
        {/* Y-axis labels */}
        {[0, maxY/2, maxY].map((val, i) => (
          <text 
            key={i} 
            x={padding/2} 
            y={scaleY(val)} 
            textAnchor="middle" 
            fontSize="12"
            dominantBaseline="middle"
          >
            {val.toFixed(1)}
          </text>
        ))}
        
        {/* Lower Darboux sum rectangles */}
        {showLower && rectangles.map((rect, i) => (
          <rect
            key={`lower-${i}`}
            x={scaleX(rect.x0)}
            y={scaleY(rect.lowerY)}
            width={scaleX(rect.x1) - scaleX(rect.x0)}
            height={scaleY(0) - scaleY(rect.lowerY)}
            fill="rgba(59, 130, 246, 0.3)"
            stroke="rgb(59, 130, 246)"
            strokeWidth="1"
          />
        ))}
        
        {/* Upper Darboux sum rectangles */}
        {showUpper && rectangles.map((rect, i) => (
          <rect
            key={`upper-${i}`}
            x={scaleX(rect.x0)}
            y={scaleY(rect.upperY)}
            width={scaleX(rect.x1) - scaleX(rect.x0)}
            height={scaleY(0) - scaleY(rect.upperY)}
            fill="rgba(239, 68, 68, 0.3)"
            stroke="rgb(239, 68, 68)"
            strokeWidth="1"
          />
        ))}
        
        {/* Function curve */}
        <path d={curvePath} fill="none" stroke="black" strokeWidth="2" />
        
        {/* Partition points */}
        {partitionPoints.map((x, i) => (
          <circle
            key={i}
            cx={scaleX(x)}
            cy={scaleY(0)}
            r="3"
            fill="black"
          />
        ))}
      </svg>
      
      <div className="mt-6 grid grid-cols-2 gap-6 w-full max-w-xl">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold text-red-600 mb-2">Upper Darboux Sum</h3>
          <p className="mb-1">U(f,P) = {formatNumber(upperSum)}</p>
          <p className="text-xs text-gray-600">Error: +{formatNumber(upperError)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold text-blue-600 mb-2">Lower Darboux Sum</h3>
          <p className="mb-1">L(f,P) = {formatNumber(lowerSum)}</p>
          <p className="text-xs text-gray-600">Error: -{formatNumber(lowerError)}</p>
        </div>
      </div>
      
      <div className="mt-4 bg-white p-4 rounded shadow w-full max-w-xl">
        <h3 className="font-bold mb-2">True Integral Value</h3>
        <p>∫<sub>{a}</sub><sup>{b}</sup> f(x) dx = {formatNumber(trueIntegral)}</p>
        <p className="mt-2 text-sm text-gray-600">
          Difference between Upper and Lower sums: {formatNumber(upperSum - lowerSum)}
        </p>
      </div>
      
      <div className="mt-6 text-sm text-gray-600 max-w-xl">
        <p>As the number of partitions increases, both the upper and lower Darboux sums converge to the true integral value. The upper sum always overestimates the area, while the lower sum underestimates it.</p>
        <p className="mt-2">When the upper and lower sums are equal, the function is Darboux integrable.</p>
      </div>
    </div>
  );
}