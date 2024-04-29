---
layout: ../../layouts/project.astro
name: Ingress tools
image: /src/assets/ingress-bg.jpg
links:
  - name: About Ingress
    href: https://ingress.com/game/
read_more: true
timespan: May 2020 – January 2021
ordering_value: 20200501
tags:
  - Python
  - algorithms
description: |
  Ingress is an augmented-reality GPS game, an ever-lasting battle of two factions. The game provides an online real-time game map, and each faction develops its own, private set of tools that operate on the game data and facilitate planning and monitoring operations. One the tools I created helps with preparing efficient game plans.

  For tactical advantage, the code isn't public, but I'll be happy to present some parts of it if you reach out.
---

## Link cleaner

In Ingress, you have many "portals" positioned all over the world, and the main goal is to create links between portals that form triangular fields. However, these links between the portals can't cross each other. So one common pattern is to create two "anchor" portals, and then link many "spine" portals onto them. Here's what it looks like:

![A so-called onion field](/src/assets/onion.png)

However, planning these fields efficiently is quite time-consuming. So I created this tool which takes a large area of portals and the two anchor ones, and creates the highest possible amount of fields whose links don't intersect. That requires a surprising amount of algorithmic complexity, including spherical geometry (since Ingress is played on the Earth, a globe) and approximating NP-hard problems.
