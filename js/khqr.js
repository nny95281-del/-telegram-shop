/**
 * KHQR Generator & Audio Effects Utility for Bakong / ABA Checkout
 */

class KhqrService {
  constructor() {
    this.audioCtx = null;
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  playSuccessSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Multi-tone cheerful chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "triangle";

      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc1.frequency.setValueAtTime(783.99, now + 0.2); // G5
      osc1.frequency.setValueAtTime(1046.50, now + 0.3); // C6

      osc2.frequency.setValueAtTime(261.63, now);
      osc2.frequency.setValueAtTime(329.63, now + 0.1);
      osc2.frequency.setValueAtTime(392.00, now + 0.2);
      osc2.frequency.setValueAtTime(523.25, now + 0.3);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.75);
      osc2.stop(now + 0.75);
    } catch (e) {
      console.warn("Audio playback not allowed:", e);
    }
  }

  playPopSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  }

  /**
   * Draw high-fidelity Bakong KHQR visual code on an HTML5 canvas
   */
  renderKhqrCanvas(canvas, options = {}) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width || 320;
    const height = canvas.height || 380;
    const {
      merchantName = "MERCHANT NAME",
      bakongId = "merchant@aba",
      amount = 0,
      currency = "USD"
    } = options;

    ctx.clearRect(0, 0, width, height);

    // Background Card
    ctx.fillStyle = "#FFFFFF";
    ctx.roundRect ? ctx.roundRect(0, 0, width, height, 16) : ctx.rect(0, 0, width, height);
    ctx.fill();

    // Red Bakong Header Banner
    ctx.fillStyle = "#E11D48";
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(0, 0, width, 60, [16, 16, 0, 0]);
    } else {
      ctx.rect(0, 0, width, 60);
    }
    ctx.fill();

    // KHQR Title Header
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 20px 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("KHQR", width / 2, 38);

    // Merchant Name
    ctx.fillStyle = "#1E293B";
    ctx.font = "bold 15px 'Inter', sans-serif";
    ctx.fillText(merchantName.toUpperCase(), width / 2, 90);

    // Bakong ID
    ctx.fillStyle = "#64748B";
    ctx.font = "12px 'Inter', sans-serif";
    ctx.fillText(bakongId, width / 2, 108);

    // Amount Display
    ctx.fillStyle = "#E11D48";
    ctx.font = "bold 22px 'Inter', sans-serif";
    const amountStr = currency === "USD" ? `$${amount.toFixed(2)}` : `${Math.round(amount).toLocaleString()} ៛`;
    ctx.fillText(amountStr, width / 2, 138);

    // QR Code Box (Simulated High-Res Pattern with Corner Markers)
    const qrSize = 180;
    const qrX = (width - qrSize) / 2;
    const qrY = 155;

    ctx.fillStyle = "#000000";
    this.drawSimulatedQr(ctx, qrX, qrY, qrSize, `${merchantName}_${amount}`);

    // Footer Tag
    ctx.fillStyle = "#94A3B8";
    ctx.font = "11px 'Inter', sans-serif";
    ctx.fillText("Scan with any Mobile Banking App (Bakong KHQR)", width / 2, 355);
  }

  drawSimulatedQr(ctx, x, y, size, seedStr) {
    const modules = 25;
    const cellSize = size / modules;

    // Outer boundary
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(x, y, size, size);
    ctx.fillStyle = "#000000";

    // Pseudo-random deterministic generator based on seed
    let seed = 0;
    for (let i = 0; i < seedStr.length; i++) {
      seed = (seed * 31 + seedStr.charCodeAt(i)) % 1000000;
    }

    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    // Matrix array
    const grid = Array(modules).fill(0).map(() => Array(modules).fill(false));

    // Draw Corner Pos Markers (Top-Left, Top-Right, Bottom-Left)
    const drawCorner = (r, c) => {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
            grid[r + i][c + j] = true;
          }
        }
      }
    };

    drawCorner(0, 0);
    drawCorner(0, modules - 7);
    drawCorner(modules - 7, 0);

    // Fill pseudo-random cells
    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        // Skip corner areas
        if ((r < 8 && c < 8) || (r < 8 && c >= modules - 8) || (r >= modules - 8 && c < 8)) {
          continue;
        }
        // Center Bakong logo zone
        if (r >= 10 && r <= 14 && c >= 10 && c <= 14) {
          continue;
        }
        grid[r][c] = random() > 0.52;
      }
    }

    // Render cells
    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        if (grid[r][c]) {
          ctx.fillRect(x + c * cellSize, y + r * cellSize, cellSize + 0.4, cellSize + 0.4);
        }
      }
    }

    // Center Red Bakong Emblem
    const logoSize = cellSize * 5;
    const logoX = x + (size - logoSize) / 2;
    const logoY = y + (size - logoSize) / 2;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(logoX - 2, logoY - 2, logoSize + 4, logoSize + 4);
    ctx.fillStyle = "#E11D48";
    ctx.beginPath();
    ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = `bold ${Math.round(logoSize * 0.45)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("៛", logoX + logoSize / 2, logoY + logoSize / 2);
  }
}

window.khqrService = new KhqrService();
