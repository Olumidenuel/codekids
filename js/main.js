// Main JavaScript file for CodeKids AI Adventure
// This file handles common functionality across the platform

// DOM Content Loaded Event Listener
document.addEventListener('DOMContentLoaded', function() {
  console.log('CodeKids AI Adventure initialized');
  
  // Initialize components based on current page
  initializeCurrentPage();
  
  // Setup common UI elements
  setupNavigation();
  setupAnimations();
  
  // Check for user session
  checkUserSession();
  
  // Setup responsive behavior
  setupResponsiveBehavior();
});

// Determine which page we're on and initialize appropriate components
function initializeCurrentPage() {
  const path = window.location.pathname;
  
  if (path.includes('/coding-exercise')) {
    initializeCodingExercise();
  } else if (path.includes('/ai-image-recognition')) {
    initializeAIImageRecognition();
  } else if (path.includes('/character-creator')) {
    initializeCharacterCreator();
  } else if (path.includes('/code-editor')) {
    initializeCodeEditor();
  } else {
    // Home page or default
    initializeHomePage();
  }
}

// Navigation setup
function setupNavigation() {
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }
  
  // Add active class to current nav item
  const navLinks = document.querySelectorAll('nav a');
  const currentPath = window.location.pathname;
  
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });
}

// Setup animations for UI elements
function setupAnimations() {
  // Add wiggle animation to elements with wiggle-hover class
  const wiggleElements = document.querySelectorAll('.wiggle-hover');
  
  wiggleElements.forEach(element => {
    element.addEventListener('mouseover', function() {
      this.classList.add('wiggle');
    });
    
    element.addEventListener('animationend', function() {
      this.classList.remove('wiggle');
    });
  });
  
  // Add hover-shadow effect
  const hoverShadowElements = document.querySelectorAll('.hover-shadow');
  
  hoverShadowElements.forEach(element => {
    element.addEventListener('mouseover', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
    });
    
    element.addEventListener('mouseout', function() {
      this.style.transform = '';
      this.style.boxShadow = '';
    });
  });
  
  // Add hover-float effect
  const hoverFloatElements = document.querySelectorAll('.hover-float');
  
  hoverFloatElements.forEach(element => {
    element.addEventListener('mouseover', function() {
      this.classList.add('float');
    });
    
    element.addEventListener('mouseout', function() {
      this.classList.remove('float');
    });
  });
  
  // Add hover-grow effect
  const hoverGrowElements = document.querySelectorAll('.hover-grow');
  
  hoverGrowElements.forEach(element => {
    element.addEventListener('mouseover', function() {
      this.style.transform = 'scale(1.05)';
    });
    
    element.addEventListener('mouseout', function() {
      this.style.transform = '';
    });
  });
  
  // Add hover-bright effect
  const hoverBrightElements = document.querySelectorAll('.hover-bright');
  
  hoverBrightElements.forEach(element => {
    element.addEventListener('mouseover', function() {
      this.style.filter = 'brightness(1.2)';
    });
    
    element.addEventListener('mouseout', function() {
      this.style.filter = '';
    });
  });
  
  // Setup page load animations
  const pageLoadElements = document.querySelectorAll('.page-load-animation');
  
  pageLoadElements.forEach((element, index) => {
    // Add a staggered delay based on index
    const delay = 0.1 + (index * 0.1);
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, delay * 1000);
  });
  
  // Setup animated buttons
  const animatedButtons = document.querySelectorAll('.animated-button');
  
  animatedButtons.forEach(button => {
    button.addEventListener('mouseover', function() {
      this.classList.add('button-pulse');
    });
    
    button.addEventListener('mouseout', function() {
      this.classList.remove('button-pulse');
    });
    
    button.addEventListener('click', function() {
      this.classList.add('button-click');
      setTimeout(() => {
        this.classList.remove('button-click');
      }, 300);
    });
  });
}

// Setup responsive behavior
function setupResponsiveBehavior() {
  // Check for touch devices and add touch-device class to body
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.classList.add('touch-device');
  }
  
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('reduced-motion');
  }
  
  // Handle window resize events
  window.addEventListener('resize', handleWindowResize);
  
  // Initial call to handle current window size
  handleWindowResize();
}

