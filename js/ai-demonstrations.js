// AI Demonstrations and Interactive Learning
// This file implements the AI demonstrations and interactive learning components

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on an AI learning page
  if (document.querySelector('.ai-learning-module')) {
    initializeAIModule();
  }
});

// Initialize AI learning module
function initializeAIModule() {
  const moduleType = document.querySelector('.ai-learning-module').getAttribute('data-module-type');
  
  switch (moduleType) {
    case 'image-recognition':
      initializeImageRecognition();
      break;
    case 'pattern-matching':
      initializePatternMatching();
      break;
    case 'decision-tree':
      initializeDecisionTree();
      break;
    case 'chatbot':
      initializeChatbot();
      break;
    default:
      console.error('Unknown AI module type:', moduleType);
  }
}

// Initialize image recognition demo
function initializeImageRecognition() {
  console.log('Initializing image recognition demo');
  
  // Get elements
  const imageContainer = document.querySelector('.image-recognition-container');
  const imageElement = document.querySelector('.recognition-image');
  const resultContainer = document.querySelector('.recognition-results');
  const trainButton = document.querySelector('.train-ai-button');
  const testButton = document.querySelector('.test-ai-button');
  const imageSelector = document.querySelector('.image-selector');
  const categoryInputs = document.querySelectorAll('.category-input');
  
  if (!imageContainer || !resultContainer) {
    console.error('Missing required elements for image recognition demo');
    return;
  }
  
  // Initialize demo state
  const demoState = {
    trained: false,
    categories: {},
    currentImage: null
  };
  
  // Setup image selector
  if (imageSelector) {
    imageSelector.addEventListener('change', function() {
      const selectedImage = this.value;
      if (selectedImage && imageElement) {
        imageElement.src = `/images/ai-demo/${selectedImage}.jpg`;
        demoState.currentImage = selectedImage;
      }
    });
  }
  
  // Setup category inputs
  if (categoryInputs.length) {
    categoryInputs.forEach(input => {
      input.addEventListener('change', function() {
        const category = this.getAttribute('data-category');
        const imageId = demoState.currentImage;
        
        if (category && imageId) {
          // Add this image to the category
          if (!demoState.categories[category]) {
            demoState.categories[category] = [];
          }
          
          // Check if image is already in this category
          if (!demoState.categories[category].includes(imageId)) {
            demoState.categories[category].push(imageId);
          }
          
          // Update UI to show the image is categorized
          updateCategoryUI();
        }
      });
    });
  }
  
  // Setup train button
  if (trainButton) {
    trainButton.addEventListener('click', function() {
      // Check if we have enough training data
      let hasEnoughData = true;
      let categoriesWithData = 0;
      
      for (const category in demoState.categories) {
        if (demoState.categories[category].length > 0) {
          categoriesWithData++;
        }
        
        if (demoState.categories[category].length < 2) {
          hasEnoughData = false;
        }
      }
      
      if (categoriesWithData < 2 || !hasEnoughData) {
        showMessage('Please add at least 2 images to each category for training', 'error');
        return;
      }
      
      // Simulate AI training
      simulateTraining(function() {
        demoState.trained = true;
        showMessage('AI has been trained successfully!', 'success');
        
        // Enable test button
        if (testButton) {
          testButton.disabled = false;
        }
      });
    });
  }
  
  // Setup test button
  if (testButton) {
    testButton.disabled = true; // Disabled until trained
    
    testButton.addEventListener('click', function() {
      if (!demoState.trained) {
        showMessage('Please train the AI first', 'error');
        return;
      }
      
      if (!demoState.currentImage) {
        showMessage('Please select an image to test', 'error');
        return;
      }
      
      // Simulate AI prediction
      simulatePrediction(demoState.currentImage, demoState.categories, function(results) {
        displayRecognitionResults(results);
      });
    });
  }
  
  // Update category UI
  function updateCategoryUI() {
    const categoryLabels = document.querySelectorAll('.category-label');
    
    categoryLabels.forEach(label => {
      const category = label.getAttribute('data-category');
      const count = demoState.categories[category] ? demoState.categories[category].length : 0;
      
      const countElement = label.querySelector('.category-count');
      if (countElement) {
        countElement.textContent = count;
      }
    });
  }
  
  // Initialize with default images if available
  if (imageSelector && imageSelector.options.length > 0) {
    imageSelector.selectedIndex = 0;
    const defaultImage = imageSelector.options[0].value;
    if (defaultImage && imageElement) {
      imageElement.src = `/images/ai-demo/${defaultImage}.jpg`;
      demoState.currentImage = defaultImage;
    }
  }
}

