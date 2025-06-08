export const Indicators = ({
  indicators,
}: {
  indicators: Record<string, boolean>;
}) => {
  return (
    <div className="flex gap-2 my-4">
      {Object.entries(indicators).map(
        ([color, visible]) =>
          visible && (
            <div
              key={color}
              className={`h-4 flex-1 rounded ${
                color === "yellow" ? "bg-yellow-300" : `bg-${color}-600`
              }`}
            ></div>
          )
      )}
    </div>
  );
};
