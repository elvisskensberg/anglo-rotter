/**
 * Reusable ad placeholder component.
 * Renders a gray-bordered div with correct pixel dimensions.
 * Used in place of real DFP/Taboola ad slots during development.
 */
export function AdSlot({
  width,
  height,
  label,
}: {
  width: number;
  height: number;
  label: string;
}) {
  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        border: "1px solid #cccccc",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "11px",
        color: "#999999",
        margin: "3px auto",
      }}
    >
      {`Ad: ${label} (${width}x${height})`}
    </div>
  );
}
