import{C as K,E as Q,G as ee,H as te,I as ne,d as j,e as H,g as V,i as G,j as $,k as U,l as Z,m as q,o as Y,p as W,q as X,t as J}from"./chunk-YFXKKJ25.js";import{Bb as L,Db as d,Ia as B,Ma as R,N as y,Pa as k,Q as x,Qa as I,R as C,Sa as P,Sb as T,T as E,V as o,W as D,Xa as c,Ya as O,Yb as h,Za as N,aa as M,ba as g,fa as p,ia as z,ka as A,kb as F,lb as r,mb as s,nb as u,pa as w,ua as S}from"./chunk-F6SRNFFX.js";var me="@",ce=(()=>{class i{doc;delegate;zone;animationType;moduleImpl;_rendererFactoryPromise=null;scheduler=null;injector=o(M);loadingSchedulerFn=o(ge,{optional:!0});_engine;constructor(e,t,a,l,m){this.doc=e,this.delegate=t,this.zone=a,this.animationType=l,this.moduleImpl=m}ngOnDestroy(){this._engine?.flush()}loadImpl(){let e=()=>this.moduleImpl??import("./chunk-ILJN36CM.js").then(a=>a),t;return this.loadingSchedulerFn?t=this.loadingSchedulerFn(e):t=e(),t.catch(a=>{throw new y(5300,!1)}).then(({\u0275createEngine:a,\u0275AnimationRendererFactory:l})=>{this._engine=a(this.animationType,this.doc);let m=new l(this.delegate,this._engine,this.zone);return this.delegate=m,m})}createRenderer(e,t){let a=this.delegate.createRenderer(e,t);if(a.\u0275type===0)return a;typeof a.throwOnSyntheticProps=="boolean"&&(a.throwOnSyntheticProps=!1);let l=new v(a);return t?.data?.animation&&!this._rendererFactoryPromise&&(this._rendererFactoryPromise=this.loadImpl()),this._rendererFactoryPromise?.then(m=>{let le=m.createRenderer(e,t);l.use(le),this.scheduler??=this.injector.get(A,null,{optional:!0}),this.scheduler?.notify(10)}).catch(m=>{l.use(a)}),l}begin(){this.delegate.begin?.()}end(){this.delegate.end?.()}whenRenderingDone(){return this.delegate.whenRenderingDone?.()??Promise.resolve()}componentReplaced(e){this._engine?.flush(),this.delegate.componentReplaced?.(e)}static \u0275fac=function(t){P()};static \u0275prov=x({token:i,factory:i.\u0275fac})}return i})(),v=class{delegate;replay=[];\u0275type=1;constructor(n){this.delegate=n}use(n){if(this.delegate=n,this.replay!==null){for(let e of this.replay)e(n);this.replay=null}}get data(){return this.delegate.data}destroy(){this.replay=null,this.delegate.destroy()}createElement(n,e){return this.delegate.createElement(n,e)}createComment(n){return this.delegate.createComment(n)}createText(n){return this.delegate.createText(n)}get destroyNode(){return this.delegate.destroyNode}appendChild(n,e){this.delegate.appendChild(n,e)}insertBefore(n,e,t,a){this.delegate.insertBefore(n,e,t,a)}removeChild(n,e,t,a){this.delegate.removeChild(n,e,t,a)}selectRootElement(n,e){return this.delegate.selectRootElement(n,e)}parentNode(n){return this.delegate.parentNode(n)}nextSibling(n){return this.delegate.nextSibling(n)}setAttribute(n,e,t,a){this.delegate.setAttribute(n,e,t,a)}removeAttribute(n,e,t){this.delegate.removeAttribute(n,e,t)}addClass(n,e){this.delegate.addClass(n,e)}removeClass(n,e){this.delegate.removeClass(n,e)}setStyle(n,e,t,a){this.delegate.setStyle(n,e,t,a)}removeStyle(n,e,t){this.delegate.removeStyle(n,e,t)}setProperty(n,e,t){this.shouldReplay(e)&&this.replay.push(a=>a.setProperty(n,e,t)),this.delegate.setProperty(n,e,t)}setValue(n,e){this.delegate.setValue(n,e)}listen(n,e,t,a){return this.shouldReplay(e)&&this.replay.push(l=>l.listen(n,e,t,a)),this.delegate.listen(n,e,t,a)}shouldReplay(n){return this.replay!==null&&n.startsWith(me)}},ge=new E("");function ie(i="animations"){return R("NgAsyncAnimations"),D([{provide:k,useFactory:()=>new ce(o(g),o(j),o(p),i)},{provide:S,useValue:i==="noop"?"NoopAnimations":"BrowserAnimations"}])}var ae=[{path:"",redirectTo:"dashboard",pathMatch:"full"},{path:"dashboard",loadComponent:()=>import("./chunk-E2SNVNIL.js").then(i=>i.DashboardComponent)},{path:"tickets",loadComponent:()=>import("./chunk-A6IQA427.js").then(i=>i.TicketListComponent)},{path:"tickets/:id",loadComponent:()=>import("./chunk-X23RAHOW.js").then(i=>i.TicketDetailComponent)},{path:"new-ticket",loadComponent:()=>import("./chunk-7HBOURAA.js").then(i=>i.NewTicketComponent)}];var oe={providers:[z(),U(ae),ie()]};var re="mat-badge-content",pe=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275cmp=c({type:i,selectors:[["ng-component"]],decls:0,vars:0,template:function(t,a){},styles:[`.mat-badge {
  position: relative;
}
.mat-badge.mat-badge {
  overflow: visible;
}

.mat-badge-content {
  position: absolute;
  text-align: center;
  display: inline-block;
  transition: transform 200ms ease-in-out;
  transform: scale(0.6);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  box-sizing: border-box;
  pointer-events: none;
  background-color: var(--mat-badge-background-color, var(--mat-sys-error));
  color: var(--mat-badge-text-color, var(--mat-sys-on-error));
  font-family: var(--mat-badge-text-font, var(--mat-sys-label-small-font));
  font-weight: var(--mat-badge-text-weight, var(--mat-sys-label-small-weight));
  border-radius: var(--mat-badge-container-shape, var(--mat-sys-corner-full));
}
.mat-badge-above .mat-badge-content {
  bottom: 100%;
}
.mat-badge-below .mat-badge-content {
  top: 100%;
}
.mat-badge-before .mat-badge-content {
  right: 100%;
}
[dir=rtl] .mat-badge-before .mat-badge-content {
  right: auto;
  left: 100%;
}
.mat-badge-after .mat-badge-content {
  left: 100%;
}
[dir=rtl] .mat-badge-after .mat-badge-content {
  left: auto;
  right: 100%;
}
@media (forced-colors: active) {
  .mat-badge-content {
    outline: solid 1px;
    border-radius: 0;
  }
}

.mat-badge-disabled .mat-badge-content {
  background-color: var(--mat-badge-disabled-state-background-color, color-mix(in srgb, var(--mat-sys-error) 38%, transparent));
  color: var(--mat-badge-disabled-state-text-color, var(--mat-sys-on-error));
}

.mat-badge-hidden .mat-badge-content {
  display: none;
}

.ng-animate-disabled .mat-badge-content,
.mat-badge-content._mat-animation-noopable {
  transition: none;
}

.mat-badge-content.mat-badge-active {
  transform: none;
}

.mat-badge-small .mat-badge-content {
  width: var(--mat-badge-legacy-small-size-container-size, unset);
  height: var(--mat-badge-legacy-small-size-container-size, unset);
  min-width: var(--mat-badge-small-size-container-size, 6px);
  min-height: var(--mat-badge-small-size-container-size, 6px);
  line-height: var(--mat-badge-small-size-line-height, 6px);
  padding: var(--mat-badge-small-size-container-padding, 0);
  font-size: var(--mat-badge-small-size-text-size, 0);
  margin: var(--mat-badge-small-size-container-offset, -6px 0);
}
.mat-badge-small.mat-badge-overlap .mat-badge-content {
  margin: var(--mat-badge-small-size-container-overlap-offset, -6px);
}

.mat-badge-medium .mat-badge-content {
  width: var(--mat-badge-legacy-container-size, unset);
  height: var(--mat-badge-legacy-container-size, unset);
  min-width: var(--mat-badge-container-size, 16px);
  min-height: var(--mat-badge-container-size, 16px);
  line-height: var(--mat-badge-line-height, 16px);
  padding: var(--mat-badge-container-padding, 0 4px);
  font-size: var(--mat-badge-text-size, var(--mat-sys-label-small-size));
  margin: var(--mat-badge-container-offset, -12px 0);
}
.mat-badge-medium.mat-badge-overlap .mat-badge-content {
  margin: var(--mat-badge-container-overlap-offset, -12px);
}

.mat-badge-large .mat-badge-content {
  width: var(--mat-badge-legacy-large-size-container-size, unset);
  height: var(--mat-badge-legacy-large-size-container-size, unset);
  min-width: var(--mat-badge-large-size-container-size, 16px);
  min-height: var(--mat-badge-large-size-container-size, 16px);
  line-height: var(--mat-badge-large-size-line-height, 16px);
  padding: var(--mat-badge-large-size-container-padding, 0 4px);
  font-size: var(--mat-badge-large-size-text-size, var(--mat-sys-label-small-size));
  margin: var(--mat-badge-large-size-container-offset, -12px 0);
}
.mat-badge-large.mat-badge-overlap .mat-badge-content {
  margin: var(--mat-badge-large-size-container-overlap-offset, -12px);
}
`],encapsulation:2,changeDetection:0})}return i})(),se=(()=>{class i{_ngZone=o(p);_elementRef=o(w);_ariaDescriber=o(te);_renderer=o(I);_animationsDisabled=J();_idGenerator=o(ee);get color(){return this._color}set color(e){this._setColor(e),this._color=e}_color="primary";overlap=!0;disabled=!1;position="above after";get content(){return this._content}set content(e){this._updateRenderedContent(e)}_content;get description(){return this._description}set description(e){this._updateDescription(e)}_description;size="medium";hidden=!1;_badgeElement;_inlineBadgeDescription;_isInitialized=!1;_interactivityChecker=o(K);_document=o(g);constructor(){let e=o(Z);e.load(pe),e.load(q)}isAbove(){return this.position.indexOf("below")===-1}isAfter(){return this.position.indexOf("before")===-1}getBadgeElement(){return this._badgeElement}ngOnInit(){this._clearExistingBadges(),this.content&&!this._badgeElement&&(this._badgeElement=this._createBadgeElement(),this._updateRenderedContent(this.content)),this._isInitialized=!0}ngAfterViewInit(){}ngOnDestroy(){this._renderer.destroyNode&&(this._renderer.destroyNode(this._badgeElement),this._inlineBadgeDescription?.remove()),this._ariaDescriber.removeDescription(this._elementRef.nativeElement,this.description)}_isHostInteractive(){return this._interactivityChecker.isFocusable(this._elementRef.nativeElement,{ignoreVisibility:!0})}_createBadgeElement(){let e=this._renderer.createElement("span"),t="mat-badge-active";return e.setAttribute("id",this._idGenerator.getId("mat-badge-content-")),e.setAttribute("aria-hidden","true"),e.classList.add(re),this._animationsDisabled&&e.classList.add("_mat-animation-noopable"),this._elementRef.nativeElement.appendChild(e),typeof requestAnimationFrame=="function"&&!this._animationsDisabled?this._ngZone.runOutsideAngular(()=>{requestAnimationFrame(()=>{e.classList.add(t)})}):e.classList.add(t),e}_updateRenderedContent(e){let t=`${e??""}`.trim();this._isInitialized&&t&&!this._badgeElement&&(this._badgeElement=this._createBadgeElement()),this._badgeElement&&(this._badgeElement.textContent=t),this._content=t}_updateDescription(e){this._ariaDescriber.removeDescription(this._elementRef.nativeElement,this.description),(!e||this._isHostInteractive())&&this._removeInlineDescription(),this._description=e,this._isHostInteractive()?this._ariaDescriber.describe(this._elementRef.nativeElement,e):this._updateInlineDescription()}_updateInlineDescription(){this._inlineBadgeDescription||(this._inlineBadgeDescription=this._document.createElement("span"),this._inlineBadgeDescription.classList.add("cdk-visually-hidden")),this._inlineBadgeDescription.textContent=this.description,this._badgeElement?.appendChild(this._inlineBadgeDescription)}_removeInlineDescription(){this._inlineBadgeDescription?.remove(),this._inlineBadgeDescription=void 0}_setColor(e){let t=this._elementRef.nativeElement.classList;t.remove(`mat-badge-${this._color}`),e&&t.add(`mat-badge-${e}`)}_clearExistingBadges(){let e=this._elementRef.nativeElement.querySelectorAll(`:scope > .${re}`);for(let t of Array.from(e))t!==this._badgeElement&&t.remove()}static \u0275fac=function(t){return new(t||i)};static \u0275dir=N({type:i,selectors:[["","matBadge",""]],hostAttrs:[1,"mat-badge"],hostVars:20,hostBindings:function(t,a){t&2&&L("mat-badge-overlap",a.overlap)("mat-badge-above",a.isAbove())("mat-badge-below",!a.isAbove())("mat-badge-before",!a.isAfter())("mat-badge-after",a.isAfter())("mat-badge-small",a.size==="small")("mat-badge-medium",a.size==="medium")("mat-badge-large",a.size==="large")("mat-badge-hidden",a.hidden||!a.content)("mat-badge-disabled",a.disabled)},inputs:{color:[0,"matBadgeColor","color"],overlap:[2,"matBadgeOverlap","overlap",h],disabled:[2,"matBadgeDisabled","disabled",h],position:[0,"matBadgePosition","position"],content:[0,"matBadge","content"],description:[0,"matBadgeDescription","description"],size:[0,"matBadgeSize","size"],hidden:[2,"matBadgeHidden","hidden",h]}})}return i})(),de=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=O({type:i});static \u0275inj=C({imports:[Q,Y]})}return i})();var f=class i{svc=o(ne);openCount=T(()=>this.svc.stats().open);static \u0275fac=function(e){return new(e||i)};static \u0275cmp=c({type:i,selectors:[["app-sidebar"]],decls:34,vars:1,consts:[[1,"sidebar"],[1,"sidebar-logo"],[1,"logo-icon"],[1,"logo-text"],[1,"logo-title"],[1,"logo-sub"],[1,"sidebar-nav"],["routerLink","/dashboard","routerLinkActive","active",1,"nav-item"],["routerLink","/tickets","routerLinkActive","active",1,"nav-item"],["matBadgeColor","warn","matBadgeSize","small",3,"matBadge"],["routerLink","/new-ticket","routerLinkActive","active",1,"nav-item"],[1,"sidebar-footer"],[1,"user-info"],[1,"avatar"],[1,"user-details"],[1,"user-name"],[1,"user-role"]],template:function(e,t){e&1&&(r(0,"aside",0)(1,"div",1)(2,"mat-icon",2),d(3,"support_agent"),s(),r(4,"div",3)(5,"span",4),d(6,"HelpDesk"),s(),r(7,"span",5),d(8,"EA Solutions"),s()()(),r(9,"nav",6)(10,"a",7)(11,"mat-icon"),d(12,"dashboard"),s(),r(13,"span"),d(14,"Dashboard"),s()(),r(15,"a",8)(16,"mat-icon",9),d(17," confirmation_number "),s(),r(18,"span"),d(19,"Chamados"),s()(),r(20,"a",10)(21,"mat-icon"),d(22,"add_circle"),s(),r(23,"span"),d(24,"Novo Chamado"),s()()(),r(25,"div",11)(26,"div",12)(27,"div",13),d(28,"PT"),s(),r(29,"div",14)(30,"span",15),d(31,"Pedro T\xE9cnico"),s(),r(32,"span",16),d(33,"Suporte T.I"),s()()()()()),e&2&&(B(16),F("matBadge",t.openCount()||null))},dependencies:[G,$,X,W,de,se],styles:[".sidebar[_ngcontent-%COMP%]{width:240px;height:100vh;background:linear-gradient(180deg,#0f172a,#1e293b);display:flex;flex-direction:column;position:fixed;left:0;top:0;border-right:1px solid rgba(255,255,255,.06);z-index:100}.sidebar-logo[_ngcontent-%COMP%]{display:flex;align-items:center;gap:12px;padding:24px 20px;border-bottom:1px solid rgba(255,255,255,.06)}.logo-icon[_ngcontent-%COMP%]{font-size:32px;width:32px;height:32px;color:#6366f1}.logo-text[_ngcontent-%COMP%]{display:flex;flex-direction:column}.logo-title[_ngcontent-%COMP%]{font-size:18px;font-weight:700;color:#f1f5f9;line-height:1}.logo-sub[_ngcontent-%COMP%]{font-size:11px;color:#64748b;margin-top:2px}.sidebar-nav[_ngcontent-%COMP%]{flex:1;padding:16px 12px;display:flex;flex-direction:column;gap:4px}.nav-item[_ngcontent-%COMP%]{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:10px;color:#94a3b8;text-decoration:none;font-size:14px;font-weight:500;transition:all .2s ease}.nav-item[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:20px;width:20px;height:20px}.nav-item[_ngcontent-%COMP%]:hover{background:#6366f11f;color:#c7d2fe}.nav-item.active[_ngcontent-%COMP%]{background:#6366f133;color:#818cf8;box-shadow:inset 3px 0 #6366f1}.sidebar-footer[_ngcontent-%COMP%]{padding:16px;border-top:1px solid rgba(255,255,255,.06)}.user-info[_ngcontent-%COMP%]{display:flex;align-items:center;gap:10px}.avatar[_ngcontent-%COMP%]{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0}.user-details[_ngcontent-%COMP%]{display:flex;flex-direction:column}.user-name[_ngcontent-%COMP%]{font-size:13px;font-weight:600;color:#e2e8f0}.user-role[_ngcontent-%COMP%]{font-size:11px;color:#64748b}"]})};var b=class i{static \u0275fac=function(e){return new(e||i)};static \u0275cmp=c({type:i,selectors:[["app-root"]],decls:4,vars:0,consts:[[1,"app-shell"],[1,"main-content"]],template:function(e,t){e&1&&(r(0,"div",0),u(1,"app-sidebar"),r(2,"main",1),u(3,"router-outlet"),s()())},dependencies:[V,f],styles:[".app-shell[_ngcontent-%COMP%]{display:flex;min-height:100vh;background:#0f172a}.main-content[_ngcontent-%COMP%]{margin-left:240px;flex:1;min-height:100vh;overflow-y:auto}"]})};H(b,oe).catch(i=>console.error(i));
