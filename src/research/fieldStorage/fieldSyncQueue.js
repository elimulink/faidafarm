import { getSubmissions, saveSubmission, updateSubmission } from "./fieldLocalDb";

function simulateSync() {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (Math.random() < 0.8) {
        resolve();
      } else {
        reject(new Error("Simulated network sync failed"));
      }
    }, 700);
  });
}

export function queueSubmission(submission) {
  return saveSubmission({
    ...submission,
    syncStatus: "queued",
    retryCount: submission.retryCount || 0,
    lastAttempt: submission.lastAttempt || null,
    errorMessage: submission.errorMessage || "",
  });
}

export function getSyncQueue() {
  return getSubmissions();
}

export function markSubmissionSynced(submissionId) {
  return updateSubmission(submissionId, {
    syncStatus: "synced",
    lastAttempt: new Date().toISOString(),
    errorMessage: "",
  });
}

export function markSubmissionFailed(submissionId, errorMessage) {
  const current = getSubmissions().find((submission) => submission.submissionId === submissionId);
  return updateSubmission(submissionId, {
    syncStatus: "failed",
    retryCount: (current?.retryCount || 0) + 1,
    lastAttempt: new Date().toISOString(),
    errorMessage,
  });
}

export async function retryQueuedSubmission(submissionId) {
  updateSubmission(submissionId, {
    syncStatus: "queued",
    lastAttempt: new Date().toISOString(),
    errorMessage: "",
  });

  try {
    await simulateSync();
    return markSubmissionSynced(submissionId);
  } catch (error) {
    return markSubmissionFailed(submissionId, error.message);
  }
}
