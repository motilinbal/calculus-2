import { useState, useEffect, useRef } from 'react';

export default function TriangleInequalityVisualization() {
  const [functionType, setFunctionType] = useState('sine');
  const [showAbsoluteValue, setShowAbsoluteValue] = useState(true);
  const [a, setA] = useState(-Math.PI);
  const [b, setB] = useState(Math.PI);
  const canvasRef = useRef(null);
  const [leftValue, setLeftValue] = useState(0);
  const [rightValue, setRightValue] = useState(0);
  const [explanation, setExplanation] = useState('');

  const functions = {
    sine: {
      f: (x) => Math.sin(x),
      label: 'f(x) = sin(x)'
    },
    cosine: {
      f: (x) => Math.cos(x),
      label: 'f(x) = cos(x)'
    },
    polynomial: {
      f: (x) => 0.5*x*x - 2*x,
      label: 'f(x) = 0.5x² - 2x'
    },
    oscillating: {
      f: (x) => Math.sin(3*x) * Math.exp(-0.2*x),
      label: 'f(x) = sin(3x)·e^(-0.2x)'
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw coordinate system
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    
    // Draw x-axis
    ctx.beginPath();
    ctx.moveTo(0, height/2);
    ctx.lineTo(width, height/2);
    ctx.stroke();
    
    // Draw y-axis
    ctx.beginPath();
    ctx.moveTo(width/2, 0);
    ctx.lineTo(width/2, height);
    ctx.stroke();
    
    // Map coordinates
    const mapX = (x) => (x - a) / (b - a) * width;
    const mapY = (y) => height/2 - y * (height/4);
    
    // Function to integrate numerically
    const integrate = (func, start, end, steps = 1000) => {
      const dx = (end - start) / steps;
      let sum = 0;
      
      for (let i = 0; i < steps; i++) {
        const x = start + i * dx;
        sum += func(x) * dx;
      }
      
      return sum;
    };
    
    const f = functions[functionType].f;
    
    // Calculate both sides of the inequality
    const leftSideValue = Math.abs(integrate(f, a, b));
    const rightSideValue = integrate((x) => Math.abs(f(x)), a, b);
    
    setLeftValue(leftSideValue.toFixed(4));
    setRightValue(rightSideValue.toFixed(4));
    
    // Generate explanation
    let newExplanation = '';
    if (Math.abs(leftSideValue - rightSideValue) < 0.0001) {
      newExplanation = "The values are equal! This happens when the function doesn't change sign in the interval, or when the positive and negative areas perfectly balance out.";
    } else {
      newExplanation = "Notice how the absolute value integral (yellow area) is larger than the absolute value of the original integral (which is the absolute difference between positive and negative areas).";
    }
    setExplanation(newExplanation);
    
    // Draw the function
    ctx.beginPath();
    ctx.strokeStyle = '#3366FF';
    ctx.lineWidth = 2;
    
    const steps = 1000;
    const dx = (b - a) / steps;
    
    for (let i = 0; i <= steps; i++) {
      const x = a + i * dx;
      const y = f(x);
      const canvasX = mapX(x);
      const canvasY = mapY(y);
      
      if (i === 0) {
        ctx.moveTo(canvasX, canvasY);
      } else {
        ctx.lineTo(canvasX, canvasY);
      }
    }
    
    ctx.stroke();
    
    // Draw the filled areas
    for (let i = 0; i < steps; i++) {
      const x = a + i * dx;
      const y = f(x);
      const nextX = a + (i+1) * dx;
      const nextY = f(nextX);
      
      const avgY = (y + nextY) / 2;
      
      const canvasX = mapX(x);
      const nextCanvasX = mapX(nextX);
      const avgCanvasY = mapY(avgY);
      const middleY = height/2;
      
      // Draw positive/negative areas of original function
      ctx.beginPath();
      ctx.fillStyle = avgY >= 0 ? 'rgba(0, 200, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)';
      ctx.moveTo(canvasX, middleY);
      ctx.lineTo(canvasX, mapY(y));
      ctx.lineTo(nextCanvasX, mapY(nextY));
      ctx.lineTo(nextCanvasX, middleY);
      ctx.closePath();
      ctx.fill();
      
      // Draw absolute value area if enabled
      if (showAbsoluteValue) {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 200, 0, 0.3)';
        ctx.moveTo(canvasX, middleY);
        ctx.lineTo(canvasX, mapY(Math.abs(y)));
        ctx.lineTo(nextCanvasX, mapY(Math.abs(nextY)));
        ctx.lineTo(nextCanvasX, middleY);
        ctx.closePath();
        ctx.fill();
      }
    }
    
    // Draw the interval limits
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    
    // Draw a
    ctx.beginPath();
    ctx.moveTo(mapX(a), 0);
    ctx.lineTo(mapX(a), height);
    ctx.stroke();
    
    // Draw b
    ctx.beginPath();
    ctx.moveTo(mapX(b), 0);
    ctx.lineTo(mapX(b), height);
    ctx.stroke();
    
    // Add labels
    ctx.fillStyle = '#000';
    ctx.font = '14px Arial';
    ctx.fillText('a', mapX(a) - 15, height - 10);
    ctx.fillText('b', mapX(b) + 5, height - 10);
    
  }, [functionType, showAbsoluteValue, a, b]);

  return (
    <div className="flex flex-col items-center w-full p-4 bg-gray-50 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Triangle Inequality for Integrals</h2>
      <div className="text-lg mb-6">
        <span className="mr-4">{`|∫(a→b) f(x)dx| ≤ ∫(a→b) |f(x)|dx`}</span>
      </div>
      
      <div className="w-full bg-white p-4 rounded-lg shadow-md">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={400} 
          className="w-full border border-gray-300 mb-4"
        />
        
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Function:</label>
            <select 
              value={functionType}
              onChange={(e) => setFunctionType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {Object.entries(functions).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Lower Bound (a):</label>
            <input 
              type="range" 
              min={-10} 
              max={10} 
              step={0.1}
              value={a}
              onChange={(e) => setA(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-center">{a.toFixed(1)}</div>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Upper Bound (b):</label>
            <input 
              type="range" 
              min={-10} 
              max={10} 
              step={0.1}
              value={b}
              onChange={(e) => setB(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-center">{b.toFixed(1)}</div>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={showAbsoluteValue}
              onChange={(e) => setShowAbsoluteValue(e.target.checked)}
              className="mr-2"
            />
            <span>Show |f(x)| Area (Yellow)</span>
          </label>
        </div>
        
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold mb-2">Results:</h3>
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-2 md:mb-0">
              <span className="font-medium">|∫(a→b) f(x)dx| = </span>
              <span className="text-blue-600">{leftValue}</span>
            </div>
            <div>
              <span className="font-medium">∫(a→b) |f(x)|dx = </span>
              <span className="text-green-600">{rightValue}</span>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="font-bold">Visual Explanation:</h4>
            <div className="flex items-center flex-wrap gap-4">
              <span className="flex items-center" style={{ marginRight: '16px' }}>
                <span style={{ display: 'inline-block', width: '16px', height: '16px', backgroundColor: '#bbf7d0', marginRight: '8px' }}></span>
                <span>Positive Area</span>
              </span>
              <span className="flex items-center" style={{ marginRight: '16px' }}>
                <span style={{ display: 'inline-block', width: '16px', height: '16px', backgroundColor: '#fca5a5', marginRight: '8px' }}></span>
                <span>Negative Area</span>
              </span>
              <span className="flex items-center">
                <span style={{ display: 'inline-block', width: '16px', height: '16px', backgroundColor: '#fde047', marginRight: '8px' }}></span>
                <span>|f(x)| Area</span>
              </span>
            </div>
            <p className="mt-2">{explanation}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-bold mb-2">Understanding the Triangle Inequality for Integrals</h3>
        <p className="mb-2">
          The triangle inequality for integrals states that the absolute value of an integral is less than or equal to the integral of the absolute value.
        </p>
        <p className="mb-2">
          <strong>Visually:</strong> The green areas represent positive values of f(x), while red areas represent negative values. 
          The left side of the inequality (|∫f(x)dx|) is the absolute value of the "net signed area" between the curve and the x-axis.
          The right side (∫|f(x)|dx) is the total area between the curve and the x-axis, ignoring signs (shown in yellow).
        </p>
        <p>
          <strong>Insight:</strong> The inequality holds because when taking the absolute value of the integral, positive and negative areas can cancel each other out, 
          whereas when integrating the absolute value, all areas contribute positively.
        </p>
      </div>
    </div>
  );
}