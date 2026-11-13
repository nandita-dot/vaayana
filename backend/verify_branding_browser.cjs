const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\hp\\.gemini\\antigravity\\brain\\b69ad8b5-d090-4d9d-a80c-037a7fef43de';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function cdpRequest(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1000000);
    const msg = JSON.stringify({ id, method, params });
    const handler = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === id) {
        ws.removeEventListener('message', handler);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(msg);
  });
}

async function evaluate(ws, expression) {
  const res = await cdpRequest(ws, 'Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true
  });
  return res.result ? res.result.value : null;
}

async function captureScreenshot(ws, filename) {
  const res = await cdpRequest(ws, 'Page.captureScreenshot', { format: 'png' });
  const filePath = path.join(ARTIFACT_DIR, filename);
  fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
  console.log(`[Screenshot Saved] ${filePath}`);
  return filePath;
}

async function run() {
  console.log('====================================================');
  console.log('STARTING VAAYANA BRANDING & SCHOOL IDENTITY AUDIT');
  console.log('====================================================');

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1280,900'
  ]);

  await sleep(1500);

  const targets = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    }).on('error', reject);
  });

  const pageTarget = targets.find(t => t.type === 'page');
  if (!pageTarget) throw new Error('No page target found');

  const wsUrl = pageTarget.webSocketDebuggerUrl;
  console.log('Connected to Chrome Target:', pageTarget.title, wsUrl);

  const WebSocketClient = globalThis.WebSocket || require(path.join(__dirname, '../frontend/node_modules/ws'));
  const ws = new WebSocketClient(wsUrl);

  await new Promise((resolve) => {
    if (ws.readyState === 1) return resolve();
    ws.addEventListener('open', resolve, { once: true });
  });

  await cdpRequest(ws, 'Page.enable');
  await cdpRequest(ws, 'Runtime.enable');

  const errors = [];
  ws.addEventListener('message', (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args.map(a => a.value || JSON.stringify(a)).join(' ');
        if (msg.params.type === 'error') errors.push(text);
      }
    } catch (e) {}
  });

  // TEST 1: HOMEPAGE BRANDING & NAVBAR
  console.log('\n--- 1. Testing Homepage Hero & Navbar Branding (/) ---');
  await cdpRequest(ws, 'Page.navigate', { url: 'http://127.0.0.1:5173/' });
  await sleep(2500);

  const homepageCheck = await evaluate(ws, `(() => {
    const text = document.body.innerText;
    const heroSchool = text.includes('ALP School Koottala');
    const heroSchoolMal = text.includes('എ.എൽ.പി സ്കൂൾ കൂട്ടാല');
    
    // Check for BookOpen icon in navbar
    const navLogo = document.querySelector('nav a svg.lucide-book-open');
    const hasNavbarBookIcon = !!navLogo;
    
    // Check app name
    const appName = text.includes('VAAYANA');

    return { heroSchool, heroSchoolMal, hasNavbarBookIcon, appName };
  })()`);

  console.log('Homepage check result:', homepageCheck);
  if (!homepageCheck.heroSchool) throw new Error('ALP School Koottala not found on homepage hero!');
  if (!homepageCheck.heroSchoolMal) throw new Error('Malayalam school name not found on homepage hero!');
  if (!homepageCheck.hasNavbarBookIcon) throw new Error('BookOpen icon not found in Navbar!');
  await captureScreenshot(ws, 'screenshot_branding_homepage.png');

  // TEST 2: FOOTER EXACT ADDRESS AND BRANDING
  console.log('\n--- 2. Testing Footer Branding & Exact School Address ---');
  await evaluate(ws, `window.scrollTo(0, document.body.scrollHeight)`);
  await sleep(1000);

  const footerCheck = await evaluate(ws, `(() => {
    const footer = document.querySelector('footer');
    if (!footer) return { found: false };
    const text = footer.innerText;
    const exactAddress = text.includes('Koottala, Erimayur, Alathur, Palakkad District, Kerala – 678681');
    const schoolName = text.includes('ALP School Koottala');
    const footerBookIcon = !!footer.querySelector('svg.lucide-book-open');
    return { found: true, exactAddress, schoolName, footerBookIcon, textPreview: text.substring(0, 200) };
  })()`);

  console.log('Footer check result:', footerCheck);
  if (!footerCheck.found) throw new Error('Footer element not found!');
  if (!footerCheck.schoolName) throw new Error('ALP School Koottala not found in footer!');
  if (!footerCheck.exactAddress) throw new Error('Exact address "Koottala, Erimayur, Alathur, Palakkad District, Kerala – 678681" not found in footer!');
  if (!footerCheck.footerBookIcon) throw new Error('BookOpen icon not found in footer branding!');
  await captureScreenshot(ws, 'screenshot_branding_footer.png');

  // TEST 3: CLASSROOM HEADER BRANDING
  console.log('\n--- 3. Testing Classroom Header Branding (/classroom) ---');
  await cdpRequest(ws, 'Page.navigate', { url: 'http://127.0.0.1:5173/classroom' });
  await sleep(2000);

  const classroomCheck = await evaluate(ws, `(() => {
    const header = document.querySelector('header');
    if (!header) return { found: false };
    const text = header.innerText;
    const headerBookIcon = !!header.querySelector('svg.lucide-book-open');
    const appTitle = text.includes('VAAYANA') || text.includes('വായന');
    return { found: true, headerBookIcon, appTitle };
  })()`);

  console.log('Classroom header check result:', classroomCheck);
  if (!classroomCheck.headerBookIcon) throw new Error('BookOpen icon not found in Classroom header!');
  await captureScreenshot(ws, 'screenshot_branding_classroom.png');

  // TEST 4: TEACHER STUDIO HEADER BRANDING
  console.log('\n--- 4. Testing Teacher Studio Branding (/teacher) ---');
  await cdpRequest(ws, 'Page.navigate', { url: 'http://127.0.0.1:5173/teacher' });
  await sleep(2000);

  const teacherCheck = await evaluate(ws, `(() => {
    const header = document.querySelector('header');
    if (!header) return { found: false };
    const headerBookIcon = !!header.querySelector('svg.lucide-book-open');
    return { found: true, headerBookIcon };
  })()`);

  console.log('Teacher header check result:', teacherCheck);
  if (!teacherCheck.headerBookIcon) throw new Error('BookOpen icon not found in Teacher Studio header!');
  await captureScreenshot(ws, 'screenshot_branding_teacher.png');

  // TEST 5: FAVICON & SVG CHECKS
  console.log('\n--- 5. Testing Favicon SVG File ---');
  const faviconSvg = fs.readFileSync(path.join(__dirname, '../frontend/public/favicon.svg'), 'utf-8');
  const hasBookGeometry = faviconSvg.includes('<!-- Stylized Open Book Symbol') || faviconSvg.includes('Book Spine');
  console.log('Favicon contains book geometry:', hasBookGeometry);
  if (!hasBookGeometry) throw new Error('Favicon does not contain book geometry!');

  console.log('\nConsole Errors captured during test:', errors);

  console.log('\n====================================================');
  console.log('ALL BRANDING & SCHOOL IDENTITY CHECKS PASSED SUCCESSFULLY!');
  console.log('====================================================');

  chromeProc.kill();
  process.exit(0);
}

run().catch(err => {
  console.error('AUDIT FAILED:', err);
  process.exit(1);
});
