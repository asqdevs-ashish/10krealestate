export default async (page) => {
  const images = [];
  const failures = [];

  page.on("response", (response) => {
    const url = response.url();
    if (url.includes("/_next/image")) {
      images.push({
        w: new URL(url).searchParams.get("w"),
        q: new URL(url).searchParams.get("q"),
        type: response.headers()["content-type"],
        kb: Math.round(Number(response.headers()["content-length"] || 0) / 1024),
        status: response.status(),
      });
    } else if (response.status() >= 400) {
      failures.push(`${response.status()} ${url.split("/").slice(-2).join("/")}`);
    }
  });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("http://localhost:3100/", { waitUntil: "load" });
  await page.waitForTimeout(6000);
  await page.evaluate(() => window.scrollTo(0, 1500));
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "img-check.png" });

  const state = await page.evaluate(() => {
    const plate = document.querySelector("[data-hero-plate] img");
    return {
      heroSrc: plate?.getAttribute("src")?.slice(0, 60) ?? null,
      heroSizes: plate?.getAttribute("sizes") ?? null,
      heroComplete: plate?.complete ?? null,
      naturalWidth: plate?.naturalWidth ?? null,
      preloaded: Array.from(document.querySelectorAll('link[rel="preload"][as="image"]')).length,
    };
  });

  return {
    state,
    count: images.length,
    avif: images.filter((i) => i.type === "image/avif").length,
    webp: images.filter((i) => i.type === "image/webp").length,
    sample: images.slice(0, 8),
    failures: failures.slice(0, 6),
  };
};
