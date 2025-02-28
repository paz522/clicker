// Game state variables
let score = 0;
let clickPower = 1;
let clickUpgradeCost = 10;
let autoClickerCost = 50;
let autoClickPower = 0;
let autoClickerInterval = null;
let bonusMultiplier = 1;
let bonusMultiplierCost = 200;
let level = 1;
let nextLevelScore = 100;
let totalClicks = 0;
let startTime = Date.now();
let milestones = [
    { score: 100, message: "Beginner Clicker" },
    { score: 500, message: "Click Master" },
    { score: 1000, message: "Click Addict" },
    { score: 5000, message: "Click God" },
    { score: 10000, message: "Legendary Clicker" }
];
let unlockedMilestones = [];

// Sound effects
const clickSound = new Audio();
clickSound.src = "data:audio/mp3;base64,SUQzAwAAAAAAJlRQRTEAAAAcAAAAU291bmRKYXkuY29tIFNvdW5kIEVmZmVjdHMA//uSwAAAAAABLBQAAAL9ILjC88AADVAAAAATEU1TV0dBTUUAAAABAAAADFRTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAA=";

const levelUpSound = new Audio();
levelUpSound.src = "data:audio/mp3;base64,SUQzAwAAAAAAIVRQRTEAAAAcAAAAU291bmRKYXkuY29tIFNvdW5kIEVmZmVjdHMAVElUMgAAABgAAABTb3VuZEpheS5jb20gU0ZYIE1hY2hpbmX/+5LEAAAEvGrIBTzAAMsMagjnnIghAAAARkxhYgAAABoAAABTb3VuZEpheS5jb20gU0ZYIE1hY2hpbmUAVERSQwAAAAsAAAMyMDIzLTAyLTIzVERSTAAAAAcAAAAxNDoyOTo5VElUMQAAABwAAABTb3VuZEpheS5jb20gU291bmQgRWZmZWN0cwA=";

const upgradeSound = new Audio();
upgradeSound.src = "data:audio/mp3;base64,SUQzAwAAAAAAIVRQRTEAAAAcAAAAU291bmRKYXkuY29tIFNvdW5kIEVmZmVjdHMAVElUMgAAABgAAABTb3VuZEpheS5jb20gU0ZYIE1hY2hpbmX/+5LEAAAEQTVICTRhgMqsafjnnIARAAAARkxhYgAAABoAAABTb3VuZEpheS5jb20gU0ZYIE1hY2hpbmUAVERSQwAAAAsAAAMyMDIzLTAyLTIzVERSTAAAAAcAAAExNDoyOTo5VElUMQAAABwAAABTb3VuZEpheS5jb20gU291bmQgRWZmZWN0cwA=";

// Get DOM element references
const scoreElement = document.getElementById('score');
const clickPowerElement = document.getElementById('click-power');
const clickUpgradeCostElement = document.getElementById('click-upgrade-cost');
const autoClickerCostElement = document.getElementById('auto-clicker-cost');
const autoClickPowerElement = document.getElementById('auto-click-power');
const bonusMultiplierCostElement = document.getElementById('bonus-multiplier-cost');
const bonusMultiplierValueElement = document.getElementById('bonus-multiplier-value');
const clickButton = document.getElementById('click-btn');
const upgradeClickButton = document.getElementById('upgrade-click');
const autoClickerButton = document.getElementById('auto-clicker');
const bonusMultiplierButton = document.getElementById('bonus-multiplier');
const levelElement = document.getElementById('level');
const nextLevelElement = document.getElementById('next-level');
const nextLevelProgressElement = document.getElementById('next-level-progress');
const totalClicksElement = document.getElementById('total-clicks');
const playTimeElement = document.getElementById('play-time');
const clickEffectsElement = document.getElementById('click-effects');
const milestoneContainerElement = document.getElementById('milestone-container');

// Set up click events
clickButton.addEventListener('click', () => {
    const amount = clickPower * bonusMultiplier;
    addScore(amount);
    animateButton();
    createClickEffect(amount);
    playClickSound();
    totalClicks++;
    updateUI();
});

