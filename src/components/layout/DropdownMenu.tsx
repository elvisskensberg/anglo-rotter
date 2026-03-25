import styles from "./DropdownMenu.module.css";

interface DropdownItem {
  label: string;
  href: string;
}

interface DropdownMenuProps {
  label: string;
  items: DropdownItem[];
}

export function DropdownMenu({ label, items }: DropdownMenuProps) {
  return (
    <div className={styles.dropdownWrapper}>
      <span className={styles.dropdownTrigger}>{label}</span>
      <div className={styles.dropdownPanel}>
        <table cellSpacing={0} cellPadding={0} border={0}>
          <tbody>
            {items.map((item) => (
              <tr key={item.href}>
                <td className={styles.dropdownItem}>
                  <a href={item.href}>{item.label}</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
