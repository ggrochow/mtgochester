import { useVirtualizer } from "@tanstack/react-virtual";
import { DeckList } from "../DeckHelpers";
import { useMemo, useRef } from "react";

type Props = {
  deck: DeckList;
};

export function DekDisplay({ deck }: Props) {
  const parentRef = useRef(null);

  const cards = useMemo(() => {
    return Object.values(deck).sort((a, b) => {
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
  }, [deck]);

  const rowVirtualizer = useVirtualizer({
    count: cards.length,
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
            const card = cards[virtualItem.index];
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
                {card.name} - {card.quantity}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
