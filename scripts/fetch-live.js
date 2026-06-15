const fs = require('fs'), path = require('path'), http = require('http'), https = require('https');
const BASE = 'http://38.22.90.40';
const HT = 'E:/boke/ht';
const CSS_FILE = '_astro/Layout.DKXi6aB-.css';

function fetch(url) {
  return new Promise((resolve) => {
    http.get(url, {timeout: 15000}, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

async function main() {
  // Copy CSS from static build
  const cssSrc = path.join(HT, CSS_FILE);
  if (!fs.existsSync(cssSrc)) {
    console.log('CSS not found, rebuilding static first...');
    // We need the CSS from static build
  }

  // Fetch all main pages
  const PAGES = ['/', '/posts/', '/archive/', '/links/', '/anime/', '/albums/', '/diary/', '/about/'];
  console.log('Fetching main pages...');
  for (const page of PAGES) {
    process.stdout.write(page + ' ');
    const html = await fetch(BASE + page);
    if (!html) continue;
    const dir = path.join(HT, page === '/' ? '' : page);
    fs.mkdirSync(dir, {recursive: true});
    fs.writeFileSync(path.join(dir, 'index.html'), html);
  }

  // Extract post slugs
  console.log('\nExtracting posts...');
  const postsHtml = fs.readFileSync(path.join(HT, 'posts/index.html'), 'utf-8');
  const slugs = new Set();
  const re = /href="\/posts\/([^"]+)\/"/g;
  let m;
  while ((m = re.exec(postsHtml)) !== null) slugs.add(m[1]);
  console.log('Posts:', slugs.size);

  for (const slug of slugs) {
    const html = await fetch(BASE + '/posts/' + slug + '/');
    if (html) {
      const dir = path.join(HT, 'posts', slug);
      fs.mkdirSync(dir, {recursive: true});
      fs.writeFileSync(path.join(dir, 'index.html'), html);
    }
  }

  // Extract album IDs
  console.log('Fetching albums...');
  const albumsHtml = fs.readFileSync(path.join(HT, 'albums/index.html'), 'utf-8');
  const albumIds = new Set();
  const ar = /href="\/albums\/(\d+)\/"/g;
  while ((m = ar.exec(albumsHtml)) !== null) albumIds.add(m[1]);
  console.log('Albums:', albumIds.size);

  for (const id of albumIds) {
    const html = await fetch(BASE + '/albums/' + id + '/');
    if (html) {
      const dir = path.join(HT, 'albums', id);
      fs.mkdirSync(dir, {recursive: true});
      fs.writeFileSync(path.join(dir, 'index.html'), html);
    }
  }

  // Collect and download all images
  console.log('Collecting images...');
  const imgUrls = new Set();
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir, {withFileTypes: true}).forEach(e => {
      const p = path.join(dir, e.name);
      if (e.isDirectory() && !e.name.startsWith('_') && !e.name.startsWith('.') && e.name !== 'images') walk(p);
      else if (e.name.endsWith('.html')) {
        const html = fs.readFileSync(p, 'utf-8');
        const imre = /src="(https?:\/\/[^"]+\.(jpg|jpeg|png|gif|webp|svg))(\?[^"]*)?"/gi;
        let im;
        while ((im = imre.exec(html)) !== null) imgUrls.add(im[1]);
        const upre = /src="(\/uploads\/[^"]+)"/gi;
        while ((im = upre.exec(html)) !== null) imgUrls.add('http://38.22.90.40' + im[1]);
      }
    });
  }
  walk(HT);
  console.log('Images:', imgUrls.size);

  const imgMap = {};
  let idx = 0;
  for (const url of imgUrls) {
    const ext = (url.match(/\.(\w+)(\?|$)/) || ['', 'jpg'])[1];
    const name = 'img_' + (idx++) + '.' + ext;
    imgMap[url] = name;
    const fp = path.join(HT, 'images', name);
    if (!fs.existsSync(fp)) {
      try {
        await new Promise((resolve) => {
          const mod = url.startsWith('https') ? https : http;
          mod.get(url, {timeout: 15000}, res => {
            const chunks = [];
            res.on('data', c => chunks.push(c));
            res.on('end', () => { fs.writeFileSync(fp, Buffer.concat(chunks)); resolve(); });
          }).on('error', () => resolve());
        });
      } catch (e) { }
    }
  }
  console.log('Downloaded ' + idx + ' images');

  // Fix all paths
  console.log('Fixing paths...');
  const urlKeys = Object.keys(imgMap);

  function fixDir(dir) {
    fs.readdirSync(dir, {withFileTypes: true}).forEach(e => {
      const p = path.join(dir, e.name);
      if (e.isDirectory() && !e.name.startsWith('_') && !e.name.startsWith('.') && e.name !== 'images') {
        fixDir(p);
      } else if (e.name.endsWith('.html')) {
        let h = fs.readFileSync(p, 'utf-8');
        const relPath = path.relative(HT, p);
        const depth = relPath.split(path.sep).length - 1;
        const pre = depth > 0 ? '../'.repeat(depth) : './';

        // Replace image URLs
        for (const url of urlKeys) {
          while (h.includes(url)) h = h.replace(url, 'images/' + imgMap[url]);
        }
        h = h.replace(/src="\/uploads\//g, 'src="images/');

        // Fix CSS if from live (SSR has no _astro CSS)
        if (!h.includes(CSS_FILE)) {
          h = h.replace('</head>', '<link rel="stylesheet" href="' + pre + CSS_FILE + '"></head>');
        } else {
          // Fix existing CSS path
          h = h.replace(/"[^"]*_astro\/Layout[^"]*\.css"/g, '"' + pre + CSS_FILE + '"');
        }

        // Fix favicon/rss
        h = h.replace(/"\/favicon/g, '"' + pre + 'favicon');
        h = h.replace(/"\/rss/g, '"' + pre + 'rss');

        // Fix navigation links
        const navPages = ['posts', 'archive', 'links', 'anime', 'albums', 'diary', 'about', 'search', 'login', 'register', 'announcements'];
        navPages.forEach(page => {
          h = h.replace(new RegExp('href="/' + page + '/"', 'g'), 'href="' + pre + page + '/index.html"');
        });
        h = h.replace(/href="\/"/g, 'href="' + pre + 'index.html"');

        // Fix post detail links
        for (const slug of slugs) {
          h = h.replace(new RegExp('href="/posts/' + slug + '/"', 'g'), 'href="' + pre + 'posts/' + slug + '/index.html"');
        }
        // Fix album detail links
        for (const id of albumIds) {
          h = h.replace(new RegExp('href="/albums/' + id + '/"', 'g'), 'href="' + pre + 'albums/' + id + '/index.html"');
        }

        fs.writeFileSync(p, h);
      }
    });
  }
  fixDir(HT);
  console.log('DONE! All pages fetched, images local, paths fixed.');
}

main().catch(e => console.error(e));
