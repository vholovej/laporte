import { useEffect, useMemo, useState } from "react";
import { QuoteEditor } from "./components/QuoteEditor";
import { QuoteList } from "./components/QuoteList";
import { createQuote } from "./lib/factories";
import { loadQuotes, saveQuotes } from "./lib/storage";
import type { Quote } from "./types/project";

export default function App() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setQuotes(loadQuotes());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveQuotes(quotes);
    }
  }, [hydrated, quotes]);

  const activeQuote = quotes.find((quote) => quote.id === activeId) ?? null;
  const filteredQuotes = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return quotes;

    return quotes.filter((quote) =>
      [quote.client.name, quote.client.phone, quote.number, quote.manager].join(" ").toLowerCase().includes(query)
    );
  }, [quotes, search]);

  const createNewQuote = () => {
    const quote = createQuote();
    setQuotes((current) => [quote, ...current]);
    setActiveId(quote.id);
  };

  const updateQuote = (nextQuote: Quote) => {
    setQuotes((current) => current.map((quote) => (quote.id === nextQuote.id ? nextQuote : quote)));
  };

  const duplicateQuote = (quote: Quote) => {
    const now = new Date().toISOString();
    const copy: Quote = {
      ...quote,
      id: crypto.randomUUID(),
      number: `LP-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`,
      status: "draft",
      createdAt: now,
      updatedAt: now,
      client: {
        ...quote.client,
        name: `${quote.client.name} копія`
      },
      items: quote.items.map((item) => ({ ...item, id: crypto.randomUUID() }))
    };

    setQuotes((current) => [copy, ...current]);
    setActiveId(copy.id);
  };

  const deleteQuote = (id: string) => {
    const confirmed = window.confirm("Видалити цю комерційну пропозицію?");
    if (!confirmed) return;

    setQuotes((current) => current.filter((quote) => quote.id !== id));
    if (activeId === id) setActiveId(null);
  };

  if (activeQuote) {
    return (
      <QuoteEditor
        quote={activeQuote}
        onChange={updateQuote}
        onSave={() => saveQuotes(quotes)}
        onBack={() => setActiveId(null)}
      />
    );
  }

  return (
    <QuoteList
      quotes={filteredQuotes}
      search={search}
      onSearch={setSearch}
      onCreate={createNewQuote}
      onEdit={(quote) => setActiveId(quote.id)}
      onDuplicate={duplicateQuote}
      onDelete={deleteQuote}
    />
  );
}
