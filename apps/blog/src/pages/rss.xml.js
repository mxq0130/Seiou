const posts = [
  { title: 'Markdown 写作完全指南', slug: 'markdown-guide', excerpt: '掌握 Markdown 的所有语法', date: '2025-01-20' },
  { title: '加密文章示例', slug: 'encrypted-post', excerpt: '这篇文章已被加密', date: '2024-01-15' },
  { title: 'Markdown 扩展功能展示', slug: 'markdown-extended', excerpt: '了解扩展功能', date: '2024-05-01' },
];
const siteUrl = 'https://example.com';
const esc = (s: string) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

export function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>🌸 小破站</title><link>${siteUrl}</link><description>二次元风格个人博客</description><language>zh-CN</language><atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>${posts.map(p => `<item><title>${esc(p.title)}</title><link>${siteUrl}/posts/${p.slug}</link><guid>${siteUrl}/posts/${p.slug}</guid><description>${esc(p.excerpt)}</description><pubDate>${new Date(p.date).toUTCString()}</pubDate></item>`).join('')}</channel></rss>`,
    { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } }
  );
}