// Simulate AI training with progress animation
function simulateTraining(callback) {
  const progressBar = document.querySelector('.training-progress-bar');
  const progressFill = document.querySelector('.training-progress-fill');
  
  if (!progressBar || !progressFill) {
    // If no progress bar, just wait a bit and call callback
    setTimeout(callback, 2000);
    return;
  }
  
  // Show progress bar
  progressBar.style.display = 'block';
  progressFill.style.width = '0%';
  
  // Simulate training progress
  let progress = 0;
  const interval = setInterval(function() {
    progress += 5;
    progressFill.style.width = `${progress}%`;
    
    if (progress >= 100) {
      clearInterval(interval);
      
      // Hide progress bar after a moment
      setTimeout(function() {
        progressBar.style.display = 'none';
        callback();
      }, 500);
    }
  }, 200);
}

// Simulate AI prediction
function simulatePrediction(imageId, categories, callback) {
  // Show thinking animation
  const thinkingElement = document.querySelector('.ai-thinking');
  
  if (thinkingElement) {
    thinkingElement.style.display = 'block';
  }
  
  // Simulate thinking time
  setTimeout(function() {
    if (thinkingElement) {
      thinkingElement.style.display = 'none';
    }
    
    // Generate prediction results
    const results = generatePredictionResults(imageId, categories);
    callback(results);
  }, 1500);
}

// Generate prediction results based on training data
function generatePredictionResults(imageId, categories) {
  const results = [];
  
  // Check which categories this image was added to during training
  for (const category in categories) {
    if (categories[category].includes(imageId)) {
      // High confidence for categories it was trained on
      results.push({
        category: category,
        confidence: 85 + Math.floor(Math.random() * 15) // 85-99%
      });
    } else {
      // Low confidence for other categories
      results.push({
        category: category,
        confidence: Math.floor(Math.random() * 30) // 0-29%
      });
    }
  }
  
  // Sort by confidence
  results.sort((a, b) => b.confidence - a.confidence);
  
  return results;
}

// Display recognition results
function displayRecognitionResults(results) {
  const resultContainer = document.querySelector('.recognition-results');
  
  if (!resultContainer) {
    return;
  }
  
  // Clear previous results
  resultContainer.innerHTML = '<h3>AI Prediction Results:</h3>';
  
  // Create results list
  const resultsList = document.createElement('ul');
  resultsList.className = 'results-list';
  
  // Add each result
  results.forEach(result => {
    const resultItem = document.createElement('li');
    resultItem.className = 'result-item';
    
    // Determine confidence class
    let confidenceClass = 'low-confidence';
    if (result.confidence >= 70) {
      confidenceClass = 'high-confidence';
    } else if (result.confidence >= 30) {
      confidenceClass = 'medium-confidence';
    }
    
    resultItem.innerHTML = `
      <span class="result-category">${result.category}:</span>
      <div class="confidence-bar">
        <div class="confidence-fill ${confidenceClass}" style="width: ${result.confidence}%"></div>
      </div>
      <span class="confidence-value">${result.confidence}%</span>
    `;
    
    resultsList.appendChild(resultItem);
  });
  
  resultContainer.appendChild(resultsList);
  
  // Add explanation
  const explanation = document.createElement('div');
  explanation.className = 'ai-explanation';
  explanation.innerHTML = `
    <h4>How did the AI make this prediction?</h4>
    <p>The AI looked at the patterns it learned during training. It compared features like colors, shapes, and textures in this image to what it saw in the training images.</p>
    <p>Higher confidence (green bars) means the AI thinks this image is very similar to images in that category. Lower confidence (red bars) means it doesn't see much similarity.</p>
  `;
  
  resultContainer.appendChild(explanation);
  
  // Show the results container
  resultContainer.style.display = 'block';
}

