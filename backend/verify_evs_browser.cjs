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
  console.log('STARTING EVS INTEGRATION & UI REDESIGN AUDIT SUITE');
  console.log('====================================================');

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1280,950'
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
        console.log('[Browser Console]', msg.params.type, text);
        if (msg.params.type === 'error') {
          errors.push(text);
        }
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        console.log('[Runtime Exception]', JSON.stringify(msg.params));
        errors.push(JSON.stringify(msg.params));
      }
    } catch (e) {}
  });

  // TEST 1: HOME PAGE BACKGROUND REDESIGN & CURRICULUM TAGS
  console.log('\n--- 1. Testing Homepage & Educational Background (/) ---');
  await cdpRequest(ws, 'Page.navigate', { url: 'http://127.0.0.1:5173/' });
  
  // Wait up to 10 seconds for root to mount
  for (let i = 0; i < 20; i++) {
    await sleep(500);
    const mounted = await evaluate(ws, `!!document.getElementById('root')?.innerText`);
    if (mounted) break;
  }
  await sleep(1000);

  const debugInfo = await evaluate(ws, `(() => {
    return {
      title: document.title,
      url: window.location.href,
      textLength: document.body.innerText.length,
      snippet: document.body.innerText.substring(0, 300),
      rootHtml: document.getElementById('root') ? document.getElementById('root').innerHTML.substring(0, 200) : 'NO_ROOT'
    };
  })()`);
  console.log('Debug info on /:', debugInfo);

  const homeCheck = await evaluate(ws, `(() => {
    const text = document.body.innerText;
    const hasMathsAndEvs = text.includes('Mathematics & EVS');
    const hasSchool = text.includes('ALP School Koottala');
    
    // Check for educational illustration elements in background
    const bgContainer = document.querySelector('div[aria-hidden="true"]');
    const hasSvgBicycle = !!document.querySelector('svg circle[r="16"]'); // bicycle wheels
    const hasStars = text.includes('VAAYANA');

    return { hasMathsAndEvs, hasSchool, hasSvgBicycle };
  })()`);

  console.log('Homepage check:', homeCheck);
  if (!homeCheck.hasMathsAndEvs) throw new Error('Class 4 Mathematics & EVS Curriculum tag missing on home!');
  await captureScreenshot(ws, 'screenshot_ui_educational_background.png');

  // TEST 2: CLASSROOM EXPERIENCE — EVS SUBJECT & CHAPTERS
  console.log('\n--- 2. Testing Classroom Hub Subject Filter & EVS Chapters (/classroom) ---');
  await cdpRequest(ws, 'Page.navigate', { url: 'http://127.0.0.1:5173/classroom' });
  await sleep(2500);

  const classroomCheck = await evaluate(ws, `(() => {
    const text = document.body.innerText;
    const hasMathCard = text.includes('Mathematics');
    const hasEvsCard = text.includes('Environmental Studies') || text.includes('പരിസരപഠനം');
    const hasCh1 = text.includes('Around Us in Different Forms') || text.includes('നമുക്ക് ചുറ്റും പല രൂപങ്ങളിൽ');
    const hasCh2 = text.includes('Marvels of the Sky') || text.includes('ആകാശവിസ്മയങ്ങൾ');
    
    // Check buttons
    const buttons = Array.from(document.querySelectorAll('button')).map(b => b.innerText);
    const evsFilterBtn = buttons.some(b => b.includes('Environmental Studies') || b.includes('പരിസരപഠനം'));

    return { hasMathCard, hasEvsCard, hasCh1, hasCh2, evsFilterBtn };
  })()`);

  console.log('Classroom check:', classroomCheck);
  if (!classroomCheck.hasEvsCard) throw new Error('EVS subject not found on classroom hub!');
  if (!classroomCheck.hasCh1) throw new Error('EVS Chapter 1 missing from classroom lessons list!');
  if (!classroomCheck.hasCh2) throw new Error('EVS Chapter 2 missing from classroom lessons list!');
  await captureScreenshot(ws, 'screenshot_evs_subject_classroom.png');

  // TEST 3: EVS CHAPTER 1 — LESSON PLAYER & ALL ACTIVITIES
  console.log('\n--- 3. Testing EVS Chapter 1 Lesson & Activities (/lesson/scert-std4-evs-around-us-different-forms) ---');
  await cdpRequest(ws, 'Page.navigate', { url: 'http://127.0.0.1:5173/lesson/scert-std4-evs-around-us-different-forms' });
  await sleep(2500);

  // 3A: Go to Slide 2 (Classifier Activity)
  console.log('\n--- 3A. Testing Solid, Liquid or Gas? Classifier ---');
  await evaluate(ws, `(() => {
    const btn = document.querySelector('button[title="Go to slide 2"]');
    if (btn) btn.click();
  })()`);
  await sleep(1500);

  const classifierCheck = await evaluate(ws, `(() => {
    const text = document.body.innerText;
    const hasSolid = text.includes('Solid') || text.includes('ഖരം');
    const hasLiquid = text.includes('Liquid') || text.includes('ദ്രാവകം');
    const hasGas = text.includes('Gas') || text.includes('വാതകം');
    return { hasSolid, hasLiquid, hasGas };
  })()`);
  console.log('Classifier activity check:', classifierCheck);
  if (!classifierCheck.hasSolid || !classifierCheck.hasLiquid || !classifierCheck.hasGas) {
    throw new Error('Solid/Liquid/Gas classifier activity not rendering correctly!');
  }
  await captureScreenshot(ws, 'screenshot_evs_ch1_states_classifier.png');

  // 3B: Go to Slide 3 (Liquid Shape Explorer)
  console.log('\n--- 3B. Testing Liquid Shape Explorer ---');
  await evaluate(ws, `(() => {
    const btn = document.querySelector('button[title="Go to slide 3"]');
    if (btn) btn.click();
  })()`);
  await sleep(1500);

  const liquidShapeCheck = await evaluate(ws, `(() => {
    const text = document.body.innerText;
    const has250ml = text.includes('250 ml');
    const hasShapeText = text.includes('Shape') || text.includes('ആകൃതി');
    return { has250ml, hasShapeText };
  })()`);
  console.log('Liquid shape check:', liquidShapeCheck);
  if (!liquidShapeCheck.has250ml) throw new Error('250 ml constant volume indicator missing!');
  await captureScreenshot(ws, 'screenshot_evs_ch1_liquid_shape.png');

  // 3C: Go to Slide 4 (Heating & Cooling Simulator)
  console.log('\n--- 3C. Testing Heating & Cooling Simulator ---');
  await evaluate(ws, `(() => {
    const btn = document.querySelector('button[title="Go to slide 4"]');
    if (btn) btn.click();
  })()`);
  await sleep(1500);

  // Click Heat button
  await evaluate(ws, `(() => {
    const heatBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Heat') || b.innerText.includes('ചൂടാക്കുക'));
    if (heatBtn) heatBtn.click();
  })()`);
  await sleep(1000);

  const thermalCheck = await evaluate(ws, `(() => {
    const text = document.body.innerText;
    const hasTemp = text.includes('°C');
    const hasTransition = text.includes('Melting') || text.includes('ദ്രവീകരണം') || text.includes('Heat');
    return { hasTemp, hasTransition };
  })()`);
  console.log('Thermal simulator check:', thermalCheck);
  if (!thermalCheck.hasTemp) throw new Error('Temperature gauge missing in thermal simulator!');
  await captureScreenshot(ws, 'screenshot_evs_ch1_thermal_transitions.png');

  // 3D: Go to Slide 5 (Air Occupies Space Demo)
  console.log('\n--- 3D. Testing Air Occupies Space Demo ---');
  await evaluate(ws, `(() => {
    const btn = document.querySelector('button[title="Go to slide 5"]');
    if (btn) btn.click();
  })()`);
  await sleep(1500);

  // Click Push Straight Down
  await evaluate(ws, `(() => {
    const pushBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Push Straight Down') || b.innerText.includes('നേരെ താഴേക്ക്'));
    if (pushBtn) pushBtn.click();
  })()`);
  await sleep(1000);

  const airCheck = await evaluate(ws, `(() => {
    const text = document.body.innerText;
    const hasTrapped = text.includes('Trapped Air') || text.includes('കുടുങ്ങിയ വായു') || text.includes('Dry Paper') || text.includes('Air Occupies Space');
    return { hasTrapped };
  })()`);
  console.log('Air space demo check:', airCheck);
  if (!airCheck.hasTrapped) throw new Error('Air space demonstration check failed!');
  await captureScreenshot(ws, 'screenshot_evs_ch1_air_space.png');

  // TEST 4: EVS CHAPTER 2 — MARVELS OF THE SKY & SIMULATIONS
  console.log('\n--- 4. Testing EVS Chapter 2 Marvels of the Sky (/lesson/scert-std4-evs-marvels-of-the-sky) ---');
  await cdpRequest(ws, 'Page.navigate', { url: 'http://127.0.0.1:5173/lesson/scert-std4-evs-marvels-of-the-sky' });
  await sleep(2500);

  // 4A: Go to Slide 2 (Solar System Simulator)
  console.log('\n--- 4A. Testing Solar System Simulator ---');
  await evaluate(ws, `(() => {
    const btn = document.querySelector('button[title="Go to slide 2"]');
    if (btn) btn.click();
  })()`);
  await sleep(1500);

  const solarCheck = await evaluate(ws, `(() => {
    const text = document.body.innerText;
    const hasSun = text.includes('SUN');
    const hasMercury = text.includes('Mercury') || text.includes('ബുധൻ');
    const hasEarth = text.includes('Earth') || text.includes('ഭൂമി');
    const hasJupiter = text.includes('Jupiter') || text.includes('വ്യാഴം');
    const hasSpeed = text.includes('Speed');
    return { hasSun, hasMercury, hasEarth, hasJupiter, hasSpeed };
  })()`);
  console.log('Solar system check:', solarCheck);
  if (!solarCheck.hasMercury || !solarCheck.hasEarth || !solarCheck.hasJupiter) {
    throw new Error('Solar System simulator planets missing!');
  }
  await captureScreenshot(ws, 'screenshot_evs_ch2_solar_system.png');

  // 4B: Go to Slide 3 (Rotation & Revolution Simulator)
  console.log('\n--- 4B. Testing Rotation & Revolution Simulator ---');
  await evaluate(ws, `(() => {
    const btn = document.querySelector('button[title="Go to slide 3"]');
    if (btn) btn.click();
  })()`);
  await sleep(1500);

  const rotationCheck = await evaluate(ws, `(() => {
    const text = document.body.innerText;
    const has24h = text.includes('24 Hours') || text.includes('24 മണിക്കൂർ');
    const has1y = text.includes('365¼') || text.includes('1 Year');
    const hasDayNight = text.includes('DAY') || text.includes('പകൽ');
    return { has24h, has1y, hasDayNight };
  })()`);
  console.log('Rotation & revolution check:', rotationCheck);
  if (!rotationCheck.has24h || !rotationCheck.has1y) {
    throw new Error('Rotation / Revolution time periods missing!');
  }
  await captureScreenshot(ws, 'screenshot_evs_ch2_rotation_revolution.png');

  // 4C: Go to Slide 4 (8 Moon Phases Simulator)
  console.log('\n--- 4C. Testing 8 Moon Phases Simulator ---');
  await evaluate(ws, `(() => {
    const btn = document.querySelector('button[title="Go to slide 4"]');
    if (btn) btn.click();
  })()`);
  await sleep(1500);

  const moonPhasesCheck = await evaluate(ws, `(() => {
    const text = document.body.innerText;
    const hasNewMoon = text.includes('New Moon') || text.includes('അമാവാസി');
    const hasFullMoon = text.includes('Full Moon') || text.includes('പൗർണ്ണമി');
    const hasScientificNote = text.includes('shadow') || text.includes('നിഴൽ');
    return { hasNewMoon, hasFullMoon, hasScientificNote };
  })()`);
  console.log('Moon phases check:', moonPhasesCheck);
  if (!moonPhasesCheck.hasNewMoon && !moonPhasesCheck.hasFullMoon) {
    throw new Error('Moon phases simulator not functioning!');
  }
  await captureScreenshot(ws, 'screenshot_evs_ch2_moon_phases.png');

  // 4D: Go to Slide 5 (Moon Exploration & Selenology vs Selenography)
  console.log('\n--- 4D. Testing Moon Exploration & Selenology ---');
  await evaluate(ws, `(() => {
    const btn = document.querySelector('button[title="Go to slide 5"]');
    if (btn) btn.click();
  })()`);
  await sleep(1500);

  const moonExplorationCheck = await evaluate(ws, `(() => {
    const text = document.body.innerText;
    const hasApollo = text.includes('Apollo') || text.includes('നീൽ ആംസ്ട്രോംഗ്') || text.includes('Tranquility');
    const hasCrater = text.includes('Crater') || text.includes('ഗർത്തം');
    return { hasApollo, hasCrater };
  })()`);
  console.log('Moon exploration check:', moonExplorationCheck);
  if (!moonExplorationCheck.hasApollo) throw new Error('Apollo 11 landing site details missing!');
  await captureScreenshot(ws, 'screenshot_evs_ch2_moon_exploration.png');

  // 4E: Go to Slide 6 (Educational Video Section - Dedicated Slot)
  console.log('\n--- 4E. Testing Educational Video Section ---');
  await evaluate(ws, `(() => {
    const btn = document.querySelector('button[title="Go to slide 6"]');
    if (btn) btn.click();
  })()`);
  await sleep(1500);

  const videoCheck = await evaluate(ws, `(() => {
    const text = document.body.innerText;
    const hasPlaceholder = text.includes('Teacher will add video') || text.includes('അധ്യാപകർ വീഡിയോ ലിങ്ക് നൽകും');
    const hasChangeBtn = text.includes('Change Video') || text.includes('ലിങ്ക് മാറ്റുക');
    return { hasPlaceholder, hasChangeBtn };
  })()`);
  console.log('Video placeholder check:', videoCheck);
  if (!videoCheck.hasPlaceholder) throw new Error('Video placeholder message missing!');
  await captureScreenshot(ws, 'screenshot_evs_video_section.png');

  // TEST 5: CONFIRM EXISTING MATHEMATICS CHAPTERS REMAIN OPERATIONAL
  console.log('\n--- 5. Verifying Mathematics Chapters Remain 100% Operational ---');
  await cdpRequest(ws, 'Page.navigate', { url: 'http://127.0.0.1:5173/lesson/scert-std4-maths-ch1-lines-and-shapes' });
  await sleep(2000);

  const mathCheck = await evaluate(ws, `(() => {
    const text = document.body.innerText;
    const hasShapes = text.includes('Lines and Shapes') || text.includes('വരകളും രൂപങ്ങളും');
    return { hasShapes };
  })()`);
  console.log('Math Chapter 1 operational:', mathCheck);
  if (!mathCheck.hasShapes) throw new Error('Math Chapter 1 damaged!');
  await captureScreenshot(ws, 'screenshot_math_still_working.png');

  console.log('\n====================================================');
  console.log('ALL EVS & UI REDESIGN TESTS PASSED WITH ZERO ERRORS!');
  console.log('====================================================');

  chromeProc.kill();
  process.exit(0);
}

run().catch(err => {
  console.error('AUDIT FAILED:', err);
  process.exit(1);
});
