import{B as d,C as y,D as C,Fa as N,Ga as T,Ha as F,Ia as H,Ja as j,M as E,N as i,O as a,P as p,U as z,W as o,ha as D,i as b,ja as l,k as s,ma as M,o as f,oa as B,qa as w,r as h,ra as k,s as v,sa as A,ta as O,ua as S,va as L,w as u,wa as P,x as _,xa as I,z as x,za as R}from"./chunk-NYPGZHL3.js";var G=[{path:"",redirectTo:"dashboard",pathMatch:"full"},{path:"dashboard",loadComponent:()=>import("./chunk-7ORB3GIS.js").then(t=>t.DashboardComponent)},{path:"tickets",loadComponent:()=>import("./chunk-TDNQCNPA.js").then(t=>t.TicketListComponent)},{path:"tickets/:id",loadComponent:()=>import("./chunk-NNI3VD56.js").then(t=>t.TicketDetailComponent)},{path:"new-ticket",loadComponent:()=>import("./chunk-YY45V7O5.js").then(t=>t.NewTicketComponent)}];var V={providers:[v(),A(G)]};var $="mat-badge-content",J=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275cmp=d({type:t,selectors:[["ng-component"]],decls:0,vars:0,template:function(n,r){},styles:[`.mat-badge {
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
`],encapsulation:2,changeDetection:0})}return t})(),Z=(()=>{class t{_ngZone=s(h);_elementRef=s(u);_ariaDescriber=s(H);_renderer=s(x);_animationsDisabled=R();_idGenerator=s(F);get color(){return this._color}set color(e){this._setColor(e),this._color=e}_color="primary";overlap=!0;disabled=!1;position="above after";get content(){return this._content}set content(e){this._updateRenderedContent(e)}_content;get description(){return this._description}set description(e){this._updateDescription(e)}_description;size="medium";hidden=!1;_badgeElement;_inlineBadgeDescription;_isInitialized=!1;_interactivityChecker=s(N);_document=s(f);constructor(){let e=s(O);e.load(J),e.load(S)}isAbove(){return this.position.indexOf("below")===-1}isAfter(){return this.position.indexOf("before")===-1}getBadgeElement(){return this._badgeElement}ngOnInit(){this._clearExistingBadges(),this.content&&!this._badgeElement&&(this._badgeElement=this._createBadgeElement(),this._updateRenderedContent(this.content)),this._isInitialized=!0}ngAfterViewInit(){}ngOnDestroy(){this._renderer.destroyNode&&(this._renderer.destroyNode(this._badgeElement),this._inlineBadgeDescription?.remove()),this._ariaDescriber.removeDescription(this._elementRef.nativeElement,this.description)}_isHostInteractive(){return this._interactivityChecker.isFocusable(this._elementRef.nativeElement,{ignoreVisibility:!0})}_createBadgeElement(){let e=this._renderer.createElement("span"),n="mat-badge-active";return e.setAttribute("id",this._idGenerator.getId("mat-badge-content-")),e.setAttribute("aria-hidden","true"),e.classList.add($),this._animationsDisabled&&e.classList.add("_mat-animation-noopable"),this._elementRef.nativeElement.appendChild(e),typeof requestAnimationFrame=="function"&&!this._animationsDisabled?this._ngZone.runOutsideAngular(()=>{requestAnimationFrame(()=>{e.classList.add(n)})}):e.classList.add(n),e}_updateRenderedContent(e){let n=`${e??""}`.trim();this._isInitialized&&n&&!this._badgeElement&&(this._badgeElement=this._createBadgeElement()),this._badgeElement&&(this._badgeElement.textContent=n),this._content=n}_updateDescription(e){this._ariaDescriber.removeDescription(this._elementRef.nativeElement,this.description),(!e||this._isHostInteractive())&&this._removeInlineDescription(),this._description=e,this._isHostInteractive()?this._ariaDescriber.describe(this._elementRef.nativeElement,e):this._updateInlineDescription()}_updateInlineDescription(){this._inlineBadgeDescription||(this._inlineBadgeDescription=this._document.createElement("span"),this._inlineBadgeDescription.classList.add("cdk-visually-hidden")),this._inlineBadgeDescription.textContent=this.description,this._badgeElement?.appendChild(this._inlineBadgeDescription)}_removeInlineDescription(){this._inlineBadgeDescription?.remove(),this._inlineBadgeDescription=void 0}_setColor(e){let n=this._elementRef.nativeElement.classList;n.remove(`mat-badge-${this._color}`),e&&n.add(`mat-badge-${e}`)}_clearExistingBadges(){let e=this._elementRef.nativeElement.querySelectorAll(`:scope > .${$}`);for(let n of Array.from(e))n!==this._badgeElement&&n.remove()}static \u0275fac=function(n){return new(n||t)};static \u0275dir=C({type:t,selectors:[["","matBadge",""]],hostAttrs:[1,"mat-badge"],hostVars:20,hostBindings:function(n,r){n&2&&z("mat-badge-overlap",r.overlap)("mat-badge-above",r.isAbove())("mat-badge-below",!r.isAbove())("mat-badge-before",!r.isAfter())("mat-badge-after",r.isAfter())("mat-badge-small",r.size==="small")("mat-badge-medium",r.size==="medium")("mat-badge-large",r.size==="large")("mat-badge-hidden",r.hidden||!r.content)("mat-badge-disabled",r.disabled)},inputs:{color:[0,"matBadgeColor","color"],overlap:[2,"matBadgeOverlap","overlap",l],disabled:[2,"matBadgeDisabled","disabled",l],position:[0,"matBadgePosition","position"],content:[0,"matBadge","content"],description:[0,"matBadgeDescription","description"],size:[0,"matBadgeSize","size"],hidden:[2,"matBadgeHidden","hidden",l]}})}return t})(),U=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=y({type:t});static \u0275inj=b({imports:[T,L]})}return t})();var m=class t{svc=s(j);openCount=D(()=>this.svc.stats().open);static \u0275fac=function(e){return new(e||t)};static \u0275cmp=d({type:t,selectors:[["app-sidebar"]],decls:34,vars:1,consts:[[1,"sidebar"],[1,"sidebar-logo"],[1,"logo-icon"],[1,"logo-text"],[1,"logo-title"],[1,"logo-sub"],[1,"sidebar-nav"],["routerLink","/dashboard","routerLinkActive","active",1,"nav-item"],["routerLink","/tickets","routerLinkActive","active",1,"nav-item"],["matBadgeColor","warn","matBadgeSize","small",3,"matBadge"],["routerLink","/new-ticket","routerLinkActive","active",1,"nav-item"],[1,"sidebar-footer"],[1,"user-info"],[1,"avatar"],[1,"user-details"],[1,"user-name"],[1,"user-role"]],template:function(e,n){e&1&&(i(0,"aside",0)(1,"div",1)(2,"mat-icon",2),o(3,"support_agent"),a(),i(4,"div",3)(5,"span",4),o(6,"HelpDesk"),a(),i(7,"span",5),o(8,"EA Solutions"),a()()(),i(9,"nav",6)(10,"a",7)(11,"mat-icon"),o(12,"dashboard"),a(),i(13,"span"),o(14,"Dashboard"),a()(),i(15,"a",8)(16,"mat-icon",9),o(17," confirmation_number "),a(),i(18,"span"),o(19,"Chamados"),a()(),i(20,"a",10)(21,"mat-icon"),o(22,"add_circle"),a(),i(23,"span"),o(24,"Novo Chamado"),a()()(),i(25,"div",11)(26,"div",12)(27,"div",13),o(28,"PT"),a(),i(29,"div",14)(30,"span",15),o(31,"Pedro T\xE9cnico"),a(),i(32,"span",16),o(33,"Suporte T.I"),a()()()()()),e&2&&(_(16),E("matBadge",n.openCount()||null))},dependencies:[w,k,I,P,U,Z],styles:[".sidebar[_ngcontent-%COMP%]{width:240px;height:100vh;background:linear-gradient(180deg,#0f172a,#1e293b);display:flex;flex-direction:column;position:fixed;left:0;top:0;border-right:1px solid rgba(255,255,255,.06);z-index:100}.sidebar-logo[_ngcontent-%COMP%]{display:flex;align-items:center;gap:12px;padding:24px 20px;border-bottom:1px solid rgba(255,255,255,.06)}.logo-icon[_ngcontent-%COMP%]{font-size:32px;width:32px;height:32px;color:#6366f1}.logo-text[_ngcontent-%COMP%]{display:flex;flex-direction:column}.logo-title[_ngcontent-%COMP%]{font-size:18px;font-weight:700;color:#f1f5f9;line-height:1}.logo-sub[_ngcontent-%COMP%]{font-size:11px;color:#64748b;margin-top:2px}.sidebar-nav[_ngcontent-%COMP%]{flex:1;padding:16px 12px;display:flex;flex-direction:column;gap:4px}.nav-item[_ngcontent-%COMP%]{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:10px;color:#94a3b8;text-decoration:none;font-size:14px;font-weight:500;transition:all .2s ease}.nav-item[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:20px;width:20px;height:20px}.nav-item[_ngcontent-%COMP%]:hover{background:#6366f11f;color:#c7d2fe}.nav-item.active[_ngcontent-%COMP%]{background:#6366f133;color:#818cf8;box-shadow:inset 3px 0 #6366f1}.sidebar-footer[_ngcontent-%COMP%]{padding:16px;border-top:1px solid rgba(255,255,255,.06)}.user-info[_ngcontent-%COMP%]{display:flex;align-items:center;gap:10px}.avatar[_ngcontent-%COMP%]{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0}.user-details[_ngcontent-%COMP%]{display:flex;flex-direction:column}.user-name[_ngcontent-%COMP%]{font-size:13px;font-weight:600;color:#e2e8f0}.user-role[_ngcontent-%COMP%]{font-size:11px;color:#64748b}"]})};var c=class t{static \u0275fac=function(e){return new(e||t)};static \u0275cmp=d({type:t,selectors:[["app-root"]],decls:4,vars:0,consts:[[1,"app-shell"],[1,"main-content"]],template:function(e,n){e&1&&(i(0,"div",0),p(1,"app-sidebar"),i(2,"main",1),p(3,"router-outlet"),a()())},dependencies:[B,m],styles:[".app-shell[_ngcontent-%COMP%]{display:flex;min-height:100vh;background:#0f172a}.main-content[_ngcontent-%COMP%]{margin-left:240px;flex:1;min-height:100vh;overflow-y:auto}"]})};M(c,V).catch(t=>console.error(t));
