!function(t){"use strict";Foundation.libs.alert={name:"alert",version:"5.4.5",settings:{callback:function(){}},init:function(t,n,i){this.bindings(n,i)},events:function(){var n=this,i=this.S;t(this.scope).off(".alert").on("click.fndtn.alert","["+this.attr_name()+"] .close",function(t){var e=i(this).closest("["+n.attr_name()+"]"),s=e.data(n.attr_name(!0)+"-init")||n.settings;t.preventDefault(),Modernizr.csstransitions?(e.addClass("alert-close"),e.on("transitionend webkitTransitionEnd oTransitionEnd",function(){i(this).trigger("close").trigger("close.fndtn.alert").remove(),s.callback()})):e.fadeOut(300,function(){i(this).trigger("close").trigger("close.fndtn.alert").remove(),s.callback()})})},reflow:function(){}}}(jQuery,window,window.document);