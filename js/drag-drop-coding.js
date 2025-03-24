// Drag and Drop Coding Blocks Functionality
// This file implements the drag and drop coding interface for the coding exercises

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on a coding exercise page
  if (document.querySelector('.coding-exercise')) {
    initializeDragAndDrop();
    setupExerciseActions();
    loadExerciseState();
  }
});

// Initialize drag and drop functionality
function initializeDragAndDrop() {
  // Get all draggable blocks
  const draggableBlocks = document.querySelectorAll('.code-block');
  // Get the code workspace
  const codeWorkspace = document.querySelector('.code-workspace');
  // Get the code blocks palette
  const blocksPalette = document.querySelector('.code-blocks-palette');
  
  if (!draggableBlocks.length || !codeWorkspace || !blocksPalette) {
    console.error('Missing required elements for drag and drop');
    return;
  }
  
  // Initialize each draggable block
  draggableBlocks.forEach(block => {
    initializeDraggableBlock(block);
  });
  
  // Make the workspace a drop target
  makeDropTarget(codeWorkspace);
  
  // Make the palette a drop target (for returning blocks)
  makeDropTarget(blocksPalette);
}

// Initialize a single draggable block
function initializeDraggableBlock(block) {
  block.setAttribute('draggable', 'true');
  
  // Add event listeners for drag operations
  block.addEventListener('dragstart', handleDragStart);
  block.addEventListener('dragend', handleDragEnd);
  
  // Add click event for mobile devices
  block.addEventListener('touchstart', handleTouchStart);
  block.addEventListener('touchmove', handleTouchMove);
  block.addEventListener('touchend', handleTouchEnd);
}

// Make an element a valid drop target
function makeDropTarget(element) {
  element.addEventListener('dragover', handleDragOver);
  element.addEventListener('dragenter', handleDragEnter);
  element.addEventListener('dragleave', handleDragLeave);
  element.addEventListener('drop', handleDrop);
  
  // Add touch events for mobile
  element.addEventListener('touchenter', handleTouchEnter);
  element.addEventListener('touchleave', handleTouchLeave);
}

// Handle the start of a drag operation
function handleDragStart(e) {
  // Add a class to show it's being dragged
  this.classList.add('dragging');
  
  // Store the block's data
  e.dataTransfer.setData('text/plain', this.getAttribute('data-block-id'));
  e.dataTransfer.effectAllowed = 'move';
  
  // Create a custom drag image if needed
  const dragImage = this.cloneNode(true);
  dragImage.style.opacity = '0.7';
  document.body.appendChild(dragImage);
  e.dataTransfer.setDragImage(dragImage, 0, 0);
  
  // Remove the clone after it's no longer needed
  setTimeout(() => {
    document.body.removeChild(dragImage);
  }, 0);
}

// Handle the end of a drag operation
function handleDragEnd(e) {
  // Remove the dragging class
  this.classList.remove('dragging');
}

