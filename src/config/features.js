// Build-time feature flags.
//
// `import.meta.env.DEV` is statically replaced by Vite, so a flag pinned to it
// folds to a constant at build time and Rollup drops the disabled branches.
// That keeps the code out of the production bundle entirely, not just hidden.

// Research / FMNR workspace: available on localhost (`npm run dev`) only.
// Excluded from `npm run build`, so it ships in neither Firebase Hosting nor
// the Capacitor Android app.
export const RESEARCH_WORKSPACE_ENABLED = import.meta.env.DEV;
