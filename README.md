# 🦊 DO NOT FIND THE FOX!

A strategic puzzle game where your goal is to avoid spelling "FOX" while placing letters on a grid.

![DO NOT FIND THE FOX!](/donotfindthefox.png)

## 🎮 Game Overview

"Do Not Find the Fox" is a single-player puzzle game where you strategically place letters on a 4x4 grid. The challenge? Avoid spelling "FOX" in any direction!

## 📋 How to Play

1. **Objective**: Fill the entire 4x4 grid without spelling "FOX" in any direction (horizontal, vertical, or diagonal).

2. **Game Mechanics**:
   - You'll be given random letters (F, O, X) one at a time
   - Place each letter on any empty space in the 4x4 grid
   - The game provides 5 F's, 6 O's, and 5 X's in total
   - If you spell "FOX" or "XOF" in any direction, you lose
   - Successfully place all 16 letters without spelling "FOX" to win

3. **Controls**:
   - Click on any empty grid space to place the current letter
   - Use the refresh button to start a new game
   - Click the help icon (?) for game instructions

## 🧩 Strategy Tips

- Plan ahead! Consider how your current placement might affect future moves
- Watch out for diagonal sequences - they're easy to miss
- Remember that "XOF" (FOX spelled backwards) also counts as a loss
- Sometimes it's better to create "dead ends" with your placements to avoid risky configurations

## 🛠️ Technical Details

This game is built with:
- React
- TypeScript
- Tailwind CSS
- Lucide React for icons

## 🧠 Game Logic

The game implements a sophisticated pattern-matching algorithm that checks for "FOX" or "XOF" sequences in eight different directions after each letter placement:
- Horizontal (left/right)
- Vertical (up/down)
- Diagonal (all four diagonal directions)

When a forbidden sequence is detected, the game highlights the matching letters and declares game over.

## 🎨 Design

The game features a clean, minimalist design with:
- A white color scheme for maximum readability
- Color-coded letters (F: blue, O: green, X: red)
- Responsive layout that works on various screen sizes

---

Enjoy the game and remember - whatever you do, DO NOT FIND THE FOX!