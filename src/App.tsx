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
  }, [beforeDek, afterDek])

  const downloadDek = useMemo(() => {
    if (!dekDiff) {
      return undefined;
    }
    const xmlText = generateDotDekXml(dekDiff);

    const xmlBlob = new Blob([xmlText], { type: 'application/xml' });
    const link = document.createElement('a');

    const url = URL.createObjectURL(xmlBlob);
    link.href = url;
    link.download = 'sell.dek'

    link.click();

    URL.revokeObjectURL(url);
  }, [dekDiff]);
  

  return (
    <main>
      <div className="hero-flex">
        <div>
          <DekUploadButton text="Before" onUpload={(d) => setBeforeDek(d)} />
          {beforeDek && <DekDisplay deck={beforeDek} />}
        </div>

        <div>
          <DekUploadButton text="after" onUpload={(d) => setafterDek(d)} />
          {afterDek && <DekDisplay deck={afterDek} />}
        </div>
      </div>


      {dekDiff && (
        <div>
          <h3>Cards to Sell</h3>
          <DekDisplay deck={dekDiff}/>
          <button onClick={downloadDek}>Download .dek</button>
        </div>
      )}
    </main>
  );
}

export default App;
