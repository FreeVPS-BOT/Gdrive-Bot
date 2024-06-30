const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');
const { google } = require('googleapis');
const mega = require('megajs');

// Konfigurasi bot Telegram
const bot = new Telegraf('6984913935:AAFH47npMBCoa-AhuwBdflCBE39M_42aFeQ');

// Konfigurasi Google Drive
const drive = google.drive({
  version: 'v3',
  auth: 'AIzaSyDF7iWKHIeLHbUT5ekz5ypzbjyNvCwSOs0',
});

// Fungsi untuk mengunduh file dari Google Drive
async function downloadGoogleDriveFile(fileId) {
  const response = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });
  return response.data;
}

// Fungsi untuk mengunggah file ke Mega.nz
async function uploadToMega(fileStream, fileName) {
  const storage = new mega.Storage({
    email: 'akhmadperfect97@gmail.com',
    password: 'AL$*#saya123'
  });

  return new Promise((resolve, reject) => {
    storage.on('ready', () => {
      const upload = storage.upload({ name: fileName });
      fileStream.pipe(upload);
      
      upload.on('complete', () => resolve('Upload Sukses'));
      upload.on('error', reject);
    });

    storage.on('error', reject);
  });
}

// Fungsi untuk mengunduh file dari Mediafire
async function downloadMediafireFile(url) {
  const response = await fetch(url);
  const buffer = await response.buffer();
  return buffer;
}

// Fungsi untuk menangani perintah unduhan dan unggah
bot.command('download_gdrive', async (ctx) => {
  const fileId = ctx.message.text.split(' ')[1];
  const fileStream = await downloadGoogleDriveFile(fileId);
  ctx.reply('Mengunduh file dari Google Drive...');
  ctx.telegram.sendDocument(ctx.message.chat.id, { source: fileStream, filename: 'file' });
});

bot.command('upload_gdrive_mega', async (ctx) => {
  const fileId = ctx.message.text.split(' ')[1];
  const fileStream = await downloadGoogleDriveFile(fileId);
  ctx.reply('Mengunduh file dari Google Drive...');
  await uploadToMega(fileStream, 'file');
  ctx.reply('File berhasil diunggah ke Mega.nz');
});

bot.command('download_mediafire', async (ctx) => {
  const url = ctx.message.text.split(' ')[1];
  const fileBuffer = await downloadMediafireFile(url);
  ctx.reply('Mengunduh file dari Mediafire...');
  ctx.telegram.sendDocument(ctx.message.chat.id, { source: fileBuffer, filename: 'file' });
});

bot.command('upload_mediafire_mega', async (ctx) => {
  const url = ctx.message.text.split(' ')[1];
  const fileBuffer = await downloadMediafireFile(url);
  ctx.reply('Mengunduh file dari Mediafire...');
  await uploadToMega(fileBuffer, 'file');
  ctx.reply('File berhasil diunggah ke Mega.nz');
});

// Menjalankan bot
bot.launch().then(() => {
  console.log('Bot berjalan');
});
