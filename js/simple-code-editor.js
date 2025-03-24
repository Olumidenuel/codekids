// Simple Code Editor for Kids
// This file implements a beginner-friendly code editor with syntax highlighting and execution

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on a code editor page
  if (document.querySelector('.simple-code-editor')) {
    initializeCodeEditor();
  }
});

// Initialize the code editor
function initializeCodeEditor() {
  console.log('Initializing simple code editor');
  
  // Get elements
  const editorContainer = document.querySelector('.editor-container');
  const codeInput = document.querySelector('.code-input');
  const runButton = document.querySelector('.run-code-button');
  const resetButton = document.querySelector('.reset-code-button');
  const outputContainer = document.querySelector('.code-output');
  const exampleSelector = document.querySelector('.example-selector');
  
  if (!editorContainer || !codeInput || !runButton || !outputContainer) {
    console.error('Missing required elements for code editor');
    return;
  }
  
  // Setup line numbers
  setupLineNumbers(codeInput);
  
  // Setup syntax highlighting if available
  setupSyntaxHighlighting(codeInput);
  
  // Setup run button
  if (runButton) {
    runButton.addEventListener('click', function() {
      runCode(codeInput.value, outputContainer);
    });
  }
  
  // Setup reset button
  if (resetButton) {
    resetButton.addEventListener('click', function() {
      resetEditor(codeInput, outputContainer);
    });
  }
  
  // Setup example selector
  if (exampleSelector) {
    exampleSelector.addEventListener('change', function() {
      loadExample(this.value, codeInput);
    });
    
    // Load initial example if available
    if (exampleSelector.value) {
      loadExample(exampleSelector.value, codeInput);
    }
  }
  
  // Setup auto-save
  setupAutoSave(codeInput);
}

// Setup line numbers for the code editor
function setupLineNumbers(codeInput) {
  const lineNumbers = document.querySelector('.line-numbers');
  
  if (!lineNumbers) {
    return;
  }
  
  // Update line numbers when text changes
  codeInput.addEventListener('input', function() {
    updateLineNumbers(this, lineNumbers);
  });
  
  // Update line numbers when scrolling
  codeInput.addEventListener('scroll', function() {
    lineNumbers.scrollTop = this.scrollTop;
  });
  
  // Initial line numbers
  updateLineNumbers(codeInput, lineNumbers);
}

// Update line numbers based on content
function updateLineNumbers(codeInput, lineNumbers) {
  const lines = codeInput.value.split('\n').length;
  let lineNumbersContent = '';
  
  for (let i = 1; i <= lines; i++) {
    lineNumbersContent += i + '\n';
  }
  
  lineNumbers.textContent = lineNumbersContent;
}

// Setup syntax highlighting
function setupSyntaxHighlighting(codeInput) {
  // If Prism.js is available, use it for syntax highlighting
  if (window.Prism) {
    codeInput.addEventListener('input', function() {
      const code = this.value;
      const highlightedCode = Prism.highlight(code, Prism.languages.javascript, 'javascript');
      
      // Update highlighted code
      const highlightElement = document.querySelector('.code-highlight');
      if (highlightElement) {
        highlightElement.innerHTML = highlightedCode + '\n';
      }
    });
    
    // Initial highlighting
    const initialCode = codeInput.value;
    const highlightedCode = Prism.highlight(initialCode, Prism.languages.javascript, 'javascript');
    
    const highlightElement = document.querySelector('.code-highlight');
    if (highlightElement) {
      highlightElement.innerHTML = highlightedCode + '\n';
    }
  }
}

// Run the code and display output
function runCode(code, outputContainer) {
  // Clear previous output
  outputContainer.innerHTML = '';
  
  // Create a safe environment for running code
  const sandbox = createSandbox(outputContainer);
  
  try {
    // Run the code in the sandbox
    sandbox.runCode(code);
  } catch (error) {
    // Display error
    displayError(error, outputContainer);
  }
}

