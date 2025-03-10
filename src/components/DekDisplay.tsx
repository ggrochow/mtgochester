import { useVirtualizer } from "@tanstack/react-virtual";
import { DeckList } from "../DeckHelpers";
import { useRef } from "react";

type Props = {
  deck: DeckList;
};

export function DekDisplay({ deck }: Props) {
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: deck.cards.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 20, // ???
  });

  return (
    <>
      {/* Scroll container */}
      <div ref={parentRef} style={{ height: `150px`, overflow: "auto" }}>
        {/* Inner list holder */}
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {/* items to display */}
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const card = deck.cards[virtualItem.index]
            return (
            <div
              key={virtualItem.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              { card.name } - { card.quantity }
            </div>
          )})}
        </div>
      </div>
    </>
  );
}
