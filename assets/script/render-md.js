import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, parse } from "node:path";
import { marked } from "marked";
const inputDir = "blogs";
const files = await readdir(inputDir);
await Promise.all(files
    .filter((file) => file.endsWith(".md"))
    .map(async (file) => {
    const inputPath = join(inputDir, file);
    const outputPath = join(inputDir, `${parse(file).name}.html`);
    const markdown = await readFile(inputPath, "utf8");
    const html = await marked.parse(markdown);
    await writeFile(outputPath, makeDocument(html));
}));
function makeDocument(html) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Hi! I'm xpple, aka Fred. Here's my Discord: @xpple">
    <title>xpple.dev</title>

    <link rel="stylesheet" href="../assets/style/fonts.css">
    <link rel="stylesheet" href="../assets/style/normalize.css">
    <link rel="stylesheet" href="../assets/style/blog.css">
</head>
<body>
<main>
${html}
</main>
</body>
</html>
`;
}