// Initialize pattern matching demo
function initializePatternMatching() {
  console.log('Initializing pattern matching demo');
  
  // Get elements
  const patternContainer = document.querySelector('.pattern-matching-container');
  const patternGrid = document.querySelector('.pattern-grid');
  const predictButton = document.querySelector('.predict-pattern-button');
  const resetButton = document.querySelector('.reset-pattern-button');
  const resultContainer = document.querySelector('.pattern-results');
  
  if (!patternContainer || !patternGrid) {
    console.error('Missing required elements for pattern matching demo');
    return;
  }
  
  // Initialize grid
  const gridSize = 5; // 5x5 grid
  const patterns = {
    'Square': [[1,1,1,1,1], [1,0,0,0,1], [1,0,0,0,1], [1,0,0,0,1], [1,1,1,1,1]],
    'Circle': [[0,1,1,1,0], [1,0,0,0,1], [1,0,0,0,1], [1,0,0,0,1], [0,1,1,1,0]],
    'X': [[1,0,0,0,1], [0,1,0,1,0], [0,0,1,0,0], [0,1,0,1,0], [1,0,0,0,1]],
    'Triangle': [[0,0,1,0,0], [0,1,0,1,0], [1,0,0,0,1], [1,1,1,1,1], [0,0,0,0,0]]
  };
  
  // Create grid cells
  createPatternGrid(patternGrid, gridSize);
  
  // Setup predict button
  if (predictButton) {
    predictButton.addEventListener('click', function() {
      const currentPattern = getCurrentPattern(patternGrid, gridSize);
      const prediction = predictPattern(currentPattern, patterns);
      displayPatternResults(prediction);
    });
  }
  
  // Setup reset button
  if (resetButton) {
    resetButton.addEventListener('click', function() {
      resetPatternGrid(patternGrid);
      
      if (resultContainer) {
        resultContainer.style.display = 'none';
      }
    });
  }
}

// Create pattern grid
function createPatternGrid(container, size) {
  container.innerHTML = '';
  container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  
  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement('div');
    cell.className = 'pattern-cell';
    cell.setAttribute('data-index', i);
    
    // Add click event to toggle cell
    cell.addEventListener('click', function() {
      this.classList.toggle('active');
    });
    
    container.appendChild(cell);
  }
}

// Get current pattern from grid
function getCurrentPattern(grid, size) {
  const pattern = [];
  
  for (let row = 0; row < size; row++) {
    const rowPattern = [];
    
    for (let col = 0; col < size; col++) {
      const index = row * size + col;
      const cell = grid.querySelector(`[data-index="${index}"]`);
      
      rowPattern.push(cell && cell.classList.contains('active') ? 1 : 0);
    }
    
    pattern.push(rowPattern);
  }
  
  return pattern;
}

// Reset pattern grid
function resetPatternGrid(grid) {
  const cells = grid.querySelectorAll('.pattern-cell');
  
  cells.forEach(cell => {
    cell.classList.remove('active');
  });
}

// Predict pattern based on known patterns
function predictPattern(currentPattern, knownPatterns) {
  const results = [];
  
  // Calculate similarity with each known pattern
  for (const patternName in knownPatterns) {
    const knownPattern = knownPatterns[patternName];
    const similarity = calculatePatternSimilarity(currentPattern, knownPattern);
    
    results.push({
      pattern: patternName,
      similarity: similarity
    });
  }
  
  // Sort by similarity
  results.sort((a, b) => b.similarity - a.similarity);
  
  return results;
}

