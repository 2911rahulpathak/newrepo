import { createCanvas } from 'canvas';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { Currency } from './enums';

export const createTextImageAndOverlay = async (currency: Currency) => {
  const apiKeyToken = process.env.ETHERSCAN;
  const url = `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${apiKeyToken}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();

    const text = currency === Currency.USD ? data.result.ethusd : data.result.ethbtc;

    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#fff';
    ctx.font = '48px serif';
    ctx.fillText(text, 10, 50);

    const textBuffer = canvas.toBuffer('image/png');

    const ethImagePath = path.resolve('./public/ETH.png');

    const ethImageBuffer = fs.readFileSync(ethImagePath);

    const newImageBuffer = await sharp(ethImageBuffer)
      .composite([{ input: textBuffer, gravity: 'southeast' }])
      .toBuffer();

    return newImageBuffer;
  } catch (error) {
    const ethImagePath = path.resolve('./public/ETH.png');
    return ethImagePath;
  }
};
