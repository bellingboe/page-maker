var isLightbox = false;
var delButtonTimeout;
var didBlur;
var toolActive;

var UIclasses = ["page-reorder-el", "text-mod-tooltip", "toolSlot", "ui-sortable"];

var UIattrs = ["data-tool", "data-hasqtip", "contenteditable", "aria-describedby"];

var _UI = {
    staticVars: {
        htmlString: null,
        htmlFormatCallback: null,
        rawHtmlCode: null,
	canvasSortOptions: {
		placeholder: "elem-placeholder",
		forcePlaceholderSize: true,
		zIndex: 999,
		opacity: 1,
		scroll: true,
		cursor: "move",
		cancel: ".is-edit-mode",
		items: ".page-reorder-el",
		connectWith: ".toolSlot",
		helper: function (event, ui) {
		    return ui.clone();
		},
		start: function (event, ui) {
		    $("body").addClass("sort-show");
		    $(".sideBar").addClass("no-scroll");
		    var top = $(".sb-items").offset().top;
		    top = top - 35;
		    $(".sb-items").css("margin-top", top+"px");
		    $(".sideBar").addClass("no-scroll");
		    _UI.actions.pageLightbox();
		    clearTimeout(delButtonTimeout);
		    _UI.actions.hideDelButton();
		},
		over: function (event, ui) {
		    var ci = $(this).data().uiSortable.currentItem;
		    var t = ci.attr("data-tool");
		    var tool_display_text = _UI.tools[t].toolDisplayText;
		    ui.helper.width(ui.helper.attr("data-w") + "px");
		    ui.helper.height(ui.helper.attr("data-ht") + "px");
		    ui.helper.find(".dragging-cb").show();
	
		    var ph_height = ui.helper.outerHeight();
	
		    if (ph_height < 30) {
			ph_height = 30;
		    }
	
		    ui.placeholder.html("<i class='fa fa-check'></i> Drop that " + tool_display_text + " here")
			.height(ph_height + "px")
			.css("line-height", ph_height + "px");
	
		    /* CONCEPT
		    var phw = ui.placeholder.outerWidth();
		    var phh = ui.placeholder.outerHeight();
		    ui.helper.animate({width:phw, height:phh}, "fast"); */
		},
		out: function (event, ui) {
		    try {
			ui.helper.find(".dragging-cb").hide();
		    } catch (err) {}
		},
		stop: function (event, ui) {
		    $("body").removeClass("sort-show");
		    $(".sideBar").removeClass("no-scroll");
		    var ci = $(this).data().uiSortable.currentItem;
		    var t = ci.attr("data-tool");
		    var selected_tool = new _Tools[t]();
		    if (ci.hasClass("tool-item")) {
			var ph_div_el = $("<div>")
			    .addClass("page-reorder-el")
			    .html(selected_tool.initContent());
			ph_div_el.attr("data-tool", t);
			ci.replaceWith(ph_div_el);
			if (selected_tool.hasOwnProperty("postInit")) {
			    selected_tool.postInit(ph_div_el);
			}
		    }
		}
	    }
    },
    tools: {
        title: {
            toolDisplayText: "Title",
            toolPlaceholderText: "Click to modify title text."
        },
        text: {
            toolDisplayText: "Text Block",
            toolPlaceholderText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer tellus justo, posuere vel posuere a, vulputate vitae dui. Nunc volutpat purus erat, ullamcorper posuere quam aliquam mollis. Sed vestibulum tincidunt semper. Sed interdum nulla urna, nec vulputate lectus volutpat nec. Vestibulum sit amet blandit nisi. Nam aliquet ipsum lacus, sit amet dapibus lorem interdum quis. Donec vehicula tempor lectus, et fermentum lectus venenatis ut."
        },
        hrule: {
            toolDisplayText: "Divider"
        },
        image: {
            toolDisplayText: "Image"
        },
        imagetext: {
            toolDisplayText: "Image + Text",
            toolPlaceholderText: "Click to modify text."
        },
        blockquote: {
            toolDisplayText: "Blockquote",
            toolPlaceholderText: "Click to modify text."
        },
	twoCol: {
            toolDisplayText: "2-Column Layout",
            toolPlaceholderText: ""
	}
    },
    hooks: {
    	pageLoadModal: function () {
		var newDiv = $("<div>");
		newDiv.append($(".welcomeTemplate").clone().children());
		
		_UI.actions.populateOverlayModal(newDiv);
		_UI.actions.showOverlayModal();
		_UI.actions.resizeOverlayModal();
		
            var sheetScroller = $(".overlayScroller");
            
            sheetScroller.delay(500).fadeIn();
             _UI.actions.resizeOverlayModal();
    	},
        setHtmlStringToFormat: function (str) {
             _UI.staticVars.rawHtmlCode = str;
        },
        setHtmlFormatDoneCallback: function (func) {
            _UI.staticVars.htmlFormatCallback = func;
        },
        didCompleteHtmlFormat: function (code) {
            _UI.staticVars.htmlString = code;
            _UI.staticVars.htmlFormatCallback(code);
        },
        startHtmlFormatting: function () {
            cleanHTML(_UI.staticVars.rawHtmlCode);
        },
        populateTextWithPlaceholderIfEmpty: function(jqobj) {
            var tool = jqobj.closest(".page-reorder-el").attr("data-tool");        
            var ph_text = _UI.tools[tool].toolPlaceholderText;
            var text = jqobj.html();
            if (text.length == 0) {
                jqobj.html(ph_text);
            }
        },
        didBlurFromEdit: function (jqobj) {
            var p = jqobj.parents();
            var parentHasStickyClass = false;

            p.each(function () {
                var t = $(this);
                if (
                t.hasClass("is-edit-mode") || t.hasClass("stay-focus")) {
                    parentHasStickyClass = true;
                }
            });

            if (
            parentHasStickyClass == false) {
                return true;
            }
            return false;
        }
    },
    actions: {
        stripUIinfo: function(what) {
            what.children().each(function() {    
                var pageEl = $(this);
                $.each(UIclasses, function(idx, val){
                    pageEl.removeClass(val);
                });
                $.each(UIattrs, function(idx, val){
                    pageEl.removeAttr(val);
                });
                var classAttr = pageEl.attr("class");
                if (("undefined" !== typeof classAttr) && (classAttr.length == 0)) {
                    pageEl.removeAttr("class");
                }
                if (pageEl.children()) {
                    _UI.actions.stripUIinfo(pageEl);
                }
            });
        },
        popDelButton: function (el) {
            if (delButtonTimeout) {
                clearTimeout(delButtonTimeout);
            }
            var pageEl = el;
            $(".deleteElement").data("page-el", pageEl).position({
                of: pageEl,
                my: "right top",
                at: "right top",
                collision: "flip flip"
            }).show();
        },
        hideDelButton: function () {
            var delButton = $(".deleteElement");
            if (delButton.data("page-el")) {
                delButton.data("page-el").removeClass("active-el");
                delButton.data("page-el", "");
                delButton.hide();
            }
        },
        pageLightbox: function () {
            if (isLightbox) {
                return false;
            }
            isLightbox = true;
            return true;
        },
        removePageLightbox: function () {
            isLightbox = false;
        },
        showOverlayModal: function () {
            var sheet = $(".overlaySheet");
            var sheetScroller = $(".overlayScroller");

            sheetScroller.fadeIn();
            sheet.center({vertical: false}).css({"top": "-50px"});
            sheet.animate({"top": "50px"},
            {complete: function(){
                sheet.css("position","relative");
            }});
            
        },
        hideOverlayModal: function () {
            var sheetScroller = $(".overlayScroller");
            var sheet = $(".overlaySheet");
            sheet.animate({
                "top": "-50px"
            });
            sheetScroller.fadeOut();
        },
        populateOverlayModal: function (content) {
            var sheet = $(".overlaySheet").empty().append(content);
        },
        resizeOverlayModal: function () {
            var sheet = $(".overlaySheet");
            sheet.center({vertical: false});
        }
    }
};