// Calculate similarity between two patterns (0-100%)
function calculatePatternSimilarity(pattern1, pattern2) {
  let matches = 0;
  let total = 0;
  
  for (let row = 0; row < pattern1.length; row++) {
    for (let col = 0; col < pattern1[row].length; col++) {
      if (pattern1[row][col] === pattern2[row][col]) {
        matches++;
      }
      total++;
    }
  }
  
  return Math.round((matches / total) * 100);
}

// Display pattern matching results
function displayPatternResults(results) {
  const resultContainer = document.querySelector('.pattern-results');
  
  if (!resultContainer) {
    return;
  }
  
  // Clear previous results
  resultContainer.innerHTML = '<h3>Pattern Recognition Results:</h3>';
  
  // Create results list
  const resultsList = document.createElement('ul');
  resultsList.className = 'results-list';
  
  // Add each result
  results.forEach(result => {
    const resultItem = document.createElement('li');
    resultItem.className = 'result-item';
    
    // Determine similarity class
    let similarityClass = 'low-similarity';
    if (result.similarity >= 70) {
      similarityClass = 'high-similarity';
    } else if (result.similarity >= 40) {
      similarityClass = 'medium-similarity';
    }
    
    resultItem.innerHTML = `
      <span class="result-pattern">${result.pattern}:</span>
      <div class="similarity-bar">
        <div class="similarity-fill ${similarityClass}" style="width: ${result.similarity}%"></div>
      </div>
      <span class="similarity-value">${result.similarity}%</span>
    `;
    
    resultsList.appendChild(resultItem);
  });
  
  resultContainer.appendChild(resultsList);
  
  // Add explanation
  const explanation = document.createElement('div');
  explanation.className = 'ai-explanation';
  explanation.innerHTML = `
    <h4>How does pattern matching work?</h4>
    <p>The AI compares your pattern with patterns it already knows. It counts how many cells match between your pattern and each known pattern.</p>
    <p>Higher similarity (green bars) means your pattern is very close to a known pattern. Lower similarity (red bars) means your pattern is different.</p>
  `;
  
  resultContainer.appendChild(explanation);
  
  // Show the results container
  resultContainer.style.display = 'block';
}

