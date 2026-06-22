import { ArrowLeft, Download, Plus, Save, Trash2 } from "lucide-react";
import { calculateItem, calculateQuote } from "../lib/calculation";
import { generateQuotePdf } from "../lib/pdf";
import {
  doorTypeLabels,
  finishLabels,
  formatMoney,
  frameLabels,
  openingLabels,
  roomOptions,
  statusLabels
} from "../lib/labels";
import { createDoorItem } from "../lib/factories";
import type { DoorItem, Quote } from "../types/project";
import { DoorVisual } from "./DoorVisual";

interface QuoteEditorProps {
  quote: Quote;
  onChange: (quote: Quote) => void;
  onSave: () => void;
  onBack: () => void;
}

const heights = ["2050", "2300", "2500", "2700", "3000", "custom"] as const;
const widths = ["600", "700", "800", "900", "custom"] as const;

export function QuoteEditor({ quote, onChange, onSave, onBack }: QuoteEditorProps) {
  const totals = calculateQuote(quote);

  const updateQuote = (patch: Partial<Quote>) => {
    onChange({ ...quote, ...patch, updatedAt: new Date().toISOString() });
  };

  const updateItem = (id: string, patch: Partial<DoorItem>) => {
    updateQuote({
      items: quote.items.map((item) => (item.id === id ? { ...item, ...patch } : item))
    });
  };

  const removeItem = (id: string) => {
    updateQuote({ items: quote.items.filter((item) => item.id !== id) });
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-6 md:px-8">
      <div className="sticky top-0 z-20 -mx-5 mb-8 border-b border-line bg-paper/95 px-5 py-4 backdrop-blur md:-mx-8 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <button className="btn btn-secondary !px-3" onClick={onBack} aria-label="Назад">
              <ArrowLeft size={18} />
            </button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{quote.number}</p>
              <h1 className="text-2xl font-semibold tracking-tight text-ink">Нова комерційна пропозиція</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="btn btn-secondary" onClick={onSave}>
              <Save size={17} />
              Зберегти
            </button>
            <button className="btn btn-primary" onClick={() => generateQuotePdf(quote)}>
              <Download size={17} />
              Сформувати PDF
            </button>
          </div>
        </div>
      </div>

      <section className="mb-8 grid gap-5 rounded-lg border border-line bg-white p-5 shadow-soft lg:grid-cols-5">
        <div className="lg:col-span-5">
          <h2 className="section-title">Дані клієнта</h2>
        </div>
        <label>
          <span className="label">Імʼя клієнта</span>
          <input className="field" value={quote.client.name} onChange={(e) => updateQuote({ client: { ...quote.client, name: e.target.value } })} />
        </label>
        <label>
          <span className="label">Телефон</span>
          <input className="field" value={quote.client.phone} onChange={(e) => updateQuote({ client: { ...quote.client, phone: e.target.value } })} />
        </label>
        <label className="lg:col-span-2">
          <span className="label">Місто / адреса обʼєкта</span>
          <input className="field" value={quote.client.address} onChange={(e) => updateQuote({ client: { ...quote.client, address: e.target.value } })} />
        </label>
        <label>
          <span className="label">Менеджер</span>
          <input className="field" value={quote.manager} onChange={(e) => updateQuote({ manager: e.target.value })} />
        </label>
        <label>
          <span className="label">Статус</span>
          <select className="field" value={quote.status} onChange={(e) => updateQuote({ status: e.target.value as Quote["status"] })}>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="lg:col-span-4">
          <span className="label">Коментар</span>
          <input className="field" value={quote.client.comment} onChange={(e) => updateQuote({ client: { ...quote.client, comment: e.target.value } })} />
        </label>
      </section>

      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="section-title">Конфігуратор дверей</h2>
        <button className="btn btn-secondary" onClick={() => updateQuote({ items: [...quote.items, createDoorItem()] })}>
          <Plus size={17} />
          Додати позицію
        </button>
      </div>

      <div className="grid gap-5">
        {quote.items.map((item, index) => (
          <DoorItemCard
            key={item.id}
            index={index}
            item={item}
            canDelete={quote.items.length > 1}
            onChange={(patch) => updateItem(item.id, patch)}
            onDelete={() => removeItem(item.id)}
          />
        ))}
      </div>

      <section className="mt-8 rounded-lg border border-line bg-ink p-6 text-white shadow-soft">
        <div className="grid gap-5 md:grid-cols-4 md:items-end">
          <div className="md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Підсумок КП</p>
            <p className="mt-2 text-sm text-white/70">Термін дії пропозиції: 7 днів. Передоплата 70%, залишок 30%.</p>
          </div>
          <Amount label="Сума" value={totals.subtotal} />
          <Amount label="Фінальна сума" value={totals.total} large />
        </div>
        <div className="mt-4 text-sm text-white/70">Сума знижки: {formatMoney(totals.discount)}</div>
      </section>
    </main>
  );
}

