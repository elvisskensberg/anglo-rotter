import styles from "./BlueNavBar.module.css";
import { DropdownMenu } from "./DropdownMenu";

const archiveItems = [
  { label: "Scoops Archive", href: "/archive/scoops" },
  { label: "News Archive", href: "/archive/news" },
  { label: "Forum Archive", href: "/archive/forum" },
];

const navItems = [
  { label: "Archive", hasDropdown: true, href: "/archive" },
  { label: "Exchange Rate", hasDropdown: false, href: "/exchange-rate" },
  { label: "Opinion", hasDropdown: false, href: "/opinion" },
  { label: "Calendar", hasDropdown: false, href: "/calendar" },
  { label: "News Flashes", hasDropdown: false, href: "/news" },
  { label: "Weather", hasDropdown: false, href: "/weather" },
  { label: "Home", hasDropdown: false, href: "/" },
];

export function BlueNavBar() {
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
            {navItems.map((item) =>
              item.hasDropdown ? (
                <td key={item.label}>
                  <DropdownMenu label={item.label} items={archiveItems} />
                </td>
              ) : (
                <td key={item.label}>
                  <a className={styles.navItem} href={item.href}>
                    {item.label}
                  </a>
                </td>
              )
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
