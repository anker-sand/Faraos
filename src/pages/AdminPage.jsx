import React, { useEffect, useMemo, useState } from "react";
import { db, storage } from "../lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const FORMATS = [
  "Manga",
  "Graphic Novel",
  "Tegneserie (hæfte)",
  "Omnibus / Samlebind",
  "Hardcover",
  "Paperback",
];
const LANGUAGES = ["Dansk", "Engelsk", "Japansk"];

const AdminPage = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  // Form fields use Danish keys and match the copy/paste order
  const emptyForm = {
    Titel: "",
    Forfatter: "",
    series: "",
    Format: "Manga",
    Sprog: "Dansk",
    Pris: "",
    Publisher: "",
    Udgivelsesår: "",
    Volume: "",
    Billede: "",
    // Optional fields kept
    description: "",
    stockCount: "",
    isbn13: "",
    genres: [],
    isActive: true,
  };
  const [form, setForm] = useState(emptyForm);
  const [genreInput, setGenreInput] = useState("");

  const comicsCol = collection(db, "Comics");

  useEffect(() => {
    const unsub = onSnapshot(
      comicsCol,
      (snap) => {
        const rows = snap.docs.map((d) => {
          const data = d.data() || {};
          const title = data.Titel ?? data.title ?? "";
          const series = data.series ?? "";
          const author = data.Forfatter ?? data.author ?? "";
          const publisher = data.Publisher ?? data.publisher ?? "";
          const format = data.Format ?? data.format ?? "";
          const language = data.Sprog ?? data.language ?? "";
          const image = data.Billede ?? data.image ?? "";
          const price =
            typeof data.Pris === "number"
              ? data.Pris
              : typeof data.price === "number"
              ? data.price
              : Number(data.Pris ?? data.price ?? 0) || 0;
          const releaseYear = data.Udgivelsesår ?? data.releaseYear ?? "";
          const volume = data.Volume ?? data.volume ?? "";
          const isActive = data.isActive ?? true;
          const description = data.description ?? "";
          const stockCount =
            typeof data.stockCount === "number"
              ? data.stockCount
              : data.stockCount === "" || data.stockCount == null
              ? null
              : Number(data.stockCount) || null;
          const isbn13 = data.isbn13 ?? "";
          // Normalize genres: support both 'genres' (array) and 'genre' (string/array)
          let genres = [];
          if (Array.isArray(data.genres)) {
            genres = data.genres;
          } else if (typeof data.genre === "string" && data.genre.trim()) {
            genres = [data.genre.trim()];
          } else if (Array.isArray(data.genre)) {
            genres = data.genre;
          }
          return {
            id: d.id,
            title,
            series,
            author,
            publisher,
            format,
            language,
            image,
            price,
            releaseYear,
            volume,
            isActive,
            description,
            stockCount,
            isbn13,
            genres,
          };
        });
        setItems(rows);
        setError("");
      },
      (e) => {
        console.error("Admin snapshot failed:", e);
        setError("Kan ikke hente data (tjek Firestore rules for read).");
      }
    );
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) =>
      [i.title, i.series, i.author, i.publisher].some((v) =>
        (v || "").toLowerCase().includes(q)
      )
    );
  }, [items, search]);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const uploadImage = async (file) => {
    if (!file) return null;
    setUploading(true);
    try {
      const fileName = `covers/${Date.now()}_${file.name}`;
      const r = ref(storage, fileName);
      await uploadBytes(r, file);
      const url = await getDownloadURL(r);
      return url;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setStatus("");
    setError("");
    const payload = {
      Titel: form.Titel?.trim() || "",
      Forfatter: form.Forfatter?.trim() || "",
      series: form.series?.trim() || "",
      Format: form.Format || "",
      Sprog: form.Sprog || "",
      Pris:
        form.Pris === "" || form.Pris === null
          ? null
          : Number(String(form.Pris).replace(",", ".")) || 0,
      Publisher: form.Publisher?.trim() || "",
      Udgivelsesår:
        form.Udgivelsesår === "" || form.Udgivelsesår === null
          ? ""
          : String(form.Udgivelsesår),
      Volume:
        form.Volume === "" || form.Volume === null
          ? null
          : Number(form.Volume) || null,
      Billede: form.Billede?.trim() || "",
      // Optional fields
      description: form.description || "",
      stockCount:
        form.stockCount === "" || form.stockCount === null
          ? null
          : Number(form.stockCount) || 0,
      isbn13: form.isbn13 || "",
      genres: (form.genres || []).map((g) => g.trim()).filter(Boolean),
      isActive: !!form.isActive,
      createdAt: Date.now(),
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "Comics", editingId), payload);
        setStatus("Ændringer gemt.");
      } else {
        await addDoc(comicsCol, payload);
        setStatus("Vare oprettet.");
      }
      setForm(emptyForm);
      setEditingId(null);
    } catch (e) {
      console.error("Save failed:", e);
      setError("Kunne ikke gemme. Tjek Firestore write-rules eller netværk.");
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      ...emptyForm,
      Titel: item.title || "",
      Forfatter: item.author || "",
      series: item.series || "",
      Format: item.format || "Manga",
      Sprog: item.language || "Dansk",
      Pris: item.price ?? "",
      Publisher: item.publisher || "",
      Udgivelsesår: item.releaseYear || "",
      Volume: item.volume || "",
      Billede: item.image || "",
      description: item.description || "",
      stockCount: item.stockCount ?? "",
      isbn13: item.isbn13 || "",
      genres: item.genres || [],
      isActive: item.isActive ?? true,
    });
  };

  const toggleActive = async (item) => {
    setError("");
    try {
      await updateDoc(doc(db, "Comics", item.id), { isActive: !item.isActive });
    } catch (e) {
      console.error("Toggle failed:", e);
      setError("Kunne ikke opdatere. Tjek write-rules.");
    }
  };

  const deleteItem = async (item) => {
    setError("");
    try {
      await deleteDoc(doc(db, "Comics", item.id));
      setStatus("Vare slettet.");
    } catch (e) {
      console.error("Delete failed:", e);
      setError("Kunne ikke slette. Tjek write-rules.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 px-4 md:px-6 py-24">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold">Admin: Tegneserier</h1>

        {status && (
          <div className="px-3 py-2 rounded-md bg-green-800/40 text-green-300">
            {status}
          </div>
        )}
        {error && (
          <div className="px-3 py-2 rounded-md bg-red-800/30 text-red-300">
            {error}
          </div>
        )}

        <div className="rounded-xl bg-neutral-900/80 ring-1 ring-neutral-800 p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span>Titel</span>
              <input
                className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2"
                value={form.Titel}
                onChange={(e) => setField("Titel", e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span>Forfatter</span>
              <input
                className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2"
                value={form.Forfatter}
                onChange={(e) => setField("Forfatter", e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span>series</span>
              <input
                className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2"
                value={form.series}
                onChange={(e) => setField("series", e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span>Format</span>
              <select
                className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2"
                value={form.Format}
                onChange={(e) => setField("Format", e.target.value)}
              >
                {FORMATS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span>Sprog</span>
              <select
                className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2"
                value={form.Sprog}
                onChange={(e) => setField("Sprog", e.target.value)}
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span>Pris</span>
              <input
                type="number"
                className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2"
                value={form.Pris}
                onChange={(e) => setField("Pris", e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span>Forlag</span>
              <input
                className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2"
                value={form.Publisher}
                onChange={(e) => setField("Publisher", e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span>Udgivelsesår</span>
              <input
                type="number"
                className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2"
                value={form.Udgivelsesår}
                onChange={(e) => setField("Udgivelsesår", e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span>Volume</span>
              <input
                className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2"
                type="number"
                value={form.Volume}
                onChange={(e) => setField("Volume", e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span>Billede (URL)</span>
              <input
                className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2"
                value={form.Billede}
                onChange={(e) => setField("Billede", e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span>Upload billede</span>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const url = await uploadImage(file);
                  if (url) setField("Billede", url);
                }}
              />
              {uploading && (
                <span className="text-xs text-neutral-400">Uploader...</span>
              )}
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="f-checkbox"
                checked={form.isActive}
                onChange={(e) => setField("isActive", e.target.checked)}
              />
              <span>Aktiv</span>
            </label>
            <label className="flex flex-col gap-1 md:col-span-2">
              <span>Beskrivelse (valgfri)</span>
              <textarea
                className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2"
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span>Lager antal (valgfri)</span>
              <input
                type="number"
                className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2"
                value={form.stockCount}
                onChange={(e) => setField("stockCount", e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span>ISBN-13 (valgfri)</span>
              <input
                className="bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2"
                value={form.isbn13}
                onChange={(e) => setField("isbn13", e.target.value)}
              />
            </label>
            <div className="flex flex-col gap-2 md:col-span-2">
              <span>Genre(r)</span>
              <div className="flex gap-2">
                <input
                  className="flex-1 bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2"
                  value={genreInput}
                  onChange={(e) => setGenreInput(e.target.value)}
                  placeholder="Tilføj genre"
                />
                <button
                  type="button"
                  className="px-3 py-2 bg-neutral-800 rounded-md"
                  onClick={() => {
                    const g = (genreInput || "").trim();
                    if (!g) return;
                    setField("genres", [...(form.genres || []), g]);
                    setGenreInput("");
                  }}
                >
                  Tilføj
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(form.genres || []).map((g) => (
                  <span
                    key={g}
                    className="px-2 py-1 rounded-full bg-neutral-800 text-sm inline-flex items-center gap-2"
                  >
                    {g}
                    <button
                      type="button"
                      className="w-5 h-5 rounded-full bg-neutral-700"
                      onClick={() =>
                        setField(
                          "genres",
                          (form.genres || []).filter((x) => x !== g)
                        )
                      }
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div>
            <button
              type="button"
              className="px-4 py-2 bg-green-600 rounded-md"
              onClick={handleSave}
            >
              {editingId ? "Gem ændringer" : "Gem"}
            </button>
            {editingId && (
              <button
                type="button"
                className="ml-3 px-4 py-2 bg-neutral-700 rounded-md"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                Annuller
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2"
            placeholder="Søg: titel / serie / forfatter / forlag"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="rounded-xl bg-neutral-900/80 ring-1 ring-neutral-800 p-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-300">
                <th className="p-2">Billede + Titel</th>
                <th className="p-2">Serie</th>
                <th className="p-2">Pris</th>
                <th className="p-2">Format</th>
                <th className="p-2">Sprog</th>
                <th className="p-2">Forlag</th>
                <th className="p-2">Aktiv</th>
                <th className="p-2">Handlinger</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id} className="border-t border-neutral-800">
                  <td className="p-2">
                    <div className="flex items-center gap-3">
                      {i.image && (
                        <img
                          src={i.image}
                          alt={i.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <div className="font-semibold">{i.title}</div>
                        <div className="text-neutral-400 text-xs">
                          {i.author}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-2">{i.series}</td>
                  <td className="p-2">
                    {typeof i.price === "number" ? `DKK ${i.price}` : i.price}
                  </td>
                  <td className="p-2">{i.format}</td>
                  <td className="p-2">{i.language}</td>
                  <td className="p-2">{i.publisher}</td>
                  <td className="p-2">{i.isActive ? "Active" : "Inactive"}</td>
                  <td className="p-2">
                    <button
                      className="px-3 py-1 bg-neutral-700 rounded-md mr-2"
                      onClick={() => startEdit(i)}
                    >
                      Rediger
                    </button>
                    <button
                      className="px-3 py-1 bg-neutral-700 rounded-md mr-2"
                      onClick={() => toggleActive(i)}
                    >
                      {i.isActive ? "Deaktiver" : "Aktiver"}
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 rounded-md"
                      onClick={() => deleteItem(i)}
                    >
                      Slet
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td className="p-4 text-neutral-400" colSpan={7}>
                    Ingen varer fundet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
