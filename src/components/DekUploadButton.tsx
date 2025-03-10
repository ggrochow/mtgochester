import { ChangeEvent } from "react";
import { DeckList, parseAsDeck } from "../DeckHelpers";

type Props = {
  text: string;
  onUpload: (d: DeckList) => void;
};

export function DekUploadButton({ text, onUpload }: Props) {

  function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = e.currentTarget.files;
    if (!files) {
      console.error("no files found on input");
      return;
    }

    if (files[0]) {
      const fileContents = files[0].text();

      fileContents
        .then((text) => {
          const res = parseAsDeck(text);
          if (res.success) {
            onUpload(res.data);
          } else {
            console.error("parseAsDeck error", res.error);
          }
        })
        .catch((e) => console.error(e));
    }
  }

  return (
    <label>
      {text}
      <input type="file" accept=".dek" onChange={handleUpload} />
    </label>
  );
}