// Create a sandbox environment for running code safely
function createSandbox(outputContainer) {
  // Create a controlled environment with limited capabilities
  const sandbox = {
    // Safe console methods
    console: {
      log: function(...args) {
        displayOutput(args.join(' '), 'log', outputContainer);
      },
      error: function(...args) {
        displayOutput(args.join(' '), 'error', outputContainer);
      },
      warn: function(...args) {
        displayOutput(args.join(' '), 'warning', outputContainer);
      }
    },
    
    // Safe turtle graphics
    turtle: {
      position: { x: 150, y: 150 },
      direction: 0, // 0 degrees = right
      penDown: true,
      penColor: '#000000',
      
      forward: function(distance) {
        const canvas = document.querySelector('.turtle-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Calculate new position
        const radians = this.direction * Math.PI / 180;
        const newX = this.position.x + distance * Math.cos(radians);
        const newY = this.position.y + distance * Math.sin(radians);
        
        // Draw line if pen is down
        if (this.penDown) {
          ctx.beginPath();
          ctx.moveTo(this.position.x, this.position.y);
          ctx.lineTo(newX, newY);
          ctx.strokeStyle = this.penColor;
          ctx.stroke();
        }
        
        // Update position
        this.position.x = newX;
        this.position.y = newY;
        
        // Draw turtle
        drawTurtle(ctx, this.position.x, this.position.y, this.direction);
        
        displayOutput(`Moved forward ${distance} pixels`, 'turtle', outputContainer);
      },
      
      backward: function(distance) {
        this.forward(-distance);
      },
      
      right: function(angle) {
        this.direction += angle;
        
        // Draw turtle in new direction
        const canvas = document.querySelector('.turtle-canvas');
        if (canvas) {
          const ctx = canvas.getContext('2d');
          drawTurtle(ctx, this.position.x, this.position.y, this.direction);
        }
        
        displayOutput(`Turned right ${angle} degrees`, 'turtle', outputContainer);
      },
      
      left: function(angle) {
        this.right(-angle);
      },
      
      penUp: function() {
        this.penDown = false;
        displayOutput('Pen up', 'turtle', outputContainer);
      },
      
      penDown: function() {
        this.penDown = true;
        displayOutput('Pen down', 'turtle', outputContainer);
      },
      
      setColor: function(color) {
        this.penColor = color;
        displayOutput(`Set pen color to ${color}`, 'turtle', outputContainer);
      },
      
      clear: function() {
        const canvas = document.querySelector('.turtle-canvas');
        if (canvas) {
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Reset position
          this.position = { x: 150, y: 150 };
          this.direction = 0;
          
          // Draw turtle
          drawTurtle(ctx, this.position.x, this.position.y, this.direction);
        }
        
        displayOutput('Cleared canvas', 'turtle', outputContainer);
      }
    },
    
    // Safe alert
    alert: function(message) {
      displayOutput('Alert: ' + message, 'alert', outputContainer);
    },
    
    // Run code in the sandbox
    runCode: function(code) {
      // Initialize turtle canvas
      initTurtleCanvas();
      
      // Add safety wrapper
      const safeCode = `
        "use strict";
        
        // Wrap in try-catch to catch runtime errors
        try {
          ${code}
        } catch (error) {
          console.error("Error: " + error.message);
        }
      `;
      
      // Create a function from the code
      const runFunction = new Function(
        'console', 'turtle', 'alert',
        safeCode
      );
      
      // Run the function with sandbox objects
      runFunction(
        this.console,
        this.turtle,
        this.alert
      );
    }
  };
  
  return sandbox;
}

// Initialize turtle canvas
function initTurtleCanvas() {
  let canvas = document.querySelector('.turtle-canvas');
  
  if (!canvas) {
    // Create canvas if it doesn't exist
    canvas = document.createElement('canvas');
    canvas.className = 'turtle-canvas';
    canvas.width = 300;
    canvas.height = 300;
    
    // Add to output container
    const outputContainer = document.querySelector('.code-output');
    if (outputContainer) {
      outputContainer.appendChild(canvas);
    }
  } else {
    // Clear existing canvas
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  
  // Draw initial turtle
  const ctx = canvas.getContext('2d');
  drawTurtle(ctx, 150, 150, 0);
}

// Draw turtle at specified position and direction
function drawTurtle(ctx, x, y, direction) {
  // Save context
  ctx.save();
  
  // Move to turtle position
  ctx.translate(x, y);
  ctx.rotate(direction * Math.PI / 180);
  
  // Draw turtle
  ctx.beginPath();
  ctx.moveTo(10, 0);  // Head
  ctx.lineTo(-5, 5);  // Bottom right
  ctx.lineTo(-5, -5); // Bottom left
  ctx.closePath();
  
  ctx.fillStyle = '#4caf50';
  ctx.fill();
  
  // Restore context
  ctx.restore();
}

// Display output in the output container
function displayOutput(message, type, outputContainer) {
  const outputLine = document.createElement('div');
  outputLine.className = `output-line ${type}-output`;
  outputLine.textContent = message;
  
  outputContainer.appendChild(outputLine);
  
  // Scroll to bottom
  outputContainer.scrollTop = outputContainer.scrollHeight;
}

// Display error in the output container
function displayError(error, outputContainer) {
  const errorLine = document.createElement('div');
  errorLine.className = 'output-line error-output';
  errorLine.textContent = 'Error: ' + error.message;
  
  outputContainer.appendChild(errorLine);
  
  // Scroll to bottom
  outputContainer.scrollTop = outputContainer.scrollHeight;
}

// Reset the editor
function resetEditor(codeInput, outputContainer) {
  // Clear code
  codeInput.value = '';
  
  // Clear output
  outputContainer.innerHTML = '';
  
  // Update line numbers
  const lineNumbers = document.querySelector('.line-numbers');
  if (lineNumbers) {
    updateLineNumbers(codeInput, lineNumbers);
  }
  
  // Update syntax highlighting
  if (window.Prism) {
    const highlightElement = document.querySelector('.code-highlight');
    if (highlightElement) {
      highlightElement.innerHTML = '';
    }
  }
  
  // Clear local storage
  localStorage.removeItem('codekids_editor_code');
}

// Load example code
function loadExample(exampleId, codeInput) {
  let code = '';
  
  switch (exampleId) {
    case 'hello-world':
      code = '// My first program\nconsole.log("Hello, world!");';
      break;
    case 'variables':
      code = '// Using variables\nlet name = "Coder";\nlet age = 8;\nconsole.log("My name is " + name);\nconsole.log("I am " + age + " years old");';
      break;
    case 'loop':
      code = '// Using a loop\nfor (let i = 1; i <= 5; i++) {\n  console.log("Count: " + i);\n}';
      break;
    case 'turtle-square':
      code = '// Draw a square with turtle\nturtle.setColor("#4a86e8");\n\nfor (let i = 0; i < 4; i++) {\n  turtle.forward(50);\n  turtle.right(90);\n}';
      break;
    case 'turtle-star':
      code = '// Draw a star with turtle\nturtle.setColor("#ff7043");\n\nfor (let i = 0; i < 5; i++) {\n  turtle.forward(80);\n  turtle.right(144);\n}';
      break;
    case 'turtle-spiral':
      code = '// Draw a spiral with turtle\nturtle.setColor("#7e57c2");\n\nfor (let i = 0; i < 20; i++) {\n  turtle.forward(i * 5);\n  turtle.right(90);\n}';
      break;
    default:
      code = '// Write your code here\nconsole.log("Ready to code!");';
  }
  
  // Set code
  codeInput.value = code;
  
  // Update line numbers
  const lineNumbers = document.querySelector('.line-numbers');
  if (lineNumbers) {
    updateLineNumbers(codeInput, lineNumbers);
  }
  
  // Update syntax highlighting
  if (window.Prism) {
    const highlightElement = document.querySelector('.code-highlight');
    if (highlightElement) {
      const highlightedCode = Prism.highlight(code, Prism.languages.javascript, 'javascript');
      highlightElement.innerHTML = highlightedCode + '\n';
    }
  }
  
  // Save to local storage
  localStorage.setItem('codekids_editor_code', code);
}

// Setup auto-save functionality
function setupAutoSave(codeInput) {
  // Load saved code if available
  const savedCode = localStorage.getItem('codekids_editor_code');
  if (savedCode) {
    codeInput.value = savedCode;
    
    // Update line numbers
    const lineNumbers = document.querySelector('.line-numbers');
    if (lineNumbers) {
      updateLineNumbers(codeInput, lineNumbers);
    }
    
    // Update syntax highlighting
    if (window.Prism) {
      const highlightElement = document.querySelector('.code-highlight');
      if (highlightElement) {
        const highlightedCode = Prism.highlight(savedCode, Prism.languages.javascript, 'javascript');
        highlightElement.innerHTML = highlightedCode + '\n';
      }
    }
  }
  
  // Save code when it changes
  codeInput.addEventListener('input', function() {
    localStorage.setItem('codekids_editor_code', this.value);
  });
}

// Export functions for use in other modules
window.CodeKidsEditor = {
  initializeCodeEditor,
  runCode,
  resetEditor,
  loadExample
};