upgradeClickButton.addEventListener('click', () => {
    if (score >= clickUpgradeCost) {
        score -= clickUpgradeCost;
        clickPower += 1;
        clickUpgradeCost = Math.floor(clickUpgradeCost * 1.5);
        playUpgradeSound();
        updateUI();
    }
});

autoClickerButton.addEventListener('click', () => {
    if (score >= autoClickerCost) {
        score -= autoClickerCost;
        autoClickPower += 1;
        autoClickerCost = Math.floor(autoClickerCost * 1.8);
        
        // Set up interval for auto clicking if it's purchased for the first time
        if (!autoClickerInterval) {
            autoClickerInterval = setInterval(() => {
                addScore(autoClickPower * bonusMultiplier);
            }, 1000);
        }
        
        playUpgradeSound();
        updateUI();
    }
});

bonusMultiplierButton.addEventListener('click', () => {
    if (score >= bonusMultiplierCost) {
        score -= bonusMultiplierCost;
        bonusMultiplier += 0.2;
        bonusMultiplierCost = Math.floor(bonusMultiplierCost * 2);
        
        playUpgradeSound();
        updateUI();
    }
});

// Function to add score
function addScore(amount) {
    score += amount;
    
    // Check for level up
    checkLevelUp();
    
    // Check for milestones
    checkMilestones();
    
    updateUI();
}

// Function to check for level up
function checkLevelUp() {
    if (score >= nextLevelScore) {
        level++;
        const oldNextLevel = nextLevelScore;
        nextLevelScore = Math.floor(nextLevelScore * 1.5);
        
        // Level up animation
        levelElement.parentElement.classList.add('pulse');
        setTimeout(() => {
            levelElement.parentElement.classList.remove('pulse');
        }, 1000);
        
        levelUpSound.play();
        
        // Show level up message
        const levelUpMessage = document.createElement('div');
        levelUpMessage.className = 'milestone';
        levelUpMessage.textContent = `Level Up to ${level}! Bonus: +${Math.floor((nextLevelScore - oldNextLevel) * 0.1)} points`;
        milestoneContainerElement.appendChild(levelUpMessage);
        
        // Add bonus
        score += Math.floor((nextLevelScore - oldNextLevel) * 0.1);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            if (levelUpMessage.parentNode) {
                levelUpMessage.parentNode.removeChild(levelUpMessage);
            }
        }, 3000);
    }
}

// Function to check for milestones
function checkMilestones() {
    milestones.forEach((milestone) => {
        if (score >= milestone.score && !unlockedMilestones.includes(milestone.score)) {
            unlockedMilestones.push(milestone.score);
            
            // Show milestone message
            const milestoneMessage = document.createElement('div');
            milestoneMessage.className = 'milestone';
            milestoneMessage.textContent = `Achievement: ${milestone.message}`;
            milestoneContainerElement.appendChild(milestoneMessage);
            
            // Remove message after 3 seconds
            setTimeout(() => {
                if (milestoneMessage.parentNode) {
                    milestoneMessage.parentNode.removeChild(milestoneMessage);
                }
            }, 3000);
        }
    });
}

// Function to update play time
function updatePlayTime() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const seconds = elapsedTime % 60;
    
    playTimeElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Play click sound effect
function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.volume = 0.2;
    clickSound.play();
}

// Play upgrade sound effect
function playUpgradeSound() {
    upgradeSound.currentTime = 0;
    upgradeSound.volume = 0.3;
    upgradeSound.play();
}

// Create click effect
function createClickEffect(amount) {
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.textContent = `+${amount}`;
    
    // Set random position and color
    const randomX = Math.random() * 80 - 40; // -40px to 40px
    const randomY = Math.random() * 20 - 60; // -60px to -40px
    
    // Color changes based on score
    const hue = (score % 360);
    effect.style.color = `hsl(${hue}, 80%, 50%)`;
    effect.style.fontSize = `${Math.min(1 + Math.log10(amount) * 0.3, 2)}rem`;
    
    effect.style.left = `calc(50% + ${randomX}px)`;
    effect.style.top = `calc(50% + ${randomY}px)`;
    
    clickEffectsElement.appendChild(effect);
    
    // Animation
    effect.animate([
        { opacity: 1, transform: 'translateY(0px)' },
        { opacity: 0, transform: 'translateY(-50px)' }
    ], {
        duration: 1000,
        easing: 'ease-out'
    }).onfinish = () => {
        if (effect.parentNode) {
            effect.parentNode.removeChild(effect);
        }
    };
}

