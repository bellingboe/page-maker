<!doctype html>
<html>
    <head>
        <meta http-equiv="content-type" content="text/html; charset=UTF-8">
        <title>Page Maker</title>
        
        <script type='text/javascript' src='//code.jquery.com/jquery-1.10.1.js'></script>
        <script type='text/javascript' src="//cdnjs.cloudflare.com/ajax/libs/qtip2/2.1.1/jquery.qtip.min.js"></script>
        <script type='text/javascript' src="./app.js"></script>
        <script type='text/javascript' src="https://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
        <script type='text/javascript' src="/jquery.center.js"></script>
        <script src="./codemirror/lib/codemirror.js"></script>
        <script src="./codemirror/mode/javascript/javascript.js"></script>
        <script src="./codemirror/mode/xml/xml.js"></script>
        <script src="./codemirror/mode/css/css.js"></script>
        <script src="./codemirror/mode/htmlmixed/htmlmixed.js"></script>
        <script src="./tabifier.js"></script>

	<link href='https://fonts.googleapis.com/css?family=Nunito' rel='stylesheet' type='text/css'>
	<link href='https://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>
            
        <link rel="stylesheet" href="./codemirror/lib/codemirror.css">
        <link rel="stylesheet" href="./whhg-font/css/whhg.css">
        <link rel="stylesheet" type="text/css" href="https://netdna.bootstrapcdn.com/font-awesome/4.0.1/css/font-awesome.css">
        <link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/qtip2/2.1.1/jquery.qtip.min.css">
	    
        <link rel="stylesheet" type="text/css" href="./app.css">
	<link rel="stylesheet" type="text/css" href="./slik-ui.css">
        
        <style>
            .overlaySheet .slik-ui-list > li:before  {
                font-family: "WebHostingHub-Glyphs";
                box-shadow:
                    inset 0 0 4px 0 rgba(0,0,0,0.4) ,
                    1px 1px 3px 0 rgba(119, 119, 119, 0.6);
            }
            
            .overlaySheet .slik-ui-list > li:first-child:before {
                content: "\f0de"
            }
            
            .overlaySheet .slik-ui-list > li:nth-child(2):before {
                content: "\f7e5"
            }
            
            .overlaySheet .slik-ui-list > li:nth-child(3):before {
                content: "\f47c"
            }
            
            .overlaySheet .slik-ui-list > li:nth-child(4):before {
                content: "\f0e0"
            }
        </style>

    </head>
    <body>
        
        <div class="overlayScroller">
            <div class="overlaySheet"><p>Content</p></div>
            <div class="overlayBottomSpacing"></div>
        </div>
        
         <!-- APP HEADER -->
        <div class="mainHead">
            <a href="#" class="icon-maximize ctl-preview basic-tt" title="Fullscreen Preview"></a>
            <a href="#" class="icon-html ctl-html basic-tt" title="Get HTML Code"></a>
        </div>
        
        <!-- TOOL SIDEBAR -->
        <div class="sideBar">
            <div class="sb-items">
                <a href="#" class="tool-item ti-l" data-tool="title"><span class="ico-ttl icon-fonttypewriter"></span> Title</a>
                <a href="#" class="tool-item ti-r" data-tool="text"><span class="ico-txt icon-align-justify"></span> Text</a>
                <a href="#" class="tool-item ti-l" data-tool="image"><span class="ico-image icon-picture"></span> Image</a>
                <a href="#" class="tool-item ti-r" data-tool="hrule"><span class="ico-hr">&mdash;</span> Divider</a>
                <a href="#" class="tool-item ti-l" data-tool="imagetext"><span class="ico-imagetext icon-insertpictureleft"></span> Image + Text</a>
                <a href="#" class="tool-item ti-r" data-tool="blockquote"><span class="fa fa-quote-left ico-blockquote"></span> Block Quote</a>
		<a href="#" class="tool-item ti-l" data-tool="twoCol"><span class="fa fa-columns ico-twocol"></span> 2-Column Layout</a>
            </div>
        </div>
            
        <!-- EDITOR AREA -->
        <div class="editorBox">
            <div class="scrollBox">
                <div class="canvasContainer">
                    <div class="pageCanvas toolSlot"></div>
                </div>
            </div>
        </div>
        
        <!--
        ==============================================
        HIDDEN ELEMENTS / TEMPLATES
        ==============================================
        -->
        
        <div class="modal-template welcomeTemplate">
            <h1 class="modal-header header-sysmsg">Hey!</h1>
            
            <ul class="slik-ui-list">
                <li>
                    <span>
                        Drag the tools from the left, onto the page.
                    </span>
                    <i class="slik-divider"></i>
                </li>
                <li>
                    <span>
                        You can re-arrange the order the tools appear on your page by simply dragging them around.
                    </span>
                    <i class="slik-divider"></i>
                </li>
                <li>
                    <span>
                        You can edit EVERYTHING! Just click on any part of your page to see customization options.
                    </span>
                    <i class="slik-divider"></i>
                </li>
                <li>
                    <span>
                        Actually, there's a lot that still needs to be done. ;)
                    </span>
                    <i class="slik-divider"></i>
                </li>
            </ul>
            
            <!---
            <p>
            	OHAI! Here you can create a website!
            	<ul>
            		<li>
            			Drag the tools from the left, onto the page.
            		</li>
            		<li>
            			You can re-arrange the order the tools appear on your page by simply dragging them around.
            		</li>
            		<li>
            			You can edit EVERYTHING! Just click on any part of your page to see customization options.
            		</li>
            	</ul>
            </p>
            --->
            <div class="footer">
            	<a href="#" class="modal-ok">OK</a>
            	<br class="clearfix">
            </div>
        </div>
        
        <div class="modal-template canvasHtmlModalTemplate">
            <h1 class="modal-header header-html">Your Page HTML</h1>
            <textarea class="htmlDisplay"></textarea>
            <div class="footer">
            	<a href="#" class="modal-ok">OK</a>
            	<br class="clearfix">
            </div>
        </div>

        <div class="icon-minimize ctl-hidepreview" title="Close Preview"></div>
        
        <div class="fa deleteElement">&#xf00d;</div>
        
        <div class="image-edit-tooltip">
            <div class="image-mod-content">
                <p>Edit Image</p>
            </div>
        </div>
        
        <div class="text-edit-tooltip">
            <div class="text-mod-content">
                <div class='btn-group'>
                    <a class='btn' data-role='undo' href='#'><i class='fa fa-undo'></i></a>
                    <a class='btn' data-role='redo' href='#'><i class='fa fa-repeat'></i></a>
                </div>
                <div class='btn-group'>
                    <a class='btn' data-role='bold' href='#'><b>Bold</b></a>
                    <a class='btn' data-role='italic' href='#'><em>Italic</em></a>
                    <a class='btn' data-role='underline' href='#'><u><b>U</b></u></a>
                    <a class='btn' data-role='strikeThrough' href='#'><strike>abc</strike></a>
                </div>
                <div class='btn-group'>
                    <a class='btn' data-role='justifyLeft' href='#'><i class='fa fa-align-left'></i></a>
                    <a class='btn' data-role='justifyCenter' href='#'><i class='fa fa-align-center'></i></a>
                    <a class='btn' data-role='justifyRight' href='#'><i class='fa fa-align-right'></i></a>
                    <a class='btn' data-role='justifyFull' href='#'><i class='fa fa-align-justify'></i></a>
                </div>
                <div class='btn-group'>
                    <a class='btn' data-role='indent' href='#'><i class='fa fa-indent'></i></a>
                    <a class='btn' data-role='outdent' href='#'><i class='fa fa-outdent'></i></a>
                </div>
                <div class='btn-group'>
                    <a class='btn' data-role='insertUnorderedList' href='#'><i class='fa fa-list-ul'></i></a>
                    <a class='btn' data-role='insertOrderedList' href='#'><i class='fa fa-list-ol'></i></a>
                </div>
                <div class='btn-group'>
                    <a class='btn' data-role='subscript' href='#'><i class='fa fa-subscript'></i></a>
                    <a class='btn' data-role='superscript' href='#'><i class='fa fa-superscript'></i></a>
                </div>
            </div>
        </div>
        
    </body>
</html>
