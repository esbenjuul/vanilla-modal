/**
 * @class VanillaModal
 * @version 1.1.3
 * @author Ben Ceglowski
 * @Contributer Esben JM
 */
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define('VanillaModal', function () {
      return factory;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory;
  } else {
    window.VanillaModal = factory;
  }
})(class {
  /**
   * @param {Object} [userSettings]
   */
  constructor(userSettings, html) {
    
    this.$$ = {
      templ : '<div class="modal"><div class="modal__inner"><a rel="modal:close"><i class="navicon navicon--close">close</i></a><header class="modal__header"></header><article class="modal__content"></article><footer class="modal__footer"><button class="button button--cancel modal__cancel">Cancel</button><button class="button button--primary modal__ok">Ok</button></footer></div></div>',
      modal : '.modal',
      modalInner : '.modal__inner',
      modalContent : '.modal__content',
      footer: '.modal__footer', 
      open : '[rel="modal:open"]',
      close : '[rel="modal:close"]',
      cancelBtn : '.modal__cancel',
      okBtn : '.modal__ok',
      page : 'body',
      class : 'modal-visible',
      loadClass : 'vanilla-modal',
      showFooter: false,
      clickOutside : true,
      closeKey : 27,
      transitions : true,
      transitionEnd : null,
      delegateOpenEvents: true,
      onBeforeOpen : function() {},
      onBeforeClose : function() {},
      onOpen : function() {},
      onClose : function() {},
      onCancel : function() {},
      onOk : function() {}
    };
    
    this._applyUserSettings(userSettings, html);
    this.fractionModal = this._createDOMElement(this.$$.templ);
    this.error = false;
    this.isOpen = false;
    this.current = null;
    this.content = html ? this._createDOMElement(html) : null;
    this.isHtml = this.content ? true : false; 
    this.open = this._open.bind(this);
    this.close = this._close.bind(this);
    this.$$.transitionEnd = this._transitionEndVendorSniff();
    this.$ = this._setupDomNodes();
  
    
    if (!this.error) {
      this._trimModal();
      this._addLoadedCssClass();
      
      this._events().add();
    } else {
      console.error('Please fix errors before proceeding.');
    }
    
  }
  /**
   * @param {Object} userSettings
   */
  _trimModal() {
    if(!this.$$.showFooter) {
      this.$.footer.remove();
    }
  }

  /**
   * @param {Object} userSettings
   */
  _applyUserSettings(userSettings) {
    if (typeof userSettings === 'object') {
      for (var i in userSettings) {
        if (userSettings.hasOwnProperty(i)) {
          this.$$[i] = userSettings[i];
        }
      }
    }
  }
  
  _transitionEndVendorSniff() {
    if (this.$$.transitions === false) return;
    var el = document.createElement('div');
    var transitions = {
      'transition':'transitionend',
      'OTransition':'otransitionend',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    };
    for (var i in transitions) {
      if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
        return transitions[i];
      }
    }
  }
  
  /**
   * @param {String} selector
   * @param {Node} parent
   */
  _getNode(selector, parent) {
    var targetNode = parent || document;
    var node = targetNode.querySelector(selector);
    if (!node) {
      this.error = true;
      return console.error(selector + ' not found in document.');
    }
    return node;
  }

  /**
   * @param {String} htmlString
   */
  _createDOMElement(html) {
    var frame = document.createElement('iframe');
    frame.style.display = 'none';
    document.body.appendChild(frame);             
    frame.contentDocument.open();
    frame.contentDocument.write(html);
    frame.contentDocument.close();
    var el = frame.contentDocument.body.firstChild;
    document.body.removeChild(frame);
    return el;
  }

  _setupDomNodes() {
    var $ = {};
    $.modal = this.isHtml ? this.fractionModal : this._getNode(this.$$.modal, null);
    $.page = this._getNode(this.$$.page);
    $.modalInner = this._getNode(this.$$.modalInner, this.isHtml ? this.fractionModal : this.modal);
    $.modalContent = this._getNode(this.$$.modalContent, this.isHtml ? this.fractionModal : this.modal);
    $.footer = this._getNode(this.$$.footer, this.isHtml ? this.fractionModal : this.modal);
    $.okBtn = this._getNode(this.$$.okBtn, this.isHtml ? this.fractionModal : this.modal);
    $.cancelBtn = this._getNode(this.$$.cancelBtn, this.isHtml ? this.fractionModal : this.modal);
    return $;
  }
  
  _addLoadedCssClass() {
    this._addClass(this.$.page, this.$$.loadClass);
  }
  
  /**
   * @param {Node} el
   * @param {String} className
   */
  _addClass(el, className) {
    if (el instanceof HTMLElement === false) return;
    var cssClasses = el.className.split(' ');
    if (cssClasses.indexOf(className) === -1) {
      cssClasses.push(className);
    }
    el.className = cssClasses.join(' ');
  }
  
  /**
   * @param {Node} el
   * @param {String} className
   */
  _removeClass(el, className) {
    if (el instanceof HTMLElement === false) return;
    var cssClasses = el.className.split(' ');
    if (cssClasses.indexOf(className) > -1) {
      cssClasses.splice(cssClasses.indexOf(className), 1);
    }
    el.className = cssClasses.join(' ');
  }
  
  _setOpenId() {
    var id = this.current.id || 'anonymous';
    this.$.page.setAttribute('data-current-modal', id);
  }
  
  _removeOpenId() {
    this.$.page.removeAttribute('data-current-modal');
  }
  
  
  /**
   * @param {mixed} e
   */
  _getElementContext(e) {
    if (e && typeof e.hash === 'string') {
      return document.querySelector(e.hash);
    } else if (typeof e === 'string') {
      return document.querySelector(e);
    } else {
      return console.error('No selector supplied to open()');
    }
  }
  
  /**
   * @param {Event} e
   */
  _open(e) {
    this._releaseNode();
    this.current = this.isHtml ? this.content : this._getElementContext(e);
    if (!this.content && this.current instanceof HTMLElement === false) return console.error('VanillaModal target must exist on page.');
    if (typeof this.$$.onBeforeOpen === 'function') this.$$.onBeforeOpen.call(this);
    this._captureNode(); 
    if(this.isHtml) { 
      this.$.page.appendChild(this.$.modal); 
    }
    this._addClass(this.$.page, this.$$.class);
    this._setOpenId();
    this.isOpen = true;
    if (typeof this.$$.onOpen === 'function') this.$$.onOpen.call(this);
  }
  
  _detectTransition() {
    var css = window.getComputedStyle(this.$.modal, null);
    var transitionDuration = ['transitionDuration', 'oTransitionDuration', 'MozTransitionDuration', 'webkitTransitionDuration'];
    var hasTransition = transitionDuration.filter(function(i) {
      if (typeof css[i] === 'string' && parseFloat(css[i]) > 0) {
        return true;
      }
    });
    return (hasTransition.length) ? true : false;
  }
    
  /**
   * @param {Event} e
   */
  _close(e) {
    if (typeof this.$$.onBeforeClose === 'function') this.$$.onBeforeClose.call(this);
    this._removeClass(this.$.page, this.$$.class);
    var transitions = this._detectTransition();
    if (this.$$.transitions && this.$$.transitionEnd && transitions) {
      this._closeModalWithTransition();
    } else {
      this._closeModal();
    }
  }
  
  _closeModal() {
    this._removeOpenId(this.$.page);
    if(!this.isHtml) { 
      this._releaseNode(); 
    } else {
      this.$.modal.remove();
    }
    this.isOpen = false;
    this.current = null;
    if (typeof this.$$.onClose === 'function') this.$$.onClose.call(this);
  }
  
  _closeModalWithTransition() {
    var _closeTransitionHandler = function() {
      this.$.modal.removeEventListener(this.$$.transitionEnd, _closeTransitionHandler);
      this._closeModal();
    }.bind(this);
    this.$.modal.addEventListener(this.$$.transitionEnd, _closeTransitionHandler);
  }
  
  _captureNode() {
    var cur = this.isHtml ? this.content : this.current;
    while (cur.childNodes.length > 0) {
      this.$.modalContent.appendChild(this.current.childNodes[0]);
    }
  }
  
  _releaseNode() {
    var cur = this.isHtml ? this.content : this.current;
    while (this.$.modalContent.childNodes.length > 0) {
      cur.appendChild(this.$.modalContent.childNodes[0]);
    }
  }
  
  /**
   * @param {Event} e
   */
  _closeKeyHandler(e) {
    if (typeof this.$$.closeKey !== 'number') return;
    if (e.which === this.$$.closeKey && this.isOpen === true) {
      e.preventDefault();
      this.close();
    }
  }
  
  /**
   * @param {Event} e
   */
  _outsideClickHandler(e) {
    if (this.$$.clickOutside !== true) return;
    var node = e.target;
    while(node != document.body) {
      if (node === this.$.modalInner) return;
      node = node.parentNode;
    }
    this.close();
  }
  
  /**
   * @param {Event} e
   * @param {String} selector
   */
  _matches(e, selector) {
    var el = e.target;
    var matches = (el.document || el.ownerDocument).querySelectorAll(selector);
    for (let i = 0; i < matches.length; i++) {
      let child = el;
      while (child !== document.body) {
        if (child === matches[i]) return child;
        child = child.parentNode;
      }
    }
    return null;
  }
  
  /**
   * @param {Event} e
   */
  _delegateOpen(e) {
    var matches = this._matches(e, this.$$.open);
    if (matches) {
      e.preventDefault();
      return this.open(matches);
    }
  }
  
  /**
   * @param {Event} e
   */
  _delegateClose(e) {
    if (this._matches(e, this.$$.close)) {
      e.preventDefault();
      return this.close();
    }
  }

   /**
   * @param {Event} e
   */
  _actionsClickHandler(e) {
    if(e.target == this.$.okBtn) {
      e.preventDefault();
      if (typeof this.$$.onOk === 'function') this.$$.onOk.call(this);
      return this.close();
    }
    if(e.target == this.$.cancelBtn) {
      e.preventDefault();
      if (typeof this.$$.cancelOk === 'function') this.$$.cancelOk.call(this);
      return this.close();
    }
  }

  
  /**
   * @private {Function} add
   */
  _events() {
    let _closeKeyHandler = this._closeKeyHandler.bind(this);
    let _outsideClickHandler = this._outsideClickHandler.bind(this);
    let _delegateOpen = this._delegateOpen.bind(this);
    let _delegateClose = this._delegateClose.bind(this);
    let _actionsClickHandler = this._actionsClickHandler.bind(this);

    var add = function() {
      this.$.modal.addEventListener('click', _actionsClickHandler);
      this.$.modal.addEventListener('click', _outsideClickHandler);
      document.addEventListener('keydown', _closeKeyHandler);
      if(!this.delegateOpenEvents){ document.addEventListener('click', _delegateOpen); }
      document.addEventListener('click', _delegateClose);
    };
  
    this.destroy = function() {
      this.close();
      this.$.modal.removeEventListener('click', _outsideClickHandler);
      document.removeEventListener('keydown', _closeKeyHandler);
      if(!this.delegateOpenEvents){ document.removeEventListener('click', _delegateOpen); }
      document.removeEventListener('click', _delegateClose);
    };
    
    return {
      add : add.bind(this)
    };
  }
});