var _Tools = {
    title: function () {
        this.initContent = function () {
            var ph_text = _UI.tools.title.toolPlaceholderText;
            var ph_el = "<h1>";
            this.contentObject = $(ph_el)
                .addClass("text-mod-tooltip")
                .html(ph_text);
            this.contentObject.data("tools-ref", this);
            return this.contentObject;
        };
        this.postInit = function (parEl) {
            this.parentObject = parEl;
            this.contentObject.on("blur", function (ev) {
                ev.preventDefault();
                if (didBlur) {
                    $(this).data("tools-ref").parentObject.removeClass("is-edit-mode");
                    $(this).data("tools-ref").contentObject.attr("contenteditable", "false");
                }
            }).on("click", function () {
                $(this).data("tools-ref").triggerFocus();
            });
        };
        this.triggerFocus = function () {
            toolActive = this.contentObject;
            if (this.contentObject.data('qtip') == null) {
                this.contentObject.qtip({
                    content: {
                        text: $(".text-edit-tooltip").html()
                    },
                    hide: "unfocus",
                    style: {
                        classes: "stay-focus qtip-tipsy qtip-shadow",
                        def: false
                    },
                    position: {
                        my: 'bottom center',
                        at: 'top center'
                    },
                    overwrite: false,
                    show: {
                        event: "focus",
                        ready: true
                    }
                });
            }
            this.parentObject.addClass("is-edit-mode");
            this.contentObject.attr("contenteditable", "true").focus();
        };
        this.triggerBlur = function () {
            this.contentObject.blur();
        };
    },
    text: function () {
        this.initContent = function () {
            var ph_text = _UI.tools.text.toolPlaceholderText;
            var ph_el = "<p>";
            this.contentObject = $(ph_el)
                .addClass("text-mod-tooltip")
                .html(ph_text);
            this.contentObject.data("tools-ref", this);
            return this.contentObject;
        };
        this.postInit = function (parEl) {
            this.parentObject = parEl;
            this.contentObject.on("blur", function (ev) {
                ev.preventDefault();
                if (didBlur) {
                    $(this).data("tools-ref").parentObject.removeClass("is-edit-mode");
                    $(this).data("tools-ref").contentObject.attr("contenteditable", "false");
                }
            }).on("click", function () {
                $(this).data("tools-ref").triggerFocus();
            });
        };
        this.triggerFocus = function () {
            toolActive = this.contentObject;
            if (this.contentObject.data('qtip') == null) {
                this.contentObject.qtip({
                    content: {
                        text: $(".text-edit-tooltip").html()
                    },
                    hide: "unfocus",
                    style: {
                        classes: "stay-focus qtip-tipsy qtip-shadow",
                        def: false
                    },
                    position: {
                        my: 'bottom center',
                        at: 'top center'
                    },
                    overwrite: false,
                    show: {
                        event: "focus",
                        ready: true 
                    }
                });
            }
            this.parentObject.addClass("is-edit-mode");
            this.contentObject.attr("contenteditable", "true").focus();
        };
        this.triggerBlur = function () {
            this.contentObject.blur();
        };
    },
    hrule: function () {
        this.initContent = function () {
            var ph_el = "<div>";
            this.contentObject = $(ph_el).addClass("page-divider");
            this.contentObject.data("tools-ref", this);
            return this.contentObject;
        };
    },
    image: function () {
        this.initContent = function () {
            var ph_el = "<img>";
            this.contentObject = $(ph_el).addClass("placeholder-image-large");
            this.contentObject.data("tools-ref", this);
            return this.contentObject;
        };
        this.postInit = function (parEl) {
            this.parentObject = parEl;
            this.contentObject.on("click", function () {
                $(this).data("tools-ref").triggerFocus();
            });
        };
        this.triggerFocus = function () {
            toolActive = this.contentObject;
            if (this.contentObject.data('qtip') == null) {
                this.contentObject.qtip({
                    content: {
                        text: $(".image-edit-tooltip").html()
                    },
                    hide: "unfocus",
                    style: {
                        classes: "stay-focus qtip-tipsy qtip-shadow",
                        def: false
                    },
                    position: {
                        my: 'bottom center',
                        at: 'top center'
                    },
                    overwrite: false,
                    show: {
                        event: "click",
                        ready: true
                    }
                });
            }
            this.parentObject.addClass("is-edit-mode");
        };
        this.triggerBlur = function () {
            this.parentObject.removeClass("is-edit-mode");
        };
    },
    imagetext: function () {
        this.initContent = function () {
            var ph_el = "<div>";
	    var ph_text = _UI.tools.imagetext.toolPlaceholderText;
            this.contentObject = $(ph_el)
                                    .addClass("image-text-combo");
            var img = $("<img>").addClass("placeholder-image").appendTo(this.contentObject);
            var text = $("<div>").html(ph_text).addClass("image-wrapper-text").appendTo(this.contentObject);
            this.contentObject.data("tools-ref", this);
            return this.contentObject;
        };
        this.postInit = function (parEl) {
            this.parentObject = parEl;
            this.contentObject.on("click", ".image-wrapper-text", function () {
                $(this).parent().data("tools-ref").triggerTextFocus();
            }).on("click", ".placeholder-image", function () {
                $(this).parent().data("tools-ref").triggerImageFocus();
            });
        };
        this.triggerTextFocus = function () {
            this.mode = "text";
            toolActive = this.contentObject;
            if (this.contentObject.find(".image-wrapper-text").data('qtip') == null) {
                this.contentObject.find(".image-wrapper-text").qtip({
                    content: {
                        text: $(".text-edit-tooltip").html()
                    },
                    hide: "unfocus",
                    style: {
                        classes: "stay-focus qtip-tipsy qtip-shadow",
                        def: false
                    },
                    position: {
                        my: 'bottom center',
                        at: 'top center'
                    },
                    overwrite: false,
                    show: {
                        event: "focus",
                        ready: true
                    }
                });
            }
            this.parentObject.addClass("is-edit-mode");
            this.contentObject.find(".image-wrapper-text").attr("contenteditable", "true").focus();
        };
        this.triggerImageFocus = function () {
            this.mode = "image";
            toolActive = this.contentObject;
            this.parentObject.addClass("is-edit-mode");
            if (this.contentObject.find(".placeholder-image").data('qtip') == null) {
                this.contentObject.find(".placeholder-image").qtip({
                    content: {
                        text: "Edit Small Image"
                    },
                    hide: "unfocus",
                    style: {
                        classes: "stay-focus qtip-tipsy qtip-shadow",
                        def: false
                    },
                    position: {
                        my: 'bottom center',
                        at: 'top center'
                    },
                    overwrite: false,
                    show: {
                        event: "click",
                        ready: true
                    }
                });
            }
        };
        this.triggerTextBlur = function () {
            _UI.hooks.populateTextWithPlaceholderIfEmpty(this.contentObject.find(".image-wrapper-text"));
            this.parentObject.removeClass("is-edit-mode");
        };
        this.triggerImageBlur = function () {
            this.parentObject.removeClass("is-edit-mode");
        };
        this.triggerBlur = function () {
            switch (this.mode) {
                case "text":
                    this.triggerTextBlur();
                    break;
                case "image":
                    this.triggerImageBlur();
                    break;
            }
            this.parentObject.removeClass("is-edit-mode");
        };
    },
    blockquote: function () {
        this.initContent = function () {
            var ph_text = _UI.tools.blockquote.toolPlaceholderText;
            var ph_el = "<blockquote>";
            this.contentObject = $(ph_el)
                .addClass("text-mod-tooltip")
                .html(ph_text);
            this.contentObject.data("tools-ref", this);
            return this.contentObject;
        };
        this.postInit = function (parEl) {
            this.parentObject = parEl;
            this.contentObject.on("blur", function (ev) {
                ev.preventDefault();
                if (didBlur) {
                    $(this).data("tools-ref").parentObject.removeClass("is-edit-mode");
                    $(this).data("tools-ref").contentObject.attr("contenteditable", "false");
                }
            }).on("click", function () {
                $(this).data("tools-ref").triggerFocus();
            });
        };
        this.triggerFocus = function () {
            toolActive = this.contentObject;
            if (this.contentObject.data('qtip') == null) {
                this.contentObject.qtip({
                    content: {
                        text: $(".text-edit-tooltip").html()
                    },
                    hide: "unfocus",
                    style: {
                        classes: "stay-focus qtip-tipsy qtip-shadow",
                        def: false
                    },
                    position: {
                        my: 'bottom center',
                        at: 'top center'
                    },
                    overwrite: false,
                    show: {
                        event: "focus",
                        ready: true 
                    }
                });
            }
            this.parentObject.addClass("is-edit-mode");
            this.contentObject.attr("contenteditable", "true").focus();
        };
        this.triggerBlur = function () {
            this.contentObject.blur();
        };
    },
    twoCol: function () {
        this.initContent = function () {
            var ph_text = _UI.tools.twoCol.toolPlaceholderText;
            var ph_el = "<table>";
            this.contentObject = $(ph_el).addClass("two-col-layout");
	    
	    var row = $("<tr>").appendTo(this.contentObject);
	    
	    this.leftCol = $("<td>").addClass("toolSlot").appendTo(row);
	    this.rightCol = $("<td>").addClass("toolSlot").appendTo(row);
	    
	    var sortableOpts = _UI.staticVars.canvasSortOptions;
	    sortableOpts.connectWith = ".toolSlot";
	    
	    this.leftCol.sortable(sortableOpts);
	    this.rightCol.sortable(sortableOpts);
	    
            this.contentObject.data("tools-ref", this);
            return this.contentObject;
        };
        this.postInit = function (parEl) {
            this.parentObject = parEl;
        };
    }
};

