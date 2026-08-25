// A one-time guided tour: dim everything, cut a hole around one thing, and
// point at it.
//
// Written rather than pulled from a library because the interesting parts here
// are all app-specific: the same step has to find the bottom bar on a phone and
// the sidebar on a desktop, and a step whose target is not on screen has to
// disappear rather than point at nothing.

import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";

const PADDING = 8; // breathing room around the highlighted element
const RADIUS = 16;

/** The first target that is actually rendered and visible.
 *
 *  Desktop and mobile draw different navigation from the same step list, so a
 *  selector legitimately matches twice - once in the hidden layout. offsetParent
 *  is null for anything inside a `display: none` ancestor, which is exactly the
 *  case Tailwind's `lg:hidden` produces.
 */
function findVisible(selector) {
  return (
    Array.from(document.querySelectorAll(selector)).find((el) => {
      // Measured rather than asked about offsetParent, which is null for any
      // position: fixed element - that quietly dropped the assistant button,
      // the one target most worth pointing at. An element inside a display:none
      // ancestor reports a zero-sized rect, so this still excludes the hidden
      // layout's copy.
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;

      const style = window.getComputedStyle(el);
      return style.visibility !== "hidden" && style.display !== "none";
    }) || null
  );
}

function readRect(el) {
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

export default function CoachTour({ steps, onFinish }) {
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState(null);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  // Steps whose target never rendered are dropped rather than shown pointing at
  // nothing - a farmer on a phone should not be told about a sidebar.
  //
  // Resolved in an effect rather than during render, and retried: on the first
  // render after a route change the page has not painted, so every target looks
  // missing and the whole tour would silently decide it had nothing to show.
  const [live, setLive] = useState([]);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    function resolve() {
      if (cancelled) return;
      const found = steps.filter((s) => findVisible(s.target));
      if (found.length) {
        setLive(found);
      } else if (attempts++ < 20) {
        setTimeout(resolve, 150);
      }
    }

    resolve();
    return () => {
      cancelled = true;
    };
  }, [steps]);

  const step = live[index];

  const measure = useCallback(() => {
    if (!step) return;
    const el = findVisible(step.target);
    if (!el) {
      setRect(null);
      return;
    }
    setRect(readRect(el));
    setViewport({ w: window.innerWidth, h: window.innerHeight });
  }, [step]);

  useLayoutEffect(() => {
    if (!step) return undefined;

    const el = findVisible(step.target);
    // Bring it into view first; measuring before the scroll settles would
    // frame empty space.
    if (el) {
      el.scrollIntoView({ block: "center", behavior: "smooth" });
    }

    const timer = setTimeout(measure, 320);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    window.addEventListener("scroll", measure, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [step, measure]);

  useEffect(() => {
    function onKey(event) {
      if (event.key === "Escape") onFinish();
      if (event.key === "ArrowRight" || event.key === "Enter") {
        setIndex((i) => (i + 1 < live.length ? i + 1 : (onFinish(), i)));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [live.length, onFinish]);

  if (!step || !rect) return null;

  const hole = {
    x: Math.max(rect.left - PADDING, 4),
    y: Math.max(rect.top - PADDING, 4),
    w: rect.width + PADDING * 2,
    h: rect.height + PADDING * 2,
  };
  const holeCx = hole.x + hole.w / 2;

  // Above or below, whichever side has room. The bottom bar and the assistant
  // button both sit low, so this decides itself rather than being configured.
  const below = hole.y + hole.h + 210 < viewport.h;
  const cardW = Math.min(320, viewport.w - 32);
  const cardX = Math.min(Math.max(holeCx - cardW / 2, 16), viewport.w - cardW - 16);
  const cardY = below ? hole.y + hole.h + 46 : Math.max(hole.y - 210, 16);

  // The dotted line the tour is built around: from the card toward the hole,
  // bowed slightly so it reads as a pointer rather than a border.
  const from = { x: cardX + cardW / 2, y: below ? cardY - 10 : cardY + 176 };
  const to = { x: holeCx, y: below ? hole.y + hole.h + 6 : hole.y - 6 };
  const bend = { x: (from.x + to.x) / 2 + (to.x > from.x ? 30 : -30), y: (from.y + to.y) / 2 };

  const last = index + 1 >= live.length;

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label={step.title}>
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        {/* Outer rect plus the hole, wound the other way, so evenodd punches it out. */}
        <path
          fillRule="evenodd"
          fill="rgba(16, 32, 20, 0.72)"
          d={`M0 0 H${viewport.w} V${viewport.h} H0 Z
             M${hole.x + RADIUS} ${hole.y}
             h${hole.w - RADIUS * 2} a${RADIUS} ${RADIUS} 0 0 1 ${RADIUS} ${RADIUS}
             v${hole.h - RADIUS * 2} a${RADIUS} ${RADIUS} 0 0 1 -${RADIUS} ${RADIUS}
             h-${hole.w - RADIUS * 2} a${RADIUS} ${RADIUS} 0 0 1 -${RADIUS} -${RADIUS}
             v-${hole.h - RADIUS * 2} a${RADIUS} ${RADIUS} 0 0 1 ${RADIUS} -${RADIUS} Z`}
        />
        <rect
          x={hole.x}
          y={hole.y}
          width={hole.w}
          height={hole.h}
          rx={RADIUS}
          fill="none"
          stroke="#7BD88F"
          strokeWidth="2"
        />
        <path
          d={`M${from.x} ${from.y} Q${bend.x} ${bend.y} ${to.x} ${to.y}`}
          fill="none"
          stroke="#7BD88F"
          strokeWidth="2"
          strokeDasharray="5 7"
          strokeLinecap="round"
        />
        <circle cx={to.x} cy={to.y} r="4" fill="#7BD88F" />
      </svg>

      <div
        className="absolute rounded-2xl bg-[#145A32] p-4 shadow-[0_18px_44px_rgba(0,0,0,0.34)]"
        style={{ left: cardX, top: cardY, width: cardW }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9BD6AC]">
          {index + 1} of {live.length}
        </p>
        <h3 className="mt-1.5 text-[17px] font-bold leading-snug text-white">{step.title}</h3>
        <p className="mt-1.5 text-[13.5px] leading-6 text-white/85">{step.body}</p>

        <div className="mt-3.5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onFinish}
            className="text-[13px] font-semibold text-white/70 hover:text-white"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={() => (last ? onFinish() : setIndex(index + 1))}
            className="rounded-xl bg-white px-4 py-2 text-[13.5px] font-bold text-[#145A32]"
          >
            {last ? "Got it" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
