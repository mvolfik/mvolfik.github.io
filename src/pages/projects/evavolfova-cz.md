---
layout: ../../layouts/project.astro
name: Evavolfova.cz
image: evavolfova.jpg
links:
  - name: View the website
    href: https://www.evavolfova.cz/
timespan: 2018 – present
ordering_value: 20220101
tags:
  - web
  - Svelte
  - frontend
  - deployment
description: |
  Since 2018, I've been maintaining my mother's website (and eventually also a small e-shop). The first version was a simple static website generated with Frozen-Flask. However, as the scope increased (and my skills improved as well) , a frontend framework became necessary, so the website is currently written in SvelteKit.

  With this project, I also learned a lot about how to manage a full VPS – while the app itself still runs on Netlify (I intend to move it away as soon as I find a better CMS + asset handling solution), I'm self-hosting Caddy, Plausible analytics and a Postgres database in a Docker-compose cluster. I've also setup Grafana with alerts to monitor server load etc.
---
