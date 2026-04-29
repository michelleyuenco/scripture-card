/* global React, ReactDOM, LandingView, ReadingView, ShareModal, getDevotional */

const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light"
}/*EDITMODE-END*/;

function App() {
  const [view, setView] = useState("landing"); // landing | reading
  const today = new Date();
  const [month, setMonth] = useState(8);
  const [day, setDay] = useState(7);
  const [shareOpen, setShareOpen] = useState(false);
  const [tweaksOpen, setTweaksOpen] = useState(false);

  // Tweaks state (persisted via host)
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);

  // Apply theme attr
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tweaks.theme);
  }, [tweaks.theme]);

  const setTweak = (k, v) => {
    const next = { ...tweaks, [k]: v };
    setTweaks(next);
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [k]: v } }, "*");
  };

  // Toggle theme via custom event from any view
  useEffect(() => {
    const handler = () => setTweak("theme", tweaks.theme === "light" ? "dark" : "light");
    window.addEventListener("toggle-theme", handler);
    return () => window.removeEventListener("toggle-theme", handler);
  }, [tweaks.theme]);

  // Tweaks panel host protocol
  useEffect(() => {
    const onMsg = (e) => {
      if (!e.data || typeof e.data !== "object") return;
      if (e.data.type === "__activate_edit_mode") setTweaksOpen(true);
      if (e.data.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const entry = getDevotional(month, day);

  return (
    <React.Fragment>
      {view === "landing" && (
        <LandingView
          month={month} day={day}
          setMonth={setMonth} setDay={setDay}
          onOpen={() => setView("reading")}
        />
      )}

      {view === "reading" && (
        <ReadingView
          entry={entry}
          onBack={() => setView("landing")}
          onShare={() => setShareOpen(true)}
        />
      )}

      {shareOpen && (
        <ShareModal entry={entry} onClose={() => setShareOpen(false)} />
      )}

      {tweaksOpen && window.TweaksPanel && (
        <window.TweaksPanel title="Tweaks">
          <window.TweakSection label="主題">
            <window.TweakRadio
              label="深 / 淺色"
              value={tweaks.theme}
              options={[
                { value: "light", label: "淺" },
                { value: "dark", label: "深" },
              ]}
              onChange={(v) => setTweak("theme", v)}
            />
          </window.TweakSection>
        </window.TweaksPanel>
      )}
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
