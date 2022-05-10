function sendEvent(name: string, props?: Record<string, string>) {
  if (
    window.location.hostname === "localhost" ||
    localStorage.get("plausible_ignore") !== "true"
  )
    return;

  navigator.sendBeacon(
    "https://an.evavolfova.cz/api/event",
    JSON.stringify({
      name,
      url: window.location.href,
      domain: window.location.hostname,
      referrer: document.referrer || null,
      screen_width: window.innerWidth,
      props,
    })
  );
}

sendEvent("pageview");

document.addEventListener("click", (e) => {
  if (e.target.href === undefined) return;

  const url = new URL(e.target.href);
  if (url.origin === window.location.origin) {
    sendEvent("Outbound Link: Click", { url: url.toString() });
  }
});

export {};
