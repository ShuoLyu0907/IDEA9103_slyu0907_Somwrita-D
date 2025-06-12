# **Functioning prototype**

## **1. Interaction Instructions**

## **2. Details of my individual approach to animating the group code**

### I chose Perlin noise to drive my personal code.

###  Introduction to Image Animation：
#### SplitCircle Animation (Class: SplitCircle)
- Animated Properties:
  - Position drift (x, y)
Uses Perlin noise to create smooth floating motion in both axes, making each circle gently drift.
  - Dynamic angle rotation (angle)
The splitting line between colors rotates over time, driven by noise, creating an ever-changing color split.
  - Radius pulsing (r)
A subtle breathing effect is achieved using a sine wave to make the circle expand and contract slightly.
- Visual Effect:
A two-colored circle that gently drifts, breathes, and rotates its split angle—giving a lively and organic motion.

#### Rect Animation (Class Rect)
- Animated Properties:
  - Width & height changes
The rectangle pulsates with time using a sine wave, simulating expansion and contraction.
  - Unique rhythm & amplitude per rectangle
Each rectangle has its own speed and phase to avoid uniformity, enhancing natural movement.
- Visual Effect:
  - Blocks that rhythmically “breathe” or pulse, with soft corner rounding. The fill and border colors remain static.

#### HalfCircle Animation (Class: HalfCircle)
- Animated Properties:
  - Vertical floating (y)
Sine-based up-and-down movement gives the illusion of gentle floating.
  - Desynchronized motion
Each half-circle has an individual phase shift based on its x position, so they don’t all float together.
- Visual Effect:
  - Semicircles that gently bob up and down like buoys, adding a sense of depth and rhythm to the layout.

#### Animated Background Grid (Function: drawDynamicBackground())
- Animated Properties:
  - Color interpolation per cell
Each square's color shifts between two preset tones using Perlin noise over time.
  - Size oscillation per cell
Noise also controls the dynamic resizing of each square—some shrink, some grow—creating a lively grid.
- Visual Effect:
  - A gently fluctuating background grid of soft, shifting colors and sizes, contributing subtle motion to the whole canvas.

####  Interactive Re-randomization (Function: keyPressed() (press spacebar))
- Behavior:
  - Regenerates randomSeed() and noiseSeed()
  - Rebuilds all SplitCircle properties (e.g. angle, ratio, motion)
  - Refreshes the entire animation pattern and structure





