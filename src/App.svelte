<script>
	import SearchInput from './components/SearchInput.svelte';
	import runes from './assets/mean.json';


	let search=false;
	let stone_title="";
	let stone_content="";
	let btn_default="排義";
	let result="";

	let site=[];
	function handleTabClick(tabName) {
		btn_default = tabName;
		if(btn_default =="及時占卜"){
		//	startPlay();
		}
	}

//上一個
	function prevOne() {
		num=num-1;
		if(num<0){
			num=runes.length-1;
		}
		stone=runes[num];
		stone_title=stone["title"];
		stone_content=stone["content"];
	}
	//下一個
	function nextOne() {

		 num=num+1;
		if(num>runes.length-1){
			num=0;
		}
		stone=runes[num];
		stone_title=stone["title"];
		stone_content=stone["content"];
	}


	//搜尋
	function handleSearch(e) {
		search = e.detail.value;
		runes.filter((word,index)=>{
			if(word["name"].toLocaleLowerCase().indexOf(search) > -1 && search){
				num=index;
				stone=runes[num];
				stone_title=stone["title"];
				stone_content=stone["content"];
			}
		});
	}
	//隨機載入盧恩
	let num=getRandom(0,runes.length-1);
	let stone=runes[num];
	if(stone){
		stone_title=stone["title"];
		stone_content=stone["content"];
	}

	//產生min到max之間的亂數
	function getRandom(min,max){
		return Math.floor(Math.random()*(max-min+1))+min;
	};

	//開始占卜
	function startPlay(){
		let runes2= JSON.parse(JSON.stringify(runes)); //copy
		let item = runes2.sort(() => 0.5 - Math.random()); //結果取0~4即可
		result=item.slice(0,4);
		for(let i=0;i<4;i++){
			site[i]=getRandom(0,1);
		}
	}

</script>
<header>
	<p class="head-title">盧恩符石</p>

</header>
<main>

	<div class="introl ">
		<button class="button-60" title="排義" on:click="{(e) => (handleTabClick('排義'))}" >排義</button>
		<button class="button-60" title="及時占卜" on:click="{(e) => (handleTabClick('及時占卜'))}" >及時占卜</button>
	</div>
	<hr class="hr-mid-circle" multiple data-content="交流分享">

	{#if btn_default=="排義"}
	<div class="pd-5">
        <SearchInput id="search-input" on:search={handleSearch} />
    </div>
	<div class="stage">
		<ul class="btn-nav">
			<li class="nav-btn">
				<a class="" href="#" on:click="{prevOne}">
					<div class="arrow swiper-button-prev arrowup"></div>
				</a>
			</li>

			<li class="nav-btn">
				<a class="" href="#" on:click="{nextOne}">
				<div class="arrow swiper-button-next arrowdown"></div>

			</li>
		</ul>
	</div>
	<div class="stone-img runes {stone_title} " title="{stone_title}" style="background-image: url('img/runes/{stone_title.toLocaleLowerCase()}.png');"></div>
		<h3> {stone["name"]}</h3>

		<div class="stone-content" title="{stone_title}">
			{stone_content}
		</div>













	{:else}

	<div class="">
		<button class="button-60 mg-5" title="及時占卜" on:click="{(e) => (startPlay())}" >開始占卜</button>


			<div class="stone-box group-1item">
				{#each result as item, index}
					{#if index === 0}
					<div class="stone-inner">
						<div class="stone-img runes {item["title"]} {["","reverse"][site[index]]}"   title="{item["title"]}" style="background-image: url('img/runes/{item["title"].toLocaleLowerCase()}.png');"></div>
						<h4>{item["name"]}{["","[逆]"][site[index]]}</h4>
					</div>
					{/if}
				{/each}
			</div>
			<div class="stone-box group-3item">

				{#each result as item, index}
					{#if index >0}
					<div class="stone-inner">
						<div class="stone-img runes {item["title"]} {["","reverse"][site[index]]}" title="{item["title"]}" style="background-image: url('img/runes/{item["title"].toLocaleLowerCase()}.png');"></div>
						<h4>{item["name"]}{["","[逆]"][site[index]]}</h4>
					</div>
					{/if}
				{/each}


			</div>

	</div>
	{/if}



</main>

	<footer>

		 <div class="note">
			<span ckass="fn14">純交流學習</span>
			<span class="fn12">想知道更多? 想了解排義、解惑?</span>
			<span class="fn12">email: 123@123.com</span>
		 </div>

	</footer>
<style>


</style>