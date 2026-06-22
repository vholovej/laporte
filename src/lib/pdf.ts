import jsPDF from "jspdf";
import { calculateQuote } from "./calculation";
import { doorTypeLabels, finishLabels, formatMoney } from "./labels";
import type { Quote } from "../types/project";

const page = { width: 794, height: 1123 };
const margin = 60;

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const wrap = (text: string, max = 88) => {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > max) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  });

  if (current) lines.push(current);
  return lines;
};

const text = (value: string, x: number, y: number, size = 16, weight = 400, color = "#171717") =>
  `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${color}" font-family="Arial, sans-serif">${escapeXml(
    value
  )}</text>`;

const renderSvgPage = (content: string) => `
  <svg xmlns="http://www.w3.org/2000/svg" width="${page.width}" height="${page.height}" viewBox="0 0 ${page.width} ${page.height}">
    <rect width="100%" height="100%" fill="#fbfaf7"/>
    ${content}
  </svg>
`;

const svgToPng = (svg: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    const svgUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = page.width * 2;
      canvas.height = page.height * 2;
      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Не вдалося створити PDF."));
        return;
      }

      context.fillStyle = "#fbfaf7";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(svgUrl);
      resolve(canvas.toDataURL("image/png"));
    };

    image.onerror = reject;
    image.src = svgUrl;
  });

export const generateQuotePdf = async (quote: Quote) => {
  const doc = new jsPDF("p", "pt", "a4");
  const calc = calculateQuote(quote);
  const date = new Intl.DateTimeFormat("uk-UA").format(new Date());
  const pages: string[] = [];

  let y = 72;
  let content = `
    <line x1="${margin}" y1="45" x2="${page.width - margin}" y2="45" stroke="#b48a4a" stroke-width="2"/>
    ${text("LA PORTE", margin, y, 30, 700)}
    ${text("коли бренд створює тренд", margin + 172, y, 14, 400, "#6f6a60")}
    ${text("Комерційна пропозиція", margin, y + 54, 30, 700)}
    ${text(`№ ${quote.number}`, margin, y + 88, 16, 700, "#6f6a60")}
    ${text(`Дата: ${date}`, page.width - 220, y + 88, 16, 400, "#6f6a60")}
    <rect x="${margin}" y="${y + 118}" width="${page.width - margin * 2}" height="112" rx="10" fill="#ffffff" stroke="#e7e0d6"/>
    ${text(`Клієнт: ${quote.client.name || "-"}`, margin + 24, y + 153, 17, 700)}
    ${text(`Телефон: ${quote.client.phone || "-"}`, margin + 24, y + 181, 15, 400, "#6f6a60")}
    ${text(`Обʼєкт: ${quote.client.address || "-"}`, margin + 24, y + 209, 15, 400, "#6f6a60")}
    ${text(`Менеджер: ${quote.manager || "-"}`, page.width - 310, y + 181, 15, 400, "#6f6a60")}
  `;

  y += 280;
  content += text("Позиції", margin, y, 22, 700);
  y += 28;
  content += `<rect x="${margin}" y="${y}" width="${page.width - margin * 2}" height="34" rx="6" fill="#171717"/>`;
  content += text("№  Приміщення / конфігурація", margin + 16, y + 23, 13, 700, "#ffffff");
  content += text("Ціна", page.width - 150, y + 23, 13, 700, "#ffffff");
  y += 54;

  const pushPage = () => {
    pages.push(renderSvgPage(content));
    y = 72;
    content = `${text("LA PORTE", margin, y, 24, 700)}${text(`КП ${quote.number}`, page.width - 210, y, 14, 400, "#6f6a60")}`;
    y += 52;
  };

  quote.items.forEach((item, index) => {
    const itemCalc = calc.items[item.id];
    const size = `${item.width === "custom" ? item.customWidth || "інд." : item.width} x ${
      item.height === "custom" ? item.customHeight || "інд." : item.height
    } мм`;
    const rowText = `${index + 1}. ${item.room}: ${doorTypeLabels[item.type]}, ${size}, ${
      finishLabels[item.finish]
    }, ${item.color || "колір не вказано"}, ${item.handle}, ${item.hinges}, ${item.lock}, монтаж: ${
      item.installation ? "так" : "ні"
    }`;
    const lines = wrap(rowText, 82);
    const rowHeight = Math.max(56, lines.length * 18 + 26);

    if (y + rowHeight > 820) pushPage();

    content += `<rect x="${margin}" y="${y - 20}" width="${page.width - margin * 2}" height="${rowHeight}" rx="8" fill="#ffffff" stroke="#e7e0d6"/>`;
    lines.forEach((line, lineIndex) => {
      content += text(line, margin + 16, y + lineIndex * 18, 14, lineIndex === 0 ? 700 : 400);
    });
    content += text(formatMoney(itemCalc.total), page.width - 170, y, 15, 700);
    y += rowHeight + 12;
  });

  if (y > 770) pushPage();

  y += 18;
  content += `<rect x="${page.width - 330}" y="${y - 28}" width="270" height="116" rx="10" fill="#171717"/>`;
  content += text(`Сума: ${formatMoney(calc.subtotal)}`, page.width - 306, y, 15, 400, "#ffffff");
  content += text(`Знижка: ${formatMoney(calc.discount)}`, page.width - 306, y + 28, 15, 400, "#ffffff");
  content += text(`Фінальна сума: ${formatMoney(calc.total)}`, page.width - 306, y + 64, 19, 700, "#ffffff");

  y += 140;
  content += text("Що входить у вартість", margin, y, 20, 700);
  content += text("Полотно, короб, обране покриття та фурнітура. Монтаж і доставка враховані для вибраних позицій.", margin, y + 30, 14, 400, "#6f6a60");
  y += 78;
  content += text("Умови", margin, y, 20, 700);
  content += text("Термін дії КП: 7 днів. Передоплата: 70%. Залишок: 30% перед монтажем або видачею.", margin, y + 30, 14, 400, "#6f6a60");
  content += text("Остаточна вартість може бути уточнена після заміру.", margin, y + 54, 14, 400, "#6f6a60");
  y += 104;
  content += text("Контакти La Porte", margin, y, 20, 700);
  content += text("Ужгород, Закарпаття · 050 150 70 70 · 075 150 70 70 · партнерство: 066 53 73 112", margin, y + 30, 14, 400, "#6f6a60");
  content += text("La Porte — коли бренд створює тренд", margin, page.height - 62, 18, 700, "#b48a4a");
  pages.push(renderSvgPage(content));

  for (const [index, svg] of pages.entries()) {
    if (index > 0) doc.addPage();
    const png = await svgToPng(svg);
    doc.addImage(png, "PNG", 0, 0, 595.28, 841.89);
  }

  doc.save(`${quote.number}-La-Porte.pdf`);
};
