---
layout: ../../layouts/project.astro
name: RoboRally
image: /src/assets/roborally.png
links:
  - name: Play the game online
    href: https://roborally-mvolf.herokuapp.com/
  - name: View repository
    href: https://github.com/mvolfik/roborally/
read_more: true
timespan: March 2022
ordering_value: 20220315
tags:
  - game
  - web
  - Svelte
  - Rust
  - WebAssembly
description: |
  As my high school graduation project, I recreated the board game RoboRally as a multiplayer online game. This included a backend written in Rust, WebSocket transport layer, Rust compiled to WebAssembly for game state deserialization and a highly interactive Svelte frontend.
---

Roborally is a turn-based strategic board game. Each player controls one robot, which moves around a factory. The goal of each player is to complete the game course by visiting each of the checkpoints in specified order. Players control the robots by "programming" movement cards into five registers. However, these moves are then executed by all players at once. Moreover, after each move register, various board elements activate and further move and rotate the robots. And order matters - when two robots collide, they push each other and chaos ensues.

This project was a great experience. Having learned Rust during Advent of Code, I enjoyed solidifying my skills by writing a full project with it. I was also quite happy that this project required more focus on actual game logic, and I didn't have to work on the visual frontend that much (even though I still ended up bikeshedding the UI slide-in/out animations :) )
