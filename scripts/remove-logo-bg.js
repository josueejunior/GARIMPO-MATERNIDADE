const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const assetsDir = path.join(__dirname, "../public/assets");
const sourcePath = path.join(assetsDir, "logo-source.png");
const outputPath = path.join(assetsDir, "logo.png");

const fallbackOriginal =
  "c__Users_user_AppData_Roaming_Cursor_User_workspaceStorage_0dc4a0fbb1a20af8947928ac84158818_images_image-513f38f5-0bf3-4dfa-9bb1-78ca48ef78a3.png";

function colorDist(r1, g1, b1, r2, g2, b2) {
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

function sampleBackground(data, width, height, channels) {
  const points = [
    [2, 2],
    [width - 3, 2],
    [2, height - 3],
    [width - 3, height - 3],
    [Math.floor(width / 2), 2],
    [Math.floor(width / 2), height - 3],
  ];

  let r = 0;
  let g = 0;
  let b = 0;

  for (const [x, y] of points) {
    const i = (y * width + x) * channels;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }

  const n = points.length;
  return { r: r / n, g: g / n, b: b / n };
}

async function resolveInput() {
  if (fs.existsSync(sourcePath)) {
    return sourcePath;
  }

  const cursorAsset = path.join(
    process.env.USERPROFILE
      ? path.join(
          "C:",
          "Users",
          process.env.USERNAME || "user",
          ".cursor",
          "projects",
          "g-GARIMPO-MATERNIDADE",
          "assets",
          fallbackOriginal
        )
      : "",
    fallbackOriginal
  );

  const wslAsset = `/mnt/c/Users/user/.cursor/projects/g-GARIMPO-MATERNIDADE/assets/${fallbackOriginal}`;

  for (const candidate of [cursorAsset, wslAsset]) {
    if (candidate && fs.existsSync(candidate)) {
      fs.copyFileSync(candidate, sourcePath);
      console.log("Original restaurado em logo-source.png");
      return sourcePath;
    }
  }

  if (fs.existsSync(outputPath)) {
    console.warn("Usando logo.png atual como entrada.");
    return outputPath;
  }

  throw new Error(
    "Coloque a imagem original em public/assets/logo-source.png"
  );
}

async function main() {
  const input = await resolveInput();

  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const bg = sampleBackground(data, width, height, channels);

  const hardCut = 42;
  const softRange = 38;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const dist = colorDist(r, g, b, bg.r, bg.g, bg.b);

    let alpha = 255;
    if (dist <= hardCut) {
      alpha = 0;
    } else if (dist < hardCut + softRange) {
      const t = (dist - hardCut) / softRange;
      alpha = Math.round(255 * t * t * (3 - 2 * t));
    }

    if (alpha < 255 && alpha > 0) {
      const spill = Math.max(0, b - Math.max(r, g));
      if (spill > 8) {
        data[i + 2] = Math.round(b - spill * 0.55);
      }
    }

    if (alpha < 12) alpha = 0;
    data[i + 3] = alpha;
  }

  const maxWidth = 900;

  await sharp(data, { raw: { width, height, channels } })
    .trim({ threshold: 12 })
    .resize(maxWidth, maxWidth, {
      fit: "inside",
      withoutEnlargement: true,
      kernel: sharp.kernel.lanczos3,
    })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outputPath);

  const meta = await sharp(outputPath).metadata();
  console.log(
    `Logo OK: ${outputPath} (${meta.width}x${meta.height}, fundo RGB ~${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)})`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
