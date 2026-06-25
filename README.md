# Compta SCI — application autonome (PWA)

Application de comptabilité pour SCI à l'IR : import de factures (PDF, Excel, Word, photo),
lecture automatique par IA, justificatifs conservés, export Excel. Aucune étape de build :
ce sont des fichiers statiques à héberger.

## Contenu du dossier
- `index.html` — l'application
- `manifest.webmanifest` — descripteur d'installation
- `sw.js` — service worker (installation + usage hors-ligne)
- `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png` — icônes

## 1. Mettre en ligne (Vercel)
Important : il faut du **HTTPS** pour l'installation, l'appareil photo et le service worker.
Vercel le fournit automatiquement.

Trois options, au choix :
- **Glisser-déposer** : sur vercel.com → « Add New… » → « Project » → onglet de dépôt manuel,
  ou via https://vercel.com/new en déposant le dossier. Le site est publié en quelques secondes.
- **CLI** : dans le dossier, `npm i -g vercel` puis `vercel` (puis `vercel --prod`).
- **Git** : pousse le dossier sur un repo GitHub et importe-le dans Vercel.

Comme c'est du statique, aucune configuration n'est nécessaire. (N'importe quel hébergeur HTTPS
convient aussi : Netlify, Cloudflare Pages, GitHub Pages…)

Pour tester en local : `npx serve` dans le dossier, puis ouvre l'adresse `http://localhost:...`.

## 2. Brancher ta clé API (une fois par appareil)
À la première ouverture, va dans **Export & réglages → Clé API Anthropic**, colle ta clé
(`sk-ant-…`, depuis console.anthropic.com → Settings → API Keys) et enregistre.

- La clé est stockée **uniquement dans le navigateur de cet appareil** (localStorage).
- Elle n'est **pas** dans le code publié : ton URL Vercel peut donc rester en ligne sans risque.
- Elle n'est **jamais** incluse dans les sauvegardes.
- Chaque analyse de facture consomme des crédits sur ton compte Anthropic.

L'appel à l'API se fait directement depuis le navigateur (en-tête
`anthropic-dangerous-direct-browser-access` déjà activé dans le code).

## 3. Installer sur l'écran d'accueil
**iPhone (Safari)** : ouvre l'URL → bouton Partager → « Sur l'écran d'accueil ».
L'app s'ouvre en plein écran, comme une vraie application.

**Ordinateur (Chrome / Edge)** : ouvre l'URL → icône d'installation dans la barre d'adresse
(ou menu ⋮ → « Installer Compta SCI »).

## 4. Synchroniser PC ↔ iPhone
Les données vivent sur chaque appareil (IndexedDB) et ne se synchronisent pas toutes seules.
Pour transférer : **Export & réglages → Exporter une sauvegarde**, range le `.json` dans
**iCloud Drive**, puis sur l'autre appareil → **Restaurer une sauvegarde**. Le fichier contient
les écritures ET les justificatifs.

Fais une sauvegarde régulièrement : c'est aussi ta copie de sécurité.

## Notes
- SCI à l'**IR**, comptabilité de trésorerie (recettes / dépenses). Pour l'IS, prévoir un suivi
  complémentaire (amortissements, bilan).
- Les photos sont compressées automatiquement avant stockage. Un fichier au-delà de 25 Mo est
  refusé au stockage (garde l'original dans iCloud).
- Si un jour tu veux une vraie synchro automatique entre appareils, c'est le moment de passer
  sur Supabase — la structure des données est déjà prête pour ça.
