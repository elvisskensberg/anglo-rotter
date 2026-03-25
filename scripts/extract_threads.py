import subprocess, re, html, json, sys

def fetch(url):
    result = subprocess.run(
        ['curl', '-s', '-L', '-H', 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', url],
        capture_output=True
    )
    try:
        return result.stdout.decode('windows-1255', errors='replace')
    except:
        return result.stdout.decode('utf-8', errors='replace')

def parse_thread(content, thread_id, forum):
    data = {'thread_id': thread_id, 'forum': forum, 'posts': []}

    title_m = re.search(r'<TITLE>(.*?)</TITLE>', content, re.IGNORECASE)
    data['title'] = html.unescape(title_m.group(1)).replace(' - חדשות רוטר', '') if title_m else ''

    desc_m = re.search(r'<meta name="description" content="(.*?)"', content, re.IGNORECASE)
    data['description'] = html.unescape(desc_m.group(1)) if desc_m else ''

    mobile_m = re.search(r'viewmobile\.php\?forum=(\w+)&thread=(\d+)', content)
    if mobile_m:
        data['mobile_url'] = f'https://rotter.net/mobile/viewmobile.php?forum={mobile_m.group(1)}&thread={mobile_m.group(2)}'

    data['canonical_url'] = f'https://rotter.net/forum/{forum}/{thread_id}.shtml'

    anchors = list(re.finditer(r'<a name="(\d+)"><b>(.*?)</b></a>', content, re.DOTALL))
    data['total_posts'] = len(anchors)

    for i, anchor in enumerate(anchors):
        start = anchor.start()
        end = anchors[i+1].start() if i+1 < len(anchors) else min(start + 15000, len(content))
        block = content[start:end]

        author = re.sub(r'<[^>]+>', '', anchor.group(2)).strip()

        post = {
            'post_number': int(anchor.group(1)),
            'author': html.unescape(author),
        }

        m = re.search(r'חבר מתאריך ([^<\n]+)', block)
        if m: post['member_since'] = m.group(1).strip()

        m = re.search(r'([\d,]+)\s*הודעות', block)
        if m: post['author_post_count'] = m.group(1)

        m = re.search(r'([\d,]+)\s*מדרגים\s*,\s*([\d,]+)\s*נקודות', block)
        if m:
            post['raters'] = m.group(1)
            post['rating_points'] = m.group(2)

        if 'ראה משוב' in block:
            post['has_feedback'] = True

        heb_m = re.search(r'(יום\s+\S+\s+\S+\s+\S+\s+\S+)', block)
        if heb_m: post['hebrew_date'] = heb_m.group(1).strip()

        td_m = re.search(r'(\d{1,2}:\d{2})\s+(\d{1,2}\.\d{1,2}\.\d{2,4})', block)
        if td_m:
            post['time'] = td_m.group(1)
            post['date'] = td_m.group(2)

        m = re.search(r'בתגובה להודעה מספר (\d+)', block)
        if m: post['reply_to'] = int(m.group(1))

        ext_links = re.findall(r'href="(https?://(?!rotter\.net)[^"]+)"', block)
        ext_links = [l for l in ext_links if not any(x in l for x in ['google', 'facebook.com', 'taboola', 'connect.', 'upapi', 'fbevents'])]
        if ext_links: post['external_links'] = ext_links

        images = re.findall(r'<img[^>]+src="(https?://[^"]+)"', block, re.IGNORECASE)
        images = [img for img in images if not any(x in img for x in ['spacer', 'forum/Images', 'rotter.net/ccc', 'googletag', 'facebook', 'dc_icons', 'team_icon'])]
        if images: post['images'] = images

        text_block = re.sub(r'<script[^>]*>.*?</script>', '', block, flags=re.DOTALL|re.IGNORECASE)
        text_block = re.sub(r'<style[^>]*>.*?</style>', '', text_block, flags=re.DOTALL|re.IGNORECASE)
        text = re.sub(r'<[^>]+>', ' ', text_block)
        text = html.unescape(text)
        text = re.sub(r'&nbsp;', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()

        arrow_idx = text.find('-->')
        if arrow_idx > 0:
            msg = text[arrow_idx+3:].strip()
        else:
            msg = text

        for boilerplate in ['תגובה עם ציטוט', 'תגובה מהירה למכתב', 'מכתב זה והנלווה', 'למנהלי הפורום']:
            bp_idx = msg.find(boilerplate)
            if bp_idx > 0:
                msg = msg[:bp_idx].strip()
                break

        if 'reply_to' in post:
            rt_m = re.search(r'בתגובה להודעה מספר \d+\s*', msg)
            if rt_m:
                after = msg[rt_m.end():].strip()
                before = msg[:rt_m.start()].strip()
                msg = (before + ' ' + after).strip() if before else after

        post['content'] = msg[:2000]
        data['posts'].append(post)

    return data

all_data = {}

scoops = {
    '940165': 'https://rotter.net/forum/scoops1/940165.shtml',
    '940171': 'https://rotter.net/forum/scoops1/940171.shtml',
    '940137': 'https://rotter.net/forum/scoops1/940137.shtml',
    '940099': 'https://rotter.net/forum/scoops1/940099.shtml',
    '940128': 'https://rotter.net/forum/scoops1/940128.shtml',
}

for tid, url in scoops.items():
    print(f'Fetching scoops1/{tid}...', file=sys.stderr)
    content = fetch(url)
    data = parse_thread(content, tid, 'scoops1')
    all_data[f'scoops1_{tid}'] = data

print('Fetching politics/39725...', file=sys.stderr)
content = fetch('https://rotter.net/forum/politics/39725.shtml')
all_data['politics_39725'] = parse_thread(content, '39725', 'politics')

with open('C:/Code/MultiRotter/rotter_threads_complete.json', 'w', encoding='utf-8') as f:
    json.dump(all_data, f, ensure_ascii=False, indent=2)

# Print full output
for key, data in all_data.items():
    print('=' * 80)
    print(f'THREAD: {data["title"]}')
    print(f'Forum: {data["forum"]} | ID: {data["thread_id"]} | Posts: {data["total_posts"]}')
    print(f'URL: {data["canonical_url"]}')
    if data.get('mobile_url'):
        print(f'Mobile: {data["mobile_url"]}')
    if data['description']:
        print(f'Description: {data["description"][:300]}')
    print()

    for post in data['posts']:
        print(f'  --- Post #{post["post_number"]} by "{post["author"]}" ---')
        if post.get('date'):
            print(f'    Date: {post.get("time","")} {post["date"]}')
        if post.get('hebrew_date'):
            print(f'    Hebrew date: {post["hebrew_date"]}')
        if post.get('member_since'):
            print(f'    Member since: {post["member_since"]}')
        if post.get('author_post_count'):
            print(f'    Author post count: {post["author_post_count"]}')
        if post.get('raters'):
            print(f'    Raters: {post["raters"]}, Points: {post["rating_points"]}')
        if post.get('has_feedback'):
            print(f'    Has feedback/rating: Yes')
        if post.get('reply_to') is not None:
            print(f'    Reply to: #{post["reply_to"]}')
        if post.get('external_links'):
            print(f'    Links: {post["external_links"]}')
        if post.get('images'):
            print(f'    Images: {post["images"]}')
        print(f'    CONTENT: {post["content"]}')
        print()
