import type { Metadata } from "next";
import { HeaderBar, BlueNavBar, OrangeNavBar } from "@/components/layout";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The requested page could not be found.",
};

export default function NotFound() {
  return (
    <>
      <HeaderBar />
      <BlueNavBar />
      <OrangeNavBar />
      <div
        style={{
          width: "var(--rotter-container, 780px)",
          margin: "10px auto",
          fontFamily: "Arial, sans-serif",
          fontSize: "13px",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #aaaaaa",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  backgroundColor: "#71B7E6",
                  color: "#ffffff",
                  padding: "6px 8px",
                  textAlign: "left",
                  fontWeight: "bold",
                  fontSize: "13px",
                }}
              >
                Page Not Found
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                style={{
                  backgroundColor: "#FDFDFD",
                  padding: "12px 8px",
                  color: "#333333",
                }}
              >
                <p style={{ margin: "0 0 8px 0" }}>
                  The page you requested could not be found.
                </p>
                <p style={{ margin: 0 }}>
                  <a href="/" style={{ color: "#000099" }}>
                    Return to homepage
                  </a>
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
