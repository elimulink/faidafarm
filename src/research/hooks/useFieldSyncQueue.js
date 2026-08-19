import { useCallback, useMemo, useState } from "react";
import { getSyncQueue, retryQueuedSubmission } from "../fieldStorage/fieldSyncQueue";

export default function useFieldSyncQueue() {
  const [queue, setQueue] = useState(() => getSyncQueue());
  const [isRetrying, setIsRetrying] = useState(false);

  const refreshQueue = useCallback(() => {
    setQueue(getSyncQueue());
  }, []);

  async function retrySubmission(submissionId) {
    setIsRetrying(true);
    await retryQueuedSubmission(submissionId);
    refreshQueue();
    setIsRetrying(false);
  }

  async function retryAll() {
    setIsRetrying(true);
    const retryable = getSyncQueue().filter((item) => item.syncStatus !== "synced");
    for (const item of retryable) {
      await retryQueuedSubmission(item.submissionId);
    }
    refreshQueue();
    setIsRetrying(false);
  }

  const counts = useMemo(
    () => ({
      queuedCount: queue.filter((item) => item.syncStatus === "queued").length,
      failedCount: queue.filter((item) => item.syncStatus === "failed").length,
      syncedCount: queue.filter((item) => item.syncStatus === "synced").length,
    }),
    [queue]
  );

  return {
    queue,
    refreshQueue,
    retrySubmission,
    retryAll,
    isRetrying,
    ...counts,
  };
}
