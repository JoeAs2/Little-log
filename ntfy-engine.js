// Automatically generates or loads a totally unguessable, secure notification topic channel name
const NTFY_TOPIC = localStorage.getItem('kj_ntfy_topic') || (() => {
  const rand = Array.from({length: 16}, () => Math.random().toString(36)[2]).join('');
  const secureTopic = `kj_home_emmy_${rand}`;
  localStorage.setItem('kj_ntfy_topic', secureTopic);
  return secureTopic;
})();

/**
 * Dispatches an immediate or delayed push notification via ntfy.sh
 * @param {string} text - Message content
 * @param {string} title - Notification title header
 * @param {string} delay - e.g., "3h" or "30m" for future alerts
 * @param {string} sequenceId - Custom identifier allowing remote clearing later
 */
async function sendNotification({ text, title = "🏡 K&J Home Alert", delay = "", sequenceId = "" }) {
  const headers = {
    "Title": title,
    "Priority": "high"
  };
  
  if (delay) headers["Delay"] = delay;
  if (sequenceId) headers["X-Message-ID"] = sequenceId; // Using ntfy custom ID tracking

  try {
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: 'POST',
      body: text,
      headers: headers
    });
    console.log(`Notification sent/scheduled via topic: ${NTFY_TOPIC}`);
  } catch (err) {
    console.error("Failed to route ntfy notification:", err);
  }
}

/**
 * Remotely clears an active or pending delayed notification matching a sequence ID from all trays
 * @param {string} sequenceId - The identifier of the message to wipe out
 */
async function clearNotification(sequenceId) {
  if (!sequenceId) return;
  try {
    await fetch(`https://ntfy.sh/${NTFY_TOPIC}/messages?id=${sequenceId}`, {
      method: 'DELETE'
    });
    console.log(`Cleared notification ID: ${sequenceId}`);
  } catch (err) {
    console.error("Failed to dismiss ntfy target:", err);
  }
}