// Handle window resize
function handleWindowResize() {
  const width = window.innerWidth;
  
  // Remove all size classes
  document.body.classList.remove('size-xs', 'size-sm', 'size-md', 'size-lg', 'size-xl');
  
  // Add appropriate size class
  if (width < 576) {
    document.body.classList.add('size-xs');
  } else if (width < 768) {
    document.body.classList.add('size-sm');
  } else if (width < 992) {
    document.body.classList.add('size-md');
  } else if (width < 1200) {
    document.body.classList.add('size-lg');
  } else {
    document.body.classList.add('size-xl');
  }
  
  // Adjust UI elements based on screen size
  adjustUIForScreenSize(width);
}

// Adjust UI elements based on screen size
function adjustUIForScreenSize(width) {
  // Adjust code editor if it exists
  const codeEditor = document.querySelector('.editor-container');
  if (codeEditor) {
    if (width < 768) {
      codeEditor.style.height = '200px';
    } else {
      codeEditor.style.height = '300px';
    }
  }
  
  // Adjust character creator layout if it exists
  const characterOptions = document.querySelector('.character-options');
  if (characterOptions && width < 768) {
    characterOptions.querySelectorAll('.character-option-group').forEach(group => {
      group.style.width = '100%';
    });
  }
}

// Check for existing user session
function checkUserSession() {
  const userSession = localStorage.getItem('codekids_user');
  
  if (userSession) {
    try {
      const user = JSON.parse(userSession);
      updateUIForLoggedInUser(user);
    } catch (e) {
      console.error('Error parsing user session:', e);
      localStorage.removeItem('codekids_user');
    }
  } else {
    updateUIForGuest();
  }
}

// Update UI for logged in users
function updateUIForLoggedInUser(user) {
  const loginButtons = document.querySelectorAll('.login-button');
  const userMenus = document.querySelectorAll('.user-menu');
  const userNameElements = document.querySelectorAll('.user-name');
  
  loginButtons.forEach(button => {
    button.classList.add('hidden');
  });
  
  userMenus.forEach(menu => {
    menu.classList.remove('hidden');
  });
  
  userNameElements.forEach(element => {
    element.textContent = user.name || 'Coder';
  });
}

// Update UI for guests
function updateUIForGuest() {
  const loginButtons = document.querySelectorAll('.login-button');
  const userMenus = document.querySelectorAll('.user-menu');
  
  loginButtons.forEach(button => {
    button.classList.remove('hidden');
  });
  
  userMenus.forEach(menu => {
    menu.classList.add('hidden');
  });
}

// Home page initialization
function initializeHomePage() {
  console.log('Initializing home page');
  
  // Setup adventure selection cards
  const adventureOptions = document.querySelectorAll('.adventure-option');
  
  adventureOptions.forEach(option => {
    option.addEventListener('click', function() {
      const path = this.querySelector('a').getAttribute('href');
      if (path) {
        window.location.href = path;
      }
    });
  });
}

// Initialize coding exercise page
function initializeCodingExercise() {
  console.log('Initializing coding exercise page');
  
  // Setup drag and drop functionality
  setupDragDropBlocks();
  
  // Setup run code button
  const runButton = document.querySelector('.run-code-button');
  if (runButton) {
    runButton.addEventListener('click', function() {
      runCodeFromBlocks();
    });
  }
  
  // Setup reset button
  const resetButton = document.querySelector('.reset-code-button');
  if (resetButton) {
    resetButton.addEventListener('click', function() {
      resetCodeWorkspace();
    });
  }
  
  // Setup hint button
  const hintButton = document.querySelector('.hint-button');
  const hintContainer = document.querySelector('.hint-container');
  
  if (hintButton && hintContainer) {
    hintButton.addEventListener('click', function() {
      hintContainer.classList.toggle('hidden');
    });
  }
}

// Initialize AI image recognition page
function initializeAIImageRecognition() {
  console.log('Initializing AI image recognition page');
  
  // Setup image selector
  const imageSelector = document.querySelector('.image-selector');
  if (imageSelector) {
    imageSelector.addEventListener('change', function() {
      updateSelectedImage(this.value);
    });
  }
  
  // Setup category selection
  const categoryInputs = document.querySelectorAll('.category-input');
  categoryInputs.forEach(input => {
    input.addEventListener('change', function() {
      updateSelectedCategory(this.getAttribute('data-category'));
    });
  });
  
  // Setup train AI button
  const trainButton = document.querySelector('.train-ai-button');
  if (trainButton) {
    trainButton.addEventListener('click', function() {
      trainAI();
    });
  }
  
  // Setup test AI button
  const testButton = document.querySelector('.test-ai-button');
  if (testButton) {
    testButton.addEventListener('click', function() {
      testAI();
    });
  }
}

