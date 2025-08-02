function getArticleText() {
  const article = document.querySelector("article");
  if (article) return article.innerText;

  const paragraphs = Array.from(document.querySelectorAll("p"));
  return paragraphs.map((p) => p.innerText).join("\n");
}

async function getYouTubeTranscript() {
  try {
    // Step 1: Open the "..." menu under the video title (actions menu)
    const moreButton = document.querySelector('tp-yt-paper-icon-button[aria-label="More actions"]');
    if (moreButton) moreButton.click();
    else throw new Error("Could not find 'More actions' button.");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Step 2: Click on "Show transcript" in the menu
    const menuItems = [...document.querySelectorAll('ytd-menu-service-item-renderer')];
    const transcriptMenuItem = menuItems.find((item) =>
      item.innerText.toLowerCase().includes("transcript")
    );

    if (transcriptMenuItem) transcriptMenuItem.click();
    else throw new Error("Transcript option not found in the menu.");

    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for transcript to load

    // Step 3: Extract transcript segments
    const transcriptSegments = [
      ...document.querySelectorAll("ytd-transcript-segment-renderer")
    ];

    if (transcriptSegments.length === 0) {
      throw new Error("No transcript segments found.");
    }

    // Step 4: Combine and return transcript text
    return transcriptSegments.map(el => el.innerText).join(" ");
  } catch (error) {
    console.error("Error getting transcript:", error);
    return null;
  }
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.type === "GET_ARTICLE_TEXT") {
    const url = window.location.href;
    if (url.includes("youtube.com/watch")) {
      getYouTubeTranscript().then((text) => {
        sendResponse({ text });
      });
      return true; // async
    } else {
      const text = getArticleText();
      sendResponse({ text });
    }
  }
});
