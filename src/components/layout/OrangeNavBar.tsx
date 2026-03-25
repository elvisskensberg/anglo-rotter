import styles from "./OrangeNavBar.module.css";

const navItems = [
  { label: "Scoops", href: "/scoops" },
  { label: "Headlines", href: "/headlines" },
  { label: "eNews", href: "/enews" },
  { label: "Index", href: "/index" },
  { label: "Pro Business", href: "/pro-business" },
];

export function OrangeNavBar() {
  return (
    <div className={styles.wrapper}>
      <table
        className={styles.navTable}
        cellSpacing={0}
        cellPadding={0}
        border={0}
      >
        <tbody>
          <tr>
            {navItems.map((item) => (
              <td key={item.label}>
                <a className={styles.navItem} href={item.href}>
                  {item.label}
                </a>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
