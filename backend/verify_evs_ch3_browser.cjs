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
  console.log('================================================================');
  console.log('STARTING EVS CHAPTER 3 (DIRECTIONS & HOMELAND) AUDIT SUITE');
  console.log('================================================================');

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1280,950'
  ]);

  await sleep(1500);

  const targets = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9223/json', (res) => {
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
        if (msg.params.type === 'error') {
          console.log('[Browser Error]', text);
          errors.push(text);
        }
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        console.log('[Runtime Exception]', JSON.stringify(msg.params));
        errors.push(JSON.stringify(msg.params));
      }
    } catch (e) {}
  });

  // 1. CLASSROOM EXPERIENCE: CHECK EVS CH 3 PRESENCE
  console.log('\n--- 1. Testing Classroom Experience (/classroom) ---');
  await cdpRequest(ws, 'Page.navigate', { url: 'http://127.0.0.1:5173/classroom' });

  for (let i = 0; i < 20; i++) {
    await sleep(500);
    const mounted = await evaluate(ws, `!!document.getElementById('root')?.innerText`);
    if (mounted) break;
  }
  await sleep(1200);

  const classroomInfo = await evaluate(ws, `(() => {
    const text = document.body.innerText;
    return {
      hasCh3: text.includes('Know the Directions') || text.includes('ദിശകൾ അറിയാം'),
      hasDirectionsCard: text.includes('8-Direction Compass') || text.includes('ദിശാ കോമ്പസ്'),
      hasKeralaCard: text.includes('Kerala Geography') || text.includes('കേരള ഭൂപ്രകൃതി'),
      bodySnippet: text.slice(0, 300)
    };
  })()`);
  console.log('Classroom page detection:', classroomInfo);

  // 2. OPEN EVS CH 3 LESSON SLIDE 1: DIRECTION COMPASS
  console.log('\n--- 2. Testing Chapter 3 Slide 1: Direction Compass (evs_direction_compass) ---');
  await cdpRequest(ws, 'Page.navigate', { url: 'http://127.0.0.1:5173/lesson/scert-std4-evs-directions-homeland' });
  await sleep(2000);

  // Check slide 1 content and interact with compass
  const slide1Info = await evaluate(ws, `(() => {
    const text = document.body.innerText;
    // Click on East direction button if available
    const eastBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('കിഴക്ക്') || b.innerText.includes('East'));
    if (eastBtn) eastBtn.click();
    return {
      title: document.querySelector('h2')?.innerText || '',
      hasCompass: text.includes('Interactive Direction Compass') || text.includes('ദിശാ കോമ്പസ്'),
      foundEastBtn: !!eastBtn
    };
  })()`);
  console.log('Slide 1 Info:', slide1Info);
  await sleep(1000);
  await captureScreenshot(ws, 'screenshot_evs_ch3_direction_compass.png');

  // 3. ADVANCE TO SLIDE 2: VILLAGE NAVIGATION MAP
  console.log('\n--- 3. Testing Chapter 3 Slide 2: Village Navigation Map (evs_village_map) ---');
  await evaluate(ws, `(() => {
    // Click Next Slide button
    const nextBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('അടുത്തത്') || b.innerText.includes('Next') || b.querySelector('svg'));
    const buttons = Array.from(document.querySelectorAll('button'));
    const navNext = buttons.find(b => b.textContent.includes('Next') || b.textContent.includes('അടുത്ത'));
    if (navNext) navNext.click();
  })()`);
  await sleep(1500);

  // Interact with keypad
  await evaluate(ws, `(() => {
    const northBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim().startsWith('N'));
    if (northBtn) northBtn.click();
  })()`);
  await sleep(1000);
  await captureScreenshot(ws, 'screenshot_evs_ch3_village_map.png');

  // 4. ADVANCE TO SLIDE 3: MAGNETIC COMPASS
  console.log('\n--- 4. Testing Chapter 3 Slide 3: Magnetic Compass Demo (evs_magnetic_compass) ---');
  await evaluate(ws, `(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const navNext = buttons.find(b => b.textContent.includes('Next') || b.textContent.includes('അടുത്ത'));
    if (navNext) navNext.click();
  })()`);
  await sleep(1500);

  // Click rotate housing or disturb needle
  await evaluate(ws, `(() => {
    const rotateBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Rotate Housing') || b.innerText.includes('തിരിക്കുക'));
    if (rotateBtn) rotateBtn.click();
  })()`);
  await sleep(1000);
  await captureScreenshot(ws, 'screenshot_evs_ch3_magnetic_compass.png');

  // 5. ADVANCE TO SLIDE 5 (Index 4): MAP SYMBOLS EXPLORER
  console.log('\n--- 5. Testing Chapter 3 Slide 5: Map Symbols Explorer (evs_map_symbols) ---');
  // Jump straight by navigating or clicking next twice
  await evaluate(ws, `(() => {
    // Next slide (to Slide 4: GPS)
    const buttons = Array.from(document.querySelectorAll('button'));
    const navNext = buttons.find(b => b.textContent.includes('Next') || b.textContent.includes('അടുത്ത'));
    if (navNext) navNext.click();
  })()`);
  await sleep(1000);
  await evaluate(ws, `(() => {
    // Next slide (to Slide 5: Map Symbols)
    const buttons = Array.from(document.querySelectorAll('button'));
    const navNext = buttons.find(b => b.textContent.includes('Next') || b.textContent.includes('അടുത്ത'));
    if (navNext) navNext.click();
  })()`);
  await sleep(1500);

  // Click hospital or railway symbol in legend
  await evaluate(ws, `(() => {
    const hospBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('ആശുപത്രി') || b.innerText.includes('Hospital'));
    if (hospBtn) hospBtn.click();
  })()`);
  await sleep(1000);
  await captureScreenshot(ws, 'screenshot_evs_ch3_map_symbols.png');

  // 6. ADVANCE TO SLIDE 6: KERALA GEOGRAPHY & RIVERS
  console.log('\n--- 6. Testing Chapter 3 Slide 6: Kerala Geography & 44 Rivers (evs_kerala_geography) ---');
  await evaluate(ws, `(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const navNext = buttons.find(b => b.textContent.includes('Next') || b.textContent.includes('അടുത്ത'));
    if (navNext) navNext.click();
  })()`);
  await sleep(1500);

  // Click "3 East-Flowing Rivers" tab
  await evaluate(ws, `(() => {
    const eastTab = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('East-Flowing') || b.innerText.includes('3 East'));
    if (eastTab) eastTab.click();
  })()`);
  await sleep(1000);
  await captureScreenshot(ws, 'screenshot_evs_ch3_kerala_geography.png');

  // 7. ADVANCE TO SLIDE 7: BACKWATERS & LAKES
  console.log('\n--- 7. Testing Chapter 3 Slide 7: Backwaters & Lakes Explorer (evs_backwaters_explorer) ---');
  await evaluate(ws, `(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const navNext = buttons.find(b => b.textContent.includes('Next') || b.textContent.includes('അടുത്ത'));
    if (navNext) navNext.click();
  })()`);
  await sleep(1500);

  // Click Ashtamudi or Sorter tab
  await evaluate(ws, `(() => {
    const ashtamudiBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('അഷ്ടമുടി') || b.innerText.includes('Ashtamudi'));
    if (ashtamudiBtn) ashtamudiBtn.click();
  })()`);
  await sleep(1000);
  await captureScreenshot(ws, 'screenshot_evs_ch3_backwaters.png');

  // 8. TEST EDUCATIONAL VIDEO INTEGRATION & PLACEHOLDER
  console.log('\n--- 8. Testing Educational Video Placeholder for Chapter 3 ---');
  // Open the video modal or verify educational video rendering in classroom
  await cdpRequest(ws, 'Page.navigate', { url: 'http://127.0.0.1:5173/classroom' });
  await sleep(1500);

  // Check video section or launch video modal
  await evaluate(ws, `(() => {
    const videoBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Watch Video') || b.innerText.includes('വീഡിയോ'));
    if (videoBtn) videoBtn.click();
  })()`);
  await sleep(1000);
  await captureScreenshot(ws, 'screenshot_evs_ch3_video.png');

  // 9. VERIFY MATHEMATICS CONTINUES WORKING
  console.log('\n--- 9. Verifying Mathematics Chapters are completely intact ---');
  await cdpRequest(ws, 'Page.navigate', { url: 'http://127.0.0.1:5173/lesson/scert-std4-maths-ch1-lines-and-shapes' });
  await sleep(2000);

  const mathStatus = await evaluate(ws, `(() => {
    return {
      title: document.querySelector('h2')?.innerText || '',
      bodyText: document.body.innerText.slice(0, 150)
    };
  })()`);
  console.log('Maths status:', mathStatus);
  await captureScreenshot(ws, 'screenshot_evs_ch3_math_intact.png');

  console.log('\nAudit complete! Total console errors captured:', errors.length);
  if (errors.length > 0) {
    console.log('Errors:', errors);
  }

  try {
    ws.close();
    chromeProc.kill();
  } catch (e) {}

  process.exit(errors.length > 0 ? 1 : 0);
}

run().catch(err => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});

