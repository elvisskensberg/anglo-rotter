import fs from "fs";
import path from "path";

describe("SVG Icon Set (DSGN-03)", () => {
  const iconsDir = path.resolve(__dirname, "../../public/icons");

  const threadIcons = [
    "thread-normal.svg",
    "thread-hot.svg",
    "thread-fire.svg",
    "thread-camera.svg",
    "thread-new.svg",
  ];

  const navIcons = ["hot-news.svg", "expand-threads.svg", "dir-arrow.svg"];

  const toolbarIcons = [
    "toolbar-login.svg",
    "toolbar-help.svg",
    "toolbar-search.svg",
    "toolbar-post.svg",
  ];

  const replyIcons = ["message.svg", "reply-message.svg"];

  const starIcons = [
    "star-1.svg",
    "star-2.svg",
    "star-3.svg",
    "star-4.svg",
    "star-5.svg",
  ];

  const allIcons = [
    ...threadIcons,
    ...navIcons,
    ...toolbarIcons,
    ...replyIcons,
    ...starIcons,
  ];

  test.each(allIcons)("%s exists", (icon) => {
    const filePath = path.join(iconsDir, icon);
    expect(fs.existsSync(filePath)).toBe(true);
  });

  test.each(allIcons)("%s contains viewBox", (icon) => {
    const filePath = path.join(iconsDir, icon);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      expect(content).toContain("viewBox");
    }
  });

  test("logo.svg exists", () => {
    const logoPath = path.resolve(__dirname, "../../public/images/logo.svg");
    expect(fs.existsSync(logoPath)).toBe(true);
  });
});
