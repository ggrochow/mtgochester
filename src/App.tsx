import { useMemo, useState } from "react";
import "./App.css";
import { DekUploadButton } from "./components/DekUploadButton";
import { DeckList } from "./DeckHelpers";
import { DekDisplay } from "./components/DekDisplay";

function App() {
  const [beforeDek, setBeforeDek] = useState<DeckList | null>(null);
  const [afterDek, setafterDek] = useState<DeckList | null>(null);
  
  const dekDiff = useMemo(() => {
    if (!beforeDek || !afterDek) {
      return null;
    }

  }, [beforeDek, afterDek])

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
          <DekDisplay deck={dekDiff}/>
        </div>
      )}
    </main>
  );
}

export default App;