// Update UI
function updateUI() {
    // Update score and ability values
    scoreElement.textContent = Math.floor(score);
    clickPowerElement.textContent = clickPower;
    clickUpgradeCostElement.textContent = clickUpgradeCost;
    autoClickerCostElement.textContent = autoClickerCost;
    autoClickPowerElement.textContent = autoClickPower;
    bonusMultiplierValueElement.textContent = bonusMultiplier.toFixed(1);
    bonusMultiplierCostElement.textContent = bonusMultiplierCost;
    levelElement.textContent = level;
    nextLevelElement.textContent = nextLevelScore - score > 0 ? nextLevelScore - score : 0;
    totalClicksElement.textContent = totalClicks;
    
    // Update progress bar
    const progress = Math.min(((score - (nextLevelScore / 1.5)) / ((nextLevelScore) - (nextLevelScore / 1.5))) * 100, 100);
    nextLevelProgressElement.style.width = `${progress}%`;
    
    // Update upgrade button states
    upgradeClickButton.disabled = score < clickUpgradeCost;
    autoClickerButton.disabled = score < autoClickerCost;
    bonusMultiplierButton.disabled = score < bonusMultiplierCost;
    
    // Update play time
    updatePlayTime();
    
    // Save game to local storage
    saveGame();
}

// Button click animation
function animateButton() {
    clickButton.classList.add('clicked');
    setTimeout(() => {
        clickButton.classList.remove('clicked');
    }, 100);
}

// Save game state
function saveGame() {
    const gameState = {
        score,
        clickPower,
        clickUpgradeCost,
        autoClickerCost,
        autoClickPower,
        bonusMultiplier,
        bonusMultiplierCost,
        level,
        nextLevelScore,
        totalClicks,
        startTime,
        unlockedMilestones
    };
    localStorage.setItem('clickerGameState', JSON.stringify(gameState));
}

// Load game state
function loadGame() {
    const savedState = localStorage.getItem('clickerGameState');
    if (savedState) {
        const gameState = JSON.parse(savedState);
        score = gameState.score;
        clickPower = gameState.clickPower;
        clickUpgradeCost = gameState.clickUpgradeCost;
        autoClickerCost = gameState.autoClickerCost;
        autoClickPower = gameState.autoClickPower;
        bonusMultiplier = gameState.bonusMultiplier || 1;
        bonusMultiplierCost = gameState.bonusMultiplierCost || 200;
        level = gameState.level || 1;
        nextLevelScore = gameState.nextLevelScore || 100;
        totalClicks = gameState.totalClicks || 0;
        startTime = gameState.startTime || Date.now();
        unlockedMilestones = gameState.unlockedMilestones || [];
        
        // Set up interval for auto clicking if it was active
        if (autoClickPower > 0) {
            autoClickerInterval = setInterval(() => {
                addScore(autoClickPower * bonusMultiplier);
            }, 1000);
        }
        
        updateUI();
    }
}

// Update play time every second
setInterval(updatePlayTime, 1000);

// Initialize game on page load
window.addEventListener('load', () => {
    loadGame();
    
    // Show game tutorial
    setTimeout(() => {
        const tutorial = document.createElement('div');
        tutorial.className = 'milestone';
        tutorial.textContent = 'Tip: Click to earn points and buy upgrades!';
        milestoneContainerElement.appendChild(tutorial);
        
        setTimeout(() => {
            if (tutorial.parentNode) {
                tutorial.parentNode.removeChild(tutorial);
            }
        }, 5000);
    }, 1000);
});

// CSS for corresponding classes
document.head.insertAdjacentHTML('beforeend', `
<style>
.clicked {
    transform: scale(0.9) !important;
}
</style>
`); 