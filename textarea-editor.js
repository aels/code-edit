// idea from https://github.com/WebCoder49/code-input
// but completely rewrited to have 0 (zero) dependencies, fixed bugs, made it bulletproof.
// Just include this script in footer and enjoy results.
textAreaEditor = function(hljs) {
	document.querySelectorAll("textarea").forEach(function(textarea,code,holder,lines){
		holder = textarea.parentElement;
		holder.style.position = "relative";
		textarea.setAttribute("spellcheck", "false");
		code = (holder.appendChild(document.createElement("pre")).appendChild(document.createElement("code")));
		code.textContent = textarea.value;
		lines = holder.appendChild(document.createElement("div"));
		lines.classList.add("line-numbers","hljs-meta");
		var
		insertStr = function(str,cursorPos) {
			cursorPos = cursorPos || textarea.selectionEnd+str.length;
			textarea.value = textarea.value.substring(0, textarea.selectionStart) + str + textarea.value.substring(textarea.selectionStart);
			textarea.setSelectionRange(cursorPos, cursorPos);
		},
		updateCode = function(text){
			text += text[text.length-1] == "\n"?" ":"";
			if(code.textContent != text) {
				code.textContent = text;
				hljs.highlightElement(code);
				updadeLineNums();
			}
		},
		updadeLineNums = function() {
			lines.textContent = "";
			for(var i=1;i<(textarea.value.match(/\n/g)||[]).length+2; i++) lines.textContent+=i+"\n";
		},
		syncScroll = function() {
			lines.scrollTop = textarea.scrollTop;
			code.scrollTop = textarea.scrollTop;
			code.scrollLeft = textarea.scrollLeft;
		},
		checkTabs = function(event,linesBefore,linesSelected,begin,end) {
			if( event.keyCode==13 && !(event.metaKey||event.ctrlKey) && textarea.selectionStart == textarea.selectionEnd ) {
				event.preventDefault();
				insertStr("\n"+textarea.value.substring(0, textarea.selectionStart).split("\n").pop().match(/^(\s*)[\S]*/)[1]);
			}
			if (event.key == "Tab") {
				event.preventDefault();
				if(textarea.selectionStart == textarea.selectionEnd) {
					insertStr("\t");
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
			}
			updateCode(textarea.value);
		};
		textarea.addEventListener('input', function() { updateCode(textarea.value); syncScroll() });
		textarea.addEventListener('scroll', function() { syncScroll() });
		textarea.addEventListener('keydown', function(e) { checkTabs(e) });
		hljs.highlightElement(code);
		updadeLineNums();
	});
};
textAreaEditorInit = function(s,u) {
	document.head.appendChild(document.createElement('style')).innerHTML = `
		textarea,code,.line-numbers{font-size:9pt;font-family:monospace;line-height:13pt;tab-size:4;caret-color:darkgrey;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;border:0!important;overflow:auto!important;height:calc(100% - 16px);width:calc(100% - 16px);margin:0;padding:8px 8px 8px 50px!important;box-sizing:border-box;position:absolute;top:8px;left:8px;z-index:0}
		code *{font-size:inherit!important;font-family:inherit!important;line-height:inherit!important;tab-size:inherit!important}
		textarea{z-index:1;color:transparent;background:transparent;resize:none;outline:none!important}
		pre{position:static!important}
		.line-numbers{width:50px;padding:8px!important}
		.line-numbers::-webkit-scrollbar{display:none}`;
	u = document.createElement('link');
	u.rel = 'stylesheet';
	u.href = document.currentScript.src.split('#')[1]||'//highlightjs.org/static/demo/styles/monokai-sublime.css';
	document.head.appendChild(u);
	s = document.createElement('script');
	s.onload = function(){ textAreaEditor(hljs) };
	s.src = '//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/highlight.min.js';
	document.head.appendChild(s);
};
textAreaEditorInit();
