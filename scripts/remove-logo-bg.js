const sharp = require("sharp");
const path = require("path");

const logoPath = path.join(__dirname, "../public/assets/logo.png");

async function main() {
  const { data, info } = await sharp(logoPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const isSkyBlue = b > 145 && g > 115 && r < 205 && b - r > 20;
    const isNearWhite = r > 238 && g > 238 && b > 238;

    if (isSkyBlue || isNearWhite) {
      data[i + 3] = 0;
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .png()
    .toFile(logoPath);

  console.log("Logo background removed:", logoPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