// Initialize character creator page
function initializeCharacterCreator() {
  console.log('Initializing character creator page');
  
  // Setup character type selection
  const typeButtons = document.querySelectorAll('.character-type-button');
  typeButtons.forEach(button => {
    button.addEventListener('click', function() {
      selectCharacterType(this.getAttribute('data-type'));
      
      // Remove selected class from all buttons
      typeButtons.forEach(btn => btn.classList.remove('selected'));
      
      // Add selected class to clicked button
      this.classList.add('selected');
    });
  });
  
  // Setup character style selection
  const styleButtons = document.querySelectorAll('.character-style-button');
  styleButtons.forEach(button => {
    button.addEventListener('click', function() {
      selectCharacterStyle(this.getAttribute('data-style'));
      
      // Remove selected class from all buttons
      styleButtons.forEach(btn => btn.classList.remove('selected'));
      
      // Add selected class to clicked button
      this.classList.add('selected');
    });
  });
  
  // Setup character name input
  const nameInput = document.querySelector('#character-name');
  if (nameInput) {
    nameInput.addEventListener('input', function() {
      updateCharacterName(this.value);
    });
  }
  
  // Setup save button
  const saveButton = document.querySelector('.character-save-button');
  if (saveButton) {
    saveButton.addEventListener('click', function() {
      saveCharacter();
    });
  }
}

// Initialize code editor page
function initializeCodeEditor() {
  console.log('Initializing code editor page');
  
  // Setup example selector
  const exampleSelector = document.querySelector('.example-selector');
  if (exampleSelector) {
    exampleSelector.addEventListener('change', function() {
      loadCodeExample(this.value);
    });
  }
  
  // Setup run code button
  const runButton = document.querySelector('.run-code-button');
  if (runButton) {
    runButton.addEventListener('click', function() {
      runCode();
    });
  }
  
  // Setup reset button
  const resetButton = document.querySelector('.reset-code-button');
  if (resetButton) {
    resetButton.addEventListener('click', function() {
      resetCode();
    });
  }
  
  // Setup code input
  const codeInput = document.querySelector('.code-input');
  if (codeInput) {
    codeInput.addEventListener('input', function() {
      updateLineNumbers(this.value);
      highlightCode(this.value);
    });
    
    // Initial line numbers and highlighting
    updateLineNumbers(codeInput.value);
    highlightCode(codeInput.value);
  }
}

// Load user progress from localStorage
function loadUserProgress(pathType) {
  const progressKey = `codekids_progress_${pathType}`;
  const progress = localStorage.getItem(progressKey);
  
  if (progress) {
    try {
      const progressData = JSON.parse(progress);
      updateProgressUI(pathType, progressData);
    } catch (e) {
      console.error(`Error parsing ${pathType} progress:`, e);
      localStorage.removeItem(progressKey);
    }
  } else {
    // Initialize empty progress
    const emptyProgress = {
      level: 1,
      completedLessons: [],
      badges: [],
      points: 0
    };
    
    localStorage.setItem(progressKey, JSON.stringify(emptyProgress));
    updateProgressUI(pathType, emptyProgress);
  }
}

// Update progress UI elements
function updateProgressUI(pathType, progressData) {
  // Update progress bars
  const progressBars = document.querySelectorAll(`.${pathType}-progress`);
  
  progressBars.forEach(bar => {
    const level = bar.getAttribute('data-level');
    
    if (level && progressData.level >= parseInt(level)) {
      // Completed level
      bar.style.width = '100%';
    } else if (level && parseInt(level) === progressData.level) {
      // Current level - calculate percentage
      const levelLessons = document.querySelectorAll(`.level-${level} .lesson`).length;
      const completedCount = progressData.completedLessons.filter(
        lesson => lesson.startsWith(`level-${level}`)
      ).length;
      
      const percentage = levelLessons > 0 ? (completedCount / levelLessons) * 100 : 0;
      bar.style.width = `${percentage}%`;
    } else {
      // Future level
      bar.style.width = '0%';
    }
  });
  
  // Update badges
  const badgeContainer = document.querySelector(`.${pathType}-badges`);
  
  if (badgeContainer) {
    badgeContainer.innerHTML = '';
    
    if (progressData.badges.length === 0) {
      badgeContainer.innerHTML = '<div class="empty-badge pulse">Complete lessons to earn badges!</div>';
    } else {
      progressData.badges.forEach(badge => {
        const badgeElement = document.createElement('div');
        badgeElement.className = 'badge';
        badgeElement.innerHTML = `
          <div class="badge-icon">${badge.icon}</div>
          <div class="badge-name">${badge.name}</div>
        `;
        badgeContainer.appendChild(badgeElement);
      });
    }
  }
  
  // Update points
  const pointsElement = document.querySelector(`.${pathType}-points`);
  if (pointsElement) {
    pointsElement.textContent = progressData.points;
  }
}

