import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

const dist = join(dirname(fileURLToPath(import.meta.url)), 'dist');

function walk(d, fn) {
  for (const e of readdirSync(d)) {
    const f = join(d, e);
    if (statSync(f).isDirectory()) walk(f, fn);
    else if (extname(f) === '.html') fn(f);
  }
}

walk(dist, (file) => {
  let c = readFileSync(file, 'utf-8');
  
  // 计算该页面相对于 dist 根目录的深度
  const rel = relative(dist, dirname(file));
  const depth = rel === '' ? 0 : rel.split(/[\\/]/).length;
  const prefix = depth === 0 ? './' : '../'.repeat(depth);
  
  // 1. 移除已有 base，插入新的
  c = c.replace(/<base[^>]*>/g, '');
  c = c.replace('<head>', `<head><base href="${prefix}">`);
  
  // 2. 所有 href="/xxx" → href="./xxx" 并指向 index.html
  c = c.replace(/href="\/([^"]+)"/g, (m, p) => {
    if (p.startsWith('http') || p.startsWith('#') || p.startsWith('./') || p.startsWith('../')) return m;
    // 如果是目录型路径（无扩展名且不以 / 结尾），指向 index.html
    const hasExt = /\.[a-z]{2,4}$/i.test(p);
    const endsWithSlash = p.endsWith('/');
    if (!hasExt) {
      const url = endsWithSlash ? p : p + '/';
      return `href="./${url}index.html"`;
    }
    return `href="./${p}"`;
  });
  
  // 3. 所有 src="/xxx" → src="./xxx"
  c = c.replace(/src="\/([^"]+)"/g, (m, p) => {
    if (p.startsWith('http')) return m;
    return `src="./${p}"`;
  });
  
  // 4. 修复 CSS url()
  c = c.replace(/url\(\//g, 'url(./');
  
  // 5. 相对目录链接也指向 index.html
  //    ./posts/ → ./posts/index.html     ./about/ → ./about/index.html
  //    ./ 裸根路径也转为 ./index.html
  c = c.replace(/href="\.\/([^"]*\/)"(?!\/)/g, (m, p) => {
    if (p.endsWith('index.html/') || p.endsWith('index.html')) return m;
    return `href="./${p}index.html"`;
  });
  c = c.replace(/href="\.\/"/g, 'href="./index.html"');
  
  // 6. 清理畸形路径
  c = c.replace(/href="\/\.\//g, 'href="./');
  c = c.replace(/src="\/\.\//g, 'src="./');
  c = c.replace(/\.\/\.\//g, './');
  
  writeFileSync(file, c);
});

console.log('✅ 路径修复完成（含 base 标签）');