function DoorItemCard({
  index,
  item,
  canDelete,
  onChange,
  onDelete
}: {
  index: number;
  item: DoorItem;
  canDelete: boolean;
  onChange: (patch: Partial<DoorItem>) => void;
  onDelete: () => void;
}) {
  const price = calculateItem(item);

  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-soft">
      <div className="mb-5 flex flex-col gap-3 border-b border-line pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Позиція {index + 1}</p>
          <h3 className="text-xl font-semibold text-ink">{item.room}</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-ink">{formatMoney(price.total)}</span>
          <button className="btn btn-secondary !px-3" onClick={onDelete} disabled={!canDelete} aria-label="Видалити позицію">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[260px_1fr]">
        <DoorVisual item={item} />
        <div className="grid gap-4 md:grid-cols-3">
          <Select label="Приміщення" value={item.room} onChange={(value) => onChange({ room: value })} options={roomOptions} />
          <Select label="Тип дверей" value={item.type} onChange={(value) => onChange({ type: value as DoorItem["type"] })} options={Object.keys(doorTypeLabels)} labels={doorTypeLabels} />
          <Select label="Висота" value={item.height} onChange={(value) => onChange({ height: value as DoorItem["height"] })} options={heights as unknown as string[]} labels={{ custom: "Індивідуальна" }} suffix=" мм" />
          {item.height === "custom" && <Input label="Індивідуальна висота" value={item.customHeight} onChange={(value) => onChange({ customHeight: value })} />}
          <Select label="Ширина" value={item.width} onChange={(value) => onChange({ width: value as DoorItem["width"] })} options={widths as unknown as string[]} labels={{ custom: "Індивідуальна" }} suffix=" мм" />
          {item.width === "custom" && <Input label="Індивідуальна ширина" value={item.customWidth} onChange={(value) => onChange({ customWidth: value })} />}
          <Select label="Відкривання" value={item.opening} onChange={(value) => onChange({ opening: value as DoorItem["opening"] })} options={Object.keys(openingLabels)} labels={openingLabels} />
          <Select label="Тип коробу" value={item.frame} onChange={(value) => onChange({ frame: value as DoorItem["frame"] })} options={Object.keys(frameLabels)} labels={frameLabels} />
          <Select label="Покриття" value={item.finish} onChange={(value) => onChange({ finish: value as DoorItem["finish"] })} options={Object.keys(finishLabels)} labels={finishLabels} />
          <Input label="Колір / RAL" value={item.color} onChange={(value) => onChange({ color: value })} />
          <Input label="Ручка" value={item.handle} onChange={(value) => onChange({ handle: value })} />
          <Input label="Петлі" value={item.hinges} onChange={(value) => onChange({ hinges: value })} />
          <Input label="Замок" value={item.lock} onChange={(value) => onChange({ lock: value })} />
          <Toggle label="Лиштва" checked={item.trim} onChange={(trim) => onChange({ trim })} />
          <Toggle label="Добір" checked={item.extension} onChange={(extension) => onChange({ extension })} />
          <Toggle label="Монтаж" checked={item.installation} onChange={(installation) => onChange({ installation })} />
          <Toggle label="Доставка" checked={item.delivery} onChange={(delivery) => onChange({ delivery })} />
          <label>
            <span className="label">Тип знижки</span>
            <select className="field" value={item.discountType} onChange={(e) => onChange({ discountType: e.target.value as DoorItem["discountType"] })}>
              <option value="uah">грн</option>
              <option value="percent">%</option>
            </select>
          </label>
          <Input label="Знижка" type="number" value={String(item.discountValue)} onChange={(value) => onChange({ discountValue: Number(value) })} />
          <label className="md:col-span-3">
            <span className="label">Коментар до позиції</span>
            <textarea className="field min-h-20" value={item.comment} onChange={(e) => onChange({ comment: e.target.value })} />
          </label>
        </div>
      </div>
    </article>
  );
}

function Select({
  label,
  value,
  options,
  labels = {},
  suffix = "",
  onChange
}: {
  label: string;
  value: string;
  options: string[];
  labels?: Partial<Record<string, string>>;
  suffix?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="label">{label}</span>
      <select className="field" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {labels[option] ?? option}
            {option !== "custom" ? suffix : ""}
          </option>
        ))}
      </select>
    </label>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label>
      <span className="label">{label}</span>
      <input className="field" type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex min-h-[68px] items-center justify-between rounded-md border border-line bg-paper px-3 py-2">
      <span className="text-sm font-medium text-ink">{label}</span>
      <input className="h-5 w-5 accent-ink" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}

function Amount({ label, value, large = false }: { label: string; value: number; large?: boolean }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.14em] text-white/50">{label}</p>
      <p className={large ? "mt-1 text-3xl font-semibold" : "mt-1 text-xl font-semibold"}>{formatMoney(value)}</p>
    </div>
  );
}
