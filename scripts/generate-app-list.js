const fs = require('fs');
const path = require('path');

const APPS_DIR = path.join(__dirname, '../apps');
const OUTPUT_FILE = path.join(__dirname, '../apps.json');
const PACKED_DIR = path.join(__dirname, '../packed');

// Ensure packed directory exists (optional, but good for linking)
if (!fs.existsSync(PACKED_DIR)) {
    fs.mkdirSync(PACKED_DIR, { recursive: true });
}

function parseAppInfo(content) {
    const lines = content.split('\n');
    const appInfo = {};

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith('#')) continue;

        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
            const value = valueParts.join('=').trim();
            appInfo[key.trim()] = value;
        }
    }
    return appInfo;
}

function getAppIcon(appInfo) {
    const name = (appInfo.name || '').toLowerCase();
    // Icon mapping based on app name (reusing logic from server.js for consistency)
    const iconMap = {
        'pong': '🏓',
        'tic tac toe': '⭕',
        'tictactoe': '⭕',
        'whiteboard': '🎨',
        'video test': '📹',
        'gate control': '🚪',
        'auth': '🔐',
        'mini apps test': '🧪',
        'ai assistant': '🤖',
        'doom': '👾',
        'coinflip': '🪙',
        'contrarun': '🏃',
        'contrarun2': '🏃',
        'dentistgame': '🦷',
        'survivalmanual': '📖',
        'calculator': '🧮',
        'kalker': '🧮'
    };

    // Check for partial matches if exact match fails
    if (iconMap[name]) return iconMap[name];
    
    for (const key in iconMap) {
        if (name.includes(key)) return iconMap[key];
    }

    return '📱';
}

function generateAppList() {
    console.log('Scanning apps directory:', APPS_DIR);
    
    if (!fs.existsSync(APPS_DIR)) {
        console.error('Apps directory not found!');
        process.exit(1);
    }

    const appDirs = fs.readdirSync(APPS_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    const apps = [];

    for (const appId of appDirs) {
        const appPath = path.join(APPS_DIR, appId);
        const appInfoPath = path.join(appPath, 'appinfo.spixi');

        if (!fs.existsSync(appInfoPath)) {
            console.warn(`Skipping ${appId} - no appinfo.spixi found`);
            continue;
        }

        try {
            const appInfoContent = fs.readFileSync(appInfoPath, 'utf8');
            const appInfo = parseAppInfo(appInfoContent);

            // Construct relative paths suitable for the website
            const relativeAppUrl = `apps/${appId}/app/index.html`;
            
            // Assuming packed files are named after the app name or id
            // We'll use the name from appInfo if available, cleaned up
            const safeName = (appInfo.name || appId).toLowerCase().replace(/\s+/g, '-');
            const relativeZipPath = `packed/${safeName}.zip`;

            const app = {
                id: appInfo.id || appId,
                name: appInfo.name || appId,
                version: appInfo.version || '1.0.0',
                icon: getAppIcon(appInfo),
                description: appInfo.description || `${appInfo.name || appId} mini app`,
                url: relativeAppUrl,
                downloadUrl: relativeZipPath,
                sourceUrl: `https://github.com/ixian-platform/Spixi-Mini-Apps/tree/master/apps/${appId}` // Update this if repo URL differs
            };

            apps.push(app);
            console.log(`Processed: ${app.name} (${app.id})`);

        } catch (err) {
            console.error(`Error processing ${appId}:`, err.message);
        }
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(apps, null, 2));
    console.log(`\nSuccessfully generated apps.json with ${apps.length} apps.`);
}

generateAppList();