$(function () {

    $(".tool-item").disableSelection();

    $(".sideBar .tool-item").each(function () {
        var sb_tool = $(this);
        var t = sb_tool.attr("data-tool");
        if ("undefined" == typeof _Tools[t]) {
            sb_tool.addClass("tool-item-disabled");
        }
    });

    var sbToCanvas = {
        connectToSortable: ".toolSlot",
        zIndex: 999,
        opacity: 1,
        scroll: false,
        items: ".tool-item",
        cancel: ".tool-item-disabled",
        start: function (event, ui) {
	    $("body").addClass("sort-show");
            var top = $(".sb-items").offset().top;
            top = top - 35;
            $(".sb-items").css("margin-top", top+"px");
            $(".sideBar").addClass("no-scroll");
        },
        stop: function (event, ui) {
	    $("body").removeClass("sort-show");
            $(".sideBar").removeClass("no-scroll");
            $(".sb-items").css("margin-top","");
        },
        helper: function () {
            var h = $(this);
            var w = h.outerWidth();
            var ht = h.outerHeight();
            var offset = $(".sideBar").scrollTop();
            var ml = h.hasClass("ti-l") ? "15px" : "0";
            var cb = $("<span>")
                .addClass("dragging-cb")
                .html("&#xf00c;");
            return h.clone()
                .css("margin-left", ml)
                .css("margin-top", -(offset-15)+"px")
                .width(w)
                .height(ht)
                .addClass("is-dragging")
                .append(cb);
        }
    };
    $(".tool-item").disableSelection().draggable(sbToCanvas);
    $(".sideBar").disableSelection();

    var sortOpts = _UI.staticVars.canvasSortOptions;
    delete sortOpts.connectWith;
    
    $(".toolSlot").sortable(sortOpts);
    $(".pageCanvas *").disableSelection();

    $(".is-edit-mode").enableSelection();

    $(".stay-focus").on("mousedown", function (ev) {
        ev.stopPropagation();
    });

    $("html").on("mousedown", function (ev) {
        didBlur = _UI.hooks.didBlurFromEdit($(ev.target));
        if (didBlur) {
            if (toolActive && "undefined" !== typeof toolActive.data("tools-ref")) {
                toolActive.data("tools-ref").triggerBlur();
            }
            //$(':focus').blur();
        }
    });

    $(".deleteElement").on("mouseenter mouseover", function () {
        if (delButtonTimeout) {
            clearTimeout(delButtonTimeout);
        }
        $(".deleteElement").data("page-el").addClass("active-el");
    }).on("mouseleave", function () {
        delButtonTimeout = setTimeout(function () {
            _UI.actions.hideDelButton()
        }, 100);
    }).on("click", function () {
        $(".deleteElement").data("page-el").remove();
        $(".deleteElement").hide();
        if (delButtonTimeout) {
            clearTimeout(delButtonTimeout);
        }
    });
    
    $(".pageCanvas").on("mouseover", ".page-reorder-el", function () {
        if ($(this).hasClass("ui-sortable-helper")) {
            return false;
        }
        _UI.actions.popDelButton($(this));
        return 1;
    });

    $(".pageCanvas").on("mouseleave", ".page-reorder-el", function () {
        delButtonTimeout = setTimeout(function () {
            _UI.actions.hideDelButton()
        }, 200);
    });

    $('body').on("click", ".text-mod-content a", function (e) {
        e.preventDefault();
        document.execCommand($(this).data('role'), false, null);
    });
    
    $(".mainHead a").on("click", function (e) {
        e.preventDefault();
    });
    
    $(".ctl-html").on("click", function (e) {
        var htmlTemplate = $(".canvasHtmlModalTemplate").clone();
        var canvasCopy = $(".pageCanvas").clone();
        var htmlText;
        var htmlTextFormatted = null;
        
        var newDiv = $("<div>");
         newDiv.append(htmlTemplate.children());

        _UI.actions.stripUIinfo(canvasCopy);
        
        htmlText = canvasCopy.html();
         
        _UI.hooks.setHtmlStringToFormat(htmlText);
        
        _UI.hooks.setHtmlFormatDoneCallback(function(code){
            htmlTextFormatted = code;
            
            _UI.actions.populateOverlayModal(newDiv);
            
            if (htmlTextFormatted.length == 0) {
            	htmlTextFormatted = "You haven't added any elements yet!";
            	var msg = $("<p>").html(htmlTextFormatted);
            	newDiv.find(".htmlDisplay").replaceWith(msg);
            	_UI.actions.showOverlayModal();
            } else {
		var htmlDisp = newDiv.find(".htmlDisplay").text(htmlTextFormatted).get(0);
		_UI.actions.showOverlayModal();
		var myCodeMirror = CodeMirror.fromTextArea(htmlDisp, {mode: "htmlmixed", lineNumbers: true, lineWrapping: true, tabMode: "indent"});
            }
            
            _UI.actions.resizeOverlayModal();
        });

        _UI.hooks.startHtmlFormatting();
        
        
        
    });
    
    $(".ctl-preview").on("click", function (e) {
        e.preventDefault();
        var header = $(".mainHead");
        var sb = $(".sideBar");
        var edit = $(".editorBox");
        var scroll = $(".scrollBox");
        var shadow = 16;
        
        var headerHeight = (header.outerHeight()) + shadow;
        var sbWidth = sb.outerWidth();
        var editTop = edit.offset().top;
        var editLeft = scroll.offset().left;
        
        var newEditLeft = editLeft - sbWidth;
        var sideBarNegWidth = -sbWidth;

        header.animate({"margin-top": "-"+headerHeight+"px"}, {queue: false});
        edit.animate({"top": "0"}, {queue: false});
        scroll.animate({"left": "0", "top": "0", "right": "0"}, {queue: false});
        sb.animate({"left": sideBarNegWidth+"px"}, {queue: false});
        
        $(".ctl-hidepreview").fadeIn();
    });
    
    $(".ctl-hidepreview").on("click", function (e) {
        e.preventDefault();
        var header = $(".mainHead");
        var sb = $(".sideBar");
        var edit = $(".editorBox");
        var scroll = $(".scrollBox");
        var shadow = 16;
        
        var headerHeight = (header.outerHeight()) + shadow;
        var sbWidth = sb.outerWidth();
        
        var editTop = edit.offset().top;
        var editLeft = scroll.offset().left;
        
        var newEditLeft = editLeft - sbWidth;
        var sideBarNegWidth = -sbWidth;

        header.animate({"margin-top": "0"}, {queue: false});
        edit.animate({"top": (headerHeight-shadow)+"px"}, {queue: false});
        scroll.animate({"left": (sbWidth+20)+"px", "top": "20px", "right": "20px"}, {queue: false});
        sb.animate({"left": "0", "top": headerHeight-shadow+"px"}, {queue: false});
        
        $(".ctl-hidepreview").fadeOut();
    });
    
    $(".overlayBG").on("click", function (e) {
        _UI.actions.hideOverlayModal();
    });
    
    $(".overlaySheet").on("click", ".modal-ok", function (e) {
        e.preventDefault();
        _UI.actions.hideOverlayModal();
    });

    $(".ctl-hidepreview").qtip({
        position: {
            my: 'left center',
            at: 'right center'
        }
    });
    
    $(".basic-tt").qtip();
    
    _UI.hooks.pageLoadModal();

    //$(".image-edit-tooltip").show().addClass("qtip").addClass("qtip-tipsy").addClass("qtip-shadow").position({of: $(".pageCanvas")});

});