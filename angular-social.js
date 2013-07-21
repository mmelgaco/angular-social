"use strict";function makeUrl(a,b){return template(a,b,encodeURIComponent)}function template(a,b,c){return a.replace(/\{([^\}]+)\}/g,function(a,d){return d in b?c?c(b[d]):b[d]:a})}var services={facebook:{title:"Facebook",icon:"icon-facebook",counterUrl:"http://graph.facebook.com/fql?q=SELECT+total_count+FROM+link_stat+WHERE+url%3D%22{url}%22&callback=JSON_CALLBACK",convertNumber:function(a){return a.data[0].total_count},popupUrl:"http://www.facebook.com/sharer/sharer.php?u={url}",popupWidth:600,popupHeight:500},twitter:{title:"Twitter",counterUrl:"http://urls.api.twitter.com/1/urls/count.json?url={url}&callback=JSON_CALLBACK",convertNumber:function(a){return a.count},popupUrl:"http://twitter.com/intent/tweet?url={url}&text={title}",popupWidth:600,popupHeight:450,click:function(a){return/[\.:\-–—]\s*$/.test(a.pageTitle)||(a.pageTitle+=":"),!0}},mailru:{title:"Mail.ru",counterUrl:"http://connect.mail.ru/share_count?url_list={url}&callback=1&func=JSON_CALLBACK",convertNumber:function(a){for(var b in a)if(a.hasOwnProperty(b))return a[b].shares},popupUrl:"http://connect.mail.ru/share?share_url={url}&title={title}",popupWidth:550,popupHeight:360},vkontakte:{title:"Вконтакте",counterUrl:"http://vkontakte.ru/share.php?act=count&url={url}&index={index}&description={description}",counter:function(a,b,c){var d=services.vkontakte;d._||(d._=[],window.VK||(window.VK={}),window.VK.Share={count:function(a,b){d._[a].resolve(b)}});var e=d._.length;d._.push(b),c.jsonp(makeUrl(a,{index:e}))},popupUrl:"http://vk.com/share.php?url={url}&title={title}",popupWidth:550,popupHeight:330},odnoklassniki:{title:"Одноклассники",counterUrl:"http://www.odnoklassniki.ru/dk?st.cmd=shareData&ref={url}&cb=JSON_CALLBACK",convertNumber:function(a){return a.count},popupUrl:"http://www.odnoklassniki.ru/dk?st.cmd=addShare&st._surl={url}",popupWidth:550,popupHeight:360},googleplus:{title:"Google+",popupUrl:"https://plus.google.com/share?url={url}",popupWidth:700,popupHeight:500},livejournal:{title:"LiveJournal",click:function(){var a=this._livejournalForm;if(!a){var b=this.options.pageHtml.replace(/&/g,"&amp;").replace(/"/g,"&quot;");a=$(template('<form action="http://www.livejournal.com/update.bml" method="post" target="_blank" accept-charset="UTF-8"><input type="hidden" name="mode" value="full"><input type="hidden" name="subject" value="{title}"><input type="hidden" name="event" value="{html}"></form>',{title:this.options.pageTitle,html:b})),this.widget.append(a),this._livejournalForm=a}a.submit()}},pinterest:{title:"Pinterest",counterUrl:"http://api.pinterest.com/v1/urls/count.json?url={url}&callback=JSON_CALLBACK",convertNumber:function(a){return a.count},popupUrl:"http://pinterest.com/pin/create/button/?url={url}&description={title}",popupWidth:630,popupHeight:270}};angular.module("ngSocial",[]).directive("ngSocialButtons",["$compile","$q","$parse","$http",function(){return{restrict:"A",scope:{url:"=",title:"=",description:"="},replace:!0,templateUrl:"/src/views/buttons.html",controller:["$scope","$q","$http",function(a,b,c){a.getCount=function(d){if(!d.counterUrl)return null;var e=b.defer(),f=makeUrl(d.counterUrl,{url:a.url,title:a.title});return d.counter?d.counter(f,e,c):c.jsonp(f).success(function(a){d.convertNumber?e.resolve(d.convertNumber(a)):e.resolve(a)}),e.promise},a.openPopup=function(a,b){var c=Math.round(screen.width/2-b.width/2),d=0;screen.height>b.height&&(d=Math.round(screen.height/3-b.height/2));var e=window.open(a,"sl_"+this.service,"left="+c+",top="+d+","+"width="+b.width+",height="+b.height+",personalbar=0,toolbar=0,scrollbars=1,resizable=1");e?e.focus():location.href=a},a.clickShare=function(b,c,d){if(!b.shiftKey&&!b.ctrlKey){b.preventDefault();var e=!0;if(angular.isFunction(d.click)&&(e=d.click.call(this,d)),e){var f=makeUrl(d.popupUrl,{url:a.url,title:a.title,description:a.description});a.openPopup(f,{width:d.popupWidth,height:d.popupHeight})}}},a.link=function(b,c){return makeUrl(c.popupUrl,{url:a.url,title:a.title})}}],link:function(a,b,c){var d={};angular.forEach((c.ngSocialButtons||"").split(","),function(b){services[b]&&(d[b]=services[b],d[b].count=a.getCount(d[b]))}),a.buttons=d}}}]),angular.module("ngSocial").run(["$templateCache",function(a){a.put("/views/buttons.html",'<ul class="ng-social ng-cloak"> <li ng-repeat="(button, options) in buttons" ng-class="\'ng-social-button_\' + button"> <a ng-href="{{link(button, options)}}" target="_blank" ng-click="clickShare($event, button, options)" class="ng-social-button"> <span class="ng-social-icon" ng-class="options.icon"></span> <span class="ng-social-text">{{options.title}}</span> </a> <span ng-show="options.count" class="ng-social-counter">{{ options.count }}</span> </li> </ul>')}]);
/*
//@ sourceMappingURL=angular-social.map
*/