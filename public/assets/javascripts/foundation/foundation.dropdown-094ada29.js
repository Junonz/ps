!function(t,e){"use strict";Foundation.libs.dropdown={name:"dropdown",version:"5.4.5",settings:{active_class:"open",mega_class:"mega",align:"bottom",is_hover:!1,opened:function(){},closed:function(){}},init:function(t,e,i){Foundation.inherit(this,"throttle"),this.bindings(e,i)},events:function(){var i=this,a=i.S;a(this.scope).off(".dropdown").on("click.fndtn.dropdown","["+this.attr_name()+"]",function(e){var n=a(this).data(i.attr_name(!0)+"-init")||i.settings;n.is_hover&&!Modernizr.touch||(e.preventDefault(),i.toggle(t(this)))}).on("mouseenter.fndtn.dropdown","["+this.attr_name()+"], ["+this.attr_name()+"-content]",function(t){var e,n,s=a(this);clearTimeout(i.timeout),s.data(i.data_attr())?(e=a("#"+s.data(i.data_attr())),n=s):(e=s,n=a("["+i.attr_name()+"='"+e.attr("id")+"']"));var o=n.data(i.attr_name(!0)+"-init")||i.settings;a(t.target).data(i.data_attr())&&o.is_hover&&i.closeall.call(i),o.is_hover&&i.open.apply(i,[e,n])}).on("mouseleave.fndtn.dropdown","["+this.attr_name()+"], ["+this.attr_name()+"-content]",function(){var t=a(this);i.timeout=setTimeout(function(){if(t.data(i.data_attr())){var e=t.data(i.data_attr(!0)+"-init")||i.settings;e.is_hover&&i.close.call(i,a("#"+t.data(i.data_attr())))}else{var n=a("["+i.attr_name()+'="'+a(this).attr("id")+'"]'),e=n.data(i.attr_name(!0)+"-init")||i.settings;e.is_hover&&i.close.call(i,t)}}.bind(this),150)}).on("click.fndtn.dropdown",function(e){var n=a(e.target).closest("["+i.attr_name()+"-content]");if(!(a(e.target).closest("["+i.attr_name()+"]").length>0))return!a(e.target).data("revealId")&&n.length>0&&(a(e.target).is("["+i.attr_name()+"-content]")||t.contains(n.first()[0],e.target))?void e.stopPropagation():void i.close.call(i,a("["+i.attr_name()+"-content]"))}).on("opened.fndtn.dropdown","["+i.attr_name()+"-content]",function(){i.settings.opened.call(this)}).on("closed.fndtn.dropdown","["+i.attr_name()+"-content]",function(){i.settings.closed.call(this)}),a(e).off(".dropdown").on("resize.fndtn.dropdown",i.throttle(function(){i.resize.call(i)},50)),this.resize()},close:function(e){var i=this;e.each(function(){var a=t("["+i.attr_name()+"="+e[0].id+"]")||t("aria-controls="+e[0].id+"]");a.attr("aria-expanded","false"),i.S(this).hasClass(i.settings.active_class)&&(i.S(this).css(Foundation.rtl?"right":"left","-99999px").attr("aria-hidden","true").removeClass(i.settings.active_class).prev("["+i.attr_name()+"]").removeClass(i.settings.active_class).removeData("target"),i.S(this).trigger("closed").trigger("closed.fndtn.dropdown",[e]))})},closeall:function(){var e=this;t.each(e.S("["+this.attr_name()+"-content]"),function(){e.close.call(e,e.S(this))})},open:function(t,e){this.css(t.addClass(this.settings.active_class),e),t.prev("["+this.attr_name()+"]").addClass(this.settings.active_class),t.data("target",e.get(0)).trigger("opened").trigger("opened.fndtn.dropdown",[t,e]),t.attr("aria-hidden","false"),e.attr("aria-expanded","true"),t.focus()},data_attr:function(){return this.namespace.length>0?this.namespace+"-"+this.name:this.name},toggle:function(t){var e=this.S("#"+t.data(this.data_attr()));0!==e.length&&(this.close.call(this,this.S("["+this.attr_name()+"-content]").not(e)),e.hasClass(this.settings.active_class)?(this.close.call(this,e),e.data("target")!==t.get(0)&&this.open.call(this,e,t)):this.open.call(this,e,t))},resize:function(){var t=this.S("["+this.attr_name()+"-content].open"),e=this.S("["+this.attr_name()+"='"+t.attr("id")+"']");t.length&&e.length&&this.css(t,e)},css:function(t,e){var i=Math.max((e.width()-t.width())/2,8),a=e.data(this.attr_name(!0)+"-init")||this.settings;if(this.clear_idx(),this.small()){var n=this.dirs.bottom.call(t,e,a);t.attr("style","").removeClass("drop-left drop-right drop-top").css({position:"absolute",width:"95%","max-width":"none",top:n.top}),t.css(Foundation.rtl?"right":"left",i)}else this.style(t,e,a);return t},style:function(e,i,a){var n=t.extend({position:"absolute"},this.dirs[a.align].call(e,i,a));e.attr("style","").css(n)},dirs:{_base:function(t){var e=this.offsetParent(),i=e.offset(),a=t.offset();return a.top-=i.top,a.left-=i.left,a},top:function(t,e){var i=Foundation.libs.dropdown,a=i.dirs._base.call(this,t);return this.addClass("drop-top"),(t.outerWidth()<this.outerWidth()||i.small()||this.hasClass(e.mega_menu))&&i.adjust_pip(this,t,e,a),Foundation.rtl?{left:a.left-this.outerWidth()+t.outerWidth(),top:a.top-this.outerHeight()}:{left:a.left,top:a.top-this.outerHeight()}},bottom:function(t,e){var i=Foundation.libs.dropdown,a=i.dirs._base.call(this,t);return(t.outerWidth()<this.outerWidth()||i.small()||this.hasClass(e.mega_menu))&&i.adjust_pip(this,t,e,a),i.rtl?{left:a.left-this.outerWidth()+t.outerWidth(),top:a.top+t.outerHeight()}:{left:a.left,top:a.top+t.outerHeight()}},left:function(t){var e=Foundation.libs.dropdown.dirs._base.call(this,t);return this.addClass("drop-left"),{left:e.left-this.outerWidth(),top:e.top}},right:function(t){var e=Foundation.libs.dropdown.dirs._base.call(this,t);return this.addClass("drop-right"),{left:e.left+t.outerWidth(),top:e.top}}},adjust_pip:function(t,e,i,a){var n=Foundation.stylesheet,s=8;t.hasClass(i.mega_class)?s=a.left+e.outerWidth()/2-8:this.small()&&(s+=a.left-8),this.rule_idx=n.cssRules.length;var o=".f-dropdown.open:before",r=".f-dropdown.open:after",d="left: "+s+"px;",l="left: "+(s-1)+"px;";n.insertRule?(n.insertRule([o,"{",d,"}"].join(" "),this.rule_idx),n.insertRule([r,"{",l,"}"].join(" "),this.rule_idx+1)):(n.addRule(o,d,this.rule_idx),n.addRule(r,l,this.rule_idx+1))},clear_idx:function(){var t=Foundation.stylesheet;this.rule_idx&&(t.deleteRule(this.rule_idx),t.deleteRule(this.rule_idx),delete this.rule_idx)},small:function(){return matchMedia(Foundation.media_queries.small).matches&&!matchMedia(Foundation.media_queries.medium).matches},off:function(){this.S(this.scope).off(".fndtn.dropdown"),this.S("html, body").off(".fndtn.dropdown"),this.S(e).off(".fndtn.dropdown"),this.S("[data-dropdown-content]").off(".fndtn.dropdown")},reflow:function(){}}}(jQuery,window,window.document);