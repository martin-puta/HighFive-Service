import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Switch,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const API_URL = 'http://localhost:3000/api';
const BLUE = '#1464E8';
const GREEN = '#19A463';
const RED = '#E84B52';

const I18N = {
  fr: {
    home: 'Accueil',
    commands: 'Commandes',
    connection: 'Connexion',
    settings: 'Paramètres',
    navSettings: 'Réglages',
    about: 'À propos',
    welcomePrefix: 'Bienvenue,',
    askPilot: 'Que souhaitez-vous piloter ?',
    devicesTitle: 'Vos appareils',
    devicesCount: (n) => `${n} appareils`,
    turnOn: 'Allumer',
    turnOff: 'Arrêter',
    running: 'En fonctionnement',
    stopped: 'Arrêté',
    ready: 'Prêt à fonctionner',
    syncNow: 'Dernière synchronisation : maintenant',
    themeLabel: 'Thème',
    light: 'Clair',
    dark: 'Sombre',
    langLabel: 'Langue',
    frName: 'Français',
    enName: 'Anglais',
    save: 'Enregistrer',
    reset: 'Réinitialiser',
    savedMsg: 'Préférences appliquées et synchronisées.',
    voiceTitle: 'Commande vocale',
    voiceStart: 'Parler',
    voiceStop: 'Arrêter l’écoute',
    voiceHint: 'Dites ex. : "Allume le chauffage" ou "Arrête la climatisation"',
    btConnected: 'Connecté',
    btDisconnected: 'Déconnecté',
    btScanning: 'Recherche en cours...',
    btScanBtn: 'Rechercher HC-05',
    deviceNames: {
      home: 'Pilote maison',
      flame: 'Chauffage',
      snow: 'Climatisation',
      spray: 'Pulvérisateur',
      bug: 'Anti-moustique',
    },
  },
  en: {
    home: 'Home',
    commands: 'Commands',
    connection: 'Connection',
    settings: 'Settings',
    navSettings: 'Settings',
    about: 'About',
    welcomePrefix: 'Welcome,',
    askPilot: 'What would you like to control?',
    devicesTitle: 'Your devices',
    devicesCount: (n) => `${n} devices`,
    turnOn: 'Turn On',
    turnOff: 'Turn Off',
    running: 'Running',
    stopped: 'Stopped',
    ready: 'Ready',
    syncNow: 'Last sync: just now',
    themeLabel: 'Theme',
    light: 'Light',
    dark: 'Dark',
    langLabel: 'Language',
    frName: 'French',
    enName: 'English',
    save: 'Save',
    reset: 'Reset',
    savedMsg: 'Preferences applied and synced.',
    voiceTitle: 'Voice Command',
    voiceStart: 'Speak',
    voiceStop: 'Stop Listening',
    voiceHint: 'Say e.g.: "Turn on heating" or "Stop air conditioning"',
    btConnected: 'Connected',
    btDisconnected: 'Disconnected',
    btScanning: 'Scanning...',
    btScanBtn: 'Scan HC-05',
    deviceNames: {
      home: 'Home Controller',
      flame: 'Heating',
      snow: 'Air Conditioning',
      spray: 'Sprayer',
      bug: 'Mosquito Repellent',
    },
  },
};

function getPalette(theme) {
  if (theme === 'dark') {
    return {
      bg: '#0B1324',
      surface: '#131F38',
      surfaceAlt: '#192948',
      text: '#F1F5FF',
      muted: '#94A3B8',
      border: '#24365A',
      softBlue: '#1B2F54',
      headerSub: '#CBD5E1',
      inputBg: '#0F1A30',
    };
  }
  return {
    bg: '#F4F7FC',
    surface: '#FFFFFF',
    surfaceAlt: '#F0F5FD',
    text: '#102A56',
    muted: '#6B7890',
    border: '#E7ECF4',
    softBlue: '#EAF2FF',
    headerSub: '#DDEAFF',
    inputBg: '#F7F9FD',
  };
}