// Handle an element being dragged over a drop target
function handleDragOver(e) {
  // Prevent default to allow drop
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

// Handle an element being dragged into a drop target
function handleDragEnter(e) {
  // Prevent default to allow drop
  e.preventDefault();
  this.classList.add('drag-over');
}

// Handle an element being dragged out of a drop target
function handleDragLeave(e) {
  this.classList.remove('drag-over');
}

// Handle an element being dropped on a target
function handleDrop(e) {
  // Prevent default action
  e.preventDefault();
  
  // Remove the drag-over class
  this.classList.remove('drag-over');
  
  // Get the dragged block's ID
  const blockId = e.dataTransfer.getData('text/plain');
  const draggedBlock = document.querySelector(`[data-block-id="${blockId}"]`);
  
  if (!draggedBlock) {
    return;
  }
  
  // Check if we're dropping in the workspace or palette
  if (this.classList.contains('code-workspace')) {
    // If it's a palette block, clone it
    if (draggedBlock.closest('.code-blocks-palette')) {
      const newBlock = draggedBlock.cloneNode(true);
      const newId = `block-${Date.now()}`;
      newBlock.setAttribute('data-block-id', newId);
      initializeDraggableBlock(newBlock);
      this.appendChild(newBlock);
    } else {
      // If it's already in the workspace, just move it
      this.appendChild(draggedBlock);
    }
  } else if (this.classList.contains('code-blocks-palette')) {
    // If dropping back to palette and it's not a palette original, remove it
    if (!draggedBlock.classList.contains('palette-original')) {
      draggedBlock.remove();
    }
  }
  
  // Update the code preview
  updateCodePreview();
  
  // Save the current state
  saveExerciseState();
}

// Touch event handlers for mobile devices
function handleTouchStart(e) {
  // Mark the block as being touched
  this.classList.add('touching');
  
  // Store the initial touch position
  this.touchStartX = e.touches[0].clientX;
  this.touchStartY = e.touches[0].clientY;
}

function handleTouchMove(e) {
  if (!this.classList.contains('touching')) {
    return;
  }
  
  // Prevent scrolling
  e.preventDefault();
  
  // Calculate how far we've moved
  const touchX = e.touches[0].clientX;
  const touchY = e.touches[0].clientY;
  const deltaX = touchX - this.touchStartX;
  const deltaY = touchY - this.touchStartY;
  
  // Move the element
  this.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  this.classList.add('dragging');
  
  // Check if we're over a drop target
  const elementsUnderTouch = document.elementsFromPoint(touchX, touchY);
  
  // Find potential drop targets
  const workspace = elementsUnderTouch.find(el => el.classList.contains('code-workspace'));
  const palette = elementsUnderTouch.find(el => el.classList.contains('code-blocks-palette'));
  
  // Clear previous drop target highlights
  document.querySelectorAll('.drag-over').forEach(el => {
    el.classList.remove('drag-over');
  });
  
  // Highlight current drop target
  if (workspace) {
    workspace.classList.add('drag-over');
    this.currentDropTarget = workspace;
  } else if (palette) {
    palette.classList.add('drag-over');
    this.currentDropTarget = palette;
  } else {
    this.currentDropTarget = null;
  }
}

function handleTouchEnd(e) {
  // Remove the touching and dragging classes
  this.classList.remove('touching');
  this.classList.remove('dragging');
  
  // Reset the transform
  this.style.transform = '';
  
  // Check if we have a valid drop target
  if (this.currentDropTarget) {
    if (this.currentDropTarget.classList.contains('code-workspace')) {
      // If it's a palette block, clone it
      if (this.closest('.code-blocks-palette')) {
        const newBlock = this.cloneNode(true);
        const newId = `block-${Date.now()}`;
        newBlock.setAttribute('data-block-id', newId);
        initializeDraggableBlock(newBlock);
        this.currentDropTarget.appendChild(newBlock);
      } else {
        // If it's already in the workspace, just move it
        this.currentDropTarget.appendChild(this);
      }
    } else if (this.currentDropTarget.classList.contains('code-blocks-palette')) {
      // If dropping back to palette and it's not a palette original, remove it
      if (!this.classList.contains('palette-original')) {
        this.remove();
      }
    }
    
    // Remove the drag-over class
    this.currentDropTarget.classList.remove('drag-over');
    
    // Update the code preview
    updateCodePreview();
    
    // Save the current state
    saveExerciseState();
  }
  
  // Clear the current drop target
  this.currentDropTarget = null;
}

function handleTouchEnter(e) {
  this.classList.add('drag-over');
}

function handleTouchLeave(e) {
  this.classList.remove('drag-over');
}

// Update the code preview based on blocks in the workspace
function updateCodePreview() {
  const codePreview = document.querySelector('.code-preview');
  const codeWorkspace = document.querySelector('.code-workspace');
  
  if (!codePreview || !codeWorkspace) {
    return;
  }
  
  // Get all blocks in the workspace
  const blocks = codeWorkspace.querySelectorAll('.code-block');
  
  // Build the code string
  let codeString = '';
  
  blocks.forEach(block => {
    const blockType = block.getAttribute('data-block-type');
    const blockValue = block.getAttribute('data-block-value');
    
    switch (blockType) {
      case 'move':
        codeString += `moveForward(${blockValue});\n`;
        break;
      case 'turn':
        codeString += `turn${blockValue}();\n`;
        break;
      case 'repeat':
        codeString += `repeat(${blockValue}, function() {\n`;
        // Add indentation for nested blocks
        const nestedBlocks = block.querySelectorAll('.nested-block .code-block');
        nestedBlocks.forEach(nestedBlock => {
          const nestedType = nestedBlock.getAttribute('data-block-type');
          const nestedValue = nestedBlock.getAttribute('data-block-value');
          
          switch (nestedType) {
            case 'move':
              codeString += `  moveForward(${nestedValue});\n`;
              break;
            case 'turn':
              codeString += `  turn${nestedValue}();\n`;
              break;
            default:
              codeString += `  // Unknown block type: ${nestedType}\n`;
          }
        });
        codeString += '});\n';
        break;
      case 'if':
        codeString += `if (${blockValue}) {\n`;
        // Add indentation for nested blocks
        const ifBlocks = block.querySelectorAll('.nested-block .code-block');
        ifBlocks.forEach(ifBlock => {
          const ifBlockType = ifBlock.getAttribute('data-block-type');
          const ifBlockValue = ifBlock.getAttribute('data-block-value');
          
          switch (ifBlockType) {
            case 'move':
              codeString += `  moveForward(${ifBlockValue});\n`;
              break;
            case 'turn':
              codeString += `  turn${ifBlockValue}();\n`;
              break;
            default:
              codeString += `  // Unknown block type: ${ifBlockType}\n`;
          }
        });
        codeString += '}\n';
        break;
      default:
        codeString += `// Unknown block type: ${blockType}\n`;
    }
  });
  
  // Update the code preview
  codePreview.textContent = codeString;
  
  // Highlight syntax if Prism.js is available
  if (window.Prism) {
    Prism.highlightElement(codePreview);
  }
}

// Setup exercise action buttons
function setupExerciseActions() {
  const runButton = document.querySelector('.run-code-button');
  const resetButton = document.querySelector('.reset-code-button');
  const hintButton = document.querySelector('.hint-button');
  
  if (runButton) {
    runButton.addEventListener('click', runCode);
  }
  
  if (resetButton) {
    resetButton.addEventListener('click', resetExercise);
  }
  
  if (hintButton) {
    hintButton.addEventListener('click', showHint);
  }
}

// Run the code in the workspace
function runCode() {
  const codeWorkspace = document.querySelector('.code-workspace');
  const exerciseCanvas = document.querySelector('.exercise-canvas');
  const character = document.querySelector('.exercise-character');
  
  if (!codeWorkspace || !exerciseCanvas || !character) {
    console.error('Missing required elements for running code');
    return;
  }
  
  // Reset character position
  character.style.transform = 'translate(0, 0) rotate(0deg)';
  
  // Get all blocks in the workspace
  const blocks = codeWorkspace.querySelectorAll('.code-block');
  
  // Execute the blocks sequentially with animation
  executeBlocks(blocks, character, 0);
}

// Execute blocks sequentially with animation
function executeBlocks(blocks, character, index) {
  if (index >= blocks.length) {
    // All blocks executed
    checkExerciseCompletion();
    return;
  }
  
  const block = blocks[index];
  const blockType = block.getAttribute('data-block-type');
  const blockValue = block.getAttribute('data-block-value');
  
  // Highlight the current block
  blocks.forEach(b => b.classList.remove('executing'));
  block.classList.add('executing');
  
  // Execute the block with animation
  switch (blockType) {
    case 'move':
      animateMove(character, blockValue, () => {
        // Move to next block after animation
        executeBlocks(blocks, character, index + 1);
      });
      break;
    case 'turn':
      animateTurn(character, blockValue, () => {
        // Move to next block after animation
        executeBlocks(blocks, character, index + 1);
      });
      break;
    case 'repeat':
      // Execute repeat block
      executeRepeatBlock(block, character, parseInt(blockValue), 0, () => {
        // Move to next block after all repetitions
        executeBlocks(blocks, character, index + 1);
      });
      break;
    case 'if':
      // Execute if block if condition is true
      const condition = evaluateCondition(blockValue, character);
      if (condition) {
        executeIfBlock(block, character, () => {
          // Move to next block after if block
          executeBlocks(blocks, character, index + 1);
        });
      } else {
        // Skip if block if condition is false
        executeBlocks(blocks, character, index + 1);
      }
      break;
    default:
      // Unknown block type, move to next
      executeBlocks(blocks, character, index + 1);
  }
}

// Animate character movement
function animateMove(character, distance, callback) {
  // Get current rotation
  const currentRotation = getCurrentRotation(character);
  
  // Calculate movement based on rotation
  const radians = currentRotation * Math.PI / 180;
  const deltaX = Math.sin(radians) * parseInt(distance) * 50; // 50px per unit
  const deltaY = -Math.cos(radians) * parseInt(distance) * 50; // Negative because Y increases downward
  
  // Get current position
  const currentTransform = window.getComputedStyle(character).transform;
  const matrix = new DOMMatrix(currentTransform);
  const currentX = matrix.m41;
  const currentY = matrix.m42;
  
  // Animate the movement
  character.style.transition = 'transform 0.5s ease';
  character.style.transform = `translate(${currentX + deltaX}px, ${currentY + deltaY}px) rotate(${currentRotation}deg)`;
  
  // Call callback after animation
  setTimeout(callback, 500);
}

// Animate character rotation
function animateTurn(character, direction, callback) {
  // Get current rotation
  const currentRotation = getCurrentRotation(character);
  
  // Calculate new rotation
  let newRotation = currentRotation;
  if (direction === 'Left') {
    newRotation -= 90;
  } else if (direction === 'Right') {
    newRotation += 90;
  }
  
  // Get current position
  const currentTransform = window.getComputedStyle(character).transform;
  const matrix = new DOMMatrix(currentTransform);
  const currentX = matrix.m41;
  const currentY = matrix.m42;
  
  // Animate the rotation
  character.style.transition = 'transform 0.5s ease';
  character.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${newRotation}deg)`;
  
  // Call callback after animation
  setTimeout(callback, 500);
}

// Execute a repeat block
function executeRepeatBlock(block, character, repetitions, currentRep, callback) {
  if (currentRep >= repetitions) {
    // All repetitions completed
    callback();
    return;
  }
  
  // Get nested blocks
  const nestedBlocks = block.querySelectorAll('.nested-block .code-block');
  
  // Execute nested blocks
  executeBlocks(nestedBlocks, character, 0, () => {
    // Move to next repetition
    executeRepeatBlock(block, character, repetitions, currentRep + 1, callback);
  });
}

// Execute an if block
function executeIfBlock(block, character, callback) {
  // Get nested blocks
  const nestedBlocks = block.querySelectorAll('.nested-block .code-block');
  
  // Execute nested blocks
  executeBlocks(nestedBlocks, character, 0, callback);
}

// Evaluate a condition for if blocks
function evaluateCondition(condition, character) {
  // Get character position and environment state
  const currentTransform = window.getComputedStyle(character).transform;
  const matrix = new DOMMatrix(currentTransform);
  const currentX = matrix.m41;
  const currentY = matrix.m42;
  
  // Get obstacles and goals
  const obstacles = document.querySelectorAll('.exercise-obstacle');
  const goals = document.querySelectorAll('.exercise-goal');
  
  // Evaluate different conditions
  switch (condition) {
    case 'pathAhead':
      // Check if path ahead is clear
      return !isObstacleAhead(character, obstacles);
    case 'atGoal':
      // Check if character is at a goal
      return isAtGoal(character, goals);
    case 'canTurnLeft':
      // Check if character can turn left
      return canTurn(character, obstacles, 'Left');
    case 'canTurnRight':
      // Check if character can turn right
      return canTurn(character, obstacles, 'Right');
    default:
      console.error('Unknown condition:', condition);
      return false;
  }
}

// Check if there's an obstacle ahead
function isObstacleAhead(character, obstacles) {
  // Get character position and rotation
  const currentTransform = window.getComputedStyle(character).transform;
  const matrix = new DOMMatrix(currentTransform);
  const currentX = matrix.m41;
  const currentY = matrix.m42;
  const currentRotation = getCurrentRotation(character);
  
  // Calculate position ahead
  const radians = currentRotation * Math.PI / 180;
  const aheadX = currentX + Math.sin(radians) * 50;
  const aheadY = currentY - Math.cos(radians) * 50;
  
  // Check if any obstacle is at the position ahead
  for (const obstacle of obstacles) {
    const obstacleRect = obstacle.getBoundingClientRect();
    const characterRect = character.getBoundingClientRect();
    
    // Calculate obstacle center
    const obstacleX = obstacleRect.left + obstacleRect.width / 2;
    const obstacleY = obstacleRect.top + obstacleRect.height / 2;
    
    // Calculate distance to obstacle
    const distance = Math.sqrt(
      Math.pow(aheadX - obstacleX, 2) + 
      Math.pow(aheadY - obstacleY, 2)
    );
    
    // If obstacle is close enough, path is blocked
    if (distance < (characterRect.width + obstacleRect.width) / 2) {
      return true;
    }
  }
  
  return false;
}

// Check if character is at a goal
function isAtGoal(character, goals) {
  // Get character position
  const characterRect = character.getBoundingClientRect();
  const characterX = characterRect.left + characterRect.width / 2;
  const characterY = characterRect.top + characterRect.height / 2;
  
  // Check if character is at any goal
  for (const goal of goals) {
    const goalRect = goal.getBoundingClientRect();
    const goalX = goalRect.left + goalRect.width / 2;
    const goalY = goalRect.top + goalRect.height / 2;
    
    // Calculate distance to goal
    const distance = Math.sqrt(
      Math.pow(characterX - goalX, 2) + 
      Math.pow(characterY - goalY, 2)
    );
    
    // If character is close enough to goal
    if (distance < (characterRect.width + goalRect.width) / 2) {
      return true;
    }
  }
  
  return false;
}

// Check if character can turn in a direction
function canTurn(character, obstacles, direction) {
  // For simplicity, always allow turning
  // In a more complex implementation, this would check if turning would cause a collision
  return true;
}

// Get current rotation of an element
function getCurrentRotation(element) {
  const transform = window.getComputedStyle(element).transform;
  
  if (transform === 'none') {
    return 0;
  }
  
  const matrix = new DOMMatrix(transform);
  const angle = Math.atan2(matrix.m12, matrix.m11) * (180 / Math.PI);
  
  return angle;
}

// Reset the exercise
function resetExercise() {
  const codeWorkspace = document.querySelector('.code-workspace');
  const character = document.querySelector('.exercise-character');
  
  if (codeWorkspace) {
    // Remove all blocks from workspace that aren't palette originals
    const blocks = codeWorkspace.querySelectorAll('.code-block:not(.palette-original)');
    blocks.forEach(block => block.remove());
  }
  
  if (character) {
    // Reset character position
    character.style.transition = 'none';
    character.style.transform = 'translate(0, 0) rotate(0deg)';
  }
  
  // Update code preview
  updateCodePreview();
  
  // Clear local storage for this exercise
  const exerciseId = document.querySelector('.coding-exercise').getAttribute('data-exercise-id');
  localStorage.removeItem(`codekids_exercise_${exerciseId}`);
}

// Show a hint for the current exercise
function showHint() {
  const hintContainer = document.querySelector('.hint-container');
  const exerciseId = document.querySelector('.coding-exercise').getAttribute('data-exercise-id');
  
  if (hintContainer) {
    // Toggle hint visibility
    hintContainer.classList.toggle('hidden');
    
    // If showing hint, mark it as viewed
    if (!hintContainer.classList.contains('hidden')) {
      // Record that hint was used
      const hintsUsed = JSON.parse(localStorage.getItem('codekids_hints_used') || '[]');
      if (!hintsUsed.includes(exerciseId)) {
        hintsUsed.push(exerciseId);
        localStorage.setItem('codekids_hints_used', JSON.stringify(hintsUsed));
      }
    }
  }
}

// Check if exercise is completed successfully
function checkExerciseCompletion() {
  const character = document.querySelector('.exercise-character');
  const goals = document.querySelectorAll('.exercise-goal');
  
  if (!character || !goals.length) {
    return;
  }
  
  // Check if character reached any goal
  const atGoal = isAtGoal(character, goals);
  
  if (atGoal) {
    // Show success message
    showCompletionMessage(true);
    
    // Mark exercise as completed
    markExerciseCompleted();
  } else {
    // Show failure message
    showCompletionMessage(false);
  }
}

// Show completion message
function showCompletionMessage(success) {
  let messageContainer = document.querySelector('.completion-message');
  
  if (!messageContainer) {
    messageContainer = document.createElement('div');
    messageContainer.className = 'completion-message';
    document.querySelector('.coding-exercise').appendChild(messageContainer);
  }
  
  if (success) {
    messageContainer.innerHTML = `
      <div class="success-message">
        <h3>Great job! 🎉</h3>
        <p>You've completed the exercise successfully!</p>
        <button class="next-exercise-button">Next Exercise</button>
      </div>
    `;
    
    // Add event listener to next button
    const nextButton = messageContainer.querySelector('.next-exercise-button');
    if (nextButton) {
      nextButton.addEventListener('click', goToNextExercise);
    }
  } else {
    messageContainer.innerHTML = `
      <div class="failure-message">
        <h3>Not quite there yet! 🤔</h3>
        <p>Your character didn't reach the goal. Try again!</p>
        <button class="try-again-button">Try Again</button>
      </div>
    `;
    
    // Add event listener to try again button
    const tryAgainButton = messageContainer.querySelector('.try-again-button');
    if (tryAgainButton) {
      tryAgainButton.addEventListener('click', () => {
        messageContainer.remove();
      });
    }
  }
  
  // Show the message
  messageContainer.style.display = 'flex';
}

// Mark exercise as completed
function markExerciseCompleted() {
  const exerciseId = document.querySelector('.coding-exercise').getAttribute('data-exercise-id');
  const pathType = document.querySelector('.coding-exercise').getAttribute('data-path-type');
  
  if (!exerciseId || !pathType) {
    return;
  }
  
  // Get completed exercises
  const completedKey = `codekids_completed_${pathType}`;
  const completed = JSON.parse(localStorage.getItem(completedKey) || '[]');
  
  // Add this exercise if not already completed
  if (!completed.includes(exerciseId)) {
    completed.push(exerciseId);
    localStorage.setItem(completedKey, JSON.stringify(completed));
    
    // Update progress
    updateProgress(pathType, exerciseId);
  }
}

// Update progress after completing an exercise
function updateProgress(pathType, exerciseId) {
  // Get current progress
  const progressKey = `codekids_progress_${pathType}`;
  let progress = JSON.parse(localStorage.getItem(progressKey) || '{}');
  
  if (!progress.completedLessons) {
    progress = {
      level: 1,
      completedLessons: [],
      badges: [],
      points: 0
    };
  }
  
  // Add this lesson with timestamp
  const lessonId = `${exerciseId}-timestamp-${Date.now()}`;
  progress.completedLessons.push(lessonId);
  
  // Add points
  progress.points += 10;
  
  // Check if level should be increased
  const level = parseInt(exerciseId.split('-')[1]);
  if (level > progress.level) {
    progress.level = level;
    
    // Award level badge
    progress.badges.push({
      name: `Level ${level} Master`,
      icon: '🏆',
      date: Date.now()
    });
  }
  
  // Save updated progress
  localStorage.setItem(progressKey, JSON.stringify(progress));
  
  // If CodeKids global object exists, update UI
  if (window.CodeKids && window.CodeKids.updateProgressUI) {
    window.CodeKids.updateProgressUI(pathType, progress);
  }
}

// Go to next exercise
function goToNextExercise() {
  const exerciseId = document.querySelector('.coding-exercise').getAttribute('data-exercise-id');
  const pathType = document.querySelector('.coding-exercise').getAttribute('data-path-type');
  
  if (!exerciseId || !pathType) {
    return;
  }
  
  // Parse current exercise number
  const parts = exerciseId.split('-');
  const level = parseInt(parts[1]);
  const exercise = parseInt(parts[2]);
  
  // Calculate next exercise
  const nextExercise = exercise + 1;
  
  // Navigate to next exercise
  window.location.href = `/${pathType}-path/level-${level}/exercise-${nextExercise}`;
}

// Save current exercise state
function saveExerciseState() {
  const exerciseId = document.querySelector('.coding-exercise').getAttribute('data-exercise-id');
  const codeWorkspace = document.querySelector('.code-workspace');
  
  if (!exerciseId || !codeWorkspace) {
    return;
  }
  
  // Get all blocks in the workspace
  const blocks = codeWorkspace.querySelectorAll('.code-block:not(.palette-original)');
  
  // Create state object
  const state = {
    blocks: []
  };
  
  // Save each block's data
  blocks.forEach(block => {
    state.blocks.push({
      type: block.getAttribute('data-block-type'),
      value: block.getAttribute('data-block-value'),
      id: block.getAttribute('data-block-id')
    });
  });
  
  // Save to localStorage
  localStorage.setItem(`codekids_exercise_${exerciseId}`, JSON.stringify(state));
}

// Load saved exercise state
function loadExerciseState() {
  const exerciseId = document.querySelector('.coding-exercise').getAttribute('data-exercise-id');
  const codeWorkspace = document.querySelector('.code-workspace');
  const blocksPalette = document.querySelector('.code-blocks-palette');
  
  if (!exerciseId || !codeWorkspace || !blocksPalette) {
    return;
  }
  
  // Get saved state
  const savedState = localStorage.getItem(`codekids_exercise_${exerciseId}`);
  
  if (!savedState) {
    return;
  }
  
  try {
    const state = JSON.parse(savedState);
    
    // Recreate blocks
    state.blocks.forEach(blockData => {
      // Find template block in palette
      const templateBlock = blocksPalette.querySelector(`[data-block-type="${blockData.type}"][data-block-value="${blockData.value}"]`);
      
      if (templateBlock) {
        // Clone the template
        const newBlock = templateBlock.cloneNode(true);
        newBlock.setAttribute('data-block-id', blockData.id);
        initializeDraggableBlock(newBlock);
        codeWorkspace.appendChild(newBlock);
      }
    });
    
    // Update code preview
    updateCodePreview();
  } catch (e) {
    console.error('Error loading exercise state:', e);
  }
}

// Export functions for use in other modules
window.CodeKidsDragDrop = {
  initializeDragAndDrop,
  updateCodePreview,
  runCode,
  resetExercise
};
