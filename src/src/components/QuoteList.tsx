import { Copy, FilePlus2, Pencil, Search, Trash2 } from "lucide-react";
import { calculateQuote } from "../lib/calculation";
import { formatDate, formatMoney, statusLabels } from "../lib/labels";
import type { Quote } from "../types/project";

interface QuoteListProps {
  quotes: Quote[];
  search: string;
  onSearch: (value: string) => void;
  onCreate: () => void;
  onEdit: (quote: Quote) => void;
  onDuplicate: (quote: Quote) => void;
  onDelete: (id: string) => void;
}

export function QuoteList({ quotes, search, onSearch, onCreate, onEdit, onDuplicate, onDelete }: QuoteListProps) {
  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-8 md:px-8">
      <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-gold">La Porte Configurator</p>
          <h1 className="text-4xl font-semibold tracking-tight text-ink md:text-5xl">Комерційні пропозиції</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            Швидке створення конфігурації дверей, розрахунок вартості та підготовка PDF для клієнта.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onCreate}>
          <FilePlus2 size={18} />
          Створити нову КП
        </button>
      </div>

      <div className="mb-6 flex items-center gap-3 rounded-md border border-line bg-white px-4 py-3 shadow-soft">
        <Search size={18} className="text-muted" />
        <input
          className="w-full bg-transparent text-sm outline-none"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Пошук по імені клієнта або номеру телефону"
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-line bg-white shadow-soft">
        <div className="grid grid-cols-[1.3fr_0.9fr_0.7fr_0.9fr_0.9fr_0.6fr] gap-4 border-b border-line bg-paper px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted max-lg:hidden">
          <span>Клієнт</span>
          <span>Статус</span>
          <span>Дата</span>
          <span>Менеджер</span>
          <span>Сума</span>
          <span></span>
        </div>

        {quotes.length === 0 ? (
          <div className="px-5 py-12 text-center text-muted">Нічого не знайдено. Створіть нову КП або змініть пошук.</div>
        ) : (
          quotes.map((quote) => {
            const total = calculateQuote(quote).total;

            return (
              <article
                key={quote.id}
                className="grid gap-4 border-b border-line px-5 py-5 last:border-0 lg:grid-cols-[1.3fr_0.9fr_0.7fr_0.9fr_0.9fr_0.6fr] lg:items-center"
              >
                <div>
                  <p className="font-semibold text-ink">{quote.client.name || "Без імені клієнта"}</p>
                  <p className="mt-1 text-sm text-muted">
                    {quote.number} · {quote.client.phone || "телефон не вказано"}
                  </p>
                </div>
                <div>
                  <span className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-medium text-ink">
                    {statusLabels[quote.status]}
                  </span>
                </div>
                <p className="text-sm text-muted">{formatDate(quote.createdAt)}</p>
                <p className="text-sm text-muted">{quote.manager}</p>
                <p className="font-semibold text-ink">{formatMoney(total)}</p>
                <div className="flex justify-start gap-2 lg:justify-end">
                  <button className="btn btn-secondary !px-3" onClick={() => onEdit(quote)} aria-label="Редагувати">
                    <Pencil size={16} />
                  </button>
                  <button className="btn btn-secondary !px-3" onClick={() => onDuplicate(quote)} aria-label="Дублювати">
                    <Copy size={16} />
                  </button>
                  <button className="btn btn-secondary !px-3" onClick={() => onDelete(quote.id)} aria-label="Видалити">
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </main>
  );
}
