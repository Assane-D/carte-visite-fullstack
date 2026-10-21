const express = require('express');
const QRCode = require('qrcode');
const app = express();

// ⚠️ REMPLACE TES INFOS ICI (Téléphone, LinkedIn, GitHub)
const PROFIL = {
  prenom: 'Assane',
  nom: 'Diba',
  poste: 'Étudiant en Master Ingénierie Logicielle – UNCHK',
  telephone: '+221 77 000 00 00', 
  email: 'assanedibe99@gmail.com',
  adresse: 'Dakar, Sénégal',
  site: 'https://assane-diba-portfolio.netlify.app',
  linkedin: 'https://linkedin.com/in/ton-profil',
  github: 'https://github.com/ton-profil'
};

// Fonction pour générer la carte de contact (vCard)
function construireVCard(p) {
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${p.nom};${p.prenom};;;`,
    `FN:${p.prenom} ${p.nom}`,
    `TITLE:${p.poste}`,
    `TEL;TYPE=CELL:${p.telephone}`,
    `EMAIL:${p.email}`,
    `ADR;TYPE=WORK:;;${p.adresse};;;;`,
    `URL:${p.site}`,
    `X-SOCIALPROFILE;TYPE=linkedin:${p.linkedin}`,
    `X-SOCIALPROFILE;TYPE=github:${p.github}`,
    'END:VCARD'
  ].join('\r\n');
}

// Route 1 : Générer le QR code pour le contact (vCard)
app.get('/api/qr/vcard', async (req, res) => {
  try {
    const vcard = construireVCard(PROFIL);
    const options = { type: 'png', width: 600, margin: 2, color: { dark: '#0B1B2B', light: '#F2F5F7' } };
    const buffer = await QRCode.toBuffer(vcard, options);
    res.set('Content-Type', 'image/png');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: 'Erreur QR vCard' });
  }
});

// Route 2 : Générer le QR code pour le portfolio (site web)
app.get('/api/qr/portfolio', async (req, res) => {
  try {
    const options = { type: 'png', width: 600, margin: 2, color: { dark: '#0B1B2B', light: '#F2F5F7' } };
    const buffer = await QRCode.toBuffer(PROFIL.site, options);
    res.set('Content-Type', 'image/png');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: 'Erreur QR Portfolio' });
  }
});

// Route 3 : Télécharger directement le fichier contact (.vcf)
app.get('/api/vcard', (req, res) => {
  const vcard = construireVCard(PROFIL);
  res.set('Content-Type', 'text/vcard; charset=utf-8');
  res.set('Content-Disposition', 'attachment; filename="contact.vcf"');
  res.send(vcard);
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API sur http://localhost:${PORT}`));