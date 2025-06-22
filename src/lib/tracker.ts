function sendEvent(name: string, props?: Record<string, string>) {
  if (
    window.location.hostname === "localhost" ||
    localStorage.getItem("plausible_ignore") === "true"
  )
    return;

  const payload = {
    name,
    url: window.location.href,
    domain: "mvolfik.github.io",
    referrer: document.referrer || null,
    screen_width: window.innerWidth,
  };
  if (props) payload.props = JSON.stringify(props);
  navigator.sendBeacon(
    "https://an.evavolfova.cz/api/event",
    JSON.stringify(payload),
  );
}

sendEvent("pageview");

document.addEventListener("click", (e) => {
  if (e.target.href === undefined) return;

  const url = new URL(e.target.href);
  if (url.origin !== window.location.origin) {
    sendEvent("Outbound Link: Click", { url: url.toString() });
  }
});

export {};
