import { X2jOptions, XMLParser } from "fast-xml-parser";
import * as v from "valibot";

export type CardData = {
  id: string;
  name: string;
  quantity: number;
};
const CardSchema = v.object({
  id: v.string(),
  name: v.string(),
  quantity: v.pipe(
    v.string(),
    v.digits(),
    v.transform((i) => Number(i)),
    v.integer(),
  ),
});

export type DeckList = {
  cards: Array<CardData>;
};

export type ParseResult =
  | {
      success: false;
      error: string;
    }
  | {
      success: true;
      data: DeckList;
    };

const parserOptions: X2jOptions = {
  ignoreAttributes: false,
};

export function parseAsDeck(xml: String): ParseResult {
  const parser = new XMLParser(parserOptions);
  const result = parser.parse(xml);

  if (!result.Deck) {
    return {
      success: false,
      error: "No 'Deck' key found",
    };
  }

  if (!result.Deck.Cards) {
    return {
      success: false,
      error: "No 'Cards' key found in Deck",
    };
  }

  const cards: Array<CardData> = [];
  for (let cardData of result.Deck.Cards) {
    let rawCard = {
      id: cardData["@_CatID"],
      quantity: cardData["@_Quantity"],
      name: cardData["@_Name"],
    };
    let card = v.parse(CardSchema, rawCard);
    cards.push(card);
  }

  cards.sort((a, b) => {
    const nameA = a.name.toUpperCase(); 
    const nameB = b.name.toUpperCase(); 
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  return {
    success: true,
    data: { cards },
  };
}

// going by id, remove all cards in after, that are present in before.
// return a list of the remaining after cards.
function diffDecks(beforeDek: DeckList, afterDek: DeckList) {
  for (let card of beforeDek.cards) {
    // should these be arrays? 
    // we will have to iterate over one of these lists way too much
    // instead maybe objects with id as key(and val)
  }
}
