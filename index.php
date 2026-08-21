<?php
session_start();
$page_title = 'Parlay Calculator';
?>
<!DOCTYPE html>

<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <title>Parlay Calculator - World Cup 2026 Edition</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800;14..32,900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
    
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <div class="tile-background" id="tileBackground" aria-hidden="true"></div>
    <div class="overlay"></div>
    <div class="slide-progress" aria-hidden="true"><span></span></div>
    <div id="toast" style="position:fixed;bottom:30px;left:50%;transform:translateX(-50%) translateY(100px);background:#1a2a1f;border:1px solid #ffed00;padding:12px 24px;border-radius:40px;color:#ffed00;z-index:10000;transition:0.3s;font-weight:600;"></div>

    <div class="container">
        <div class="header">
            <div class="header-trophy" aria-hidden="true">
                <svg viewBox="0 0 96 140">
                    <defs>
                        <radialGradient id="heroTrophyGlobe" cx="30%" cy="20%" r="80%">
                            <stop offset="0" stop-color="#fff8c9"/>
                            <stop offset=".3" stop-color="#f6d56d"/>
                            <stop offset=".7" stop-color="#bd7f1d"/>
                            <stop offset="1" stop-color="#5b350b"/>
                        </radialGradient>
                        <linearGradient id="heroTrophyBody" x1="0" y1="0" x2="1" y2="1">
                            <stop stop-color="#fff2a4"/>
                            <stop offset=".25" stop-color="#e6b43e"/>
                            <stop offset=".55" stop-color="#8e5612"/>
                            <stop offset=".78" stop-color="#f0cb55"/>
                            <stop offset="1" stop-color="#63380c"/>
                        </linearGradient>
                        <linearGradient id="heroTrophyBase" x1="0" y1="0" x2="0" y2="1">
                            <stop stop-color="#f7d966"/>
                            <stop offset="1" stop-color="#68400f"/>
                        </linearGradient>
                    </defs>
                    <circle cx="48" cy="30" r="23" fill="url(#heroTrophyGlobe)" stroke="#ffe98e" stroke-width="1.5"/>
                    <path d="M31 24c8-8 17-11 29-8l7 7-6 6-10-3-4 8-10 2-8-6Z" fill="#8f5d17" opacity=".7"/>
                    <path d="M33 42c1 13 6 27 13 38l-7 18h19l-8-18c8-11 13-25 14-38-6 7-10 11-16 15-6-4-10-8-15-15Z" fill="url(#heroTrophyBody)" stroke="#f6d268" stroke-width="1.3"/>
                    <path d="M31 47c-9 8-11 20-7 31 2 7 7 12 14 14l4-10c-6-2-10-7-10-14 0-6 2-11 6-15Z" fill="url(#heroTrophyBody)"/>
                    <path d="M65 47c9 8 11 20 7 31-2 7-7 12-14 14l-4-10c6-2 10-7 10-14 0-6-2-11-6-15Z" fill="url(#heroTrophyBody)"/>
                    <path d="M39 95h18l6 15H33Z" fill="url(#heroTrophyBase)" stroke="#f2cd58"/>
                    <rect x="27" y="108" width="42" height="12" rx="4" fill="url(#heroTrophyBase)" stroke="#f5d76a" stroke-width="1.2"/>
                    <path d="M38 20c4-6 11-9 18-6" fill="none" stroke="#fff9ca" stroke-width="3.2" stroke-linecap="round" opacity=".85"/>
                    <path d="M42 51c-1 11 1 20 7 28" fill="none" stroke="#fff1a0" stroke-width="2.5" stroke-linecap="round" opacity=".64"/>
                </svg>
            </div>
            <div class="badge">WORLD CUP 2026 · THEME EDITION</div>
            <h1>PARLAY <span style="background:linear-gradient(135deg,#F4C95D,#FF7A76,#70C8FF);-webkit-background-clip:text;background-clip:text;color:transparent;">CALCULATOR</span></h1>
            <p>Hitung Parlay & Single Bet • Odds Minus/Plus • Vooran Akurat</p>
        </div>

        <div id="cardsContainer"></div>
        <button class="btn-add" id="addBtn">+ Tambah Pertandingan</button>

        <div class="stake-panel">
            <div class="stake-label">Modal Taruhan</div>
            <div class="stake-input">
                <span>Rp</span>
                <input type="number" id="stake" value="500000" min="1000" step="1000">
            </div>
        </div>

        <div class="action-bar">
            <button class="btn btn-primary" id="hitBtn">HITUNG SEKARANG</button>
            <button class="btn btn-reset" id="resetBtn">Reset Semua</button>
        </div>

        <div class="result-card" id="resultBox">
            <div class="result-header" id="resultTitle">HASIL PERHITUNGAN</div>
            <div class="stats-grid">
                <div class="stat-card"><div class="stat-label">Total Odds</div><div class="stat-value" id="resOdds">0.00</div></div>
                <div class="stat-card"><div class="stat-label">Payout</div><div class="stat-value" id="resPayout">Rp 0</div></div>
                <div class="stat-card"><div class="stat-label">Profit</div><div class="stat-value" id="resProfit">Rp 0</div></div>
                <div class="stat-card"><div class="stat-label">Stake</div><div class="stat-value" id="resStake">Rp 0</div></div>
            </div>
            <div class="detail-panel" id="stepsDetail"></div>
            <div class="copy-area" id="copyArea"></div>
            <button class="btn-copy" id="copyBtn">COPY HASIL KE MEMBER</button>
        </div>
        <div class="footer">World Cup 2026 Theme · Matchday Edition | Perhitungan Akurat Berdasarkan Skor & Voor</div>
    </div>

    <div class="team-picker-modal" id="teamPickerModal" aria-hidden="true">
        <div class="team-picker-panel" role="dialog" aria-modal="true" aria-labelledby="teamPickerTitle">
            <div class="team-picker-head">
                <div>
                    <div class="team-picker-title" id="teamPickerTitle">Pilih Team</div>
                    <div class="team-picker-subtitle" id="teamPickerSubtitle">Pilih langsung dari semua logo team</div>
                </div>
                <button type="button" class="team-picker-close" id="teamPickerClose" aria-label="Tutup">×</button>
            </div>
            <div class="team-picker-search-wrap">
                <input type="search" class="team-picker-search" id="teamPickerSearch" placeholder="Cari team (opsional)">
            </div>
            <div class="team-picker-letters" id="teamPickerLetters"></div>
            <div class="team-picker-grid" id="teamPickerGrid"></div>
            <div class="team-picker-footer">
                <button type="button" class="picker-page-btn" id="teamPickerPrev">Sebelumnya</button>
                <div class="picker-page-info" id="teamPickerPageInfo"></div>
                <button type="button" class="picker-page-btn" id="teamPickerNext">Berikutnya</button>
            </div>
        </div>
    </div>

    
<script src="assets/js/teams.js"></script>
<script src="assets/js/calculator.js"></script>
<script src="assets/js/team-picker.js"></script>
<script src="assets/js/background.js"></script>
<script src="assets/js/app.js"></script>
</body>
</html>
