# Rotter.net Complete Design Specification

## Table of Contents
1. [Global Architecture](#1-global-architecture)
2. [Homepage](#2-homepage)
3. [Forum Listing (Scoops)](#3-forum-listing-scoops)
4. [Thread Page](#4-thread-page)
5. [News Page (Mivzakim)](#5-news-page-mivzakim)
6. [English News Page](#6-english-news-page)
7. [Forum List Page (Chronological)](#7-forum-list-page-chronological)
8. [Color Scheme](#8-color-scheme)
9. [Typography](#9-typography)
10. [CSS Classes Reference](#10-css-classes-reference)
11. [Icons & Images](#11-icons--images)
12. [JavaScript Functionality](#12-javascript-functionality)
13. [Mobile Handling](#13-mobile-handling)
14. [Ad Placements](#14-ad-placements)

---

## 1. Global Architecture

### Encoding & Language
- Character encoding: `windows-1255` (Hebrew)
- Content-Language: `he`
- The entire site uses **old-school table-based layout** with no modern CSS frameworks
- No responsive design -- mobile is handled by separate pages via JavaScript user-agent detection and redirect

### Direction
- **Homepage**: `<html dir=ltr>` -- the outer shell is LTR
- **Forum pages** (scoops, threads, forum list): `<HTML DIR="RTL">` -- full RTL
- **News pages**: No dir on `<html>`, but content is implicitly RTL via structure
- Inside forum pages, there is a `<DIV DIR="RTL">` wrapper around main content
- Navigation bars use `dir="ltr"` table wrappers even within RTL pages

### Common External Resources
- Main CSS: `https://rotter.net/ccc/style.css` (used on homepage only)
- Forum JS: `https://rotter.net/forum/dcf.js` (used on forum/thread pages)
- Images hosted on both `rotter.net` and `rotter.co.il` (CDN alias)
- Google Analytics: UA-33997367-1
- Google DFP ads: account /69589285/
- Taboola widget integration
- Facebook SDK (for sharing)
- Google Custom Search Engine (cx: 002506875823855302489:zhlssxjzpxk)

### Auto-Refresh
- Homepage: `<meta http-equiv=refresh content="770">` (every ~13 minutes)
- News page: `<meta http-equiv=refresh content="530">` (every ~9 minutes)
- English news: `<meta http-equiv=refresh content="300">` (every 5 minutes)
- Forum list: `<meta http-equiv=refresh content="3600">` (every hour)

---

## 2. Homepage

### HTML Structure
```
<html dir=ltr>
<head>
  <link rel="stylesheet" href="https://rotter.net/ccc/style.css">
</head>
<body bgcolor="#FFFFFF" background="https://rotter.net/rreka.gif" text="#000000"
     link="#000000" vlink="#0000FF" alink="#FF0000"
     leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">

  <!-- Right margin ad (absolute positioned) -->
  <div style='position:absolute;right:0;top:0;'>

  <center>
  <!-- OUTER CONTAINER TABLE: width=1012 -->
  <table width="1012" border="0" cellspacing="0" cellpadding="0">

    <!-- ROW 1: HEADER with logo, date, search -->
    <tr><td>
      <table width="100%" background="https://rotter.co.il/ccc/bg00.gif">
        <!-- Logo (335px) | Special image (80px) | Spacer | Date+Search (600px) -->
      </table>
    </td></tr>

    <!-- ROW 2: BLUE NAVIGATION BAR (975px centered) -->
    <tr><td align="center">
      <table width="975"> <!-- Image-based nav buttons -->
    </td></tr>

    <!-- ROW 3: ORANGE NAVIGATION BAR (975px centered) -->
    <tr><td align="center">
      <table width="975"> <!-- Image-based nav buttons -->
    </td></tr>

    <!-- ROW 4: AD BELOW HEADER -->

    <!-- ROW 5: DROPDOWN MENUS BAR (blue background) -->
    <!-- Contains: "פורום אקטואליה" | "פורום אקסקלוסיבי" | "חופשה" | "המייל האדום" | etc. -->

    <!-- ROW 6: THREE-COLUMN LAYOUT -->
    <table width="100%">
      <tr>
        <!-- RIGHT COLUMN (~300px): Sidebar content -->
        <td width="300" valign="top">
          <!-- Exclusive forum ticker (scrolling div) -->
          <!-- Sponser.co.il iframe -->
          <!-- Advertising banner -->
          <!-- Blogs section -->
          <!-- Zmanim (prayer times) widget -->
        </td>

        <!-- CENTER COLUMN (450px): Breaking news -->
        <td style="text-align:center; width: 450px; vertical-align:top; background-color:#ffffff;">
          <!-- "חדשות מתפרצות" header with decorative images -->
          <!-- News items: time (red) + linked headline -->
          <!-- Includes צבע אדום (Red Alert) entries -->
          <!-- Center ad slot -->
          <!-- More news items from scoops forum -->
        </td>

        <!-- LEFT COLUMN: Additional content -->
        <td valign="top">
          <!-- Left cube ad -->
          <!-- Additional content -->
        </td>
      </tr>
    </table>

  </table>
  </center>
</body>
</html>
```

### Header Bar
- Background image: `https://rotter.co.il/ccc/bg00.gif`
- Logo: `https://rotter.co.il/ccc/logo1.gif` -- links to rotter.net
- Width: 335px for logo cell
- Date display: White text (`color=ffffff`) on the bg, font `size=-1`, bold
- Includes Hebrew date, time, and Gregorian date
- Google Custom Search box embedded in header

### Navigation Bars
Two horizontal bars of image-based buttons:

**Blue bar** (top, height: 25px):
- Background: part of blue gradient theme
- Buttons are GIF images, each a fixed width
- Items: ארכיון | שער הדולר | שערי דעה | לוח שנה | מבזקים | מזג אוויר | עמוד הבית
- Right cap: `blue_links_bar_right.gif` (71px)

**Orange bar** (bottom, height: 24px):
- Items: סקופים | כותרות הסקופים | Rotter eNews | אינדקס | פרו עסקי
- Right cap: `orange_link_bar_right.gif` (71px)

### Dropdown Menus
- Triggered by `onmouseover`/`onmouseout` using `ShowDiv1()`/`HideDiv1()` JavaScript
- Style: `POSITION: absolute; background:#c6e0fb; z-index:1;`
- Items use class `drop-list`: bg `#D9D9D9`, padding `1px 15px 1px 30px`, font `10pt Arial`
- Hover: bg changes to `#FFFFFF`
- Menu categories: פורום אקטואליה, פורום אקסקלוסיבי, חופשה, המייל האדום, רשימת קישורים

### Breaking News (Center Column)
- Header: decorative tab images (`bl_l.gif`, `bl_t_bg.gif`, `bl_rr.gif`, etc.)
- Header text: "חדשות מתפרצות" in yellow bold, font size=-1
- Each news item format:
  ```html
  <span style='font-size:9.0pt;color:red'><b>19:07</b></span>&nbsp;
  <a target='news' HREF="..."><span style='font-size:10.0pt;color:000099'>HEADLINE</span></a><br>
  ```
- Time: 9pt, red, bold
- Headline: 10pt, color `#000099` (dark blue)
- Red Alert items: same styling, title starts with "צבע אדום (HH:MM): location"

### Right Sidebar
- Exclusive forum ticker: scrolling `<div>` (300px wide, 430px tall, `overflow-y:scroll`)
- Each item: red bold date+time (class `diego_title`), blue linked content (class `diego_content`)
- Prayer times (Zmanim) widget with JavaScript-calculated times
- Various ad slots and iframes

---

## 3. Forum Listing (Scoops)

### Page Structure
```
<HTML DIR="RTL">
<BODY STYLE="margin-top:0px" bgcolor="FEFEFE" VLINK="#909090" ALINK="Black"
     rightmargin="0" leftmargin="0" link="#000099">
<DIV DIR="RTL">
<CENTER>

<!-- LOGO BAR: full width, bgcolor="71B7E6" -->
<table width=100% bgcolor="71B7E6">
  <!-- Ad slot | Logo image (logo_012b.gif) -->
  <!-- Black separator line -->
</table>

<!-- NAVIGATION (same blue/orange bars as homepage) -->

<!-- FORUM TOOLBAR -->
<table> <!-- Login | Help | Search | Write | Red Mail icons --></table>

<!-- DISCLAIMER (red text) -->

<!-- MODERATORS LIST -->

<!-- THREAD TABLE HEADER -->
<table border="0" width="100%" bgcolor="#000000" cellspacing="0" cellpadding="0">
  <table border="0" width="100%" cellspacing="0" cellpadding="3">
    <TR bgcolor="#3293CD">  <!-- Blue header row -->
      <!-- Breadcrumb: קבוצות דיון > סקופים -->
      <!-- Role icons legend: מנהל, סגן המנהל, מפקח, עיתונאי מקוון, צל"ש -->
    </TR>
  </table>

  <!-- COLUMN HEADERS -->
  <TR BGCOLOR="71B7E6">
    <TD> <!-- Expand threads icon --> </TD>
    <TD> כותרות </TD>
    <TD> הכותב </TD>
    <TD> מכתב אחרון </TD>
    <TD> תג' (replies) </TD>
    <TD> נצפה (views) </TD>
  </TR>

  <!-- THREAD ROWS (alternating colors) -->
  <TR BGCOLOR="#FDFDFD"> ... </TR>  <!-- Odd rows: white-ish -->
  <TR BGCOLOR="#eeeeee"> ... </TR>  <!-- Even rows: light gray -->
```

### Thread Row Structure (6 columns)
Each `<TR>` contains:

1. **Icon cell** (`width ~1%`, center aligned):
   - Normal thread: `icon_general.gif`
   - Hot thread (many views): `hot_icon_general.gif`
   - Has tooltip on mouseover showing preview of thread content

2. **Title cell** (`width="55%"`, right aligned):
   - Class: `text15bn` (font-size 15px)
   - Font: Arial
   - Link wrapping bold title text
   - Links to: `dcboard.cgi?az=read_count&om=THREADID&forum=scoops1`

3. **Author + Date cell** (center aligned):
   - Date: `font size=1 color=000099` (e.g., "22.03.26")
   - Time: `font size=1 color=red` (e.g., "19:40")
   - Author: linked, class `text13`, bold

4. **Last reply cell** (center aligned):
   - Date + time (same styling)
   - "מאת USERNAME" link in `color="#0000FF"`
   - Links to: `forum/scoops1/THREADID.shtml#REPLYNUM`

5. **Reply count cell** (center aligned):
   - `SIZE="2" COLOR="#000099" FACE="Arial"`, bold

6. **Views cell** (right aligned):
   - Normal: `font size=-1 color=#ff9933` (orange), bold
   - Hot threads: `font size=-1 color=red` (red), bold + `hot_icon_news.gif` image

### Hot Thread Indicators
- Icon changes from `icon_general.gif` to `hot_icon_general.gif`
- View count color changes from `#ff9933` (orange) to `red`
- A `hot_icon_news.gif` image appears next to the view count
- No specific view threshold found in HTML -- determined server-side

### Tooltip (Thread Preview)
- Activated via `onmouseover="EnterContent('ToolTip', title, content)"`
- Follows mouse cursor
- Structure: nested table with:
  - Top bar: bg `#7D92A9`, class `tooltiptitle` (white, arial bold 10pt)
  - Content: bg `#e6f2ff`, class `tooltipcontent` (black, arial 9pt)
- Container: `<div DIR="RTL" id="ToolTip">` absolutely positioned, z-index:4

### Pagination
- At bottom of thread list header area
- Format: `דף 1 | 2 | 3 | 4 | 5 | 6 | ... | 100`
- Page numbers: `font color=red size=2`, bold, linked
- Lines per page selector: dropdown (15/30/50/100/150/200/250/300)

### Forum Toolbar Icons
- Login: `Images/login.gif` (33x33)
- Help: `Images/help.gif` (33x33)
- Search: `Images/search.gif` (33x33)
- Post new: `Images/post.gif` (33x33)
- Red Mail: `week/red-mail.jpg` (50px height)
- All with `font size="-1" face="Arial" color="#000099"` labels below

---

## 4. Thread Page

### Structure
Same header/navigation as forum listing, then:

```
<!-- Thread metadata bar -->
<TR bgcolor="#3293CD">
  <!-- Breadcrumb: קבוצות דיון > סקופים > נושא #940099 -->
  <!-- Role icons legend -->
</TR>

<!-- Thread controls -->
<TR BGCOLOR="71B7E6">
  <!-- Thread number, chronological view button, management button, first/last reply buttons -->
</TR>

<!-- ORIGINAL POST -->
<table border="0" width="100%" cellpadding="3" cellspacing="0">
  <TR BGCOLOR="#eeeeee">  <!-- Author info row -->
    <td width="50%">
      <!-- Author name (bold, linked) -->
      <!-- Star rating image (e.g., 3_star.gif) -->
      <!-- "חבר מתאריך X" (member since) -->
      <!-- "N הודעות" (post count) -->
      <!-- "N מדרגים, N נקודות" (ratings) -->
    </td>
    <td width="50%">
      <!-- Hebrew date, time (red), Gregorian date -->
    </td>
  </TR>
  <tr bgcolor="#eeeeee">
    <td>
      <!-- Action icons: Send message, Profile, Add buddy, Business card, IP -->
    </td>
  </tr>
  <tr bgcolor="#FDFDFD">
    <td colspan="2">
      <!-- Thread title as <h1> with class text16b -->
      <!-- Post content in nested table (width 70%) -->
      <!-- Content font: size=2, Arial, color=#000099, class text15 -->
    </td>
  </tr>
  <TR BGCOLOR="#eeeeee">
    <!-- Action buttons: Edit, Up, Reply, View All, Back to forum -->
    <!-- "תגובה עם ציטוט" (reply with quote) -->
    <!-- "תגובה מהירה" (quick reply) -->
    <!-- "(ניהול: למבזק)" management link -->
  </TR>
</table>

<!-- REPLY THREAD TREE -->
<TABLE WIDTH="100%" cellspacing="1" cellpadding="1">
  <tr bgcolor="#eeeeee">
    <th>האשכול</th>
    <th>מחבר</th>
    <th>תאריך כתיבה</th>
    <th>מספר</th>
  </tr>

  <!-- Top-level reply -->
  <tr bgcolor="#eeeeee">
    <td>&nbsp;&nbsp;<img src="Images/message.gif"> REPLY_TITLE </td>
    <td>AUTHOR</td>
    <td>DATE TIME</td>
    <td>NUMBER</td>
  </tr>

  <!-- Nested reply (indented with &nbsp;) -->
  <tr bgcolor="#FDFDFD">
    <td>&nbsp;&nbsp;&nbsp;&nbsp;<img src="Images/reply_message.gif"> REPLY_TITLE</td>
    ...
  </tr>

  <!-- Deeper nesting = more &nbsp; entities (4 per level) -->
</TABLE>
```

### Post Author Info
- Username: bold, `font size="2" color="#000099"`
- Star rating: linked image (`1_star.gif` through `5_star.gif`)
- Member since: `font size="1"`
- Post count: `font size="1"`
- Ratings: green (`color=006633`), points in red

### Post Content
- Title: `<h1 CLASS='text16b' style="margin:0px; padding-right:10px;">`
- Content wrapped in table at 70% width with 5px cellpadding
- Text: `font size="2" face="Arial" color="#000099"`, class `text15`
- Content area has inline `display: inline-table` style

### Reply Tree
- Icons: `message.gif` for top-level, `reply_message.gif` for nested
- Indentation: multiples of `&nbsp;` (4 per nesting level)
- Alternating row colors: `#eeeeee` and `#FDFDFD`
- Reply text: `SIZE="2" FACE="Arial" color="#000099"`
- Author: `SIZE="1" FACE="Arial" color="#000099"`
- Time: `SIZE="1" FACE="Arial" color="red"`

### Quick Reply
- Activated via `javascript:updatePropertyDisplay('0')`
- Hidden form element toggled by JavaScript

### Report Thread
- Hidden form (`id="reportthread"`) with POST to `report-luach-a.pl`
- Fields: report, username, link, title, forum

---

## 5. News Page (Mivzakim)

### Structure
```
<body BGCOLOR="#eaf4ff" VLINK="000099" ALINK="000099" LINK="000099"
     style="padding: 0px; margin: 0px;">

<!-- HEADER TABLE (full width) -->
<table border=0 width='100%' cellspacing=0 cellpadding=0>
  <tr>
    <td class="addLns1" width="290px">
      <!-- Logo: logo1.gif -->
    </td>
    <td class="addLns1">
      <!-- Sub-header with date, search, forum links -->
      <table style="background-color: #3984ad; color: #ffffff;">
        <!-- Date | Search | פורום סקופים | כותרות הסקופים -->
      </table>

      <!-- Category tabs -->
      <table>
        <tr>
          <td class="newstitles"><h1 style='font-size:19px;'>מבזקי חדשות</h1></td>
          <td class="newstitles">מבזקי ספורט</td>
          <td class="newstitles">מבזקי כלכלה</td>
          <td class="newstitles">מחשבים ואינטרנט</td>
          <td class="newstitles">למגזר החרדי</td>
          <td class="newstitles">כל המבזקים והחדשות</td>
          <td class="newstitles">מבזקי חדשות</td>
        </tr>
      </table>
    </td>
  </tr>
</table>

<!-- NEWS ITEMS TABLE -->
<table border="0" width="100%">
  <tr>
    <td>
      <!-- Each news item is a table row -->
      <!-- Standard pattern repeats -->
    </td>
  </tr>
</table>
```

### News Item Row
Each news item occupies a `<tr>` with background `#FFFFFF` and `height:24px`:
```html
<tr>
  <td style="background: #eeeeee;"> <!-- Source icon/category --> </td>
  <td> <!-- Headline with link --> </td>
  <td> <!-- Time --> </td>
  <td> <!-- Source name --> </td>
</tr>
```

### News Page Specific CSS
```css
td { background: #FFFFFF; height: 24px; }
.tdhead { background: #3984ad; }
.addLns { font: bold 20pt; }
.morLns { font: normal 12px tahoma; }
.addLns, .morLns { background: #EEEEEE; color: #000099; }
.addLns1, .morLns1 { background: #3984ad; }
.newstitles { background: #3984ad; color: #fff; text-align: center; margin: 0px 1px; }
.ntl { color: #fff; }
```

---

## 6. English News Page

### Key Differences from Hebrew News
- Title: "Rotter.Net - Israel News"
- `<body BGCOLOR="#eaf4ff" VLINK="000099" ALINK="000099" LINK="000099">`
- Header has a **red** background: `<table border="0" width="100%" bgcolor="red">`
- Simpler header with just date and Google search form
- Auto-refresh every 300 seconds (5 minutes)
- Mobile redirect to `https://rotter.net/mobile/enews.php`
- Same news item structure but with English language content
- Simpler layout, fewer category tabs

---

## 7. Forum List Page (Chronological)

### Page-Specific Features
- Title heading: `<h1 style="color: red; font-size: 25px; padding: 0px; margin: 0 auto; font-weight: bold;">כותרות פורום סקופים בסדר כרונולוגי</h1>`
- Links to alternative sort: "לחץ כאן לקבל את הכותרות מסודרות לפי תגובה אחרונה"
- Link color for sort options: `color=#ff6600` (orange)

### Two-Column Layout
```html
<table width="100%" dir="rtl">
  <tr>
    <!-- RIGHT SIDEBAR (160px fixed) -->
    <td style="border:0px solid red; width:160px;" valign="top">
      <!-- Ad slot -->
      <!-- Pro business iframe -->
      <!-- Taboola right rail -->
    </td>

    <!-- MAIN CONTENT -->
    <td>
      <!-- Thread listing table -->
    </td>
  </tr>
</table>
```

### Thread Listing Table (4 columns)
```
<TR BGCOLOR="71B7E6">  <!-- Header -->
  <TD> <!-- icon --> </TD>
  <TD> כותרות </TD>
  <TD> שעה </TD>
  <TD> הכותב </TD>
</TR>

<TR BGCOLOR='#FDFDFD'>  <!-- Thread row -->
  <TD><img src="Images/new_icon_general.gif" style='width: 16px; height: 16px;'></TD>
  <TD ALIGN='right' WIDTH='70%'>
    <FONT CLASS='text15bn' FACE='Arial'>
      <a href="..."><b>HEADLINE</b></a>
    </FONT>
  </TD>
  <TD ALIGN='center'>
    <FONT CLASS='text13b'><b>19:50</b></FONT><br>
    <font color=000000 size=1>22.03.26</font>
  </TD>
  <TD ALIGN='CENTER'><font CLASS='text13r'>AUTHOR</font></TD>
</TR>
```

### Thread Icon Types
- Normal: `new_icon_general.gif` (16x16)
- Fire/Hot: `new_icon_fire.gif` (16x16) -- used for "צבע אדום" (Red Alert) threads
- Camera: `new_icon_camera.gif` (16x16) -- for threads with media/video

### Red Alert Thread Styling
- Uses `new_icon_fire.gif` icon
- Author shown as "צבע אדום" in class `text13r` (red, bold, 13px)
- Headline typically starts with "צבע אדום (HH:MM): location" or "חדירת כלי טיס"
- No special background color -- same alternating white/gray as other rows
- In the homepage breaking news section, they appear inline with same styling as other items

---

## 8. Color Scheme

### Primary Colors
| Usage | Color | Hex |
|-------|-------|-----|
| Body background (homepage) | White | `#FFFFFF` |
| Body background (news) | Light blue | `#eaf4ff` |
| Body background (forum) | Near-white | `#FEFEFE` |
| Background image (homepage) | Pattern | `rreka.gif` |
| Main header/logo bar bg | Blue | `#71B7E6` |
| Forum header row | Medium blue | `#3293CD` |
| Column header row | Blue | `#71B7E6` |
| Navigation dropdown bg | Blue | `#2d8dce` |
| News header bg | Teal blue | `#3984ad` |
| Thread row odd | White-ish | `#FDFDFD` |
| Thread row even | Light gray | `#eeeeee` |
| Menu row bg | Blue | `#2D8DCE` |
| Dropdown bg | Light blue | `#c6e0fb` |
| Dropdown item bg | Gray | `#D9D9D9` |
| Dropdown item hover bg | White | `#FFFFFF` |
| Separator line | Black | `#000000` |
| Table border container | Black | `#000000` |
| English news header | Red | `red` |

### Text Colors
| Usage | Color | Hex |
|-------|-------|-----|
| Default text | Black | `#000000` |
| Primary link color | Dark blue | `#000099` |
| Visited link (forum) | Gray | `#909090` |
| Active link (forum) | Black | `Black` |
| Header text | White | `#FFFFFF` |
| Time display | Red | `red` |
| View count (normal) | Orange | `#ff9933` |
| View count (hot) | Red | `red` |
| Sort link options | Orange | `#ff6600` |
| Dropdown text | Yellow | `yellow` |
| Author in forum list | Bold dark blue | `#000099` |
| Author in chronological list | Red bold | class `text13r` = `red` |
| Green (ratings) | Green | `#006633` |
| "Last reply by" link | Blue | `#0000FF` |
| Moderator presence text | Red | `red` |

### Scrollbar Colors (IE-specific)
```css
scrollbar-face-color: #3C5D8A;
scrollbar-shadow-color: #FAD2A4;
scrollbar-highlight-color: #FAD2A4;
scrollbar-3dlight-color: #000000;
scrollbar-darkshadow-color: #000000;
scrollbar-track-color: #6481AA;
scrollbar-arrow-color: #ffffff;
```

---

## 9. Typography

### Font Families
- Primary: `Arial (Hebrew), David (Hebrew), Courier New (Hebrew)`
- Fallback: `Arial, helvetica, geneva`
- News page uses `tahoma` for `.morLns`
- CSS file uses `Georgia` for `.text26` class

### Font Sizes
| Class/Context | Size |
|---------------|------|
| text12 | 12px |
| text13 | 13px |
| text15 / text15n / text15b | 15px |
| text15bn | 15px |
| text16b | 16px |
| text20 | 20px |
| Menu items (menu1) | 16px |
| Tooltip title | 10pt |
| Tooltip content | 9pt |
| Thread title | 15px (text15bn) |
| Thread title (h1 in thread page) | text16b (16px) |
| News category h1 | 19px |
| Date/time in thread list | font size=1 |
| Author name | font size=1 or 13px |
| View count | font size=-1 |
| Input fields | 13-14px |

### Font Weights
- Thread titles: `bold` (via `<b>` tags)
- Navigation: `bold`
- Moderator names: bold
- Dropdown text: bold
- Class `text13b`, `text15b`, `text16b`: FONT-WEIGHT: bold; TEXT-DECORATION: underline

### Text Decoration
- Links default: `text-decoration: none`
- Links on hover: `text-decoration: underline`
- `text13b`, `text15b`, `text16b`: underline always
- Navigation links: none, underline on hover

---

## 10. CSS Classes Reference

### From Inline Styles (Forum Pages)
```css
/* Body scrollbar styling */
BODY { scrollbar-face-color: #3C5D8A; ... }

/* Links */
a:link { text-decoration: none; }
a:visited { text-decoration: none; }
a:active { text-decoration: underline; }
a:hover { text-decoration: underline; }

/* Border utility */
.aborder { border: 1px solid black; }

/* Menu styles */
.menu1 { font-family: Arial; font-size: 16px; color: white; font-weight: bold; }
.menu2 { font-family: Times New Roman (Hebrew)...; font-size: 15px; color: #FFFFFF; font-weight: bold; text-decoration: underline; }

/* Background colors */
.msg_b { background-color: #71B7E6; }
._menu1b { background-color: #3293CD; }
.menu1b { background-color: #2D8DCE; }
.icons { background-color: #FEFEFE; }
.icons2 { background-color: #FFFFE8; }
._icons { background-color: #FF8400; }
._icons2 { background-color: #FFDE7F; }

/* Tooltip */
.tooltiptitle { color: #FFFFFF; font-family: arial; font-weight: bold; font-size: 10pt; }
.tooltipcontent { color: #000000; font-family: arial; font-size: 9pt; }
#ToolTip { position: absolute; width: 100px; top: 0px; right: 0px; z-index: 4; visibility: hidden; }

/* Text classes */
.text12 { font-family: Arial (Hebrew)...; font-size: 12px; color: #000099; }
.text13 { font-family: Arial (Hebrew)...; font-size: 13px; color: #000099; }
.text13b { ...; font-size: 13px; color: #000099; font-weight: bold; text-decoration: underline; }
.text15n { font-family: Arial (Hebrew)...; font-size: 15px; }
.text15 { ...; font-size: 15px; color: black; }
.text15b { ...; font-size: 15px; color: #000099; font-weight: bold; text-decoration: underline; }
.text15bn { font-size: 15px; }
.text16b { ...; font-size: 16px; color: #000099; font-weight: bold; text-decoration: underline; }

/* Input styling */
INPUT, .bginput { font-family: arial; font-size: 13px; color: #000099; font-weight: bold; }

/* Dropdown menus */
.drop-list { background-color: #D9D9D9; padding: 1px 15px 1px 30px; font: 10pt Arial; text-align: right; }
.drop-list-on { background-color: #FFFFFF; padding: 1px 15px 1px 30px; font: 8pt Arial; }
```

### From style.css (Homepage)
```css
/* Text classes (slightly different from forum inline) */
.text12 { ...; color: #000000; }  /* Note: black, not dark blue */
.text13 { ...; color: #9f9f9f; font-weight: bold; }  /* Gray! */
.text15 { ...; color: #000000; }
.text20 { ...; font-size: 20px; color: #000000; }
.text20b { ...; font-size: 20px; color: White; font-weight: bold; }
.text21b { ...; font-size: 20px; color: #000099; font-weight: bold; }
.text26 { font-family: Georgia; font-size: 26px; color: #808080; font-weight: bold; }
.text40 { font-family: Arial; font-size: 40px; color: #808080; font-weight: bold; }

/* Links in style.css */
A:link { color: #004623; font-size: 14px; }
A:visited { color: #004623; font-size: 14px; }
A:hover { color: #000099; font-size: 14px; text-decoration: underline; }

/* Menu */
.menutable { color: #FFFFFF; font-weight: bold; font-size: 10pt; }
.menubordercolor { background-color: #4284b5; }
.menubordercolorm { background-color: #c60400; }
.menubackcolor { background-color: #FFFFFF; }
.cathdl { color: #ffffff; font-weight: bold; font-size: 10pt; }
.cat { color: #336699; font-weight: bold; font-size: 10pt; }

/* News prefs */
.newstexttitle { color: #FFFFFF; font-weight: bold; font-size: 10pt; }
.fullnewstitle { color: #003399; font-weight: bold; font-size: 12pt; }
.newsbordercolor { ... }
```

### From Forum List Page
```css
.text13r { font-family: Arial (Hebrew)...; font-size: 13px; color: red; font-weight: bold; }
.text13b { font-family: Arial (Hebrew)...; font-size: 13px; color: #006600; font-weight: bold; }
.text15b { ...; font-size: 16px; color: #006600; font-weight: bold; }
.floating { position: fixed; top: 10px; }
.unfloating { position: static; }
```

### From Homepage Sidebar
```css
.diego_title { font-weight: bold; font-size: 10pt; color: red; }
.diego_content { color: #000099; font-size: 8.0pt; text-decoration: none; }
a.diego_content:link { color: #000099; font: 10pt Arial; }
a.diego_content:hover { color: #000099; font: 10pt Arial; text-decoration: underline; }
```

---

## 11. Icons & Images

### Navigation Button Images (from rotter.co.il/ccc/)
- `logo1.gif` -- Main site logo (335px wide in header)
- `bg00.gif` -- Header background pattern
- `blue_link_archive.gif` (141x25) -- ארכיון
- `blue_link_shaar.gif` (120x25) -- שער הדולר
- `blue_link_Shaarei.gif` (120x25) -- שערי דעה
- `blue_link_luach2.gif` (120x25) -- לוח שנה
- `blue_link_mivzakim.gif` (111x25) -- מבזקים
- `blue_link_mezeg.gif` (134x25) -- מזג אוויר
- `blue_link_home.gif` (147x25) -- עמוד הבית
- `blue_link_takanon.gif` (120x25) -- תקנון
- `blue_link_chat.gif` (134x25) -- מגזין
- `blue_links_bar_right.gif` (71x25) -- Right end cap
- `blue_back_search.gif` -- Blue gradient background
- `orange_link_scoops.gif` (195x24) -- סקופים
- `orange_link_scoopsb.gif` (166x24) -- כותרות הסקופים
- `rotter_enews.png` (187x24) -- English News
- `IndexButton.png` (116x24) -- אינדקס
- `BizButton.png` (197x24) -- פרו עסקי
- `orange_link_downloads.gif` (187x24) -- תודות
- `orange_link_rss.gif` (116x24) -- RSS
- `orange_link_skarim.gif` (197x24) -- סקרים
- `orange_link_bar_right.gif` (71x24) -- Right end cap
- `orange_link_gil.gif` (195x24) -- צ'אט
- `trans.gif` -- Transparent spacer pixel

### Forum Icons (from rotter.net/forum/Images/)
- `logo_012b.gif` -- Forum logo
- `spacer.gif` -- Transparent spacer
- `icon_general.gif` -- Normal thread icon
- `hot_icon_general.gif` -- Hot thread icon
- `hot_icon_news.gif` -- Hot news indicator (next to view count)
- `new_icon_general.gif` (16x16) -- New thread icon (forum list page)
- `new_icon_fire.gif` (16x16) -- Fire/alert icon (forum list page)
- `new_icon_camera.gif` (16x16) -- Camera/media icon
- `message.gif` -- Reply tree: top-level message
- `reply_message.gif` -- Reply tree: nested reply
- `expand_threads.gif` -- Threaded view toggle
- `dir.gif` -- Breadcrumb arrow
- `gobk.gif` -- "Go back" button
- `goprev.gif` -- Previous thread
- `gonext.gif` -- Next thread
- `login.gif` (33x33) -- Login button
- `help.gif` (33x33) -- Help button
- `search.gif` (33x33) -- Search button
- `post.gif` (33x33) -- New post button
- `response.gif` -- Reply button
- `all.gif` -- View all replies
- `edit.gif` -- Edit post
- `up.gif` -- Upvote/bump
- `mesg.gif` -- Send private message
- `profile_small.gif` -- View profile
- `mesg_add_buddy.gif` -- Add to buddy list
- `kartis.gif` -- Business card
- `ip.gif` -- View IP
- `bookmark.gif` -- Add bookmark
- `printer_friendly.gif` -- Printer friendly version
- `subscribe_thread.gif` -- Subscribe to thread
- `reportthread.png` -- Report thread
- `blueline.gif` -- Decorative line
- `1_star.gif` through `5_star.gif` -- User rating stars
- `manager_icon.gif` -- Forum manager badge
- `moderator_icon.gif` -- Deputy manager badge
- `supervisor_icon.gif` -- Supervisor badge
- `report_iconx.gif` -- Online journalist badge
- `team_iconx.gif` -- Commendation badge
- `oranis/icon_star.gif` -- Star icon for lobby link

### Breaking News Decorations (from rotter.net/ccc/)
- `bl_l.gif` (8x28) -- Left tab corner
- `bl_t_bg.gif` -- Tab background
- `bl_rr.gif` (66x28) -- Right tab transition
- `bl_rr_bg.gif` -- Right bar background
- `bl_right.gif` (12x28) -- Right end
- `fil.jpg` (1x28) -- Filler
- `r1.gif` -- Blog section header background
- `bottom3.gif` (250px) -- Bottom decorative element

### News Page Logo
- `https://rotter.net/news/logo1.gif` -- News page logo (290px)

### OG/Social Image
- `https://rotter.net/ccc/rotter-600x315.jpg` -- Open Graph image

---

## 12. JavaScript Functionality

### Tooltip System (Forum Pages)
- Global variables: `Ex`, `Ey`, `topColor="#7D92A9"`, `subColor="#e6f2ff"`
- `EnterContent(layerName, TTitle, TContent)` -- builds tooltip HTML
- `MoveToolTip(layerName, e)` -- positions tooltip at cursor + 15px offset
- `Activate()` / `deActivate()` -- toggles tooltip visibility
- `overhere(e)` -- mousemove handler

### Dropdown Menu System (All Pages)
- `ShowDiv1(obj, arrow, right, index)` -- shows dropdown, calculates position
- `HideDiv1(obj, index)` -- hides dropdown
- Uses `document.all` (IE-specific, but works in modern browsers)
- Position calculated from `document.body.clientWidth - arrow.offsetLeft`

### Cookie Management (News Page)
- `createCookie(name, value, days)`
- `readCookie(name)`
- `eraseCookie(name)`
- Used for mobile redirect suppression ("NoNewsMobile" cookie)

### Forum JS (dcf.js)
- `check_cookie(cookie_name)` -- checks user login status
- Controls conditional display of bookmark, subscribe buttons
- `makeRemote(url)` / `makeRemotets(url, name)` -- opens popup windows
- `seenews(url)` -- opens news archive in popup (700x800)
- `tel5(url)` -- opens popup (700x300)
- `updatePropertyDisplay('0')` -- toggles quick reply form

### A/B Testing
```javascript
window.dataLayer = window.dataLayer || [];
dataLayer.push({
    event: 'experience_impression',
    experiment: '20240805',
    group: 'old'
});
```
- References `https://rotter.net/newsite/oldBtn.js` -- suggests a new site version exists
- Users are tagged as "old" group in the experiment

### Auto-Homepage Setting (Homepage)
```javascript
onclick="this.style.behavior='url(#default#homepage)'; this.setHomePage('http://rotter.net');"
```
- IE-specific homepage setting behavior

---

## 13. Mobile Handling

### Detection Method
JavaScript user-agent sniffing on each page:
```javascript
if (navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
) {
    location.replace("MOBILE_URL");
}
```

### Mobile URLs
- Homepage: No redirect (same page served)
- News: `https://rotter.net/mobile/news.php` (with `?nws=1` param)
- English news: `https://rotter.net/mobile/enews.php`
- Forum list: `https://rotter.net/mobile/headlines.php`
- Thread pages: `https://rotter.net/mobile/viewmobile.php?forum=scoops1&thread=THREADID`
  (declared via `<link rel="alternate" media="only screen and (max-width: 640px)">`)

### Mobile Cookie Override
News page checks for "NoNewsMobile" cookie. If present, shows link "לאתר המבזקים המותאם" instead of redirecting.

### Mobile vs Desktop
When fetched with iPhone user-agent, the homepage returns **identical HTML** to desktop (no server-side detection for homepage). Redirect happens client-side via JavaScript.

---

## 14. Ad Placements

### Google DFP (DoubleClick) Slots
| Slot Name | Dimensions | Page |
|-----------|-----------|------|
| Main_Page_Below_Header | 970x90, 970x250 | Homepage |
| Main_Page_Left_Cube | 250x300 | Homepage |
| Main_Page_Center_Pos2 | 450x300 | Homepage |
| Main_Page_Right_Cube | 300x600, 300x250 | Homepage |
| Main_Right_Margin | 160x600, 300x600 | Homepage (>1400px) |
| Forum_Top_Leaderboard | 970x90 | Forum |
| Forum_Logo_Line | 600x80, 728x90, 970x90 | Forum |
| Forum_Below_Forum_Leaderboard | 970x250 | Forum |
| Forum_Inside_Content | 300x250 | Forum |
| Threads_Top_Leaderboard | 970x90, 970x250 | Thread |
| Threads_Third_Leaderboard | 970x250 | Thread |
| Threads_Near_Content | 300x600 | Thread |
| Threads_Below_Main_Content | 336x280, 300x250 | Thread |
| Threads_Bottom | 600x300, 300x600, 970x250 | Thread |
| Mivzakim_Logo_Line | 728x90, 970x90 | News |
| Mivzakim_Side_Skyscraper | 336x280, 300x600, 300x250 | News |
| Mivzakim_Below_Skira_Leaderboard | 970x250, 500x300 | News |
| List_Forum_Logo_Line | varies | Forum List |
| List_Forum_Right_Skyscraper_Pos1 | varies | Forum List |

### Responsive Ad Sizing
```javascript
var TopSizeMap = googletag.sizeMapping().
  addSize([1900, 1070], [970, 250]).
  addSize([992, 0], [970, 90]).
  addSize([0, 0], [970, 250]).
  build();
```

### Taboola Integration
- Homepage: `mode: 'text-links-b'` (Top News Links)
- Forum: `mode: 'thumbnails-text-links-b'` (Scoop Forum Text Links)
- Thread: `mode: 'alternating-thumbnails-a'` (Below Article Thumbnails)
- Forum List: `mode: 'thumbnails-q'` (Below Article Text Links), `mode: 'thumbnails-rr'` (Right Rail)
- Push notifications: `taboola-push-sdk.js`

### Google AdSense
- Homepage center: `data-ad-client="ca-pub-7526246123697304"`, `data-ad-slot="4669837646"` (450x280)

### Other Ad Networks
- `https://adncdn.net/evy3vG4c` (async)
- Booking.com affiliate (data-aid various: 1785244, 1567452, 1565868, 1592808, 1603000)
- `https://hb.trvdp.com/prebid/rotter.net/prebid.js` (prebid header bidding)
- `https://mrb.upapi.net/code?w=5711431416676352&uponit=true` (Uponit)

---

## Summary of Key Layout Dimensions

| Element | Width |
|---------|-------|
| Homepage outer table | 1012px |
| Navigation bars | 975px |
| Homepage right sidebar | ~300px |
| Homepage center column | 450px |
| Forum list right sidebar | 160px |
| Breaking news section | 450px |
| Thread content table | 70% of container |
| Forum toolbar icons | 50px each cell |
| Navigation buttons | Various (71-197px) |
| Ad leaderboard | 970px |

### Key Structural Patterns
1. **Everything is tables** -- no CSS Grid, no Flexbox, minimal div usage
2. **Colors via HTML attributes** -- `bgcolor`, `color` attributes, not CSS
3. **Font tags** -- extensive use of `<font>` instead of CSS
4. **Inline styles** scattered throughout
5. **Image-based navigation** -- buttons are GIF images, not styled HTML
6. **No semantic HTML** -- no `<nav>`, `<article>`, `<section>`, `<header>`, `<footer>`
7. **IE-specific code** -- `document.all`, scrollbar CSS, homepage behavior
8. **Mixed HTTP/HTTPS** -- some resources still referenced via http://
