import React from "react";
import { Table } from "@/components/ui/Table";
import { ThreadRating } from "./ThreadRating";
import type { ThreadPost } from "@/data/thread-seed";
import styles from "./OriginalPostBlock.module.css";

interface OriginalPostBlockProps {
  post: ThreadPost;
  title: string;
  threadId: number;
}

/**
 * Original post block for the thread page (THRD-01, THRD-02).
 * Renders author info row (#eeeeee) and post content area (#FDFDFD).
 * Source: data/design/thread_page.html lines 521-569.
 */
export function OriginalPostBlock({ post, title, threadId }: OriginalPostBlockProps) {
  return (
    <Table
      width="100%"
      border={0}
      cellSpacing={0}
      cellPadding={0}
      style={{ backgroundColor: "#000000" }}
    >
      <tbody>
        <tr>
          <td>
            <Table
              width="100%"
              border={0}
              cellSpacing={0}
              cellPadding={1}
              style={{ backgroundColor: "#000000" }}
            >
              <tbody>
                <tr>
                  <td>
                    <Table width="100%" border={0} cellPadding={3} cellSpacing={0}>
                      <tbody>
                        {/* Row 1 — Author info (THRD-01) */}
                        <tr style={{ backgroundColor: "var(--rotter-row-even)" }}>
                          <td
                            align="right"
                            valign="top"
                            width="50%"
                            rowSpan={2}
                          >
                            <span
                              style={{
                                fontSize: "var(--rotter-size-sm)",
                                color: "var(--rotter-text-primary)",
                                fontFamily: "var(--rotter-font-primary)",
                              }}
                            >
                              <b>{post.author}</b>
                            </span>
                            {" "}
                            <ThreadRating
                              threadId={threadId}
                              currentRating={post.starRating}
                              ratersCount={post.ratersCount}
                              points={post.points}
                            />
                            <br />
                            <span style={{ fontSize: "var(--rotter-size-xs)" }}>
                              Member since {post.memberSince}
                            </span>
                            <br />
                            <span style={{ fontSize: "var(--rotter-size-xs)" }}>
                              {post.postCount} posts
                            </span>
                          </td>
                          <td align="left" valign="top" width="50%">
                            <span
                              style={{
                                fontSize: "var(--rotter-size-xs)",
                                color: "var(--rotter-text-primary)",
                              }}
                            >
                              {post.date}
                            </span>
                            {" "}
                            <span
                              style={{
                                color: "var(--rotter-text-time)",
                                fontSize: "var(--rotter-size-xs)",
                              }}
                            >
                              {post.time}
                            </span>
                          </td>
                        </tr>

                        {/* Row 2 — Action icons placeholder (spans with author info via rowspan) */}
                        <tr style={{ backgroundColor: "var(--rotter-row-even)" }}>
                          <td align="left">&nbsp;</td>
                        </tr>

                        {/* Row 3 — Post content (THRD-02) */}
                        <tr style={{ backgroundColor: "var(--rotter-row-odd)" }}>
                          <td colSpan={2} width="100%">
                            <h1
                              className={styles.text16b}
                              style={{ margin: "0px", paddingRight: "10px" }}
                            >
                              {title}
                            </h1>
                            <br />
                            <Table
                              border={0}
                              cellPadding={5}
                              cellSpacing={0}
                              width="70%"
                              style={{ display: "inline-table" }}
                            >
                              <tbody>
                                <tr>
                                  <td valign="top" width={50}>
                                    &nbsp;&nbsp;
                                  </td>
                                  <td valign="top" width="100%">
                                    <span
                                      style={{
                                        fontSize: "var(--rotter-size-sm)",
                                        color: "var(--rotter-text-primary)",
                                        fontFamily: "var(--rotter-font-primary)",
                                      }}
                                    >
                                      {post.content}
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </Table>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </td>
                </tr>
              </tbody>
            </Table>
          </td>
        </tr>
      </tbody>
    </Table>
  );
}
