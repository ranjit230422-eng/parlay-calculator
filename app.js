        const backgroundSlides=["data:image/webp;base64,UklGRkYUAgBXRUJQVlA4IDoUAgBQhgedASqABzgEPmEwlEekIy2spTYpCbAMCWVu+86KNX15KC8cxeWMxq8tqy1rRN8K/67tk/Rl1LX0P2+f+o23LXyqW0i7hvz9cjI/wP+V/qf3U/yf7jfOFx/3k+3/w/+d/2/+B/c37ef8P/s8R/c/+j5pPRH/b/y35TfML/o/+L/Y++T+n/5v/v/5798/oU/V3/hf3P/LftT8dXsN/w
        let backgroundIndex=0;
        let backgroundRotationTimer=null;
        const rotateSideTeamBackground=false;
        const tileBackground=document.getElementById('tileBackground');
        const backgroundTiles=[];
        let featuredTeamBackgrounds=[];
        function setTeamTile(tile,team){
            tile.style.setProperty('--team-hue',String(team.hue));
            tile.querySelector('.tile-photo').src=team.logo;
            tile.querySelector('.team-tile-name').textContent=team.label;
        }
        function initializeTeamLogoBackground(teams){
            featuredTeamBackgrounds=teams.filter(team=>team.logo);
            if(!featuredTeamBackgrounds.length)return;
            tileBackground.replaceChildren();
            backgroundTiles.length=0;
            for(let tileIndex=0;tileIndex<12;tileIndex++){
                const tile=document.createElement('div');
                const tilePhoto=document.createElement('img');
                const teamTileName=document.createElement('div');
                tile.className='background-tile';
                tilePhoto.className='tile-photo';
                tilePhoto.alt='';
                tilePhoto.decoding='async';
                tilePhoto.draggable=false;
                teamTileName.className='team-tile-name';
                tile.append(tilePhoto,teamTileName);
                setTeamTile(tile,featuredTeamBackgrounds[tileIndex%featuredTeamBackgrounds.length]);
                tileBackground.appendChild(tile);
                backgroundTiles.push(tile);
            }
            if(backgroundRotationTimer)clearInterval(backgroundRotationTimer);
            if(rotateSideTeamBackground) backgroundRotationTimer=setInterval(rotateBackground,10000);
        }
        function rotateBackground(){
            if(!featuredTeamBackgrounds.length)return;
            backgroundIndex=(backgroundIndex+12)%featuredTeamBackgrounds.length;
            backgroundTiles.forEach((tile,tileIndex)=>{
                setTimeout(()=>{
                    tile.classList.add('changing');
                    setTimeout(()=>{
                        setTeamTile(tile,featuredTeamBackgrounds[(backgroundIndex+tileIndex)%featuredTeamBackgrounds.length]);
                        tile.classList.remove('changing');
                    },260);
                },tileIndex*45);
            });
        }
        function showToast(msg){
            const toast = document.getElementById('toast');
            toast.textContent = msg;
            toast.style.transform = 'translateX(-50%) translateY(0)';
            setTimeout(()=>{
                toast.style.transform = 'translateX(-50%) translateY(100px)';
            },2500);
        }
        let cardCounter = 0;
        const defaultCards = [
            { home:"Uruguay", away:"Ghana", hs:2, as:0, line:"-0.75", odds:1.90, type:"ah", side:"home" },
            { home:"Brazil", away:"Argentina", hs:1, as:1, line:"0", odds:1.85, type:"ah", side:"home" },
            { home:"Portugal", away:"Spain", hs:2, as:1, line:"", odds:1.45, type:"1x2", side:"home" }
        ];
        function buildLineOptions(type,selected){
            const values=[];
            if(type==='ou'){
                for(let value=.5;value<=8.5;value+=.25) values.push(Number(value.toFixed(2)));
            }else{
                for(let value=-5;value<=5;value+=.25) values.push(Number(value.toFixed(2)));
            }
            let target=Number(selected);
            if(!Number.isFinite(target)) target=type==='ou'?2.5:0;
            target=Number(target.toFixed(2));
            if(!values.includes(target)) values.push(target);
            values.sort((a,b)=>a-b);
            return values.map(value=>{
                const raw=String(Number(value.toFixed(2)));
                const label=type==='ah'&&value>0?`+${raw}`:raw;
                return `<option value="${raw}" ${value===target?'selected':''}>${label}</option>`;
            }).join('');
        }
        function addCard(data=null){
            cardCounter++;
            const d = data || { home:"", away:"", hs:0, as:0, line:"", odds:1.90, type:"ah", side:"home" };
            const html = `
                <div class="match-card" data-id="${cardCounter}">
                    <div class="card-header">
                        <span class="match-number">MATCH ${cardCounter}</span>
                        <div style="display:flex;gap:12px;">
                            <div class="match-status status-push">STATUS</div>
                            <div class="live-tag"><span class="live-dot"></span> LIVE</div>
                            <button class="btn-remove" onclick="removeCard(this)">X</button>
                        </div>
                    </div>
                    <div class="teams-row">
                        <div class="team-box"><div class="team-label">HOME</div><div class="team-emblem home-emblem">${escapeHtml(getInitials(d.home))}</div><button type="button" class="team-input team-picker-trigger card-home" value="${escapeHtml(d.home)}" onclick="openTeamPicker(this)"><span class="team-picker-label">${escapeHtml(d.home||'Pilih Home')}</span><span class="picker-arrow">▼</span></button></div>
                        <div class="match-center">
                            <div class="vs world-cup-trophy" aria-label="VS">
                                <svg viewBox="0 0 90 116" role="img" aria-hidden="true">
                                    <defs>
                                        <radialGradient id="trophyGlobe" cx="32%" cy="22%" r="78%">
                                            <stop offset="0" stop-color="#fff7c5"/>
                                            <stop offset=".28" stop-color="#f8d96f"/>
                                            <stop offset=".68" stop-color="#c88921"/>
                                            <stop offset="1" stop-color="#70420f"/>
                                        </radialGradient>
                                        <linearGradient id="trophyBody" x1="0" y1="0" x2="1" y2="1">
                                            <stop stop-color="#fff3aa"/>
                                            <stop offset=".25" stop-color="#e9b943"/>
                                            <stop offset=".58" stop-color="#9f6417"/>
                                            <stop offset=".78" stop-color="#f5d461"/>
                                            <stop offset="1" stop-color="#75420e"/>
                                        </linearGradient>
                                        <linearGradient id="trophyBase" x1="0" y1="0" x2="0" y2="1">
                                            <stop stop-color="#f9db68"/><stop offset="1" stop-color="#71400f"/>
                                        </linearGradient>
                                        <filter id="trophyDepth" x="-40%" y="-30%" width="180%" height="190%">
                                            <feDropShadow dx="0" dy="7" stdDeviation="5" flood-color="#000" flood-opacity=".62"/>
                                            <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#ffd96b" flood-opacity=".36"/>
                                        </filter>
                                    </defs>
                                    <g filter="url(#trophyDepth)">
                                        <circle cx="45" cy="27" r="21" fill="url(#trophyGlobe)" stroke="#ffe991" stroke-width="1.4"/>
                                        <path d="M29 21c7-7 15-10 27-8l6 7-5 5-9-2-3 7-9 2-8-5Z" fill="#9b691c" opacity=".72"/>
                                        <path d="M53 31l9 2-3 8-8 5-5-7Z" fill="#704613" opacity=".66"/>
                                        <path d="M31 38c1 12 5 24 12 34l-7 15h18l-7-15c8-10 11-22 12-34-5 6-9 10-14 14-5-4-9-8-14-14Z" fill="url(#trophyBody)" stroke="#f9d76c" stroke-width="1.2"/>
                                        <path d="M29 42c-8 7-10 17-7 27 2 6 7 10 13 12l4-9c-6-2-9-6-9-12 0-5 2-9 5-13Z" fill="url(#trophyBody)"/>
                                        <path d="M61 42c8 7 10 17 7 27-2 6-7 10-13 12l-4-9c6-2 9-6 9-12 0-5-2-9-5-13Z" fill="url(#trophyBody)"/>
                                        <path d="M37 82h16l5 12H32Z" fill="url(#trophyBase)" stroke="#f5d15b" stroke-width="1"/>
                                        <rect x="27" y="93" width="36" height="10" rx="4" fill="url(#trophyBase)" stroke="#f6db71" stroke-width="1.2"/>
                                        <path d="M36 18c4-6 10-8 16-6" fill="none" stroke="#fff8c7" stroke-width="3" stroke-linecap="round" opacity=".82"/>
                                        <path d="M40 46c-1 10 1 18 6 25" fill="none" stroke="#fff3a5" stroke-width="2.4" stroke-linecap="round" opacity=".66"/>
                                    </g>
                                </svg>
                                <span>VS</span>
                            </div>
                            <div class="score-area">
                                <input type="number" class="score-input home-score" value="${d.hs}" min="0">
                                <span class="score-sep">—</span>
                                <input type="number" class="score-input away-score" value="${d.as}" min="0">
                            </div>
                        </div>
                        <div class="team-box"><div class="team-label">AWAY</div><div class="team-emblem away-emblem">${escapeHtml(getInitials(d.away))}</div><button type="button" class="team-input team-picker-trigger card-away" value="${escapeHtml(d.away)}" onclick="openTeamPicker(this)"><span class="team-picker-label">${escapeHtml(d.away||'Pilih Away')}</span><span class="picker-arrow">▼</span></button></div>
                    </div>
                    <div class="settings-grid">
                        <div class="field"><label>Jenis Taruhan</label><select class="card-type"><option value="ah" ${d.type==='ah'?'selected':''}>Asian Handicap</option><option value="ou" ${d.type==='ou'?'selected':''}>Over/Under</option><option value="1x2" ${d.type==='1x2'?'selected':''}>1X2</option></select></div>
                        <div class="field line-field"><label>${d.type==='ou'?'Line O/U':'Vooran'}</label><select class="card-line" data-line-type="${d.type}">${buildLineOptions(d.type,d.line)}</select></div>
                        <div class="field"><label>Pilihan</label><select class="card-side"></select></div>
                        <div class="field"><label>Odds</label><input type="number" class="card-odds" value="${formatOdds(d.odds)}" step="any" onblur="this.value=formatOdds(this.value)"></div>
                    </div>
                </div>
            `;
            document.getElementById('cardsContainer').insertAdjacentHTML('beforeend',html);
            const newCard = document.querySelector('.match-card:last-child');
            updateSide(newCard.querySelector('.card-home'));
            const typeSel = newCard.querySelector('.card-type');
            typeSel.addEventListener('change',function(){ toggleTypeInCard(this.closest('.match-card')); });
            toggleTypeInCard(newCard);
            newCard.querySelector('.card-side').value = d.side;
            newCard.addEventListener('input',()=>updateMatchStatus(newCard));
            newCard.addEventListener('change',()=>updateMatchStatus(newCard));
            updateMatchStatus(newCard);
        }
        function escapeHtml(str){ if(!str) return ''; return str.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]);}
        function getInitials(name){
            const words=(name||'TEAM').trim().split(/\s+/).filter(Boolean);
            return words.slice(0,2).map(word=>word[0]).join('').toUpperCase()||'TM';
        }
        function getFlag(name){
            const flags={
                uruguay:'🇺🇾',ghana:'🇬🇭',brazil:'🇧🇷',brasil:'🇧🇷',argentina:'🇦🇷',portugal:'🇵🇹',spain:'🇪🇸',spanyol:'🇪🇸',
                indonesia:'🇮🇩',japan:'🇯🇵',jepang:'🇯🇵',korea:'🇰🇷','south korea':'🇰🇷',china:'🇨🇳',australia:'🇦🇺',england:'🏴',
                france:'🇫🇷',prancis:'🇫🇷',germany:'🇩🇪',jerman:'🇩🇪',italy:'🇮🇹',italia:'🇮🇹',netherlands:'🇳🇱',belanda:'🇳🇱',
                belgium:'🇧🇪',belgia:'🇧🇪',croatia:'🇭🇷',kroasia:'🇭🇷',mexico:'🇲🇽',meksiko:'🇲🇽',usa:'🇺🇸','united states':'🇺🇸',
                canada:'🇨🇦',morocco:'🇲🇦',maroko:'🇲🇦',senegal:'🇸🇳',cameroon:'🇨🇲',kamerun:'🇨🇲',nigeria:'🇳🇬',egypt:'🇪🇬',mesir:'🇪🇬'
            };
            return flags[(name||'').trim().toLowerCase()]||'';
        }
        const teamLogos={"07 vestur":"data:image/webp;base64,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
        const featuredTeamLogosHD={"real madrid":"data:image/webp;base64,UklGRgSWAABXRUJQVlA4TPiVAAAv/8F/EO8HObJt1cpe+8kXXOIhIAJn/EfY2fceJAlIsm2nja70v9IMcxr1tPe/JqaA/J8IciRJiqSs6h1Y+u4eCHICnFwn7AnATBnpOJJtVenVV9xZkQR5EqG7u2sdeuXfU+aI0TE6Ro8hREhDhNEQIUJkEUpIoMIiRP+icFp8x5cIJSQszdJs9hgdswfMNGZZbyJESLParMISKCGyKCKrsAhDGB2jx2ih2aBB+yAEmnoIzUSOzWiJKq38AUCAiGhC6C30Eno2OgmdhJ5N34VqovLg5kyiFZOYxCRWkocOTAVCxUYxVCwqEopASaNUKCOUCEVCiahiJ8WginJuWpr2TGdL1VUOG7AgBwYy7GGDDLbAYIfdcLjAZt6ZPZRhgwsw2OFidmCwQ/ZvKWEHZljYotO/pRS74cDMDjtczA7c7EEOcigFKciBAYcdLmaH3VyAwwYMdmCwww4c/xoZWJBBDizIIIeSKAWEaGAiQAAQEAav4xatqRdm0SiaRaOgRjRiIBp1YBvYBtSIhhoapEY0oi02mUe4TnQsrhvUCfu2lxXHjdp+sJ8wWRNjqD7aOkyWya7rVLqz0ntc+n9i/H5+mN/7lfn8y373Z18nX/thG9eu7xfH68nxelLl3kd987m9WW5erDevLl9P3t+Ovn8P6rCo1z8vzzeudtfe7u/cvzxI0JIkqZIkpbn7sNDQ9z8wkA9a9j+i/xPA1/37r8af468ZQ0bPl99IuCJ1/QWNAmDm3jUOM2ADvQsSIJzjfonuhSaiTr/6Mf0CqRmg9w4gKVw6xNiU3vuqrUjSoxffEHa/JE2m1sXVk/QjdDWTRmIkV4n8M9Wg6wgjMTSjAEISEogcIHWZBFkEB1tF2ETpJ5iIoLA2gIWRyQlC6oU39fIzws2uSZpKAbAPuGn2JQClc26XeDz0nw96uf85H2Q/KqUAySH2C1BKoSRHeMl4AiUpSb7zctT6yCXrr7wmeeIb+cb7JPdsc4Tv5Y4nNjkiy03xInu95yfsF7+rWpO81lrb+AHY9qKmJnpLbV7NuwYk9pTUWqV3pNZ8LyTX5Zkk9lS/aE2ttXZn9pylk5rUWutbHtIXtj2ptkjvrG2rudn2DSdeKVq+oX2s1ha+4ZW1/ybSP6+n5LSHsZ14f30zXlkmh7zJNjkvi7HokJyXSYwVyWlKbiyTs6qUPCCxrXOqlGz6guSMKqnWmqWYJwNJPkH6naqUrcRYOQFiS03tPVRn6QnYiYDp95OqWmsiLQp37E1r7TWkOieRpgD9nm3/ttZfi1RrYltSmdluEs/yW0QlO5UC2uwXzR+k3ZHoYnSSG7Ytf0CWj0g23n+VG53egWThA1hlM08kwDiCVe6skzF8BouSPIHhU5gC8Pt7j3MgyQ8vngSU8vPziLP+TykQA7iN24AAcfvvbMt2nwEiYgL0dv7xnRn6E7eeMZd9f8PMMH8a4Ec0o+EnBpv5enc32Gqy35K0rSSx/hC29wa8Lwdb+GDZfhFhbCTAg8mzEVHdBtXUivJIQTVgXAAlejKKWrWubYtKypMVitXWdqu2EXrgIHR5yIvbF34ZIqJHivMmr8ieJ4okOBmhJxsh5KqtRAton05Q6zSoV5Q8U2hrKdyY7Ev5vrfY+9bW7m6vzsofwqZXScoXExJsqcl8LMkmmceabWt7JreRzmd/byIiM+EdJQgkBYoEQSMvrb4FmdVXoFm7Wfeo7qK972txs/K+SkURHvRIRCLD/O87iMD
        const nationalTeamLogoUrlsHD={"Albania":"https:
        function featuredTeamHue(key){
            let hash=0;
            for(let index=0;index<key.length;index++)hash=((hash<<5)-hash)+key.charCodeAt(index);
            return Math.abs(hash)%360;
        }
        const featuredTeamBackgroundsData=[
            ['real madrid','Real Madrid'],
            ['barcelona','Barcelona'],
            ['manchester city','Manchester City'],
            ['liverpool','Liverpool'],
            ['arsenal','Arsenal'],
            ['manchester united','Manchester United'],
            ['chelsea','Chelsea'],
            ['bayern munich','Bayern Munich'],
            ['borussia dortmund','Borussia Dortmund'],
            ['paris saint germain psg','Paris Saint-Germain'],
            ['inter','Inter Milan'],
            ['milan','AC Milan'],
            ['juventus','Juventus'],
            ['napoli','Napoli'],
            ['atletico madrid','Atletico Madrid'],
            ['bayer leverkusen','Bayer Leverkusen'],
            ['benfica','Benfica'],
            ['fc porto','FC Porto'],
            ['ajax','Ajax'],
            ['flamengo','Flamengo'],
            ['palmeiras','Palmeiras'],
            ['river plate','River Plate'],
            ['boca juniors','Boca Juniors'],
            ['al hilal','Al Hilal']
        ].map(([key,label])=>({key,label,logo:featuredTeamLogosHD[key]||teamLogos[key],hue:featuredTeamHue(key)})).filter(team=>team.logo);
        const referenceSideTeamOrder=['Norway','Paraguay','Qatar','Panama','Palestine','Russia'];
        const nationalTeamBackgroundsData=[
            ...referenceSideTeamOrder.map(label=>[label,nationalTeamLogoUrlsHD[label]]),
            ...Object.entries(nationalTeamLogoUrlsHD).filter(([label])=>!referenceSideTeamOrder.includes(label))
        ].map(([label,logo])=>({key:label.toLowerCase(),label,logo,hue:featuredTeamHue(label)}));
        initializeTeamLogoBackground(nationalTeamBackgroundsData);
        const teamPickerNames=Object.keys(teamLogos).sort((a,b)=>a.localeCompare(b));
        const teamPickerPageSize=50;
        let activeTeamButton=null;
        let teamPickerPage=0;
        let activeTeamLetter='';
        let filteredTeamPickerNames=teamPickerNames;
        function getTeamKey(name){
            return (name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
        }
        function getTeamLogo(name){ return teamLogos[getTeamKey(name)]||''; }
        function formatTeamName(name){
            const small=new Set(['and','of','de','da','do','dos','del']);
            const caps=new Set(['fc','afc','ac','sc','cf','cd','fk','sv','sk','bk','if','ik','us','usa','u23','u21','u20','ii']);
            return (name||'').split(' ').map((word,index)=>caps.has(word)?word.toUpperCase():(index>0&&small.has(word)?word:word.charAt(0).toUpperCase()+word.slice(1))).join(' ');
        }
        function openTeamPicker(button){
            activeTeamButton=button;
            teamPickerPage=0;
            activeTeamLetter='';
            filteredTeamPickerNames=teamPickerNames;
            const search=document.getElementById('teamPickerSearch');
            search.value='';
            const side=button.classList.contains('card-home')?'HOME':'AWAY';
            document.getElementById('teamPickerTitle').textContent=`Pilih Team ${side}`;
            const modal=document.getElementById('teamPickerModal');
            modal.classList.add('show');
            modal.setAttribute('aria-hidden','false');
            renderTeamLetters();
            renderTeamPicker();
        }
        function closeTeamPicker(){
            const modal=document.getElementById('teamPickerModal');
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden','true');
            activeTeamButton=null;
        }
        function renderTeamPicker(){
            const grid=document.getElementById('teamPickerGrid');
            grid.replaceChildren();
            const totalPages=Math.max(1,Math.ceil(filteredTeamPickerNames.length/teamPickerPageSize));
            teamPickerPage=Math.min(teamPickerPage,totalPages-1);
            const start=teamPickerPage*teamPickerPageSize;
            const names=filteredTeamPickerNames.slice(start,start+teamPickerPageSize);
            if(!names.length){
                const empty=document.createElement('div');
                empty.className='team-picker-empty';
                empty.textContent='Team tidak ditemukan';
                grid.appendChild(empty);
            }
            names.forEach(key=>{
                const choice=document.createElement('button');
                choice.type='button';
                choice.className='team-choice';
                const img=document.createElement('img');
                img.src=teamLogos[key];
                img.alt=`Logo ${formatTeamName(key)}`;
                img.loading='lazy';
                const label=document.createElement('span');
                label.textContent=formatTeamName(key);
                choice.append(img,label);
                choice.addEventListener('click',()=>selectTeam(key));
                grid.appendChild(choice);
            });
            document.getElementById('teamPickerPrev').disabled=teamPickerPage===0;
            document.getElementById('teamPickerNext').disabled=teamPickerPage>=totalPages-1;
            document.getElementById('teamPickerPageInfo').textContent=`${filteredTeamPickerNames.length.toLocaleString('id-ID')} team · Halaman ${teamPickerPage+1}/${totalPages}`;
            grid.scrollTop=0;
        }
        function renderTeamLetters(){
            const letters=document.getElementById('teamPickerLetters');
            letters.replaceChildren();
            ['','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'].forEach(letter=>{
                const button=document.createElement('button');
                button.type='button';
                button.className=`team-letter${letter===activeTeamLetter?' active':''}`;
                button.dataset.label=letter||'SEMUA';
                button.setAttribute('aria-label',letter?`Team huruf ${letter}`:'Semua team');
                button.addEventListener('click',()=>filterTeamByLetter(letter));
                letters.appendChild(button);
            });
        }
        function filterTeamByLetter(letter){
            activeTeamLetter=letter;
            document.getElementById('teamPickerSearch').value='';
            filteredTeamPickerNames=letter?teamPickerNames.filter(name=>name.startsWith(letter.toLowerCase())):teamPickerNames;
            teamPickerPage=0;
            renderTeamLetters();
            renderTeamPicker();
        }
        function selectTeam(key){
            if(!activeTeamButton) return;
            const name=formatTeamName(key);
            activeTeamButton.value=name;
            activeTeamButton.querySelector('.team-picker-label').textContent=name;
            const card=activeTeamButton.closest('.match-card');
            updateSide(activeTeamButton);
            updateMatchStatus(card);
            closeTeamPicker();
        }
        function filterTeamPicker(){
            const query=getTeamKey(document.getElementById('teamPickerSearch').value);
            activeTeamLetter='';
            filteredTeamPickerNames=query?teamPickerNames.filter(name=>name.includes(query)):teamPickerNames;
            teamPickerPage=0;
            renderTeamLetters();
            renderTeamPicker();
        }
        function emblemGradient(name){
            let hash=0;
            for(const char of (name||'TEAM')) hash=((hash<<5)-hash)+char.charCodeAt(0);
            const hue=Math.abs(hash)%360;
            return `linear-gradient(145deg,hsl(${hue} 78% 54%),hsl(${(hue+42)%360} 72% 22%) 67%,hsl(${(hue+190)%360} 75% 28%))`;
        }
        function updateTeamEmblem(card,side,name){
            const emblem=card.querySelector(`.${side}-emblem`);
            if(!emblem) return;
            const key=getTeamKey(name);
            const logo=teamLogos[key];
            const flag=getFlag(name);
            emblem.classList.toggle('has-logo',Boolean(logo));
            emblem.classList.toggle('flag',Boolean(flag&&!logo));
            emblem.replaceChildren();
            if(logo){
                const img=document.createElement('img');
                img.className='team-logo-img';
                img.src=logo;
                img.alt=`Logo ${name||'team'}`;
                img.onerror=()=>{
                    emblem.classList.remove('has-logo');
                    emblem.textContent=flag||getInitials(name);
                    emblem.classList.toggle('flag',Boolean(flag));
                    emblem.style.background=flag?'linear-gradient(145deg,rgba(255,255,255,.25),rgba(0,0,0,.35))':emblemGradient(name);
                };
                emblem.appendChild(img);
                emblem.style.background='radial-gradient(circle at 35% 25%,#fff 0,#eef3f8 52%,#aebdcc 100%)';
            }else{
                emblem.textContent=flag||getInitials(name);
                emblem.style.background=flag?'linear-gradient(145deg,rgba(255,255,255,.25),rgba(0,0,0,.35))':emblemGradient(name);
            }
            emblem.title=name||'Team';
        }
        function removeCard(btn){ btn.closest('.match-card').remove(); reindex(); }
        function reindex(){ document.querySelectorAll('.match-card').forEach((c,i)=>{ c.querySelector('.match-number').innerText = `MATCH ${i+1}`; }); }
        function updateSide(inp){
            const card = inp.closest('.match-card');
            const home = card.querySelector('.card-home').value||'Home';
            const away = card.querySelector('.card-away').value||'Away';
            const type = card.querySelector('.card-type').value;
            const sideSel = card.querySelector('.card-side');
            const currentSide = sideSel.value;
            updateTeamEmblem(card,'home',home);
            updateTeamEmblem(card,'away',away);
            if(type==='1x2') sideSel.innerHTML = `<option value="home">${home}</option><option value="away">${away}</option><option value="draw">Draw</option>`;
            else if(type==='ah') sideSel.innerHTML = `<option value="home">${home}</option><option value="away">${away}</option>`;
            else sideSel.innerHTML = `<option value="over">Over</option><option value="under">Under</option>`;
            if([...sideSel.options].some(option=>option.value===currentSide)) sideSel.value=currentSide;
            updateMatchStatus(card);
        }
        function toggleTypeInCard(card){
            const type = card.querySelector('.card-type').value;
            const lineField = card.querySelector('.line-field');
            if(type==='1x2') lineField.style.display = 'none';
            else {
                lineField.style.display = 'flex';
                lineField.querySelector('label').innerText = type==='ou'?'Line O/U':'Vooran';
                const lineSelect=lineField.querySelector('.card-line');
                if(lineSelect.dataset.lineType!==type){
                    lineSelect.innerHTML=buildLineOptions(type,type==='ou'?2.5:0);
                    lineSelect.dataset.lineType=type;
                }
            }
            updateSide(card.querySelector('.card-home'));
        }
        function calcAH(home, away, line, side){
            const selectedScore = side==='away' ? away : home;
            const opponentScore = side==='away' ? home : away;
            let diff = selectedScore - opponentScore + line;
            const isQuarter = Math.abs(line*2)%1 !== 0;
            if(!isQuarter){
                if(diff>0) return {status:'WIN', desc:'menang penuh', factor:1};
                if(diff<0) return {status:'LOSE', desc:'kalah', factor:0};
                return {status:'PUSH', desc:'Push', factor:1};
            }
            const low = Math.floor(line*2)/2, high = Math.ceil(line*2)/2;
            const dLow = selectedScore - opponentScore + low, dHigh = selectedScore - opponentScore + high;
            const rL = dLow>0?'W':(dLow<0?'L':'P'), rH = dHigh>0?'W':(dHigh<0?'L':'P');
            if(rL==='W' && rH==='W') return {status:'WIN', desc:'menang penuh', factor:1};
            if(rL==='L' && rH==='L') return {status:'LOSE', desc:'kalah', factor:0};
            if(rL==='P' && rH==='P') return {status:'PUSH', desc:'Push', factor:1};
            if((rL==='W' && rH==='P')||(rL==='P' && rH==='W')) return {status:'HALF_WIN', desc:'menang setengah', factor:0.5};
            if((rL==='L' && rH==='P')||(rL==='P' && rH==='L')) return {status:'HALF_LOSE', desc:'kalah setengah', factor:0.5};
            return {status:'PUSH', desc:'Push', factor:1};
        }
        function calc12(home, away, side){
            const diff = home-away;
            if(side==='home') return diff>0?{status:'WIN',desc:'menang penuh',factor:1}:diff<0?{status:'LOSE',desc:'kalah',factor:0}:{status:'PUSH',desc:'Push',factor:1};
            if(side==='away') return diff<0?{status:'WIN',desc:'menang penuh',factor:1}:diff>0?{status:'LOSE',desc:'kalah',factor:0}:{status:'PUSH',desc:'Push',factor:1};
            return diff===0?{status:'WIN',desc:'menang penuh',factor:1}:{status:'LOSE',desc:'kalah',factor:0};
        }
        function calcOU(total, line, side){
            const isQuarter = Math.abs(line*2)%1 !== 0;
            if(!isQuarter){
                if(side==='over') return total>line?{status:'WIN',desc:'menang penuh',factor:1}:total<line?{status:'LOSE',desc:'kalah',factor:0}:{status:'PUSH',desc:'Push',factor:1};
                return total<line?{status:'WIN',desc:'menang penuh',factor:1}:total>line?{status:'LOSE',desc:'kalah',factor:0}:{status:'PUSH',desc:'Push',factor:1};
            }
            const low = Math.floor(line*2)/2, high = Math.ceil(line*2)/2;
            const rL = side==='over'?(total>low?'W':total<low?'L':'P'):(total<low?'W':total>low?'L':'P');
            const rH = side==='over'?(total>high?'W':total<high?'L':'P'):(total<high?'W':total>high?'L':'P');
            if(rL==='W' && rH==='W') return {status:'WIN',desc:'menang penuh',factor:1};
            if(rL==='L' && rH==='L') return {status:'LOSE',desc:'kalah',factor:0};
            if(rL==='P' && rH==='P') return {status:'PUSH',desc:'Push',factor:1};
            if((rL==='W' && rH==='P')||(rL==='P' && rH==='W')) return {status:'HALF_WIN',desc:'menang setengah',factor:0.5};
            return {status:'HALF_LOSE',desc:'kalah setengah',factor:0.5};
        }
        function statusClass(status){
            if(status==='WIN') return 'status-win';
            if(status==='LOSE') return 'status-lose';
            if(status==='PUSH') return 'status-push';
            return 'status-half';
        }
        function readCardResult(card){
            const homeScore=Number(card.querySelector('.home-score').value)||0;
            const awayScore=Number(card.querySelector('.away-score').value)||0;
            const type=card.querySelector('.card-type').value;
            const side=card.querySelector('.card-side').value;
            const line=Number(card.querySelector('.card-line').value)||0;
            if(type==='ah') return calcAH(homeScore,awayScore,line,side);
            if(type==='ou') return calcOU(homeScore+awayScore,line,side);
            return calc12(homeScore,awayScore,side);
        }
        function updateMatchStatus(card){
            if(!card || !card.querySelector('.card-side').value) return;
            const result=readCardResult(card);
            const status=card.querySelector('.match-status');
            status.className=`match-status ${statusClass(result.status)}`;
            status.textContent=result.desc.toUpperCase();
        }
        function formatOdds(value){
            const number=Number(value);
            if(!Number.isFinite(number)) return '0';
            return Number(number.toFixed(12)).toString();
        }
        function hitungSekarang(){
            const cards = document.querySelectorAll('.match-card');
            if(cards.length===0){ alert('Tambahkan minimal 1 pertandingan'); return; }
            const stake = parseFloat(document.getElementById('stake').value) || 0;
            let details = [];
            for(let card of cards){
                const home = card.querySelector('.card-home').value||'Home';
                const away = card.querySelector('.card-away').value||'Away';
                const hs = parseInt(card.querySelector('.home-score').value)||0;
                const as = parseInt(card.querySelector('.away-score').value)||0;
                const type = card.querySelector('.card-type').value;
                let lineRaw = card.querySelector('.card-line').value;
                if(type==='ou' && !lineRaw) lineRaw='2.5';
                if(type==='ah' && !lineRaw) lineRaw='0';
                const line = parseFloat(lineRaw)||0;
                const side = card.querySelector('.card-side').value;
                const rawOdds = parseFloat(card.querySelector('.card-odds').value)||1.0;
                const decOdds = rawOdds<0 ? 1+(1/Math.abs(rawOdds)) : rawOdds;
                let res;
                if(type==='ah') res = calcAH(hs,as,line,side);
                else if(type==='1x2') res = calc12(hs,as,side);
                else res = calcOU(hs+as,line,side);
                let effOdds = 1;
                if(res.status==='WIN') effOdds = decOdds;
                else if(res.status==='LOSE'){ effOdds=0; }
                else if(res.status==='PUSH') effOdds=1;
                else if(res.status==='HALF_WIN') effOdds = 1+(decOdds-1)*0.5;
                else if(res.status==='HALF_LOSE') effOdds=0.5;
                details.push({home,away,hs,as,type,line,side,rawOdds,decOdds,res,effOdds});
            }
            let totalOdds = 1;
            for(let d of details){
                if(d.res.status==='LOSE'){ totalOdds=0; break; }
                totalOdds *= d.effOdds;
            }
            let payout = stake * totalOdds;
            let profit = payout - stake;
            let isSingle = cards.length===1;
            let output = '';
            if(isSingle){
                const d = details[0];
                const sideName = d.type==='ah' ? (d.side==='home' ? d.home : d.away) :
                                 (d.type==='1x2' ? (d.side==='home' ? d.home : (d.side==='away' ? d.away : 'Draw')) :
                                 (d.side==='over' ? 'Over' : 'Under'));
                const voorText = (d.type==='ah' || d.type==='ou') ? d.line : '';
                output = `=== HASIL SINGLE BET ===\n${d.home} vs ${d.away}\nPilihan: ${sideName} ${voorText}\nOdds: ${formatOdds(d.rawOdds)}\nTaruhan: Rp ${stake.toLocaleString('id-ID')}\nSkor akhir: ${d.hs} - ${d.as}\n\n`;
                if(d.res.status === 'WIN'){
                    if(d.rawOdds < 0){
                        const absOdds = Math.abs(d.rawOdds);
                        const totalBayar = stake * absOdds;
                        const keuntungan = stake;
                        const totalKembali = totalBayar + keuntungan;
                        const vooranNilai = Math.abs(d.line);
                        const lawanVoor = (d.side === 'home' ? d.away : d.home);
                        output += `Anda MENANG PENUH\n\n`;
                        output += `Vooran ${vooranNilai} (${vooranNilai}) untuk ${lawanVoor}\n`;
                        output += `Odds MINUS ${formatOdds(d.rawOdds)} → anda membayar lebih:\n`;
                        output += `${stake.toLocaleString('id-ID')} x ${formatOdds(absOdds)} = ${totalBayar.toLocaleString('id-ID')}\n`;
                        output += `Karena menang, anda mendapatkan:\n`;
                        output += `Keuntungan = ${keuntungan.toLocaleString('id-ID')}\n`;
                        output += `Total diterima = ${totalKembali.toLocaleString('id-ID')}`;
                        payout = totalKembali;
                        profit = keuntungan;
                    } else {
                        const keuntungan = stake * d.rawOdds;
                        const totalKembali = stake + keuntungan;
                        output += `Anda MENANG PENUH\n\n`;
                        output += `Odds PLUS ${formatOdds(d.rawOdds)}:\n`;
                        output += `Keuntungan = ${keuntungan.toLocaleString('id-ID')}\n`;
                        output += `Total diterima = ${totalKembali.toLocaleString('id-ID')}`;
                        payout = totalKembali;
                        profit = keuntungan;
                    }
                }
                else if(d.res.status === 'LOSE'){
                    if(d.rawOdds < 0){
                        const totalBayar = stake * Math.abs(d.rawOdds);
                        output += `Anda KALAH\n\n`;
                        output += `Kerugian = ${totalBayar.toLocaleString('id-ID')}`;
                        profit = -totalBayar;
                        payout = 0;
                    } else {
                        output += `Anda KALAH\n\n`;
                        output += `Kerugian = ${stake.toLocaleString('id-ID')}`;
                        profit = -stake;
                        payout = 0;
                    }
                }
                else if(d.res.status === 'PUSH'){
                    if(d.rawOdds < 0){
                        const totalBayar = stake * Math.abs(d.rawOdds);
                        output += `Hasil PUSH (SERI)\n\n`;
                        output += `Odds MINUS ${formatOdds(d.rawOdds)} → anda membayar lebih: ${stake.toLocaleString('id-ID')} x ${formatOdds(Math.abs(d.rawOdds))} = ${totalBayar.toLocaleString('id-ID')}\n`;
                        output += `Karena seri, seluruh modal yang anda bayarkan dikembalikan = ${totalBayar.toLocaleString('id-ID')}`;
                        profit = 0;
                        payout = totalBayar;
                    } else {
                        output += `Hasil PUSH (SERI)\n\n`;
                        output += `Odds PLUS ${formatOdds(d.rawOdds)} → anda bertaruh Rp ${stake.toLocaleString('id-ID')}\n`;
                        output += `Karena seri, modal dikembalikan = ${stake.toLocaleString('id-ID')}`;
                        profit = 0;
                        payout = stake;
                    }
                }
                else if(d.res.status === 'HALF_WIN'){
                    if(d.rawOdds < 0){
                        const absOdds = Math.abs(d.rawOdds);
                        const totalBayar = stake * absOdds;
                        const keuntunganFull = stake;
                        const keuntunganSetengah = keuntunganFull / 2;
                        const totalKembali = totalBayar + keuntunganSetengah;
                        const vooranNilai = Math.abs(d.line);
                        const lawanVoor = (d.side === 'home' ? d.away : d.home);
                        output += `Anda MENANG SETENGAH (1/2)\n\n`;
                        output += `Vooran ${vooranNilai} (${vooranNilai}) untuk ${lawanVoor}\n`;
                        output += `Odds MINUS ${formatOdds(d.rawOdds)} → anda membayar lebih:\n`;
                        output += `${stake.toLocaleString('id-ID')} x ${formatOdds(absOdds)} = ${totalBayar.toLocaleString('id-ID')}\n`;
                        output += `Karena menang setengah, anda mendapatkan:\n`;
                        output += `Keuntungan = ${keuntunganSetengah.toLocaleString('id-ID')}\n`;
                        output += `Total diterima = ${totalKembali.toLocaleString('id-ID')}`;
                        payout = totalKembali;
                        profit = keuntunganSetengah;
                    } else {
                        const keuntunganFull = stake * d.rawOdds;
                        const keuntunganSetengah = keuntunganFull / 2;
                        const totalKembali = stake + keuntunganSetengah;
                        output += `Anda MENANG SETENGAH (1/2)\n\n`;
                        output += `Odds PLUS ${formatOdds(d.rawOdds)}:\n`;
                        output += `Keuntungan penuh jika menang full = ${keuntunganFull.toLocaleString('id-ID')}\n`;
                        output += `Karena menang setengah, keuntungan = ${keuntunganSetengah.toLocaleString('id-ID')}\n`;
                        output += `Total diterima = ${totalKembali.toLocaleString('id-ID')}`;
                        payout = totalKembali;
                        profit = keuntunganSetengah;
                    }
                }
                else if(d.res.status === 'HALF_LOSE'){
                    if(d.rawOdds < 0){
                        const absOdds = Math.abs(d.rawOdds);
                        const totalBayar = stake * absOdds;
                        const kerugian = totalBayar / 2;
                        const sisaModal = totalBayar - kerugian;
                        const vooranNilai = Math.abs(d.line);
                        const lawanVoor = (d.side === 'home' ? d.away : d.home);
                        output += `Anda KALAH SETENGAH (1/2)\n\n`;
                        output += `Vooran ${vooranNilai} (${vooranNilai}) untuk ${lawanVoor}\n`;
                        output += `Odds MINUS ${formatOdds(d.rawOdds)} → anda membayar lebih:\n`;
                        output += `${stake.toLocaleString('id-ID')} x ${formatOdds(absOdds)} = ${totalBayar.toLocaleString('id-ID')}\n`;
                        output += `Karena kalah setengah, kerugian = ${kerugian.toLocaleString('id-ID')}\n`;
                        output += `Sisa modal yang dikembalikan = ${sisaModal.toLocaleString('id-ID')}`;
                        profit = -kerugian;
                        payout = sisaModal;
                    } else {
                        const kerugian = stake / 2;
                        const sisaModal = stake - kerugian;
                        output += `Anda KALAH SETENGAH (1/2)\n\n`;
                        output += `Odds PLUS ${formatOdds(d.rawOdds)}:\n`;
                        output += `Kerugian = ${kerugian.toLocaleString('id-ID')}\n`;
                        output += `Sisa modal = ${sisaModal.toLocaleString('id-ID')}`;
                        profit = -kerugian;
                        payout = sisaModal;
                    }
                }
                payout = stake * d.effOdds;
                profit = payout - stake;
            }
            else {
                output = `berikut ya bosku untuk perhitungan pada parlay\n*HASIL* PARLAY (${cards.length} TIM)\nStake: Rp ${stake.toLocaleString('id-ID')}\n\n`;
                for(let i=0;i<details.length;i++){
                    const d=details[i];
                    const sideName = d.type==='ah' ? (d.side==='home'?d.home:d.away) : (d.type==='1x2' ? (d.side==='home'?d.home:d.side==='away'?d.away:'Draw') : (d.side==='over'?'Over':'Under'));
                    const voor = (d.type==='ah'||d.type==='ou') ? d.line : '';
                    let stat = '';
                    if(d.res.status==='WIN') stat='MENANG PENUH';
                    else if(d.res.status==='LOSE') stat='KALAH';
                    else if(d.res.status==='PUSH') stat='PUSH (SERI)';
                    else if(d.res.status==='HALF_WIN') stat='MENANG SETENGAH';
                    else stat='KALAH SETENGAH';
                    output += `Match ${i+1}: ${d.home} vs ${d.away} (${sideName} ${voor})\nSkor: ${d.hs}-${d.as}\nStatus: ${stat} (${d.res.desc})\n`;
                    if(d.rawOdds<0) output += `konversi odds minus: 1 + (1/${Math.abs(d.rawOdds).toFixed(2)}) = ${d.decOdds.toFixed(4)}\n`;
                    output += `odds : ${d.decOdds.toFixed(3)} dengan status ${d.res.desc}\n`;
                    if(d.res.status==='WIN') output += `menang penuh -> odds efektif = ${d.effOdds.toFixed(4)}\n`;
                    else if(d.res.status==='PUSH') output += `push -> odds efektif = 1.000\n`;
                    else if(d.res.status==='HALF_WIN') output += `menang setengah -> odds efektif = ${d.effOdds.toFixed(4)}\n`;
                    else if(d.res.status==='HALF_LOSE') output += `kalah setengah -> odds efektif = 0.5\n`;
                    else output += `kalah -> odds efektif = 0\n`;
                    output += `\n`;
                }
                const steps = details.map(d=>d.effOdds.toFixed(3)).join(' x ');
                output += `Jadi hasil perhitungan nya adalah\nTotal odds = ${steps} = ${totalOdds.toFixed(4)}\n`;
                if(profit>0) output += `${totalOdds.toFixed(4)} x ${stake.toLocaleString('id-ID')} = Rp ${Math.round(payout).toLocaleString('id-ID')} (kemenangan + modal)\nKeuntungan bersih = Rp ${Math.round(profit).toLocaleString('id-ID')} ya bosku`;
                else if(profit<0) output += `Anda kalah sebesar Rp ${Math.abs(Math.round(profit)).toLocaleString('id-ID')} ya bosku`;
                else output += `Hasil impas (modal kembali) ya bosku`;
            }
            document.getElementById('resOdds').innerText = formatOdds(totalOdds);
            document.getElementById('resPayout').innerText = `Rp ${Math.round(payout).toLocaleString()}`;
            document.getElementById('resProfit').innerText = `Rp ${Math.round(profit).toLocaleString()}`;
            document.getElementById('resStake').innerText = `Rp ${stake.toLocaleString()}`;
            document.getElementById('resultTitle').innerHTML = cards.length===1 ? 'HASIL SINGLE BET' : 'HASIL PARLAY';
            let htmlDetail = '<div style="font-weight:700;margin-bottom:12px;">RINCIAN PER TARUHAN</div>';
            for(let d of details){
                let sideName = d.type==='ah' ? (d.side==='home'?d.home:d.away) : (d.type==='1x2' ? (d.side==='home'?d.home:d.side==='away'?d.away:'Draw') : (d.side==='over'?'Over':'Under'));
                let voor = (d.type==='ah'||d.type==='ou') ? d.line : '';
                const homeLogo=getTeamLogo(d.home), awayLogo=getTeamLogo(d.away);
                htmlDetail += `<div class="detail-match-card">
                    <div class="detail-scoreboard">
                        <div class="detail-team">${homeLogo?`<img class="detail-logo" src="${homeLogo}" alt="Logo ${escapeHtml(d.home)}">`:''}<span>${escapeHtml(d.home)}</span></div>
                        <strong class="detail-score">${d.hs} - ${d.as}</strong>
                        <div class="detail-team away"><span>${escapeHtml(d.away)}</span>${awayLogo?`<img class="detail-logo" src="${awayLogo}" alt="Logo ${escapeHtml(d.away)}">`:''}</div>
                    </div>
                    <div class="detail-bet-line">Taruhan: ${escapeHtml(sideName)} ${escapeHtml(String(voor))} | Odds: ${formatOdds(d.rawOdds)}</div>
                    <div class="detail-bet-line">Hasil: ${d.res.desc.toUpperCase()} | Odds Efektif: ${formatOdds(d.effOdds)}</div>
                </div>`;
            }
            htmlDetail += `<div style="margin-top:16px;border-top:1px solid rgba(255,255,255,0.2);padding-top:14px;">Total Odds: ${details.map(d=>formatOdds(d.effOdds)).join(' x ')} = <strong>${formatOdds(totalOdds)}</strong><br>Payout: Rp ${Math.round(payout).toLocaleString()}<br>Profit: ${profit>=0?`+ ${Math.round(profit).toLocaleString()}`:`- ${Math.abs(Math.round(profit)).toLocaleString()}`}</div>`;
            document.getElementById('stepsDetail').innerHTML = htmlDetail;
            document.getElementById('copyArea').innerText = output;
            document.getElementById('resultBox').classList.add('show');
            document.getElementById('resultBox').scrollIntoView({behavior:'smooth'});
        }
        function resetAll(){
            document.getElementById('cardsContainer').innerHTML = '';
            cardCounter=0;
            defaultCards.forEach(c=>addCard(c));
            document.getElementById('resultBox').classList.remove('show');
        }
        function copyTxt(){
            const txt = document.getElementById('copyArea').innerText;
            if(!txt.trim()){ showToast('Belum ada hasil hitung'); return; }
            navigator.clipboard.writeText(txt).then(()=>{ showToast('Hasil disalin'); });
        }
        document.getElementById('addBtn').addEventListener('click',()=>addCard());
        document.getElementById('hitBtn').addEventListener('click',hitungSekarang);
        document.getElementById('resetBtn').addEventListener('click',resetAll);
        document.getElementById('copyBtn').addEventListener('click',copyTxt);
        document.getElementById('teamPickerClose').addEventListener('click',closeTeamPicker);
        document.getElementById('teamPickerSearch').addEventListener('input',filterTeamPicker);
        document.getElementById('teamPickerPrev').addEventListener('click',()=>{ if(teamPickerPage>0){ teamPickerPage--; renderTeamPicker(); } });
        document.getElementById('teamPickerNext').addEventListener('click',()=>{ const total=Math.ceil(filteredTeamPickerNames.length/teamPickerPageSize); if(teamPickerPage<total-1){ teamPickerPage++; renderTeamPicker(); } });
        document.getElementById('teamPickerModal').addEventListener('click',event=>{ if(event.target.id==='teamPickerModal') closeTeamPicker(); });
        document.addEventListener('keydown',event=>{ if(event.key==='Escape'&&document.getElementById('teamPickerModal').classList.contains('show')) closeTeamPicker(); });
        window.onload = ()=>{ defaultCards.forEach(c=>addCard(c)); };