// These functions would be implemented in their respective JS files
// Placeholder implementations for completeness

// Drag and drop coding blocks functionality
function setupDragDropBlocks() {
  console.log('Setting up drag and drop blocks');
  // Implementation would be in drag-drop-coding.js
}

function runCodeFromBlocks() {
  console.log('Running code from blocks');
  // Implementation would be in drag-drop-coding.js
}

function resetCodeWorkspace() {
  console.log('Resetting code workspace');
  // Implementation would be in drag-drop-coding.js
}

// AI image recognition functionality
function updateSelectedImage(imageValue) {
  console.log('Updating selected image:', imageValue);
  // Implementation would be in ai-demonstrations.js
}

function updateSelectedCategory(category) {
  console.log('Updating selected category:', category);
  // Implementation would be in ai-demonstrations.js
}

function trainAI() {
  console.log('Training AI');
  // Implementation would be in ai-demonstrations.js
}

function testAI() {
  console.log('Testing AI');
  // Implementation would be in ai-demonstrations.js
}

// Character creator functionality
function selectCharacterType(type) {
  console.log('Selecting character type:', type);
  // Update character preview
  const characterPreview = document.querySelector('.character-preview');
  if (characterPreview) {
    // Map of character types to emojis
    const typeEmojis = {
      'coder': '👩‍💻',
      'scientist': '👩‍🔬',
      'astronaut': '👩‍🚀',
      'artist': '👩‍🎨'
    };
    
    // Get current style
    const currentStyle = document.querySelector('.character-style-button.selected').getAttribute('data-style');
    
    // Update emoji based on type and style
    updateCharacterEmoji(type, currentStyle);
  }
}

function selectCharacterStyle(style) {
  console.log('Selecting character style:', style);
  // Update character preview
  const characterPreview = document.querySelector('.character-preview');
  if (characterPreview) {
    // Get current type
    const currentType = document.querySelector('.character-type-button.selected').getAttribute('data-type');
    
    // Update emoji based on type and style
    updateCharacterEmoji(currentType, style);
  }
}

function updateCharacterEmoji(type, style) {
  const characterPreview = document.querySelector('.character-preview');
  if (!characterPreview) return;
  
  // Map of character types and styles to emojis
  const emojiMap = {
    'coder': {
      'girl': '👩‍💻',
      'boy': '👨‍💻',
      'kid': '🧑‍💻'
    },
    'scientist': {
      'girl': '👩‍🔬',
      'boy': '👨‍🔬',
      'kid': '🧑‍🔬'
    },
    'astronaut': {
      'girl': '👩‍🚀',
      'boy': '👨‍🚀',
      'kid': '🧑‍🚀'
    },
    'artist': {
      'girl': '👩‍🎨',
      'boy': '👨‍🎨',
      'kid': '🧑‍🎨'
    }
  };
  
  // Set emoji
  if (emojiMap[type] && emojiMap[type][style]) {
    characterPreview.textContent = emojiMap[type][style];
  }
}

function updateCharacterName(name) {
  console.log('Updating character name:', name);
  const nameElement = document.querySelector('.character-preview-name');
  if (nameElement) {
    nameElement.textContent = name || 'Coder';
  }
}

function saveCharacter() {
  console.log('Saving character');
  // Get character data
  const type = document.querySelector('.character-type-button.selected').getAttribute('data-type');
  const style = document.querySelector('.character-style-button.selected').getAttribute('data-style');
  const name = document.querySelector('#character-name').value || 'Coder';
  
  // Save to localStorage
  const character = {
    type,
    style,
    name
  };
  
  localStorage.setItem('codekids_character', JSON.stringify(character));
  
  // Show success message
  alert('Character saved successfully!');
}

// Code editor functionality
function loadCodeExample(example) {
  console.log('Loading code example:', example);
  // Implementation would be in simple-code-editor.js
}

function runCode() {
  console.log('Running code');
  // Implementation would be in simple-code-editor.js
}

function resetCode() {
  console.log('Resetting code');
  // Implementation would be in simple-code-editor.js
}

function updateLineNumbers(code) {
  console.log('Updating line numbers');
  // Implementation would be in simple-code-editor.js
}

function highlightCode(code) {
  console.log('Highlighting code');
  // Implementation would be in simple-code-editor.js
}
