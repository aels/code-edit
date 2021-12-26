// idea from https://github.com/WebCoder49/code-input
// but completely rewrited to have 0 (zero) dependencies, fixed bugs, made it bulletproof.
// Just include this script in footer and enjoy results.

textAreaEditor = function(hljs) {
	document.querySelectorAll("textarea").forEach(function(textarea,code,holder,lines){
		var
		updateCode = function(text){
			text += text[text.length-1] == "\n"?" ":"";
			if(code.textContent != text) {
				code.textContent = text;
				hljs.highlightElement(code);
				updadeLineNums();
			}
			syncScroll();
		},
		updadeLineNums = function() {
			lines.textContent = "";
			for(var i=1;i<(textarea.value.match(/\n/g)||[]).length+3; i++) lines.textContent+=i+"\n";
		},
		syncScroll = function() {
			lines.scrollTop = textarea.scrollTop;
			code.scrollTop = textarea.scrollTop;
			code.scrollLeft = textarea.scrollLeft;
		},
		checkTabs = function(event,linesBefore,linesSelected,begin,end) {
			if( event.code=="Enter" && !(event.metaKey||event.ctrlKey) ) {
				event.preventDefault();
				document.execCommand("insertText", !1, '\n'+textarea.value.substring(0, textarea.selectionStart).split("\n").pop().match(/^(\s*)[\S]*/)[1]);
				updateCode(textarea.value);
			}
			if (event.key == "Tab") {
				event.preventDefault();
				if(textarea.selectionStart == textarea.selectionEnd) {
					document.execCommand("insertText", !1, '\t');
				}
				else {
					linesBefore = textarea.value.substring(0, textarea.selectionStart).split("\n").length-1;
					linesSelected = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd).split("\n").length;
					begin = textarea.selectionStart;
					end = textarea.selectionEnd;
					textarea.value = textarea.value.split("\n").map(function(str,i){
						if( i>=linesBefore && i<linesBefore+linesSelected ) {
							str = "\t"+str;
							end++;
						}
						return str;
					}).join("\n");
					textarea.selectionStart = begin+1;
					textarea.selectionEnd = end;
				}
				updateCode(textarea.value);
			}
		};
		holder = textarea.parentElement;
		holder.style.position = "relative";
		textarea.setAttribute("spellcheck", "false");
		textarea.style.width = textarea.offsetWidth-40+'px';
		wrapper = holder.appendChild(document.createElement("div"));
		wrapper.classList.add("code-wrapper");
		wrapper.style.width = textarea.offsetWidth+'px';
		wrapper.style.height = textarea.offsetHeight+'px';
		wrapper.style.left = textarea.offsetLeft-40+'px';
		wrapper.style.top = textarea.offsetTop+'px';
		code = wrapper.appendChild(document.createElement("code"));
		code.textContent = textarea.value;
		lines = holder.appendChild(document.createElement("div"));
		lines.style.height = textarea.offsetHeight+'px';
		lines.style.left = textarea.offsetLeft-40+'px';
		lines.style.top = textarea.offsetTop+'px';
		lines.classList.add("line-numbers","hljs-meta");

		textarea.addEventListener('input', function() { updateCode(textarea.value) });
		textarea.addEventListener('scroll', function() { updateCode(textarea.value) });
		textarea.addEventListener('keydown', function(e) { checkTabs(e) });
		
		hljs.highlightElement(code);
		updadeLineNums();
	});
};
textAreaEditorInit = function(s,u) {
	document.head.appendChild(document.createElement('style')).innerHTML = `
		textarea,code,.code-wrapper,.line-numbers{
			font: 12px 'Fira Mono',monospace !important;
			line-height:18px;
			tab-size:4;
			caret-color:#e6db74;
			white-space:pre;
			word-spacing:normal;
			word-break:normal;
			word-wrap:normal;
			border:0!important;
			overflow:auto!important;
			margin: 0 0 0 40px!important;
			padding:8px!important;
			box-sizing:border-box;
			position:absolute;
			z-index:0;
		}
		textarea{
			position: relative;
			z-index:1;
			color:transparent;
			background:transparent;
			resize:none;
			outline:none!important;
		}
		.code-wrapper{
			padding:0!important;
		}
		code{
			width:100%!important;
			height:100%!important;
			margin:0!important;
		}
		.line-numbers{
			width:40px!important;
			padding: 8px 8px 8px 0!important;
			margin: 0!important;
			background: #111;
			border-right: #e6db74 1px solid!important;
			text-align: right;
		}
		.line-numbers::-webkit-scrollbar{
			display:none;
		}
		code span{
			font-weight: normal;
		}`;
	u = document.createElement('link');
	u.rel = 'stylesheet';
	u.href = document.currentScript&&document.currentScript.src.split('#')[1]||'//highlightjs.org/static/demo/styles/monokai-sublime.css';
	document.head.appendChild(u);
	u = document.createElement('link');
	u.rel = 'stylesheet';
	u.href = '//fonts.googleapis.com/css2?family=Fira+Mono&display=swap';
	document.head.appendChild(u);
	s = document.createElement('script');
	s.onload = function(){ textAreaEditor(hljs) };
	s.src = '//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/highlight.min.js';
	document.head.appendChild(s);
};
textAreaEditorInit();
