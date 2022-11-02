
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.49.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\components\SearchInput.svelte generated by Svelte v3.49.0 */
    const file$1 = "src\\components\\SearchInput.svelte";

    function create_fragment$1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "id", /*id*/ ctx[0]);
    			attr_dev(input, "placeholder", "輸入關鍵字搜尋");
    			attr_dev(input, "class", "search svelte-12hmxru");
    			attr_dev(input, "type", "search");
    			add_location(input, file$1, 53, 0, 992);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*handleInput*/ ctx[2], false, false, false),
    					listen_dev(input, "compositionstart", /*handleComposition*/ ctx[1], false, false, false),
    					listen_dev(input, "compositionend", /*handleComposition*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*id*/ 1) {
    				attr_dev(input, "id", /*id*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SearchInput', slots, []);
    	const dispatch = createEventDispatcher();
    	let { id } = $$props;
    	let isOnComposition = false;

    	const handleComposition = e => {
    		if (e.type === 'compositionend') {
    			isOnComposition = false;
    		} else {
    			isOnComposition = true;
    		}
    	};

    	function handleInput(e) {
    		dispatch('search', { value: e.target.value }, 1000);
    	} // const dispatchDebounce = debounce(dispatch, 1000);
    	// debounce('search', {

    	const writable_props = ['id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SearchInput> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		id,
    		isOnComposition,
    		handleComposition,
    		handleInput
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('isOnComposition' in $$props) isOnComposition = $$props.isOnComposition;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id, handleComposition, handleInput];
    }

    class SearchInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { id: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchInput",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[0] === undefined && !('id' in props)) {
    			console.warn("<SearchInput> was created without expected prop 'id'");
    		}
    	}

    	get id() {
    		throw new Error("<SearchInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<SearchInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var runes = [
    	{
    		name: "飛虎(Fehu)",
    		title: "Fehu",
    		content: "原意為家畜牛群或母牛，在古代家畜視為財富的象徵，而現在則是用金錢代表財富，家畜可以為我們帶來許多的資源，因此飛虎代表著豐盛的資源與財富，也是手上握有多少資源、擁有多少能量去計劃一件事或談一段感情？或能否運用身旁的資源幫自己解決問題？此外也有成就感、高傲的意思，表示此人熱愛挑戰喜歡征服困難並讓自我獲得成就感。在北歐神話飛虎代表 Freya 是美麗與愛情的女神，善用法術，也代表著剛開始的熱戀期或單戀的情懷，是進入新關係之前的熱戀。據說芙雷雅曾用自己的美色與侏儒交換珠寶，因此也有著虛假的情感、為利益而付出的情感等的意思，尤其在逆位。"
    	},
    	{
    		name: "烏魯茲(Uruz)",
    		title: "Uruz",
    		content: "原意為野牛，在古代草原上無人控管奔馳的野牛，現代看來就是地球原始的能量，一股創造性的能量能打破舊有的框架創造新的圖像(改變之意)，也是我們內在的勇氣、耐心、驅力，趨使我們移動到一個新的環境、新的地位、舞台、情勢等，也有健康、強壯的心靈之意。從符號來看像個大門，因此引申為公司、機構，尤其公家機關，也可說是一種門檻、條件、有順序、有條理、有步驟、分門別類(的部門)等。在北歐神話裡 Uruz 代表的是宇宙初創的母牛歐德姆拉，牠以奶餵養巨人尤彌爾，讓世界得以誕生，因此在卡巴拉裡也代表著 Chokmah 和Binah 為神聖的光誕生萬物之意。此外，也代表身體的健康的主題，可能暗示著需要扮演一個積極的角色去爭取事物；必要的話也是頂著風險有意志的去改變事情。"
    	},
    	{
    		name: "瑟依薩茲(Thurisaz)",
    		title: "Thurisaz",
    		content: "Thurs 原意為巨人的意思，帶來破壞性及傷害的力量。因為文化演變也可視為是一種自然的原力，因為是自然的力量因此沒有好壞之分。之後隨著文化和語言的演變成為 thorn〔荊棘〕，荊棘具有傷害及保護的力量〔惱人的荊棘〕。神話中代表雷神索爾，及祂那把槌子，有著野蠻的力量、火爆的脾氣及性格，將這樣的力量用在事業上是好的；但若用在關係上則適得其反，同時也具有保護及破壞的能力。另一方面，尤彌爾是個巨人，最後用他的身體創造了世界，因此瑟依薩斯也被視為在飛虎及烏魯茲後第三個創造性的力量，不同的是瑟依薩斯是透過衝突、激烈的爭執、心生不滿而有新的想法與領悟。"
    	},
    	{
    		name: "安蘇茲(Ansuz)",
    		title: "Ansuz",
    		content: "原意為嘴巴，代表溝通、傳播、文字、詩、演講等說出來的話。溝通的力量可以化解干戈，在神話中亞薩神族會保護中土免受巨人國的侵害，因此也代表著智慧，引申為測驗、心智能力、心智成熟度、心智力量。神話中安蘇茲代表眾神之王奧丁，因此他也可以是權威(人物)的代表給予忠告，同時也是父親的原型或傳統的觀念，有著關愛、照顧家庭的意思。奧丁身旁總跟著兩隻烏鴉，一隻代表思想；另一隻是記憶，所以也有思想和記憶的意思。據說他將自己倒掛在宇宙樹上九天九夜，才獲得24個符號，即盧恩符文；他曾經也用自己的一隻眼睛和守護智慧之泉的密彌爾交換一口泉水以獲得智慧，因此也有犧牲自我來做交換的意思，尤其逆位。"
    	},
    	{
    		name: "萊多(Raidho)",
    		title: "Raidho",
    		content: "原意為馬車，人駕著馬車，人是駕奴的但馬是被奴役的，人舒服馬辛苦，意謂(人)有意願要如何做，但(馬)做的疲憊不堪(根本不想做)。人駕馬車必定有目的地要去，因此也是有目的的行動。此外，也代表著馬車上的輪子，因為轉動具有規律，因此也是有規律的行為，又引伸為宇宙秩序、規律。現代則代表交通工具、行動、旅行、(生命)路途、電子傳輸等。在到達目的的路途上會有許多人一同搭一輛車，因此也有組織團體或協商、討論、合作的意思。對個人而言，行走在交叉路中必須為自我生命做抉擇，因此有抉擇或自我控制之意，猶如車伕控制馬車一般，人控制自我意識。"
    	},
    	{
    		name: "肯納茲(Kenaz)",
    		title: "Kenaz",
    		content: "原意為火炬，一種友善、溫暖、溫馴、照亮冰冷的黑暗、保護環境猶如壁爐裡的小火光般，一個溫暖給予安全的地方。火有延續、蔓延的特質，因此又像拋磚引玉一般一個接著一個被激發〔說話、想法等〕，許多想法源源不絕、或有許多想說的話，也有創造、啟動、給予的意思。就個人而言他是內心的熱忱、熱情或性慾，用適當的方式引導會是心靈的、幸福的或藝術的豐盛，若用在錯的地方會是黏人、煩人、造成他人負擔過重的行為。情人間的曖昧、幸福的溫度也是肯納茲的展現，也是願意為對方付出的心、行為，特別是男生的付出、給予。此外也代表男性生殖器。"
    	},
    	{
    		name: "吉福(Gebo)",
    		title: "Gebo",
    		content: "原意為禮物，送人禮物、或是一種慷慨的行為，被北歐人視為一種崇高的美德，收到讚賞或禮物是值得開心的。後期於婚宴上結婚者宴請大家，以換來祝福與肯定。隨著文化演變不收取回饋的慷慨奉獻被視為一種犧牲，因此有交換的意思，付出換來的酬賞。此外，也代表合夥關係，可能是一樁事業的合夥，也可能是一段愛情的伴侶關係。神話中代表索爾的老婆－希爾，是農業女神，無私的奉獻穀物給人們。"
    	},
    	{
    		name: "溫究(Wunjo)",
    		title: "Wunjo",
    		content: "原意為喜悅，是一種愉悅快樂的感覺，心靈的沉醉、喜歡的感覺，可能是與朋友的相處所帶來的歡樂，也可能是一個無所畏懼的人內心油然而生的愉悅。溫究的喜悅是一種成熟的愉悅，一種打從內心的歡喜、享受，也可以代表情人、朋友、心有好感的重要他人、在乎的人等，也代表情人關係的成功、歡樂的分享活動尤其在工作上，好消息、好的結果、情緒的歡愉。溫究掌管著喜歡與不喜歡和情緒有關，因此逆位溫究也可能代表不合、疏遠、不滿意等等，尤其是在關係上，至於不喜歡的程度則視整體盤陣而定。"
    	},
    	{
    		name: "海格拉斯(Hagalaz)",
    		title: "Hagalaz",
    		content: "原意為冰雹，又另一種說法為颶風，對人們來說，尤其農夫，這是個不祥的氣候；但在神話中則被視為冰的種子，是宇宙誕生的起源。海格拉斯代表著延遲與阻礙，與一種自然崩解的狀態，也意謂著目前所面對的事情並非自我所能決定，操之在他人身上。通常也說明了目前不是開始新計畫的好時機。有時阻礙、困難能使我們能從麻煩中學習並成長。此時與他人或命運硬碰硬只會帶來悲傷。是時機學習退一步、妥協的好機會。海格拉斯代表北歐神話的海爾，是掌管地府的女王，在占卜上代表深層的恐懼、害怕。臉上一半透露死亡的氣息另一半則是美麗的容貌，且排序為 9，是破壞與重生的一個數字，也因此有著毀壞與重生的意思。同時，他也代表著阻礙、事故、挫敗、災難、散亂等，且是我們無法決定或控制的；也有著冒險的意思，結果如何則看盤陣的狀況。"
    	},
    	{
    		name: "納歐帝茲(Nauthiz)",
    		title: "Nauthiz",
    		content: "原意為匱乏的限制，因為匱乏而產生需求，當我們匱乏時便會沉浸在憂傷的情緒中。他讓我們想要什麼就沒有什麼，通常指出一個人正面臨生命的困苦、折磨、束縛、壓迫或疾病纏身，也讓我們在資源匱乏的環境中求取資源。這些狀態雖然令人苦惱，但只能等待時間來解決，自我的焦躁與不安努力是無法解決事情的，與其如此不如學著與困苦和平共處，趁這個時機好好了解、整合自己，探索這些痛苦在自身過往經歷的來源。不論如何，納歐帝斯帶來的匱乏感都是我們的需要面對並學習的課題。占卜上代表匱乏或需求，也代表憂傷、害怕，或可引伸為業力，因為這些不安全感而努力辛苦往上攀爬。當我們面對這些自我課題、內在壓力時內心需擁有更多的韌性與耐心，狂風驟雨後帶來的是晴朗的天空，也有延遲、掙扎的意思。"
    	},
    	{
    		name: "伊莎(Isa)",
    		title: "Isa",
    		content: "原意為冰，在長期冰冷的北歐，冰原對他們而言相當常見，他們視冰擁有美麗、閃亮的外貌卻無任何實際效用，尤其當你走在冰原上還會不小心滑倒。冰是冥府的主要元素，因此伊莎跟海格拉斯有部分相似處。占卜上代表兩種可能，一是停滯不前、固定、拘束、有遇限制、無法改變、寂靜、懶散等使情況毫無改變；二是向內寧靜、集中精神、凝聚、專注等以維持自我力量。神話中宇宙是由冰與火相交而生，因此伊莎和肯納茲是世界運行的兩大趨力，有靜就有動、有消極就有積極、有灰心喪志就有熱情如火。伊莎在關係上可能涉及冷戰，尤其跟瑟依撒茲配對時；或關係停滯在一個地步無法向前發展，也可能涉指欺騙；但也有著凝聚感情、向心力，端看搭配的盧恩。"
    	},
    	{
    		name: "傑拉(Jera)",
    		title: "Jera",
    		content: "原意為年、豐收的季節。在長期冰寒的北歐，短暫的夏天是穀物豐收的最佳時機，因此大家都非常高興這季節的到來。傑拉象徵著季節的循環及因果的關係，怎麼努力就有什麼收穫，豐收和困苦依著循環而來，也是陰與陽、動與靜、黑與白相生共存、交替出現的象徵，如同太極圖一般，因此也代表著平衡，包括身心、關係及能量的平衡，也暗喻著必須等到適當的時機才能得到美好的結果(豐收)。占卜上，代表著豐收、努力過後的成果/回饋、循環、好的結果、平衡，也引申代表正義、法治。個人上代表著某些行為、思考或情緒上的重複，可能被制約也可能是上癮，尤其配上波斯若代表著與潛意識有關、與海爾代表傷害的循環等。牌陣上出現傑拉也可以抵銷負面的能量。"
    	},
    	{
    		name: "艾華茲(Elhwaz)",
    		title: "Elhwaz",
    		content: "原意為紫杉樹，北歐神話中聯結九個世界的宇宙樹，伊格卓西亞，便是紫杉樹。索爾的繼子烏林也是住在遍滿紫杉的山谷中，因此紫杉被視為一種神聖的植物。質地硬、不易斷裂，戰士們會將其製成弓箭作戰。其為長年生的植物，有著永恆生命的象徵大多種植於墳場，因此也有死亡之樹之稱。愛華茲連結正與反兩種不同的能量，如連結不同次元的通道。日耳曼習俗中，人死後靈魂會跑回樹裡，等待下一次的再生，因此艾華茲擁有反思、保護及轉化的意思。日常中的反省、省思，反思過往調整未來的腳步；也代表我們為自己設定一個未來的目標，一步一腳印努力的過程，切勿著急，穩定自我腳步讓時間帶領我們走到目標。他有強大的保護效力，會讓你達成目標，但過程是辛苦且緩慢的。再危險的問題都能逐漸好轉。健康上代表脊椎，可治療背部問題、增強或矯正脊椎。"
    	},
    	{
    		name: "波斯若(Perthro)",
    		title: "Perthro",
    		content: "原意骰子杯、籤筒、聖杯，抽籤和骰子遊戲都是機率問題，在底定前都是未知，因此在這方面有著秘密、命運、機緣的意思。神話認為在人出生時命運三女神便給予了一生的命運，意謂著人出生時命運便被寫入此人的生命程式。波斯若跟命運有關，也是秘密、機緣、無法預料的事情(有好有壞)、或是某種超自然的力量將會幫助你解決問題。有可能是檯面下動手腳、走後門、暗中說話的意思，也可能是意料之外的突發事件。聖杯或魔法袋能創造人們所需，以現代觀點來看我們無法改變命運，但可以在命運的道路上拓寬自我的視野、改變內再看待事物的態度，以創造新的人生(新的人生誕生)。此外波斯若也代表著人類深層的內在，願意與他人分享與否，與他人內在精神性交流，使他人看見內在真實的自我，接受外來資源或閉鎖。"
    	},
    	{
    		name: "亞吉茲(Algiz)",
    		title: "Algiz",
    		content: "原意為鹿角，在語言學上 Elk-Alcis 有著神聖的森林、庇護的意思，也有人將它翻為天鵝。因此亞吉茲有著強大的保護力，與愛華茲不同在於愛華茲是過程由壞到好的保護，而亞吉茲是當下實質的保護免於厄運及災難，例如：躲過突如其來的暴雨、運用智慧解決眼前困難等。 他意謂雙手張開抵擋危險。此外，也代表著幸運、好運氣。亞吉茲的符號也是一個人展開雙手向天祈禱的樣子，因此也有受到祝福、庇蔭的意思，在占卜容易有貴人相助、佛神庇佑、能抬頭挺胸無愧事非、良好的自我尊嚴之意，使得個人內心更強而有力、不畏艱難。 逆位代表危險、犧牲，尤其和逆未提爾搭配犧牲時間在沒動力的事情上，會有種被掏空、無力的感覺，或自尊被踐踏、侵害之意。"
    	},
    	{
    		name: "索威羅(Sowilo)",
    		title: "Sowilo",
    		content: "原意為太陽，早期在北歐太陽有如現代的燈塔一般給予航海者一個明確的指引與方向，因此也有人認為索威羅代表帆船。太陽被北歐人視為一種勝利或除去惡物的象徵，因為他可以融化長年冰原的北歐，並給人們帶來豐富的物產及溫暖。太陽位於第二族群的最後一個，意謂著旅程到了終點是闊達、無懼、開悟、奉獻大眾的成功人生。太陽有著照耀大地給予每個人每件事溫暖的功能。然而太陽的光芒炙熱只是短暫，意味著人生不可能永遠處在成功之時，功成名就只是短暫的一瞬間，因此也代表短暫而強烈的情緒。"
    	},
    	{
    		name: "提華茲(Tiwaz)",
    		title: "Tiwaz",
    		content: "原意為勝利，在北歐神話中代表提爾戰神，提爾是位行俠仗義的神，為正義而行，北歐著名的故事中，與芬里爾狼的故事可看出提爾以正義降惡的事蹟。在公平競爭與不公的壓迫間互相抗衡。為了公平奮鬥，有時可能還會有所犧牲、損失，會不惜代價以爭取公平正義。有時也可以把他看成一把劍，在戰場無堅不摧的勝利之劍，因此提華茲均能代表幫助個人突破困境或勝利之意。然而追逐勝利的過程便要經歷一番磨難、挫敗，因此也代表著挑戰的到來。此外，也可代表個人內在的動機，行俠仗義之事必需仰賴個人內在動機而行，可看出個人內在動機純粹與否，積極或消極、充滿幹勁或頹廢沮喪的心態、有力與無力感之分。提華茲也代表感情中的男性；相對拉古茲則代表感情中的女性，感情上出現提爾是優勢的徵兆，代表一段嶄新、快樂和激情的戀情即將誕生。"
    	},
    	{
    		name: "博卡納(Berkana)",
    		title: "Berkana",
    		content: "原意為樺樹，樺樹是用根生長繁殖的樹，他代表了地球母性的原力。樺樹可以長得非常的高大，如同頂天立地的一根梁柱，茂盛的樹葉提供人們休息、補充精神體力的地方。在北歐民族裡樹也代表靈魂棲息處等待再次重生之時。因此樺樹代表著不斷的成長、孕育、滋養，與生命的誕生到死亡的循環。樺樹與母性有著極大的連結，尤其媽媽、奶奶，或心所歸屬的家。因此在占卜上抽到樺樹代表著問題與母親議題有關；也可能與親密關係、心中重要他人；或家庭情感有關的問題。在北歐習俗新婚者的門外都會插上一束樺樹的枝葉，代表豐滿與新生，所以柏卡納也能代表一個孕育很久的新生命的誕生，包括新的概念或想法。"
    	},
    	{
    		name: "依華茲(Ehwaz)",
    		title: "Ehwaz",
    		content: "原意為馬，對北歐人來說是一種非常吉祥的動物，屬風元素與思想、速度、移動有關，代表一種變動性，短暫停留又馬上改變。古時候快馬奔騰意謂急信傳書，通常奔馳的馬匹是我們最有利的助手，也因此依華茲意謂著生命中的貴人，或是來幫助我們的人。此外，騎馬時人馬的互相配合(雙方合作)才能安全抵達目標，是配對、組合的象徵，必須同心協力達至相同的目標，有著互相合作的意思，所以在面對不對等關係時必須調整自我的想法和觀念來對待彼此，試著用他人的角度來思考，轉變觀念與應對方式以達和諧。占卜上代表著計畫、事件變動的機會很大，穩定的成長與擴大，通訊工具、時間短暫或快速移動等，都和變動有關。在夥伴關係上，相較於萊多，萊多是團體的合作，尤其在工作上；依華茲限於兩人關係的狀態，發生於所有情況。"
    	},
    	{
    		name: "美納茲(Mannaz)",
    		title: "Mannaz",
    		content: "原意為人類，是集體人類的原型。若說依華茲是相異的兩人必須共同合作，那麼美納茲便是相同的一群人彼此互相幫助。美納茲代表著人性、人類的社會、與人的集體意識，有著群眾力量的一顆符文。 在占卜上，人性代表的是一個人極為細膩、敏感且聰穎的特質，如此人們容易感到受傷而害怕受傷，便有善惡的行為，是善是惡端看於整盤的符文而定，人性有著追求美好的慣性；同時也有著自私自利的貪婪；有美納茲則必定與人有關，可能代表一個人的內在狀態，也可能是一群人塑造出來的氛圍，是一顆群眾與個人有著密不可分關係的符文。人們是群居生活的，無論在怎麼隱居或逃避，只要是人便得遵從社會的遊戲規則，因此在占卜上也有著互相依賴、箝制、綁住彼此等意涵；有時美納茲也指出問題與自我個人有關，這樣的情況下可能受困在自己的問題而無法有效解決。此外也代表著協助人群、外來的幫忙。"
    	},
    	{
    		name: "拉古茲(Laguz)",
    		title: "Laguz",
    		content: "原意為水，水能載舟亦能覆舟，好壞端看在盤陣中的位置及正逆位。水泛指海洋、河川、雨水或湖泊，因此有著渡船遠行、出國、遠遊 之意，相較於萊多為短暫的旅程，拉古茲則是長期、久遠的、緩慢的。水也代表情緒尤其在水面下的洪流若湧現則意為情緒的湧現與爆發。占卜上代表女性，尤其現代女性。卡巴拉中代表著 YESOD 球體，與想像、夢想、幻想有關。不同於安蘇茲是左腦的理性，拉古茲代表人類右腦所主宰的領域，與圖像、想像、畫面有關，也代表著直覺，此時應聽著自我的直覺行事。占卜上代表流動的水，與情緒、直覺、自然發展、緩慢等相關，也與當事人的喜好度有相關。"
    	},
    	{
    		name: "英格茲(Ingwaz)",
    		title: "Ingwaz",
    		content: "原意為 Ing 神，是豐足、歡樂之神。掌管著農業的豐收，但事實上他更能代表孩童般的純真。從符號上來看 (來自古日耳曼族)代表著一個提供休憩、養精蓄銳、回復元氣的場所，是一種緩和的意義。也代表著陰囊或卵巢，供精子或卵子(人類生命之源)儲蓄能量之地。另一種符號，來自盎格魯薩克遜族，有著基因與遺傳的意思。英格茲與性和遺傳有關，是人們內在臻於成熟後進一步的繁衍，而內心知足者無論在哪都覺得是豐盛的；逆位則是理想化、不切實際。占卜上有可能因不敢突破舒適圈而未能創造好結果，此也表示一種不成熟的心態。若出現在結果的位置也代表著一件事情的完成，或美滿的結局，只有在非常負面的盤陣中才可能暗示著失敗。也有著養精蓄銳、水乳交融、簡單、暫時性的歡樂、或圓滿結局等。"
    	},
    	{
    		name: "歐瑟拉(Othala)",
    		title: "Othala",
    		content: "原意為繼承，代表著家族的力量及後代繼承的產物。歐瑟拉與家族有關，居住於長年冰冷及有危機意識的維京人是以群居的方式互相關照，家族對個人來說有著極大的影響，個人表現、成就或敗壞也會牽連整個家族，因此歐瑟拉表現出的是個人和家族、遺產的關係，包括界線、不可剝奪的遺產、以及運用智慧經營家族財產等。也代表事務的根基、基礎。歐瑟拉也是一種佔有所有物的象徵。繼承前幾世代遺留下來的物品、基因、內再創傷、業力。占卜上若是與感情有關通常與成家、結婚等佔有對方有關。也可能指出生活的條件，找到一棟房子、室友或與鄰居的關係等與個人目前所居住之環境有關。"
    	},
    	{
    		name: "戴格茲(Dagaz)",
    		title: "Dagaz",
    		content: "原意為日，是曙光、黎明的意思。在北歐夜晚的時間比白天長，甚至冬天會有永晝的現象，所以即使這麼短暫的曙光對他們來說卻是非常令人欣喜的光芒。在他們的文化中白天是夜晚的孩子，可看出除了欣喜白天的光芒，他們對夜晚也抱著相當尊敬的態度。曙光在北歐代表著夜晚過後帶來的欣喜的意思。戴格茲也象徵著增加與成長，是一種增進、豐饒的過程，且只要運用自我內在的力量(態度)便可翻轉局勢、反敗為勝。戴格茲的成長是緩慢的，循序漸進的變化，而非一夕之間的爆發。有時也暗示著生命中的巨變即將來到，可能是個極端徹底的事，讓你對生命改觀而使你必須重新開始，或在某件事上從新開始。而這也代表了經歷一段新的生活方式、新的思考模式，甚至可能是一種宗教啟蒙。占卜上，戴格茲能表示希望感、不預期的好事、期待、緩慢的增加等，也代表著巨變後新的開始、新的計畫等，通常戴格茲帶來的欣喜有如前端隧道出口處的一丁點光芒，意味著還有一段距離欣喜才會到來，需要耐心等待，只要懷著希望整個宇宙會聯合起來幫助你。"
    	},
    	{
    		name: "威爾(Wyrd)",
    		title: "Wyrd",
    		content: "原意為空，亦即宇宙之意。宇宙承載著萬事萬物、運行著四季、依照著某種法則使得這世界的一切存有得以生生不息。宇宙主宰這世上所發生的一切，人類的緣起緣滅至一花一草的萌生與凋零，都無法被改變也無法不遵從祂的旨意行走，所有的一切都在祂的掌管中，祂要我們往哪走就得往哪走、祂要世界如何發展就得如何發展，宇宙含納了所有的一切，沒有任何一件事物可以脫離祂，儘管一粒沙塵、一絲塵埃等再微小的存在、再脫軌的事物都在宇宙之內。宇宙懷有著萬事萬物，而萬事萬物中也包含著宇宙，意謂著生活上每個人事物都是宇宙的一部份、都和宇宙息息相通。科學已發現人類的細胞分析、分析、再分析下去的結果是什麼都沒有，即『空』，意謂著人類擁有無限創造的潛能，擁有宇宙掌管一且事務運行的潛在力量，意謂著我們正是宇宙。這並非你、我、他可以自在改變這世界法則，而是世上所有的人們、動植礦物等的能量連結與互動創造的能量之網，得以用某種發展的趨勢引領世界邁動。因此威爾在占卜上代表的是什麼都沒有(空)，然而因為是空，所以我們可以無中生有，我們可以運用自己的力量來創造，這時便是考驗自我能力與意願的時刻。"
    	}
    ];

    /* src\App.svelte generated by Svelte v3.49.0 */
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	child_ctx[18] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	child_ctx[18] = i;
    	return child_ctx;
    }

    // (129:1) {:else}
    function create_else_block(ctx) {
    	let div2;
    	let button;
    	let t1;
    	let div0;
    	let t2;
    	let div1;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*result*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*result*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			button = element("button");
    			button.textContent = "開始占卜";
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(button, "class", "button-60 mg-5");
    			attr_dev(button, "title", "及時占卜");
    			add_location(button, file, 131, 2, 2723);
    			attr_dev(div0, "class", "stone-box group-1item");
    			add_location(div0, file, 134, 3, 2824);
    			attr_dev(div1, "class", "stone-box group-3item");
    			add_location(div1, file, 144, 3, 3259);
    			attr_dev(div2, "class", "");
    			add_location(div2, file, 130, 1, 2705);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, button);
    			append_dev(div2, t1);
    			append_dev(div2, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(div2, t2);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[13], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*site, result*/ 24) {
    				each_value_1 = /*result*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*site, result*/ 24) {
    				each_value = /*result*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(129:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (91:1) {#if btn_default=="排義"}
    function create_if_block(ctx) {
    	let div0;
    	let searchinput;
    	let t0;
    	let div3;
    	let ul;
    	let li0;
    	let a0;
    	let div1;
    	let t1;
    	let li1;
    	let a1;
    	let div2;
    	let t2;
    	let div4;
    	let div4_class_value;
    	let t3;
    	let h3;
    	let t4_value = /*stone*/ ctx[5]["name"] + "";
    	let t4;
    	let t5;
    	let div5;
    	let t6;
    	let current;
    	let mounted;
    	let dispose;

    	searchinput = new SearchInput({
    			props: { id: "search-input" },
    			$$inline: true
    		});

    	searchinput.$on("search", /*handleSearch*/ ctx[9]);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(searchinput.$$.fragment);
    			t0 = space();
    			div3 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			div1 = element("div");
    			t1 = space();
    			li1 = element("li");
    			a1 = element("a");
    			div2 = element("div");
    			t2 = space();
    			div4 = element("div");
    			t3 = space();
    			h3 = element("h3");
    			t4 = text(t4_value);
    			t5 = space();
    			div5 = element("div");
    			t6 = text(/*stone_content*/ ctx[1]);
    			attr_dev(div0, "class", "pd-5");
    			add_location(div0, file, 91, 1, 1932);
    			attr_dev(div1, "class", "arrow swiper-button-prev arrowup");
    			add_location(div1, file, 98, 5, 2156);
    			attr_dev(a0, "class", "");
    			attr_dev(a0, "href", "#");
    			add_location(a0, file, 97, 4, 2107);
    			attr_dev(li0, "class", "nav-btn");
    			add_location(li0, file, 96, 3, 2081);
    			attr_dev(div2, "class", "arrow swiper-button-next arrowdown");
    			add_location(div2, file, 104, 4, 2309);
    			attr_dev(a1, "class", "");
    			attr_dev(a1, "href", "#");
    			add_location(a1, file, 103, 4, 2261);
    			attr_dev(li1, "class", "nav-btn");
    			add_location(li1, file, 102, 3, 2235);
    			attr_dev(ul, "class", "btn-nav");
    			add_location(ul, file, 95, 2, 2056);
    			attr_dev(div3, "class", "stage");
    			add_location(div3, file, 94, 1, 2033);
    			attr_dev(div4, "class", div4_class_value = "stone-img runes " + /*stone_title*/ ctx[0] + "");
    			attr_dev(div4, "title", /*stone_title*/ ctx[0]);
    			set_style(div4, "background-image", "url('img/runes/" + /*stone_title*/ ctx[0].toLocaleLowerCase() + ".png')");
    			add_location(div4, file, 109, 1, 2396);
    			add_location(h3, file, 110, 2, 2554);
    			attr_dev(div5, "class", "stone-content");
    			attr_dev(div5, "title", /*stone_title*/ ctx[0]);
    			add_location(div5, file, 112, 2, 2585);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(searchinput, div0, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(a0, div1);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(a1, div2);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div4, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, t6);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a0, "click", /*prevOne*/ ctx[7], false, false, false),
    					listen_dev(a1, "click", /*nextOne*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*stone_title*/ 1 && div4_class_value !== (div4_class_value = "stone-img runes " + /*stone_title*/ ctx[0] + "")) {
    				attr_dev(div4, "class", div4_class_value);
    			}

    			if (!current || dirty & /*stone_title*/ 1) {
    				attr_dev(div4, "title", /*stone_title*/ ctx[0]);
    			}

    			if (!current || dirty & /*stone_title*/ 1) {
    				set_style(div4, "background-image", "url('img/runes/" + /*stone_title*/ ctx[0].toLocaleLowerCase() + ".png')");
    			}

    			if ((!current || dirty & /*stone*/ 32) && t4_value !== (t4_value = /*stone*/ ctx[5]["name"] + "")) set_data_dev(t4, t4_value);
    			if (!current || dirty & /*stone_content*/ 2) set_data_dev(t6, /*stone_content*/ ctx[1]);

    			if (!current || dirty & /*stone_title*/ 1) {
    				attr_dev(div5, "title", /*stone_title*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(searchinput.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(searchinput.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(searchinput);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div4);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div5);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(91:1) {#if btn_default==\\\"排義\\\"}",
    		ctx
    	});

    	return block;
    }

    // (137:5) {#if index === 0}
    function create_if_block_2(ctx) {
    	let div1;
    	let div0;
    	let div0_class_value;
    	let div0_title_value;
    	let t0;
    	let h4;
    	let t1_value = /*item*/ ctx[16]["name"] + "";
    	let t1;
    	let t2_value = ["", "[逆]"][/*site*/ ctx[4][/*index*/ ctx[18]]] + "";
    	let t2;
    	let t3;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			h4 = element("h4");
    			t1 = text(t1_value);
    			t2 = text(t2_value);
    			t3 = space();
    			attr_dev(div0, "class", div0_class_value = "stone-img runes " + /*item*/ ctx[16]["title"] + " " + ["", "reverse"][/*site*/ ctx[4][/*index*/ ctx[18]]]);
    			attr_dev(div0, "title", div0_title_value = /*item*/ ctx[16]["title"]);
    			set_style(div0, "background-image", "url('img/runes/" + /*item*/ ctx[16]["title"].toLocaleLowerCase() + ".png')");
    			add_location(div0, file, 138, 6, 2958);
    			add_location(h4, file, 139, 6, 3157);
    			attr_dev(div1, "class", "stone-inner");
    			add_location(div1, file, 137, 5, 2925);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t0);
    			append_dev(div1, h4);
    			append_dev(h4, t1);
    			append_dev(h4, t2);
    			append_dev(div1, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*result, site*/ 24 && div0_class_value !== (div0_class_value = "stone-img runes " + /*item*/ ctx[16]["title"] + " " + ["", "reverse"][/*site*/ ctx[4][/*index*/ ctx[18]]])) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty & /*result*/ 8 && div0_title_value !== (div0_title_value = /*item*/ ctx[16]["title"])) {
    				attr_dev(div0, "title", div0_title_value);
    			}

    			if (dirty & /*result*/ 8) {
    				set_style(div0, "background-image", "url('img/runes/" + /*item*/ ctx[16]["title"].toLocaleLowerCase() + ".png')");
    			}

    			if (dirty & /*result*/ 8 && t1_value !== (t1_value = /*item*/ ctx[16]["name"] + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*site*/ 16 && t2_value !== (t2_value = ["", "[逆]"][/*site*/ ctx[4][/*index*/ ctx[18]]] + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(137:5) {#if index === 0}",
    		ctx
    	});

    	return block;
    }

    // (136:4) {#each result as item, index}
    function create_each_block_1(ctx) {
    	let if_block_anchor;
    	let if_block = /*index*/ ctx[18] === 0 && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*index*/ ctx[18] === 0) if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(136:4) {#each result as item, index}",
    		ctx
    	});

    	return block;
    }

    // (148:5) {#if index >0}
    function create_if_block_1(ctx) {
    	let div1;
    	let div0;
    	let div0_class_value;
    	let div0_title_value;
    	let t0;
    	let h4;
    	let t1_value = /*item*/ ctx[16]["name"] + "";
    	let t1;
    	let t2_value = ["", "[逆]"][/*site*/ ctx[4][/*index*/ ctx[18]]] + "";
    	let t2;
    	let t3;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			h4 = element("h4");
    			t1 = text(t1_value);
    			t2 = text(t2_value);
    			t3 = space();
    			attr_dev(div0, "class", div0_class_value = "stone-img runes " + /*item*/ ctx[16]["title"] + " " + ["", "reverse"][/*site*/ ctx[4][/*index*/ ctx[18]]]);
    			attr_dev(div0, "title", div0_title_value = /*item*/ ctx[16]["title"]);
    			set_style(div0, "background-image", "url('img/runes/" + /*item*/ ctx[16]["title"].toLocaleLowerCase() + ".png')");
    			add_location(div0, file, 149, 6, 3392);
    			add_location(h4, file, 150, 6, 3589);
    			attr_dev(div1, "class", "stone-inner");
    			add_location(div1, file, 148, 5, 3359);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t0);
    			append_dev(div1, h4);
    			append_dev(h4, t1);
    			append_dev(h4, t2);
    			append_dev(div1, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*result, site*/ 24 && div0_class_value !== (div0_class_value = "stone-img runes " + /*item*/ ctx[16]["title"] + " " + ["", "reverse"][/*site*/ ctx[4][/*index*/ ctx[18]]])) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty & /*result*/ 8 && div0_title_value !== (div0_title_value = /*item*/ ctx[16]["title"])) {
    				attr_dev(div0, "title", div0_title_value);
    			}

    			if (dirty & /*result*/ 8) {
    				set_style(div0, "background-image", "url('img/runes/" + /*item*/ ctx[16]["title"].toLocaleLowerCase() + ".png')");
    			}

    			if (dirty & /*result*/ 8 && t1_value !== (t1_value = /*item*/ ctx[16]["name"] + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*site*/ 16 && t2_value !== (t2_value = ["", "[逆]"][/*site*/ ctx[4][/*index*/ ctx[18]]] + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(148:5) {#if index >0}",
    		ctx
    	});

    	return block;
    }

    // (147:4) {#each result as item, index}
    function create_each_block(ctx) {
    	let if_block_anchor;
    	let if_block = /*index*/ ctx[18] > 0 && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*index*/ ctx[18] > 0) if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(147:4) {#each result as item, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let header;
    	let p;
    	let t1;
    	let main;
    	let div0;
    	let button0;
    	let t3;
    	let button1;
    	let t5;
    	let hr;
    	let t6;
    	let current_block_type_index;
    	let if_block;
    	let t7;
    	let footer;
    	let div1;
    	let span0;
    	let t9;
    	let span1;
    	let t11;
    	let span2;
    	let t12;
    	let a0;
    	let t14;
    	let span3;
    	let t15;
    	let b0;
    	let a1;
    	let t17;
    	let b1;
    	let a2;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*btn_default*/ ctx[2] == "排義") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			header = element("header");
    			p = element("p");
    			p.textContent = "盧恩符石";
    			t1 = space();
    			main = element("main");
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "排義";
    			t3 = space();
    			button1 = element("button");
    			button1.textContent = "及時占卜";
    			t5 = space();
    			hr = element("hr");
    			t6 = space();
    			if_block.c();
    			t7 = space();
    			footer = element("footer");
    			div1 = element("div");
    			span0 = element("span");
    			span0.textContent = "純交流學習";
    			t9 = space();
    			span1 = element("span");
    			span1.textContent = "想知道更多? 想了解排義、解惑?";
    			t11 = space();
    			span2 = element("span");
    			t12 = text("粉專: ");
    			a0 = element("a");
    			a0.textContent = "天使森林秘境";
    			t14 = space();
    			span3 = element("span");
    			t15 = text("Email: ");
    			b0 = element("b");
    			a1 = element("a");
    			a1.textContent = "pig3629@gmail.com";
    			t17 = text("、");
    			b1 = element("b");
    			a2 = element("a");
    			a2.textContent = "wuxin840411@gmail.com";
    			attr_dev(p, "class", "head-title");
    			add_location(p, file, 79, 1, 1559);
    			add_location(header, file, 78, 0, 1548);
    			attr_dev(button0, "class", "button-60");
    			attr_dev(button0, "title", "排義");
    			add_location(button0, file, 85, 2, 1640);
    			attr_dev(button1, "class", "button-60");
    			attr_dev(button1, "title", "及時占卜");
    			add_location(button1, file, 86, 2, 1736);
    			attr_dev(div0, "class", "introl ");
    			add_location(div0, file, 84, 1, 1615);
    			attr_dev(hr, "class", "hr-mid-circle");
    			attr_dev(hr, "multiple", "");
    			attr_dev(hr, "data-content", "交流分享");
    			add_location(hr, file, 88, 1, 1846);
    			add_location(main, file, 82, 0, 1604);
    			attr_dev(span0, "ckass", "fn14");
    			add_location(span0, file, 168, 3, 3767);
    			attr_dev(span1, "class", "fn12");
    			add_location(span1, file, 169, 3, 3803);
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "href", "https://www.facebook.com/angelsforestspace");
    			add_location(a0, file, 170, 26, 3873);
    			attr_dev(span2, "class", "fn12");
    			add_location(span2, file, 170, 3, 3850);
    			attr_dev(a1, "href", "mailto:pig3629@gmail.com");
    			add_location(a1, file, 171, 33, 3995);
    			add_location(b0, file, 171, 29, 3991);
    			attr_dev(a2, "href", "mailto:wuxin840411@gmail.com");
    			add_location(a2, file, 171, 99, 4061);
    			add_location(b1, file, 171, 96, 4058);
    			attr_dev(span3, "class", "fn12");
    			add_location(span3, file, 171, 3, 3965);
    			attr_dev(div1, "class", "note");
    			add_location(div1, file, 167, 3, 3744);
    			add_location(footer, file, 165, 1, 3729);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, p);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(div0, button0);
    			append_dev(div0, t3);
    			append_dev(div0, button1);
    			append_dev(main, t5);
    			append_dev(main, hr);
    			append_dev(main, t6);
    			if_blocks[current_block_type_index].m(main, null);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div1);
    			append_dev(div1, span0);
    			append_dev(div1, t9);
    			append_dev(div1, span1);
    			append_dev(div1, t11);
    			append_dev(div1, span2);
    			append_dev(span2, t12);
    			append_dev(span2, a0);
    			append_dev(div1, t14);
    			append_dev(div1, span3);
    			append_dev(span3, t15);
    			append_dev(span3, b0);
    			append_dev(b0, a1);
    			append_dev(span3, t17);
    			append_dev(span3, b1);
    			append_dev(b1, a2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[11], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(main, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(footer);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getRandom(min, max) {
    	return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let search = false;
    	let stone_title = "";
    	let stone_content = "";
    	let btn_default = "排義";
    	let result = "";
    	let site = [];

    	function handleTabClick(tabName) {
    		$$invalidate(2, btn_default = tabName);
    	}

    	//上一個
    	function prevOne() {
    		num = num - 1;

    		if (num < 0) {
    			num = runes.length - 1;
    		}

    		$$invalidate(5, stone = runes[num]);
    		$$invalidate(0, stone_title = stone["title"]);
    		$$invalidate(1, stone_content = stone["content"]);
    	}

    	//下一個
    	function nextOne() {
    		num = num + 1;

    		if (num > runes.length - 1) {
    			num = 0;
    		}

    		$$invalidate(5, stone = runes[num]);
    		$$invalidate(0, stone_title = stone["title"]);
    		$$invalidate(1, stone_content = stone["content"]);
    	}

    	//搜尋
    	function handleSearch(e) {
    		search = e.detail.value;

    		runes.filter((word, index) => {
    			if (word["name"].toLocaleLowerCase().indexOf(search) > -1 && search) {
    				num = index;
    				$$invalidate(5, stone = runes[num]);
    				$$invalidate(0, stone_title = stone["title"]);
    				$$invalidate(1, stone_content = stone["content"]);
    			}
    		});
    	}

    	//隨機載入盧恩
    	let num = getRandom(0, runes.length - 1);

    	let stone = runes[num];

    	if (stone) {
    		stone_title = stone["title"];
    		stone_content = stone["content"];
    	}

    	//開始占卜
    	function startPlay() {
    		let runes2 = JSON.parse(JSON.stringify(runes)); //copy
    		let item = runes2.sort(() => 0.5 - Math.random()); //結果取0~4即可
    		$$invalidate(3, result = item.slice(0, 4));

    		for (let i = 0; i < 4; i++) {
    			$$invalidate(4, site[i] = getRandom(0, 1), site);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = e => handleTabClick('排義');
    	const click_handler_1 = e => handleTabClick('及時占卜');
    	const click_handler_2 = e => startPlay();

    	$$self.$capture_state = () => ({
    		SearchInput,
    		runes,
    		search,
    		stone_title,
    		stone_content,
    		btn_default,
    		result,
    		site,
    		handleTabClick,
    		prevOne,
    		nextOne,
    		handleSearch,
    		num,
    		stone,
    		getRandom,
    		startPlay
    	});

    	$$self.$inject_state = $$props => {
    		if ('search' in $$props) search = $$props.search;
    		if ('stone_title' in $$props) $$invalidate(0, stone_title = $$props.stone_title);
    		if ('stone_content' in $$props) $$invalidate(1, stone_content = $$props.stone_content);
    		if ('btn_default' in $$props) $$invalidate(2, btn_default = $$props.btn_default);
    		if ('result' in $$props) $$invalidate(3, result = $$props.result);
    		if ('site' in $$props) $$invalidate(4, site = $$props.site);
    		if ('num' in $$props) num = $$props.num;
    		if ('stone' in $$props) $$invalidate(5, stone = $$props.stone);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		stone_title,
    		stone_content,
    		btn_default,
    		result,
    		site,
    		stone,
    		handleTabClick,
    		prevOne,
    		nextOne,
    		handleSearch,
    		startPlay,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,

    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
