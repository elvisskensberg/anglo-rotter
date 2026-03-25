import styles from "./HeaderBar.module.css";
import { AuthButton } from "@/components/auth/AuthButton";

function formatDate(): string {
  const now = new Date();
  return now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function HeaderBar() {
  return (
    <div className={styles.headerOuter}>
      <table
        className={styles.headerTable}
        cellSpacing={0}
        cellPadding={0}
        border={0}
      >
        <tbody>
          <tr>
            <td className={styles.logoCell}>
              <img
                src="/images/logo.svg"
                alt="MultiRotter"
                width={335}
                height={50}
              />
            </td>
            <td className={styles.dateCell}>
              <span className={styles.dateText}>{formatDate()}</span>
            </td>
            <td className={styles.authCell}>
              <AuthButton />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
