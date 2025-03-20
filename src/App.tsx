import { useMemo, useState } from "react";
import "./App.css";
import { DekUploadButton } from "./components/DekUploadButton";
import { DeckList, diffDecks, generateDotDekXml } from "./DeckHelpers";
import { DekDisplay } from "./components/DekDisplay";

function App() {
  const [beforeDek, setBeforeDek] = useState<DeckList | null>(null);
  const [afterDek, setafterDek] = useState<DeckList | null>(null);

  const dekDiff = useMemo(() => {
    if (!beforeDek || !afterDek) {
      return null;
    }

    return diffDecks(beforeDek, afterDek);
  }, [beforeDek, afterDek]);

  const downloadDek = useMemo(() => {
    if (!dekDiff) {
      return undefined;
    }
    const xmlText = generateDotDekXml(dekDiff);
    const xmlBlob = new Blob([xmlText], { type: "application/xml" });

    const link = document.createElement("a");
    const url = URL.createObjectURL(xmlBlob);
    link.href = url;
    link.download = "sell.dek";
    link.click();

    URL.revokeObjectURL(url);
  }, [dekDiff]);

  // Create binders with newly opened cards from treasure chests to sell to bots
  // step 1, export entire collection as before.dek
  // step 2, open treasure chests
  // step 3, export entire collection again, as after.dek
  // step 4, upload before.dek and after.dek
  // step 5, download the generated sell.dek
  // step 6, import as a binder and sell to a buybot

  return (
    <main>
      <h1>MTGO Chest sell helper</h1>
      <div className="hero-flex">
        <div>
          <DekUploadButton text="Before" onUpload={(d) => setBeforeDek(d)} />
          {beforeDek && <DekDisplay deck={beforeDek} />}
        </div>

        <div>
          <DekUploadButton text="After" onUpload={(d) => setafterDek(d)} />
          {afterDek && <DekDisplay deck={afterDek} />}
        </div>
      </div>

      {!dekDiff && (
        <div>
          <h2>How To</h2>
          <ol>
            <li>
              before opening chests. export entire collection as before.dek
            </li>
            <li>open chests</li>
            <li>export entire collection as after.dek</li>
            <li>upload before/after to the above inputs</li>
            <li>download and import new.dek file as binder to sell to bot</li>
          </ol>
        </div>
      )}
      {dekDiff && (
        <div>
          <h3>Cards to Sell</h3>
          <DekDisplay deck={dekDiff} />
          <button onClick={downloadDek}>Download .dek</button>
        </div>
      )}
    </main>
  );
}

export default App;