// Initialize decision tree demo
function initializeDecisionTree() {
  console.log('Initializing decision tree demo');
  
  // Get elements
  const treeContainer = document.querySelector('.decision-tree-container');
  const questionElement = document.querySelector('.decision-question');
  const optionsContainer = document.querySelector('.decision-options');
  const resetButton = document.querySelector('.reset-decision-button');
  const resultContainer = document.querySelector('.decision-result');
  
  if (!treeContainer || !questionElement || !optionsContainer) {
    console.error('Missing required elements for decision tree demo');
    return;
  }
  
  // Define decision tree
  const decisionTree = {
    question: "Is it sunny outside?",
    options: [
      {
        text: "Yes",
        next: {
          question: "Is it hot (above 80°F)?",
          options: [
            {
              text: "Yes",
              next: {
                question: "Is there a swimming pool available?",
                options: [
                  {
                    text: "Yes",
                    result: "Go swimming! 🏊‍♂️"
                  },
                  {
                    text: "No",
                    result: "Stay inside with air conditioning! ❄️"
                  }
                ]
              }
            },
            {
              text: "No",
              next: {
                question: "Do you have free time?",
                options: [
                  {
                    text: "Yes",
                    result: "Go for a walk in the park! 🚶‍♀️"
                  },
                  {
                    text: "No",
                    result: "Quickly run your errands while it's nice! 🏃‍♂️"
                  }
                ]
              }
            }
          ]
        }
      },
      {
        text: "No",
        next: {
          question: "Is it raining?",
          options: [
            {
              text: "Yes",
              next: {
                question: "Do you have an umbrella?",
                options: [
                  {
                    text: "Yes",
                    result: "Go outside with your umbrella! ☔"
                  },
                  {
                    text: "No",
                    result: "Stay inside and read a book! 📚"
                  }
                ]
              }
            },
            {
              text: "No",
              next: {
                question: "Is it cold (below 50°F)?",
                options: [
                  {
                    text: "Yes",
                    result: "Stay inside and drink hot chocolate! ☕"
                  },
                  {
                    text: "No",
                    result: "Go to the mall or a museum! 🏛️"
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  };
  
  // Initialize with the root question
  let currentNode = decisionTree;
  updateDecisionTree(currentNode);
  
  // Setup reset button
  if (resetButton) {
    resetButton.addEventListener('click', function() {
      currentNode = decisionTree;
      updateDecisionTree(currentNode);
      
      if (resultContainer) {
        resultContainer.style.display = 'none';
      }
    });
  }
  
  // Update decision tree UI
  function updateDecisionTree(node) {
    // Update question
    questionElement.textContent = node.question;
    
    // Clear previous options
    optionsContainer.innerHTML = '';
    
    // Add options
    node.options.forEach((option, index) => {
      const optionButton = document.createElement('button');
      optionButton.className = 'decision-option';
      optionButton.textContent = option.text;
      
      optionButton.addEventListener('click', function() {
        if (option.result) {
          // Show result
          showDecisionResult(option.result);
        } else if (option.next) {
          // Move to next question
          currentNode = option.next;
          updateDecisionTree(currentNode);
        }
      });
      
      optionsContainer.appendChild(optionButton);
    });
  }
  
  // Show decision result
  function showDecisionResult(result) {
    if (!resultContainer) {
      return;
    }
    
    // Update result
    resultContainer.innerHTML = `
      <h3>Decision:</h3>
      <div class="decision-result-text">${result}</div>
      <div class="ai-explanation">
        <h4>How did the AI make this decision?</h4>
        <p>The AI used a decision tree to follow a path based on your answers. Each answer led to a new question, narrowing down the possibilities until reaching a final decision.</p>
        <p>This is similar to how many AI systems make decisions - by following a series of if-then rules based on the input data.</p>
      </div>
    `;
    
    // Show result container
    resultContainer.style.display = 'block';
  }
}

// Initialize chatbot demo
function initializeChatbot() {
  console.log('Initializing chatbot demo');
  
  // Get elements
  const chatContainer = document.querySelector('.chatbot-container');
  const messagesContainer = document.querySelector('.chat-messages');
  const inputForm = document.querySelector('.chat-input-form');
  const inputField = document.querySelector('.chat-input');
  const sendButton = document.querySelector('.chat-send-button');
  
  if (!chatContainer || !messagesContainer || !inputForm || !inputField) {
    console.error('Missing required elements for chatbot demo');
    return;
  }
  
  // Define chatbot responses
  const responses = {
    greetings: [
      { pattern: /\b(hi|hello|hey)\b/i, response: "Hello there! I'm CodeBot, your AI assistant. How can I help you learn about coding or AI today?" },
      { pattern: /\b(good morning|good afternoon|good evening)\b/i, response: "Good day! I'm CodeBot. What would you like to learn about today?" }
    ],
    coding: [
      { pattern: /\b(what is|how to|learn) (coding|programming)\b/i, response: "Coding is telling a computer what to do using special instructions. It's like giving directions to a robot! Would you like to learn about blocks, sequences, or loops?" },
      { pattern: /\b(blocks|block coding)\b/i, response: "Block coding is a fun way to code by connecting puzzle-like pieces. Each block is a command that tells the computer what to do. It's perfect for beginners!" },
      { pattern: /\b(sequence|sequences)\b/i, response: "A sequence in coding is a series of steps that happen in order, like a recipe. First you do this, then you do that!" },
      { pattern: /\b(loop|loops|repeat)\b/i, response: "Loops are like a broken record that repeats the same thing over and over. They help you avoid writing the same code multiple times. For example, you could use a loop to draw a square by repeating 'move forward, turn right' four times!" }
    ],
    ai: [
      { pattern: /\b(what is|how does) (ai|artificial intelligence)\b/i, response: "Artificial Intelligence (AI) is when computers can learn and make decisions kind of like humans do. They can recognize patterns, understand language, and solve problems!" },
      { pattern: /\b(machine learning|ml)\b/i, response: "Machine Learning is how computers learn from examples instead of being told exactly what to do. It's like how you learn to recognize dogs by seeing many different dogs, not by memorizing a list of dog features!" },
      { pattern: /\b(neural network|neural networks)\b/i, response: "Neural networks are special computer systems inspired by how our brains work. They have layers of connected 'neurons' that help them learn complex patterns. They're used for things like recognizing images and understanding speech!" }
    ],
    help: [
      { pattern: /\b(help|confused|don't understand)\b/i, response: "I'm here to help! You can ask me about coding concepts like 'What are loops?' or AI concepts like 'How does machine learning work?' What would you like to know?" }
    ],
    fallback: [
      { response: "I'm not sure I understand. Could you try asking about coding or AI in a different way?" },
      { response: "That's an interesting question! I'm still learning, but I can definitely help with questions about coding and AI basics." },
      { response: "Hmm, I'm not sure about that. I'm best at answering questions about coding concepts like loops and sequences, or AI concepts like machine learning." }
    ]
  };
  
  // Add initial message
  addMessage("Hello! I'm CodeBot, your friendly AI assistant. I can answer questions about coding and AI. What would you like to know?", 'bot');
  
  // Setup input form
  inputForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const message = inputField.value.trim();
    
    if (message) {
      // Add user message
      addMessage(message, 'user');
      
      // Clear input
      inputField.value = '';
      
      // Generate response after a short delay
      setTimeout(function() {
        const response = generateResponse(message, responses);
        addMessage(response, 'bot');
      }, 1000);
    }
  });
  
  // Add message to chat
  function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'chat-avatar';
    avatar.textContent = sender === 'bot' ? '🤖' : '👧';
    
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = text;
    
    messageElement.appendChild(avatar);
    messageElement.appendChild(bubble);
    
    messagesContainer.appendChild(messageElement);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  // Generate response based on user input
  function generateResponse(input, responses) {
    // Check each category of responses
    for (const category in responses) {
      if (category === 'fallback') continue;
      
      for (const item of responses[category]) {
        if (item.pattern && item.pattern.test(input)) {
          return item.response;
        }
      }
    }
    
    // If no match, use fallback
    const fallbacks = responses.fallback;
    const randomIndex = Math.floor(Math.random() * fallbacks.length);
    return fallbacks[randomIndex].response;
  }
}

// Show message to user
function showMessage(message, type = 'info') {
  // Use global message function if available
  if (window.CodeKids && window.CodeKids.showMessage) {
    window.CodeKids.showMessage(message, type);
    return;
  }
  
  // Create message element if it doesn't exist
  let messageContainer = document.querySelector('.message-container');
  
  if (!messageContainer) {
    messageContainer = document.createElement('div');
    messageContainer.className = 'message-container';
    document.body.appendChild(messageContainer);
  }
  
  // Create message
  const messageElement = document.createElement('div');
  messageElement.className = `message message-${type}`;
  messageElement.textContent = message;
  
  // Add close button
  const closeButton = document.createElement('button');
  closeButton.className = 'message-close';
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', function() {
    messageElement.remove();
  });
  
  messageElement.appendChild(closeButton);
  messageContainer.appendChild(messageElement);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    messageElement.remove();
  }, 5000);
}

// Export functions for use in other modules
window.CodeKidsAI = {
  initializeAIModule,
  showMessage
};
