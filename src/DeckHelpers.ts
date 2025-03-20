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

export type DeckList = { [index: string]: CardData };

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

export function parseAsDeck(xml: string): ParseResult {
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

  const cards: DeckList = {};
  for (let cardData of result.Deck.Cards) {
    let rawCard = {
      id: cardData["@_CatID"],
      quantity: cardData["@_Quantity"],
      name: cardData["@_Name"],
    };
    let card: CardData = v.parse(CardSchema, rawCard);
    cards[card.id] = card;
  }

  return {
    success: true,
    data: cards,
  };
}

// since we only have to add a list of cards to pre-existing xml, manually handle
// instead of using xml library to generate for us
export function generateDotDekXml(decklist: DeckList): string {
  const cards = Object.values(decklist)
    .map((card) => {
      return `\
  <Cards CatID="${card.id}" Quantity="${card.quantity}" Sideboard="false" Name="${card.name}" Annotation="0" />`;
    })
    .join("\n");

  return `\
<?xml version="1.0" encoding="utf-8"?>
<Deck xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NetDeckID>0</NetDeckID>
  <PreconstructedDeckID>0</PreconstructedDeckID>
    ${cards}
</Deck>
  `;
}

// going by id, remove all cards in after, that are present in before.
// return a list of the remaining after cards.
export function diffDecks(beforeDek: DeckList, afterDek: DeckList): DeckList {
  const remainingCards: DeckList = {};

  for (let card of Object.values(afterDek)) {
    const beforeQuant = beforeDek[card.id]?.quantity ?? 0;
    const remaining = card.quantity - beforeQuant;
    if (remaining > 0) {
      remainingCards[card.id] = { ...card, quantity: remaining };
    } else if (remaining < 0) {
      console.warn('negative card quantity, something wrong', card.name, remaining);
    }
  }

  return remainingCards;
}
