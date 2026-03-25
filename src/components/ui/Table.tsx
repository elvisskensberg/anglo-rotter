import React from "react";
import styles from "./Table.module.css";

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

/**
 * Base table component that enforces explicit <tbody> to prevent
 * React 19 hydration mismatch. All table-based layouts in MultiRotter
 * MUST use this component or manually include <tbody>.
 *
 * Usage:
 *   <Table width="100%" cellSpacing={0} cellPadding={3}>
 *     <tbody>
 *       <tr>...</tr>
 *     </tbody>
 *   </Table>
 *
 * The component itself does NOT auto-wrap children in <tbody> —
 * callers must explicitly include <tbody> so the intent is clear
 * and <thead>/<tfoot> can also be used. The component's purpose is
 * to provide consistent table defaults and serve as a lint target
 * (grep for bare <table> to find violations).
 */
export function Table({ children, className, ...props }: TableProps) {
  return (
    <table className={`${styles.table} ${className ?? ""}`} {...props}>
      {children}
    </table>
  );
}
