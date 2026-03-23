# Yolo Slides Generator

AI-powered branded presentation generator for Yolo Investments.

## Live App
https://egert-tamm.github.io/presentation-test

## Usage
1. Open the live URL above
2. Enter your Anthropic API key (get one at console.anthropic.com)
3. Type a topic and hit **Generate Deck**
4. Navigate slides with the arrows
5. Click **Save as PDF** → Print → Save as PDF

## Slide Templates
9 layouts extracted from the Yolo Figma design file:
- Cover
- Stats sidebar
- 2×2 grid cards
- Chapter divider
- Team cards
- Portfolio grid
- Advantage / comparison
- CTA
- Quote

## Stack
Single `index.html` — no build step, no dependencies. React + Babel + Anthropic API.

## API Key
Your Anthropic API key is stored in your browser's `localStorage` only. It is never sent anywhere except directly to `api.anthropic.com`.
