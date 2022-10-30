var app=function(){"use strict";function t(){}function n(t){return t()}function e(){return Object.create(null)}function o(t){t.forEach(n)}function r(t){return"function"==typeof t}function l(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}function a(t,n){t.appendChild(n)}function i(t,n,e){t.insertBefore(n,e||null)}function c(t){t.parentNode.removeChild(t)}function s(t,n){for(let e=0;e<t.length;e+=1)t[e]&&t[e].d(n)}function u(t){return document.createElement(t)}function f(t){return document.createTextNode(t)}function d(){return f(" ")}function m(){return f("")}function g(t,n,e,o){return t.addEventListener(n,e,o),()=>t.removeEventListener(n,e,o)}function h(t,n,e){null==e?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function p(t,n){n=""+n,t.wholeText!==n&&(t.data=n)}function b(t,n,e,o){null===e?t.style.removeProperty(n):t.style.setProperty(n,e,o?"important":"")}let $;function v(t){$=t}function w(){const t=function(){if(!$)throw new Error("Function called outside component initialization");return $}();return(n,e,{cancelable:o=!1}={})=>{const r=t.$$.callbacks[n];if(r){const l=function(t,n,{bubbles:e=!1,cancelable:o=!1}={}){const r=document.createEvent("CustomEvent");return r.initCustomEvent(t,e,o,n),r}(n,e,{cancelable:o});return r.slice().forEach((n=>{n.call(t,l)})),!l.defaultPrevented}return!0}}const z=[],y=[],k=[],x=[],L=Promise.resolve();let _=!1;function E(t){k.push(t)}const C=new Set;let T=0;function M(){const t=$;do{for(;T<z.length;){const t=z[T];T++,v(t),A(t.$$)}for(v(null),z.length=0,T=0;y.length;)y.pop()();for(let t=0;t<k.length;t+=1){const n=k[t];C.has(n)||(C.add(n),n())}k.length=0}while(z.length);for(;x.length;)x.pop()();_=!1,C.clear(),v(t)}function A(t){if(null!==t.fragment){t.update(),o(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(E)}}const O=new Set;let N;function S(t,n){t&&t.i&&(O.delete(t),t.i(n))}function H(t,n,e,o){if(t&&t.o){if(O.has(t))return;O.add(t),N.c.push((()=>{O.delete(t),o&&(e&&t.d(1),o())})),t.o(n)}else o&&o()}function P(t,e,l,a){const{fragment:i,on_mount:c,on_destroy:s,after_update:u}=t.$$;i&&i.m(e,l),a||E((()=>{const e=c.map(n).filter(r);s?s.push(...e):o(e),t.$$.on_mount=[]})),u.forEach(E)}function j(t,n){const e=t.$$;null!==e.fragment&&(o(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}function I(t,n){-1===t.$$.dirty[0]&&(z.push(t),_||(_=!0,L.then(M)),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function B(n,r,l,a,i,s,u,f=[-1]){const d=$;v(n);const m=n.$$={fragment:null,ctx:null,props:s,update:t,not_equal:i,bound:e(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(r.context||(d?d.$$.context:[])),callbacks:e(),dirty:f,skip_bound:!1,root:r.target||d.$$.root};u&&u(m.root);let g=!1;if(m.ctx=l?l(n,r.props||{},((t,e,...o)=>{const r=o.length?o[0]:e;return m.ctx&&i(m.ctx[t],m.ctx[t]=r)&&(!m.skip_bound&&m.bound[t]&&m.bound[t](r),g&&I(n,t)),e})):[],m.update(),g=!0,o(m.before_update),m.fragment=!!a&&a(m.ctx),r.target){if(r.hydrate){const t=function(t){return Array.from(t.childNodes)}(r.target);m.fragment&&m.fragment.l(t),t.forEach(c)}else m.fragment&&m.fragment.c();r.intro&&S(n.$$.fragment),P(n,r.target,r.anchor,r.customElement),M()}v(d)}class F{$destroy(){j(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(t){var n;this.$$set&&(n=t,0!==Object.keys(n).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function J(n){let e,r,l;return{c(){e=u("input"),h(e,"id",n[0]),h(e,"placeholder","輸入關鍵字搜尋"),h(e,"class","search svelte-12hmxru"),h(e,"type","search")},m(t,o){i(t,e,o),r||(l=[g(e,"input",n[2]),g(e,"compositionstart",n[1]),g(e,"compositionend",n[1])],r=!0)},p(t,[n]){1&n&&h(e,"id",t[0])},i:t,o:t,d(t){t&&c(e),r=!1,o(l)}}}function W(t,n,e){const o=w();let{id:r}=n;return t.$$set=t=>{"id"in t&&e(0,r=t.id)},[r,t=>{t.type},function(t){o("search",{value:t.target.value},1e3)}]}class D extends F{constructor(t){super(),B(this,t,W,J,l,{id:0})}}var U=[{name:"飛虎(Fehu)",title:"Fehu",content:"原意為家畜牛群或母牛，在古代家畜視為財富的象徵，而現在則是用金錢代表財富，家畜可以為我們帶來許多的資源，因此飛虎代表著豐盛的資源與財富，也是手上握有多少資源、擁有多少能量去計劃一件事或談一段感情？或能否運用身旁的資源幫自己解決問題？此外也有成就感、高傲的意思，表示此人熱愛挑戰喜歡征服困難並讓自我獲得成就感。在北歐神話飛虎代表 Freya 是美麗與愛情的女神，善用法術，也代表著剛開始的熱戀期或單戀的情懷，是進入新關係之前的熱戀。據說芙雷雅曾用自己的美色與侏儒交換珠寶，因此也有著虛假的情感、為利益而付出的情感等的意思，尤其在逆位。"},{name:"烏魯茲(Uruz)",title:"Uruz",content:"原意為野牛，在古代草原上無人控管奔馳的野牛，現代看來就是地球原始的能量，一股創造性的能量能打破舊有的框架創造新的圖像(改變之意)，也是我們內在的勇氣、耐心、驅力，趨使我們移動到一個新的環境、新的地位、舞台、情勢等，也有健康、強壯的心靈之意。從符號來看像個大門，因此引申為公司、機構，尤其公家機關，也可說是一種門檻、條件、有順序、有條理、有步驟、分門別類(的部門)等。在北歐神話裡 Uruz 代表的是宇宙初創的母牛歐德姆拉，牠以奶餵養巨人尤彌爾，讓世界得以誕生，因此在卡巴拉裡也代表著 Chokmah 和Binah 為神聖的光誕生萬物之意。此外，也代表身體的健康的主題，可能暗示著需要扮演一個積極的角色去爭取事物；必要的話也是頂著風險有意志的去改變事情。"},{name:"瑟依薩茲(Thurisaz)",title:"Thurisaz",content:"Thurs 原意為巨人的意思，帶來破壞性及傷害的力量。因為文化演變也可視為是一種自然的原力，因為是自然的力量因此沒有好壞之分。之後隨著文化和語言的演變成為 thorn〔荊棘〕，荊棘具有傷害及保護的力量〔惱人的荊棘〕。神話中代表雷神索爾，及祂那把槌子，有著野蠻的力量、火爆的脾氣及性格，將這樣的力量用在事業上是好的；但若用在關係上則適得其反，同時也具有保護及破壞的能力。另一方面，尤彌爾是個巨人，最後用他的身體創造了世界，因此瑟依薩斯也被視為在飛虎及烏魯茲後第三個創造性的力量，不同的是瑟依薩斯是透過衝突、激烈的爭執、心生不滿而有新的想法與領悟。"},{name:"安蘇茲(Ansuz)",title:"Ansuz",content:"原意為嘴巴，代表溝通、傳播、文字、詩、演講等說出來的話。溝通的力量可以化解干戈，在神話中亞薩神族會保護中土免受巨人國的侵害，因此也代表著智慧，引申為測驗、心智能力、心智成熟度、心智力量。神話中安蘇茲代表眾神之王奧丁，因此他也可以是權威(人物)的代表給予忠告，同時也是父親的原型或傳統的觀念，有著關愛、照顧家庭的意思。奧丁身旁總跟著兩隻烏鴉，一隻代表思想；另一隻是記憶，所以也有思想和記憶的意思。據說他將自己倒掛在宇宙樹上九天九夜，才獲得24個符號，即盧恩符文；他曾經也用自己的一隻眼睛和守護智慧之泉的密彌爾交換一口泉水以獲得智慧，因此也有犧牲自我來做交換的意思，尤其逆位。"},{name:"萊多(Raidho)",title:"Raidho",content:"原意為馬車，人駕著馬車，人是駕奴的但馬是被奴役的，人舒服馬辛苦，意謂(人)有意願要如何做，但(馬)做的疲憊不堪(根本不想做)。人駕馬車必定有目的地要去，因此也是有目的的行動。此外，也代表著馬車上的輪子，因為轉動具有規律，因此也是有規律的行為，又引伸為宇宙秩序、規律。現代則代表交通工具、行動、旅行、(生命)路途、電子傳輸等。在到達目的的路途上會有許多人一同搭一輛車，因此也有組織團體或協商、討論、合作的意思。對個人而言，行走在交叉路中必須為自我生命做抉擇，因此有抉擇或自我控制之意，猶如車伕控制馬車一般，人控制自我意識。"},{name:"肯納茲(Kenaz)",title:"Kenaz",content:"原意為火炬，一種友善、溫暖、溫馴、照亮冰冷的黑暗、保護環境猶如壁爐裡的小火光般，一個溫暖給予安全的地方。火有延續、蔓延的特質，因此又像拋磚引玉一般一個接著一個被激發〔說話、想法等〕，許多想法源源不絕、或有許多想說的話，也有創造、啟動、給予的意思。就個人而言他是內心的熱忱、熱情或性慾，用適當的方式引導會是心靈的、幸福的或藝術的豐盛，若用在錯的地方會是黏人、煩人、造成他人負擔過重的行為。情人間的曖昧、幸福的溫度也是肯納茲的展現，也是願意為對方付出的心、行為，特別是男生的付出、給予。此外也代表男性生殖器。"},{name:"吉福(Gebo)",title:"Gebo",content:"原意為禮物，送人禮物、或是一種慷慨的行為，被北歐人視為一種崇高的美德，收到讚賞或禮物是值得開心的。後期於婚宴上結婚者宴請大家，以換來祝福與肯定。隨著文化演變不收取回饋的慷慨奉獻被視為一種犧牲，因此有交換的意思，付出換來的酬賞。此外，也代表合夥關係，可能是一樁事業的合夥，也可能是一段愛情的伴侶關係。神話中代表索爾的老婆－希爾，是農業女神，無私的奉獻穀物給人們。"},{name:"溫究(Wunjo)",title:"Wunjo",content:"原意為喜悅，是一種愉悅快樂的感覺，心靈的沉醉、喜歡的感覺，可能是與朋友的相處所帶來的歡樂，也可能是一個無所畏懼的人內心油然而生的愉悅。溫究的喜悅是一種成熟的愉悅，一種打從內心的歡喜、享受，也可以代表情人、朋友、心有好感的重要他人、在乎的人等，也代表情人關係的成功、歡樂的分享活動尤其在工作上，好消息、好的結果、情緒的歡愉。溫究掌管著喜歡與不喜歡和情緒有關，因此逆位溫究也可能代表不合、疏遠、不滿意等等，尤其是在關係上，至於不喜歡的程度則視整體盤陣而定。"},{name:"海格拉斯(Hagalaz)",title:"Hagalaz",content:"原意為冰雹，又另一種說法為颶風，對人們來說，尤其農夫，這是個不祥的氣候；但在神話中則被視為冰的種子，是宇宙誕生的起源。海格拉斯代表著延遲與阻礙，與一種自然崩解的狀態，也意謂著目前所面對的事情並非自我所能決定，操之在他人身上。通常也說明了目前不是開始新計畫的好時機。有時阻礙、困難能使我們能從麻煩中學習並成長。此時與他人或命運硬碰硬只會帶來悲傷。是時機學習退一步、妥協的好機會。海格拉斯代表北歐神話的海爾，是掌管地府的女王，在占卜上代表深層的恐懼、害怕。臉上一半透露死亡的氣息另一半則是美麗的容貌，且排序為 9，是破壞與重生的一個數字，也因此有著毀壞與重生的意思。同時，他也代表著阻礙、事故、挫敗、災難、散亂等，且是我們無法決定或控制的；也有著冒險的意思，結果如何則看盤陣的狀況。"},{name:"納歐帝茲(Nauthiz)",title:"Nauthiz",content:"原意為匱乏的限制，因為匱乏而產生需求，當我們匱乏時便會沉浸在憂傷的情緒中。他讓我們想要什麼就沒有什麼，通常指出一個人正面臨生命的困苦、折磨、束縛、壓迫或疾病纏身，也讓我們在資源匱乏的環境中求取資源。這些狀態雖然令人苦惱，但只能等待時間來解決，自我的焦躁與不安努力是無法解決事情的，與其如此不如學著與困苦和平共處，趁這個時機好好了解、整合自己，探索這些痛苦在自身過往經歷的來源。不論如何，納歐帝斯帶來的匱乏感都是我們的需要面對並學習的課題。占卜上代表匱乏或需求，也代表憂傷、害怕，或可引伸為業力，因為這些不安全感而努力辛苦往上攀爬。當我們面對這些自我課題、內在壓力時內心需擁有更多的韌性與耐心，狂風驟雨後帶來的是晴朗的天空，也有延遲、掙扎的意思。"},{name:"伊莎(Isa)",title:"Isa",content:"原意為冰，在長期冰冷的北歐，冰原對他們而言相當常見，他們視冰擁有美麗、閃亮的外貌卻無任何實際效用，尤其當你走在冰原上還會不小心滑倒。冰是冥府的主要元素，因此伊莎跟海格拉斯有部分相似處。占卜上代表兩種可能，一是停滯不前、固定、拘束、有遇限制、無法改變、寂靜、懶散等使情況毫無改變；二是向內寧靜、集中精神、凝聚、專注等以維持自我力量。神話中宇宙是由冰與火相交而生，因此伊莎和肯納茲是世界運行的兩大趨力，有靜就有動、有消極就有積極、有灰心喪志就有熱情如火。伊莎在關係上可能涉及冷戰，尤其跟瑟依撒茲配對時；或關係停滯在一個地步無法向前發展，也可能涉指欺騙；但也有著凝聚感情、向心力，端看搭配的盧恩。"},{name:"傑拉(Jera)",title:"Jera",content:"原意為年、豐收的季節。在長期冰寒的北歐，短暫的夏天是穀物豐收的最佳時機，因此大家都非常高興這季節的到來。傑拉象徵著季節的循環及因果的關係，怎麼努力就有什麼收穫，豐收和困苦依著循環而來，也是陰與陽、動與靜、黑與白相生共存、交替出現的象徵，如同太極圖一般，因此也代表著平衡，包括身心、關係及能量的平衡，也暗喻著必須等到適當的時機才能得到美好的結果(豐收)。占卜上，代表著豐收、努力過後的成果/回饋、循環、好的結果、平衡，也引申代表正義、法治。個人上代表著某些行為、思考或情緒上的重複，可能被制約也可能是上癮，尤其配上波斯若代表著與潛意識有關、與海爾代表傷害的循環等。牌陣上出現傑拉也可以抵銷負面的能量。"},{name:"艾華茲(Elhwaz)",title:"Elhwaz",content:"原意為紫杉樹，北歐神話中聯結九個世界的宇宙樹，伊格卓西亞，便是紫杉樹。索爾的繼子烏林也是住在遍滿紫杉的山谷中，因此紫杉被視為一種神聖的植物。質地硬、不易斷裂，戰士們會將其製成弓箭作戰。其為長年生的植物，有著永恆生命的象徵大多種植於墳場，因此也有死亡之樹之稱。愛華茲連結正與反兩種不同的能量，如連結不同次元的通道。日耳曼習俗中，人死後靈魂會跑回樹裡，等待下一次的再生，因此艾華茲擁有反思、保護及轉化的意思。日常中的反省、省思，反思過往調整未來的腳步；也代表我們為自己設定一個未來的目標，一步一腳印努力的過程，切勿著急，穩定自我腳步讓時間帶領我們走到目標。他有強大的保護效力，會讓你達成目標，但過程是辛苦且緩慢的。再危險的問題都能逐漸好轉。健康上代表脊椎，可治療背部問題、增強或矯正脊椎。"},{name:"波斯若(Perthro)",title:"Perthro",content:"原意骰子杯、籤筒、聖杯，抽籤和骰子遊戲都是機率問題，在底定前都是未知，因此在這方面有著秘密、命運、機緣的意思。神話認為在人出生時命運三女神便給予了一生的命運，意謂著人出生時命運便被寫入此人的生命程式。波斯若跟命運有關，也是秘密、機緣、無法預料的事情(有好有壞)、或是某種超自然的力量將會幫助你解決問題。有可能是檯面下動手腳、走後門、暗中說話的意思，也可能是意料之外的突發事件。聖杯或魔法袋能創造人們所需，以現代觀點來看我們無法改變命運，但可以在命運的道路上拓寬自我的視野、改變內再看待事物的態度，以創造新的人生(新的人生誕生)。此外波斯若也代表著人類深層的內在，願意與他人分享與否，與他人內在精神性交流，使他人看見內在真實的自我，接受外來資源或閉鎖。"},{name:"亞吉茲(Algiz)",title:"Algiz",content:"原意為鹿角，在語言學上 Elk-Alcis 有著神聖的森林、庇護的意思，也有人將它翻為天鵝。因此亞吉茲有著強大的保護力，與愛華茲不同在於愛華茲是過程由壞到好的保護，而亞吉茲是當下實質的保護免於厄運及災難，例如：躲過突如其來的暴雨、運用智慧解決眼前困難等。 他意謂雙手張開抵擋危險。此外，也代表著幸運、好運氣。亞吉茲的符號也是一個人展開雙手向天祈禱的樣子，因此也有受到祝福、庇蔭的意思，在占卜容易有貴人相助、佛神庇佑、能抬頭挺胸無愧事非、良好的自我尊嚴之意，使得個人內心更強而有力、不畏艱難。 逆位代表危險、犧牲，尤其和逆未提爾搭配犧牲時間在沒動力的事情上，會有種被掏空、無力的感覺，或自尊被踐踏、侵害之意。"},{name:"索威羅(Sowilo)",title:"Sowilo",content:"原意為太陽，早期在北歐太陽有如現代的燈塔一般給予航海者一個明確的指引與方向，因此也有人認為索威羅代表帆船。太陽被北歐人視為一種勝利或除去惡物的象徵，因為他可以融化長年冰原的北歐，並給人們帶來豐富的物產及溫暖。太陽位於第二族群的最後一個，意謂著旅程到了終點是闊達、無懼、開悟、奉獻大眾的成功人生。太陽有著照耀大地給予每個人每件事溫暖的功能。然而太陽的光芒炙熱只是短暫，意味著人生不可能永遠處在成功之時，功成名就只是短暫的一瞬間，因此也代表短暫而強烈的情緒。"},{name:"提華茲(Tiwaz)",title:"Tiwaz",content:"原意為勝利，在北歐神話中代表提爾戰神，提爾是位行俠仗義的神，為正義而行，北歐著名的故事中，與芬里爾狼的故事可看出提爾以正義降惡的事蹟。在公平競爭與不公的壓迫間互相抗衡。為了公平奮鬥，有時可能還會有所犧牲、損失，會不惜代價以爭取公平正義。有時也可以把他看成一把劍，在戰場無堅不摧的勝利之劍，因此提華茲均能代表幫助個人突破困境或勝利之意。然而追逐勝利的過程便要經歷一番磨難、挫敗，因此也代表著挑戰的到來。此外，也可代表個人內在的動機，行俠仗義之事必需仰賴個人內在動機而行，可看出個人內在動機純粹與否，積極或消極、充滿幹勁或頹廢沮喪的心態、有力與無力感之分。提華茲也代表感情中的男性；相對拉古茲則代表感情中的女性，感情上出現提爾是優勢的徵兆，代表一段嶄新、快樂和激情的戀情即將誕生。"},{name:"博卡納(Berkana)",title:"Berkana",content:"原意為樺樹，樺樹是用根生長繁殖的樹，他代表了地球母性的原力。樺樹可以長得非常的高大，如同頂天立地的一根梁柱，茂盛的樹葉提供人們休息、補充精神體力的地方。在北歐民族裡樹也代表靈魂棲息處等待再次重生之時。因此樺樹代表著不斷的成長、孕育、滋養，與生命的誕生到死亡的循環。樺樹與母性有著極大的連結，尤其媽媽、奶奶，或心所歸屬的家。因此在占卜上抽到樺樹代表著問題與母親議題有關；也可能與親密關係、心中重要他人；或家庭情感有關的問題。在北歐習俗新婚者的門外都會插上一束樺樹的枝葉，代表豐滿與新生，所以柏卡納也能代表一個孕育很久的新生命的誕生，包括新的概念或想法。"},{name:"依華茲(Ehwaz)",title:"Ehwaz",content:"原意為馬，對北歐人來說是一種非常吉祥的動物，屬風元素與思想、速度、移動有關，代表一種變動性，短暫停留又馬上改變。古時候快馬奔騰意謂急信傳書，通常奔馳的馬匹是我們最有利的助手，也因此依華茲意謂著生命中的貴人，或是來幫助我們的人。此外，騎馬時人馬的互相配合(雙方合作)才能安全抵達目標，是配對、組合的象徵，必須同心協力達至相同的目標，有著互相合作的意思，所以在面對不對等關係時必須調整自我的想法和觀念來對待彼此，試著用他人的角度來思考，轉變觀念與應對方式以達和諧。占卜上代表著計畫、事件變動的機會很大，穩定的成長與擴大，通訊工具、時間短暫或快速移動等，都和變動有關。在夥伴關係上，相較於萊多，萊多是團體的合作，尤其在工作上；依華茲限於兩人關係的狀態，發生於所有情況。"},{name:"美納茲(Mannaz)",title:"Mannaz",content:"原意為人類，是集體人類的原型。若說依華茲是相異的兩人必須共同合作，那麼美納茲便是相同的一群人彼此互相幫助。美納茲代表著人性、人類的社會、與人的集體意識，有著群眾力量的一顆符文。 在占卜上，人性代表的是一個人極為細膩、敏感且聰穎的特質，如此人們容易感到受傷而害怕受傷，便有善惡的行為，是善是惡端看於整盤的符文而定，人性有著追求美好的慣性；同時也有著自私自利的貪婪；有美納茲則必定與人有關，可能代表一個人的內在狀態，也可能是一群人塑造出來的氛圍，是一顆群眾與個人有著密不可分關係的符文。人們是群居生活的，無論在怎麼隱居或逃避，只要是人便得遵從社會的遊戲規則，因此在占卜上也有著互相依賴、箝制、綁住彼此等意涵；有時美納茲也指出問題與自我個人有關，這樣的情況下可能受困在自己的問題而無法有效解決。此外也代表著協助人群、外來的幫忙。"},{name:"拉古茲(Laguz)",title:"Laguz",content:"原意為水，水能載舟亦能覆舟，好壞端看在盤陣中的位置及正逆位。水泛指海洋、河川、雨水或湖泊，因此有著渡船遠行、出國、遠遊 之意，相較於萊多為短暫的旅程，拉古茲則是長期、久遠的、緩慢的。水也代表情緒尤其在水面下的洪流若湧現則意為情緒的湧現與爆發。占卜上代表女性，尤其現代女性。卡巴拉中代表著 YESOD 球體，與想像、夢想、幻想有關。不同於安蘇茲是左腦的理性，拉古茲代表人類右腦所主宰的領域，與圖像、想像、畫面有關，也代表著直覺，此時應聽著自我的直覺行事。占卜上代表流動的水，與情緒、直覺、自然發展、緩慢等相關，也與當事人的喜好度有相關。"},{name:"英格茲(Ingwaz)",title:"Ingwaz",content:"原意為 Ing 神，是豐足、歡樂之神。掌管著農業的豐收，但事實上他更能代表孩童般的純真。從符號上來看 (來自古日耳曼族)代表著一個提供休憩、養精蓄銳、回復元氣的場所，是一種緩和的意義。也代表著陰囊或卵巢，供精子或卵子(人類生命之源)儲蓄能量之地。另一種符號，來自盎格魯薩克遜族，有著基因與遺傳的意思。英格茲與性和遺傳有關，是人們內在臻於成熟後進一步的繁衍，而內心知足者無論在哪都覺得是豐盛的；逆位則是理想化、不切實際。占卜上有可能因不敢突破舒適圈而未能創造好結果，此也表示一種不成熟的心態。若出現在結果的位置也代表著一件事情的完成，或美滿的結局，只有在非常負面的盤陣中才可能暗示著失敗。也有著養精蓄銳、水乳交融、簡單、暫時性的歡樂、或圓滿結局等。"},{name:"歐瑟拉(Othala)",title:"Othala",content:"原意為繼承，代表著家族的力量及後代繼承的產物。歐瑟拉與家族有關，居住於長年冰冷及有危機意識的維京人是以群居的方式互相關照，家族對個人來說有著極大的影響，個人表現、成就或敗壞也會牽連整個家族，因此歐瑟拉表現出的是個人和家族、遺產的關係，包括界線、不可剝奪的遺產、以及運用智慧經營家族財產等。也代表事務的根基、基礎。歐瑟拉也是一種佔有所有物的象徵。繼承前幾世代遺留下來的物品、基因、內再創傷、業力。占卜上若是與感情有關通常與成家、結婚等佔有對方有關。也可能指出生活的條件，找到一棟房子、室友或與鄰居的關係等與個人目前所居住之環境有關。"},{name:"戴格茲(Dagaz)",title:"Dagaz",content:"原意為日，是曙光、黎明的意思。在北歐夜晚的時間比白天長，甚至冬天會有永晝的現象，所以即使這麼短暫的曙光對他們來說卻是非常令人欣喜的光芒。在他們的文化中白天是夜晚的孩子，可看出除了欣喜白天的光芒，他們對夜晚也抱著相當尊敬的態度。曙光在北歐代表著夜晚過後帶來的欣喜的意思。戴格茲也象徵著增加與成長，是一種增進、豐饒的過程，且只要運用自我內在的力量(態度)便可翻轉局勢、反敗為勝。戴格茲的成長是緩慢的，循序漸進的變化，而非一夕之間的爆發。有時也暗示著生命中的巨變即將來到，可能是個極端徹底的事，讓你對生命改觀而使你必須重新開始，或在某件事上從新開始。而這也代表了經歷一段新的生活方式、新的思考模式，甚至可能是一種宗教啟蒙。占卜上，戴格茲能表示希望感、不預期的好事、期待、緩慢的增加等，也代表著巨變後新的開始、新的計畫等，通常戴格茲帶來的欣喜有如前端隧道出口處的一丁點光芒，意味著還有一段距離欣喜才會到來，需要耐心等待，只要懷著希望整個宇宙會聯合起來幫助你。"},{name:"威爾(Wyrd)",title:"Wyrd",content:"原意為空，亦即宇宙之意。宇宙承載著萬事萬物、運行著四季、依照著某種法則使得這世界的一切存有得以生生不息。宇宙主宰這世上所發生的一切，人類的緣起緣滅至一花一草的萌生與凋零，都無法被改變也無法不遵從祂的旨意行走，所有的一切都在祂的掌管中，祂要我們往哪走就得往哪走、祂要世界如何發展就得如何發展，宇宙含納了所有的一切，沒有任何一件事物可以脫離祂，儘管一粒沙塵、一絲塵埃等再微小的存在、再脫軌的事物都在宇宙之內。宇宙懷有著萬事萬物，而萬事萬物中也包含著宇宙，意謂著生活上每個人事物都是宇宙的一部份、都和宇宙息息相通。科學已發現人類的細胞分析、分析、再分析下去的結果是什麼都沒有，即『空』，意謂著人類擁有無限創造的潛能，擁有宇宙掌管一且事務運行的潛在力量，意謂著我們正是宇宙。這並非你、我、他可以自在改變這世界法則，而是世上所有的人們、動植礦物等的能量連結與互動創造的能量之網，得以用某種發展的趨勢引領世界邁動。因此威爾在占卜上代表的是什麼都沒有(空)，然而因為是空，所以我們可以無中生有，我們可以運用自己的力量來創造，這時便是考驗自我能力與意願的時刻。"}];function G(t,n,e){const o=t.slice();return o[16]=n[e],o[18]=e,o}function K(t,n,e){const o=t.slice();return o[16]=n[e],o[18]=e,o}function R(n){let e,o,r,l,f,m,p,b,$=n[3],v=[];for(let t=0;t<$.length;t+=1)v[t]=Y(K(n,$,t));let w=n[3],z=[];for(let t=0;t<w.length;t+=1)z[t]=Q(G(n,w,t));return{c(){e=u("div"),o=u("button"),o.textContent="開始占卜",r=d(),l=u("div");for(let t=0;t<v.length;t+=1)v[t].c();f=d(),m=u("div");for(let t=0;t<z.length;t+=1)z[t].c();h(o,"class","button-60 mg-5"),h(o,"title","及時占卜"),h(l,"class","stone-box group-1item"),h(m,"class","stone-box group-3item"),h(e,"class","")},m(t,c){i(t,e,c),a(e,o),a(e,r),a(e,l);for(let t=0;t<v.length;t+=1)v[t].m(l,null);a(e,f),a(e,m);for(let t=0;t<z.length;t+=1)z[t].m(m,null);p||(b=g(o,"click",n[13]),p=!0)},p(t,n){if(24&n){let e;for($=t[3],e=0;e<$.length;e+=1){const o=K(t,$,e);v[e]?v[e].p(o,n):(v[e]=Y(o),v[e].c(),v[e].m(l,null))}for(;e<v.length;e+=1)v[e].d(1);v.length=$.length}if(24&n){let e;for(w=t[3],e=0;e<w.length;e+=1){const o=G(t,w,e);z[e]?z[e].p(o,n):(z[e]=Q(o),z[e].c(),z[e].m(m,null))}for(;e<z.length;e+=1)z[e].d(1);z.length=w.length}},i:t,o:t,d(t){t&&c(e),s(v,t),s(z,t),p=!1,b()}}}function q(t){let n,e,r,l,s,m,$,v,w,z,y,k,x,L,_,E,C,T,M,A,O,N,I=t[5].name+"";return e=new D({props:{id:"search-input"}}),e.$on("search",t[9]),{c(){var o;n=u("div"),(o=e.$$.fragment)&&o.c(),r=d(),l=u("div"),s=u("ul"),m=u("li"),$=u("a"),$.innerHTML='<div class="arrow swiper-button-prev arrowup"></div>',v=d(),w=u("li"),z=u("a"),z.innerHTML='<div class="arrow swiper-button-next arrowdown"></div>',y=d(),k=u("div"),L=d(),_=u("h3"),E=f(I),C=d(),T=u("div"),M=f(t[1]),h(n,"class","pd-5"),h($,"class",""),h($,"href","#"),h(m,"class","nav-btn"),h(z,"class",""),h(z,"href","#"),h(w,"class","nav-btn"),h(s,"class","btn-nav"),h(l,"class","stage"),h(k,"class",x="stone-img runes "+t[0]),h(k,"title",t[0]),b(k,"background-image","url('img/runes/"+t[0].toLocaleLowerCase()+".png')"),h(T,"class","stone-content"),h(T,"title",t[0])},m(o,c){i(o,n,c),P(e,n,null),i(o,r,c),i(o,l,c),a(l,s),a(s,m),a(m,$),a(s,v),a(s,w),a(w,z),i(o,y,c),i(o,k,c),i(o,L,c),i(o,_,c),a(_,E),i(o,C,c),i(o,T,c),a(T,M),A=!0,O||(N=[g($,"click",t[7]),g(z,"click",t[8])],O=!0)},p(t,n){(!A||1&n&&x!==(x="stone-img runes "+t[0]))&&h(k,"class",x),(!A||1&n)&&h(k,"title",t[0]),(!A||1&n)&&b(k,"background-image","url('img/runes/"+t[0].toLocaleLowerCase()+".png')"),(!A||32&n)&&I!==(I=t[5].name+"")&&p(E,I),(!A||2&n)&&p(M,t[1]),(!A||1&n)&&h(T,"title",t[0])},i(t){A||(S(e.$$.fragment,t),A=!0)},o(t){H(e.$$.fragment,t),A=!1},d(t){t&&c(n),j(e),t&&c(r),t&&c(l),t&&c(y),t&&c(k),t&&c(L),t&&c(_),t&&c(C),t&&c(T),O=!1,o(N)}}}function Y(t){let n,e=0===t[18]&&function(t){let n,e,o,r,l,s,m,g,$,v=t[16].name+"",w=["","[逆]"][t[4][t[18]]]+"";return{c(){n=u("div"),e=u("div"),l=d(),s=u("h4"),m=f(v),g=f(w),$=d(),h(e,"class",o="stone-img runes "+t[16].title+" "+["","reverse"][t[4][t[18]]]),h(e,"title",r=t[16].title),b(e,"background-image","url('img/runes/"+t[16].title.toLocaleLowerCase()+".png')"),h(n,"class","stone-inner")},m(t,o){i(t,n,o),a(n,e),a(n,l),a(n,s),a(s,m),a(s,g),a(n,$)},p(t,n){24&n&&o!==(o="stone-img runes "+t[16].title+" "+["","reverse"][t[4][t[18]]])&&h(e,"class",o),8&n&&r!==(r=t[16].title)&&h(e,"title",r),8&n&&b(e,"background-image","url('img/runes/"+t[16].title.toLocaleLowerCase()+".png')"),8&n&&v!==(v=t[16].name+"")&&p(m,v),16&n&&w!==(w=["","[逆]"][t[4][t[18]]]+"")&&p(g,w)},d(t){t&&c(n)}}}(t);return{c(){e&&e.c(),n=m()},m(t,o){e&&e.m(t,o),i(t,n,o)},p(t,n){0===t[18]&&e.p(t,n)},d(t){e&&e.d(t),t&&c(n)}}}function Q(t){let n,e=t[18]>0&&function(t){let n,e,o,r,l,s,m,g,$,v=t[16].name+"",w=["","[逆]"][t[4][t[18]]]+"";return{c(){n=u("div"),e=u("div"),l=d(),s=u("h4"),m=f(v),g=f(w),$=d(),h(e,"class",o="stone-img runes "+t[16].title+" "+["","reverse"][t[4][t[18]]]),h(e,"title",r=t[16].title),b(e,"background-image","url('img/runes/"+t[16].title.toLocaleLowerCase()+".png')"),h(n,"class","stone-inner")},m(t,o){i(t,n,o),a(n,e),a(n,l),a(n,s),a(s,m),a(s,g),a(n,$)},p(t,n){24&n&&o!==(o="stone-img runes "+t[16].title+" "+["","reverse"][t[4][t[18]]])&&h(e,"class",o),8&n&&r!==(r=t[16].title)&&h(e,"title",r),8&n&&b(e,"background-image","url('img/runes/"+t[16].title.toLocaleLowerCase()+".png')"),8&n&&v!==(v=t[16].name+"")&&p(m,v),16&n&&w!==(w=["","[逆]"][t[4][t[18]]]+"")&&p(g,w)},d(t){t&&c(n)}}}(t);return{c(){e&&e.c(),n=m()},m(t,o){e&&e.m(t,o),i(t,n,o)},p(t,n){t[18]>0&&e.p(t,n)},d(t){e&&e.d(t),t&&c(n)}}}function V(t){let n,e,r,l,s,f,m,p,b,$,v,w,z,y,k,x,L;const _=[q,R],E=[];function C(t,n){return"排義"==t[2]?0:1}return v=C(t),w=E[v]=_[v](t),{c(){n=u("header"),n.innerHTML='<p class="head-title">盧恩符石</p>',e=d(),r=u("main"),l=u("div"),s=u("button"),s.textContent="排義",f=d(),m=u("button"),m.textContent="及時占卜",p=d(),b=u("hr"),$=d(),w.c(),z=d(),y=u("footer"),y.innerHTML='<div class="note"><span ckass="fn14">純交流學習</span> \n\t\t\t<span class="fn12">想知道更多? 想了解排義、解惑?</span> \n\t\t\t<span class="fn12">粉專: <a target="_blank" href="https://www.facebook.com/angelsforestspace">天使森林秘境</a></span> \n\t\t\t<span class="fn12">email: pig3629@gmail.com</span></div>',h(s,"class","button-60"),h(s,"title","排義"),h(m,"class","button-60"),h(m,"title","及時占卜"),h(l,"class","introl "),h(b,"class","hr-mid-circle"),h(b,"multiple",""),h(b,"data-content","交流分享")},m(o,c){i(o,n,c),i(o,e,c),i(o,r,c),a(r,l),a(l,s),a(l,f),a(l,m),a(r,p),a(r,b),a(r,$),E[v].m(r,null),i(o,z,c),i(o,y,c),k=!0,x||(L=[g(s,"click",t[11]),g(m,"click",t[12])],x=!0)},p(t,[n]){let e=v;v=C(t),v===e?E[v].p(t,n):(N={r:0,c:[],p:N},H(E[e],1,1,(()=>{E[e]=null})),N.r||o(N.c),N=N.p,w=E[v],w?w.p(t,n):(w=E[v]=_[v](t),w.c()),S(w,1),w.m(r,null))},i(t){k||(S(w),k=!0)},o(t){H(w),k=!1},d(t){t&&c(n),t&&c(e),t&&c(r),E[v].d(),t&&c(z),t&&c(y),x=!1,o(L)}}}function X(t,n){return Math.floor(Math.random()*(n-t+1))+t}function Z(t,n,e){let o=!1,r="",l="",a="排義",i="",c=[];function s(t){e(2,a=t)}let u=X(0,U.length-1),f=U[u];function d(){let t=JSON.parse(JSON.stringify(U)).sort((()=>.5-Math.random()));e(3,i=t.slice(0,4));for(let t=0;t<4;t++)e(4,c[t]=X(0,1),c)}f&&(r=f.title,l=f.content);return[r,l,a,i,c,f,s,function(){u-=1,u<0&&(u=U.length-1),e(5,f=U[u]),e(0,r=f.title),e(1,l=f.content)},function(){u+=1,u>U.length-1&&(u=0),e(5,f=U[u]),e(0,r=f.title),e(1,l=f.content)},function(t){o=t.detail.value,U.filter(((t,n)=>{t.name.toLocaleLowerCase().indexOf(o)>-1&&o&&(u=n,e(5,f=U[u]),e(0,r=f.title),e(1,l=f.content))}))},d,t=>s("排義"),t=>s("及時占卜"),t=>d()]}return new class extends F{constructor(t){super(),B(this,t,Z,V,l,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