const Icon = ({ name, active = false, styles }) => {
  const symbols = { home: '⌂', commands: '▦', connection: '⌁', settings: '⚙', info: 'ⓘ', flame: '♨', snow: '❄', spray: '▰', bug: '⊘', link: '↗', mic: '🎙' };
  return <Text style={[styles.icon, active && styles.iconActive]}>{symbols[name] || '•'}</Text>;
};

const Button = ({ children, onPress, variant = 'primary', styles }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.button,
      variant === 'danger' && styles.dangerButton,
      variant === 'soft' && styles.softButton,
      pressed && styles.pressed,
    ]}
  >
    <Text style={[styles.buttonText, variant !== 'primary' && variant !== 'danger' && styles.softButtonText]}>
      {children}
    </Text>
  </Pressable>
);

function Onboarding({ onDone, styles, palette }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const valid = name.trim().length > 1 && email.includes('@');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" backgroundColor={BLUE} />
      <ScrollView contentContainerStyle={styles.onboarding}>
        <View style={styles.blueTop} />
        <Text style={styles.eyebrow}>Bienvenue sur</Text>
        <Text style={styles.brand}>HighFive <Text style={styles.brandDark}>Service</Text></Text>
        <Text style={styles.lead}>Configurons votre espace en quelques secondes.</Text>
        <View style={styles.formCard}>
          <View style={styles.avatar}><Text style={styles.avatarText}>H</Text></View>
          <View>
            <Text style={styles.cardTitle}>Votre profil</Text>
            <Text style={styles.muted}>Renseignez vos informations</Text>
          </View>
          <Text style={styles.label}>Nom complet</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Martin Puta Sudi"
            placeholderTextColor={palette.muted}
            style={styles.input}
          />
          <Text style={styles.label}>Adresse e-mail</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="martin@example.com"
            placeholderTextColor={palette.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <Button styles={styles} onPress={() => valid && onDone({ name, email })}>→   Continuer</Button>
          <Text style={styles.helper}>Vos données restent associées à votre profil local.</Text>
        </View>
        <View style={styles.benefits}>
          <Text style={styles.sectionTitle}>Une expérience personnalisée</Text>
          {[
            ['Bienvenue personnalisée', 'Votre nom apparaît dans l’accueil.'],
            ['Connexion plus simple', 'Retrouvez vos préférences sur l’appareil.'],
            ['Contrôle immédiat', 'Accédez rapidement à vos commandes.'],
          ].map(([t, d], i) => (
            <View style={styles.benefit} key={t}>
              <View style={styles.number}><Text style={styles.numberText}>{i + 1}</Text></View>
              <View><Text style={styles.itemTitle}>{t}</Text><Text style={styles.muted}>{d}</Text></View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Header({ title, back = false, styles }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{back ? '‹  ' : ''}{title}</Text>
      <Text style={styles.headerStatus}>LTE  •  37%</Text>
    </View>
  );
}

function Card({ children, style, styles }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

function Home({ profile, go, styles, t }) {
  return (
    <>
      <Header title={t.home} styles={styles} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroLogo}><Text style={styles.heroH}>H</Text></View>
        <Text style={styles.heroTitle}>HighFive Service</Text>
        <Text style={styles.heroSubtitle}>Simple • Rapide • Efficace</Text>
        <View style={styles.divider} />
        <Text style={styles.welcome}>{t.welcomePrefix} {profile.name.split(' ')[0]}</Text>
        <Text style={styles.muted}>{t.askPilot}</Text>
        {[
          ['commands', t.commands, 'Piloter vos appareils'],
          ['settings', t.settings, 'Personnaliser l’application'],
          ['connection', t.connection, 'Connecter le module HC-05'],
          ['info', t.about, 'En savoir plus'],
        ].map(([icon, title, sub]) => (
          <Pressable key={icon} onPress={() => go(icon)}>
            <Card styles={styles} style={styles.menuCard}>
              <View style={styles.menuIcon}><Icon name={icon} active styles={styles} /></View>
              <View style={styles.menuCopy}>
                <Text style={styles.itemTitle}>{title}</Text>
                <Text style={styles.muted}>{sub}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </>
  );
}

const initialDevices = [
  { id: 'home', code: 'HOME', icon: 'home', on: true },
  { id: 'flame', code: 'FLAME', icon: 'flame', on: false },
  { id: 'snow', code: 'SNOW', icon: 'snow', on: false },
  { id: 'spray', code: 'SPRAY', icon: 'spray', on: false },
  { id: 'bug', code: 'BUG', icon: 'bug', on: false },
];

function parseVoiceCommand(transcript) {
  const txt = (transcript || '').toLowerCase();
  const isOff = /\b(arr[eê]te|arr[eê]ter|[eé]teins|[eé]teindre|stop|off|turn off)\b/.test(txt);
  const isOn = /\b(allume|allumer|active|activer|d[eé]marre|on|turn on)\b/.test(txt);
  const targetOn = isOff ? false : isOn ? true : null;
  if (targetOn === null) return null;

  let deviceId = null;
  if (/chauffage|flame|heat/.test(txt)) deviceId = 'flame';
  else if (/clim|climatisation|snow|cool|ac/.test(txt)) deviceId = 'snow';
  else if (/pulv[eé]risateur|spray/.test(txt)) deviceId = 'spray';
  else if (/moustique|bug|repellent/.test(txt)) deviceId = 'bug';
  else if (/maison|home|pilote/.test(txt)) deviceId = 'home';

  if (!deviceId) return null;
  return { deviceId, nextOn: targetOn };
}

function Commands({ devices, onToggleDevice, onVoiceApply, btConnected, lang, styles, t }) {
  const [listening, setListening] = useState(false);
  const [heardText, setHeardText] = useState('');
  const [testPhrase, setTestPhrase] = useState('');
  const voiceModRef = useRef(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const mod = await import('@react-native-voice/voice');
        const Voice = mod.default || mod;
        if (!active || !Voice) return;
        voiceModRef.current = Voice;
        Voice.onSpeechResults = (e) => {
          const phrase = e?.value?.[0] || '';
          setHeardText(phrase);
          const parsed = parseVoiceCommand(phrase);
          if (parsed) onVoiceApply(parsed.deviceId, parsed.nextOn);
        };
        Voice.onSpeechEnd = () => setListening(false);
        Voice.onSpeechError = () => setListening(false);
      } catch {
        // Repli sur la saisie textuelle si @react-native-voice/voice n'est pas lié
      }
    })();
    return () => {
      active = false;
      try {
        voiceModRef.current?.destroy?.();
      } catch {}
    };
  }, [onVoiceApply]);

  const toggleListen = async () => {
    if (listening) {
      try {
        await voiceModRef.current?.stop?.();
      } catch {}
      setListening(false);
      return;
    }
    setListening(true);
    setHeardText('');
    try {
      await voiceModRef.current?.start?.(lang === 'en' ? 'en-US' : 'fr-FR');
    } catch {
      setListening(false);
    }
  };

  const applyTestPhrase = () => {
    setHeardText(testPhrase);
    const parsed = parseVoiceCommand(testPhrase);
    if (parsed) {
      onVoiceApply(parsed.deviceId, parsed.nextOn);
      setTestPhrase('');
    }
  };

  return (
    <>
      <Header title={t.commands} back styles={styles} />
      <ScrollView contentContainerStyle={styles.content}>
        <Card styles={styles} style={styles.voiceCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.itemTitle}>{t.voiceTitle}</Text>
            <Text style={[styles.muted, { color: btConnected ? GREEN : RED, fontWeight: '800' }]}>
              {btConnected ? `HC-05: ${t.btConnected}` : `HC-05: ${t.btDisconnected}`}
            </Text>
          </View>
          <Text style={styles.muted}>{t.voiceHint}</Text>
          <Button styles={styles} onPress={toggleListen}>
            {listening ? `⏹  ${t.voiceStop}` : `🎙  ${t.voiceStart}`}
          </Button>
          {heardText ? <Text style={styles.heardText}>"{heardText}"</Text> : null}
          <TextInput
            value={testPhrase}
            onChangeText={setTestPhrase}
            placeholder={lang === 'en' ? 'Test command e.g. turn on heating' : 'Tester ex. : allume le chauffage'}
            placeholderTextColor={styles.muted.color}
            style={[styles.input, { marginTop: 10 }]}
            onSubmitEditing={applyTestPhrase}
          />
        </Card>

        <View style={styles.rowBetween}>
          <Text style={styles.screenTitle}>{t.devicesTitle}</Text>
          <Text style={styles.muted}>{t.devicesCount(devices.length)}</Text>
        </View>

        {devices.map((d, i) => {
          const statusLabel = d.id === 'home' && d.on ? t.ready : d.on ? t.running : t.stopped;
          return (
            <Card key={d.id} styles={styles} style={styles.deviceCard}>
              <View style={styles.deviceIcon}><Icon name={d.icon} active={d.on} styles={styles} /></View>
              <View style={styles.deviceCopy}>
                <Text style={styles.itemTitle}>{t.deviceNames[d.id] || d.id}</Text>
                <Text style={styles.muted}>{statusLabel}</Text>
              </View>
              <Button styles={styles} variant={d.on ? 'primary' : 'danger'} onPress={() => onToggleDevice(i)}>
                {d.on ? t.turnOn : t.turnOff}
              </Button>
            </Card>
          );
        })}

        <View style={styles.sync}><Text style={styles.muted}>{t.syncNow}</Text></View>
      </ScrollView>
    </>
  );
}

function Connection({ btDevice, btScanning, onScan, onConnectDevice, onDisconnect, styles, t }) {
  const [devicesList, setDevicesList] = useState([]);
  const connected = Boolean(btDevice);

  const handleScan = async () => {
    const found = await onScan();
    setDevicesList(found);
  };

  return (
    <>
      <Header title={t.connection} back styles={styles} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.connectionHero}>
          <View style={styles.btCircle}><Icon name="connection" active styles={styles} /></View>
          <Text style={styles.heroTitle}>Bluetooth HC-05</Text>
          <Text style={styles.muted}>
            Statut :{' '}
            <Text style={{ color: connected ? GREEN : RED, fontWeight: '800' }}>
              {connected ? `${t.btConnected} (${btDevice.name || btDevice.address})` : t.btDisconnected}
            </Text>
          </Text>
        </View>

        <Button styles={styles} onPress={connected ? onDisconnect : handleScan}>
          {connected ? 'Déconnecter' : btScanning ? t.btScanning : `↗   ${t.btScanBtn}`}
        </Button>

        <Text style={styles.screenTitle}>Appareils disponibles</Text>

        {devicesList.map((dev) => (
          <Pressable key={dev.address} onPress={() => onConnectDevice(dev)}>
            <Card styles={styles} style={styles.available}>
              <Icon name="connection" active styles={styles} />
              <View style={styles.deviceCopy}>
                <Text style={styles.itemTitle}>{dev.name || 'HC-05'}</Text>
                <Text style={styles.muted}>{dev.address}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Card>
          </Pressable>
        ))}

        <View style={styles.scanDone}>
          <Text style={{ color: GREEN, fontWeight: '700' }}>
            ●  {btScanning ? t.btScanning : `Recherche terminée • ${devicesList.length} appareil(s)`}
          </Text>
        </View>

        <Card styles={styles} style={styles.steps}>
          <Text style={styles.sectionTitle}>Connexion en 3 étapes</Text>
          {[
            ['Scanner', 'Afficher les périphériques appairés et détectés.'],
            ['Sélectionner', 'Appuyer sur HC-05 pour ouvrir le port série.'],
            ['Connecter', 'Envoyer et recevoir les trames série en direct.'],
          ].map(([title, desc], i) => (
            <View style={styles.benefit} key={title}>
              <View style={styles.number}><Text style={styles.numberText}>{i + 1}</Text></View>
              <View><Text style={styles.itemTitle}>{title}</Text><Text style={styles.muted}>{desc}</Text></View>
            </View>
          ))}
        </Card>
      </ScrollView>
    </>
  );
}

function Settings({ theme, setTheme, lang, setLang, onSync, styles, t }) {
  const [smartHome, setSmartHome] = useState(true);
  const [autoReconnect, setAutoReconnect] = useState(true);
  const [feedback, setFeedback] = useState('');

  const toggleTheme = () => {
    setFeedback('');
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleLang = () => {
    setFeedback('');
    setLang((prev) => (prev === 'fr' ? 'en' : 'fr'));
  };

  const handleReset = () => {
    setTheme('light');
    setLang('fr');
    setSmartHome(true);
    setAutoReconnect(true);
    setFeedback('');
  };

  const handleSave = async () => {
    await onSync({ theme, lang, smartHome, autoReconnect });
    setFeedback(t.savedMsg);
  };

  const currentThemeText = theme === 'light' ? t.light : t.dark;
  const currentLangText = lang === 'fr' ? t.frName : t.enName;

  return (
    <>
      <Header title={t.settings} back styles={styles} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitleBlue}>Personnalisation</Text>
        <Card styles={styles} style={styles.settingRow}>
          <View>
            <Text style={styles.itemTitle}>Maison intelligente</Text>
            <Text style={styles.muted}>Module HC-05</Text>
          </View>
          <Switch value={smartHome} onValueChange={setSmartHome} trackColor={{ true: BLUE }} thumbColor="#fff" />
        </Card>
        <Card styles={styles} style={styles.settingRow}>
          <View>
            <Text style={styles.itemTitle}>Connexion automatique</Text>
            <Text style={styles.muted}>Se reconnecter si besoin</Text>
          </View>
          <Switch value={autoReconnect} onValueChange={setAutoReconnect} trackColor={{ true: BLUE }} thumbColor="#fff" />
        </Card>
        <Card styles={styles} style={styles.settingRow}>
          <View>
            <Text style={styles.itemTitle}>Sensibilité du micro</Text>
            <Text style={styles.muted}>Plus de sensibilité</Text>
          </View>
          <Text style={styles.slider}>━━━━●</Text>
        </Card>

        <Text style={styles.sectionTitleBlue}>Expérience</Text>
        <Pressable onPress={toggleTheme}>
          <Card styles={styles} style={styles.settingRow}>
            <View>
              <Text style={styles.itemTitle}>{t.themeLabel}</Text>
              <Text style={styles.muted}>{currentThemeText}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Card>
        </Pressable>
        <Pressable onPress={toggleLang}>
          <Card styles={styles} style={styles.settingRow}>
            <View>
              <Text style={styles.itemTitle}>{t.langLabel}</Text>
              <Text style={styles.muted}>{currentLangText}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Card>
        </Pressable>

        {feedback ? <Text style={styles.feedbackText}>{feedback}</Text> : null}
        <Button styles={styles} variant="soft" onPress={handleReset}>{t.reset}</Button>
        <Button styles={styles} onPress={handleSave}>{t.save}</Button>
      </ScrollView>
    </>
  );
}

function About({ styles, t }) {
  return (
    <>
      <Header title={t.about} back styles={styles} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.connectionHero}>
          <View style={styles.heroLogo}><Text style={styles.heroH}>H</Text></View>
          <Text style={styles.heroTitle}>HighFive Service</Text>
          <Text style={styles.linkText}>Version 2.0</Text>
          <View style={styles.divider} />
          <Text style={styles.centerText}>Une application simple pour contrôler vos appareils via Bluetooth et voix.</Text>
        </View>
        <Card styles={styles}>
          <Text style={styles.muted}>Développé par</Text>
          <Text style={styles.itemTitle}>Martin Puta Sudi</Text>
          <Text style={styles.muted}>Design system & prototype</Text>
        </Card>
        <Button styles={styles} variant="soft">Contacter</Button>
      </ScrollView>
    </>
  );
}

function Nav({ active, go, styles, t }) {
  return (
    <View style={styles.nav}>
      {[
        ['home', t.home],
        ['commands', t.commands],
        ['connection', t.connection],
        ['settings', t.navSettings],
      ].map(([icon, label]) => (
        <Pressable key={icon} style={styles.navItem} onPress={() => go(icon)}>
          <Icon name={icon} active={active === icon} styles={styles} />
          <Text style={[styles.navText, active === icon && styles.navTextActive]}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

async function requestBluetoothPermissions() {
  if (Platform.OS !== 'android') return true;
  if (Platform.Version >= 31) {
    const res = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
    return res[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED;
  }
  const fine = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
  return fine === PermissionsAndroid.RESULTS.GRANTED;
}

export default function App() {
  const [profile, setProfile] = useState(null);
  const [screen, setScreen] = useState('home');
  const [devices, setDevices] = useState(initialDevices);
  const [theme, setTheme] = useState('light');
  const [lang, setLang] = useState('fr');
  const [btDevice, setBtDevice] = useState(null);
  const [btScanning, setBtScanning] = useState(false);

  const btClientRef = useRef(null);
  const speechModRef = useRef(null);
  const readSubRef = useRef(null);
  const rxBufferRef = useRef('');

  const palette = useMemo(() => getPalette(theme), [theme]);
  const styles = useMemo(() => createStyles(palette), [palette]);
  const t = I18N[lang] || I18N.fr;

  useEffect(() => {
    let active = true;
    fetch(`${API_URL}/health`).catch(() => {});

    (async () => {
      try {
        const btMod = await import('react-native-bluetooth-classic');
        if (active) btClientRef.current = btMod.default || btMod;
      } catch {}

      try {
        const spMod = await import('expo-speech');
        if (active) speechModRef.current = spMod;
      } catch {}
    })();

    return () => {
      active = false;
      readSubRef.current?.remove?.();
    };
  }, []);

  const applyArduinoMessage = (rawLine) => {
    const line = rawLine.trim();
    const match = /^STATE:([A-Z]+):(ON|OFF)$/i.exec(line);
    if (!match) return;
    const code = match[1].toUpperCase();
    const isOn = match[2].toUpperCase() === 'ON';
    setDevices((prev) => prev.map((d) => (d.code === code ? { ...d, on: isOn } : d)));
  };

  const sendSerialCommand = async (code, nextOn) => {
    const bt = btClientRef.current;
    if (!bt || !btDevice?.address) return;
    const frame = `CMD:${code}:${nextOn ? 'ON' : 'OFF'}\n`;
    try {
      await bt.writeToDevice(btDevice.address, frame);
    } catch {}
  };

  const speakFeedback = (code, nextOn) => {
    const sp = speechModRef.current;
    if (!sp?.speak) return;
    const label = t.deviceNames[code.toLowerCase()] || code;
    const msg =
      lang === 'en'
        ? `${label} ${nextOn ? 'activated' : 'stopped'}`
        : `${label} ${nextOn ? 'activé' : 'arrêté'}`;
    try {
      sp.speak(msg, { language: lang === 'en' ? 'en-US' : 'fr-FR' });
    } catch {}
  };

  const setDeviceState = async (deviceId, nextOn) => {
    const target = devices.find((d) => d.id === deviceId);
    if (!target) return;
    setDevices((prev) => prev.map((d) => (d.id === deviceId ? { ...d, on: nextOn } : d)));
    await sendSerialCommand(target.code, nextOn);
    speakFeedback(target.code, nextOn);
  };

  const handleToggleDevice = async (idx) => {
    const current = devices[idx];
    if (!current) return;
    await setDeviceState(current.id, !current.on);
  };

  const handleScanBt = async () => {
    const bt = btClientRef.current;
    if (!bt) return [];
    setBtScanning(true);
    try {
      await requestBluetoothPermissions();
      const bonded = await bt.getBondedDevices();
      let discovered = [];
      try {
        discovered = await bt.startDiscovery();
      } catch {
        discovered = [];
      }
      const mapByAddr = new Map();
      [...(bonded || []), ...(discovered || [])].forEach((d) => {
        if (d?.address) mapByAddr.set(d.address, d);
      });
      return Array.from(mapByAddr.values());
    } catch {
      return [];
    } finally {
      setBtScanning(false);
    }
  };

  const handleConnectBt = async (dev) => {
    const bt = btClientRef.current;
    if (!bt) return;
    try {
      const ok = await bt.connectToDevice(dev.address);
      if (!ok) return;
      readSubRef.current?.remove?.();
      rxBufferRef.current = '';
      readSubRef.current = bt.onDeviceRead(dev.address, (event) => {
        rxBufferRef.current += event?.data || '';
        const parts = rxBufferRef.current.split('\n');
        rxBufferRef.current = parts.pop() || '';
        parts.forEach(applyArduinoMessage);
      });
      setBtDevice(dev);
    } catch {
      setBtDevice(null);
    }
  };

  const handleDisconnectBt = async () => {
    const bt = btClientRef.current;
    readSubRef.current?.remove?.();
    if (bt && btDevice?.address) {
      try {
        await bt.disconnectFromDevice(btDevice.address);
      } catch {}
    }
    setBtDevice(null);
  };

  const syncPreferences = async (prefs) => {
    try {
      await fetch(`${API_URL}/preferences`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: profile?.email, ...prefs }),
      });
    } catch {}
  };

  const go = (next) => setScreen(next);

  if (!profile) return <Onboarding onDone={setProfile} styles={styles} palette={palette} />;

  const page =
    screen === 'home' ? <Home profile={profile} go={go} styles={styles} t={t} /> :
    screen === 'commands' ? (
      <Commands
        devices={devices}
        onToggleDevice={handleToggleDevice}
        onVoiceApply={setDeviceState}
        btConnected={Boolean(btDevice)}
        lang={lang}
        styles={styles}
        t={t}
      />
    ) :
    screen === 'connection' ? (
      <Connection
        btDevice={btDevice}
        btScanning={btScanning}
        onScan={handleScanBt}
        onConnectDevice={handleConnectBt}
        onDisconnect={handleDisconnectBt}
        styles={styles}
        t={t}
      />
    ) :
    screen === 'settings' ? (
      <Settings
        theme={theme}
        setTheme={setTheme}
        lang={lang}
        setLang={setLang}
        onSync={syncPreferences}
        styles={styles}
        t={t}
      />
    ) :
    <About styles={styles} t={t} />;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} backgroundColor={BLUE} />
      <View style={styles.app}>
        {page}
        <Nav active={screen} go={go} styles={styles} t={t} />
      </View>
    </SafeAreaView>
  );
}

function createStyles(p) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: p.bg },
    app: { flex: 1, backgroundColor: p.bg },
    blueTop: { position: 'absolute', top: 0, left: 0, right: 0, height: 28, backgroundColor: BLUE },
    onboarding: { padding: 28, paddingTop: 68, minHeight: '100%' },
    eyebrow: { color: p.muted, fontSize: 16, fontWeight: '700' },
    brand: { color: BLUE, fontSize: 34, fontWeight: '900', marginTop: 4 },
    brandDark: { color: p.text },
    lead: { color: p.text, fontSize: 15, marginTop: 22 },
    formCard: { backgroundColor: p.surface, borderRadius: 22, padding: 20, marginTop: 28, borderWidth: 1, borderColor: p.border, shadowColor: '#102A56', shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 },
    avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: p.softBlue, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    avatarText: { color: BLUE, fontSize: 24, fontWeight: '900' },
    cardTitle: { color: p.text, fontSize: 16, fontWeight: '800' },
    muted: { color: p.muted, fontSize: 12, marginTop: 3 },
    label: { color: p.text, fontWeight: '800', fontSize: 12, marginTop: 18, marginBottom: 7 },
    input: { height: 42, borderRadius: 10, borderWidth: 1, borderColor: p.border, backgroundColor: p.inputBg, paddingHorizontal: 13, color: p.text },
    button: { backgroundColor: BLUE, minHeight: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, marginTop: 16 },
    dangerButton: { backgroundColor: RED },
    softButton: { backgroundColor: p.softBlue },
    buttonText: { color: '#fff', fontWeight: '800', fontSize: 13 },
    softButtonText: { color: BLUE },
    pressed: { opacity: 0.75 },
    helper: { color: p.muted, fontSize: 10, marginTop: 13 },
    benefits: { backgroundColor: p.surface, borderRadius: 18, padding: 18, marginTop: 22, borderWidth: 1, borderColor: p.border },
    sectionTitle: { color: p.text, fontSize: 16, fontWeight: '800', marginBottom: 12 },
    benefit: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
    number: { width: 28, height: 28, borderRadius: 14, backgroundColor: p.softBlue, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    numberText: { color: BLUE, fontWeight: '800' },
    itemTitle: { color: p.text, fontSize: 13, fontWeight: '800' },
    header: { height: 92, backgroundColor: BLUE, paddingHorizontal: 20, paddingTop: 38, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
    headerStatus: { color: p.headerSub, fontSize: 10, fontWeight: '700' },
    content: { padding: 18, paddingBottom: 92 },
    heroLogo: { width: 72, height: 72, borderRadius: 36, backgroundColor: p.softBlue, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: 10 },
    heroH: { color: BLUE, fontSize: 44, fontWeight: '900' },
    heroTitle: { color: p.text, fontSize: 20, fontWeight: '900', textAlign: 'center', marginTop: 12 },
    heroSubtitle: { color: p.muted, textAlign: 'center', marginTop: 4 },
    divider: { height: 2, backgroundColor: BLUE, width: 120, alignSelf: 'center', marginVertical: 16 },
    welcome: { color: p.text, fontSize: 18, fontWeight: '900', marginTop: 4 },
    menuCard: { flexDirection: 'row', alignItems: 'center', padding: 14, marginTop: 10 },
    card: { backgroundColor: p.surface, borderRadius: 15, padding: 14, borderWidth: 1, borderColor: p.border, marginTop: 10 },
    voiceCard: { marginBottom: 8 },
    heardText: { color: BLUE, fontWeight: '800', fontSize: 12, marginTop: 8 },
    menuIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: p.softBlue, alignItems: 'center', justifyContent: 'center' },
    menuCopy: { flex: 1, marginLeft: 12 },
    chevron: { color: BLUE, fontSize: 25 },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
    screenTitle: { color: p.text, fontSize: 16, fontWeight: '900', marginTop: 10, marginBottom: 8 },
    deviceCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
    deviceIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: p.softBlue, alignItems: 'center', justifyContent: 'center' },
    deviceCopy: { flex: 1, marginLeft: 10 },
    sync: { backgroundColor: p.surfaceAlt, borderRadius: 10, padding: 11, alignItems: 'center', marginTop: 12 },
    connectionHero: { alignItems: 'center', paddingVertical: 8 },
    btCircle: { width: 88, height: 88, borderRadius: 44, backgroundColor: p.softBlue, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    available: { flexDirection: 'row', alignItems: 'center' },
    scanDone: { backgroundColor: '#EAF7F0', borderRadius: 10, padding: 10, marginTop: 10 },
    steps: { marginTop: 18 },
    settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    sectionTitleBlue: { color: BLUE, fontSize: 16, fontWeight: '900', marginTop: 16, marginBottom: 4 },
    slider: { color: BLUE, fontWeight: '900' },
    linkText: { color: BLUE, fontWeight: '800', marginTop: 4 },
    centerText: { textAlign: 'center', color: p.text, lineHeight: 20 },
    feedbackText: { color: GREEN, fontWeight: '700', fontSize: 12, marginTop: 10, textAlign: 'center' },
    nav: { position: 'absolute', bottom: 10, left: 10, right: 10, height: 62, backgroundColor: p.surface, borderRadius: 16, borderWidth: 1, borderColor: p.border, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', elevation: 8 },
    navItem: { alignItems: 'center', justifyContent: 'center', minWidth: 65 },
    icon: { color: p.muted, fontSize: 21, fontWeight: '700', textAlign: 'center' },
    iconActive: { color: BLUE },
    navText: { color: p.muted, fontSize: 9, marginTop: 2 },
    navTextActive: { color: BLUE, fontWeight: '800' },
  });
}