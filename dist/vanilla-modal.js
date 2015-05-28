"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

/**
 * @class VanillaModal
 * @version 1.1.3
 * @author Ben Ceglowski
 * @Contributer Esben JM
 */
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define("VanillaModal", function () {
      return factory;
    });
  } else if (typeof module !== "undefined" && module.exports) {
    module.exports = factory;
  } else {
    window.VanillaModal = factory;
  }
})((function () {
  var _class =
  /**
   * @param {Object} [userSettings]
   */
  function (userSettings, html) {
    this.$$ = {
      templ: "<div class=\"modal\"><div class=\"modal__inner\"><a rel=\"modal:close\"><i class=\"navicon navicon--close\">close</i></a><header class=\"modal__header\"></header><article class=\"modal__content\"></article><footer class=\"modal__footer\"><button class=\"button button--cancel modal__cancel\">Cancel</button><button class=\"button button--primary modal__ok\">Ok</button></footer></div></div>",
      modal: ".modal",
      modalInner: ".modal__inner",
      modalContent: ".modal__content",
      footer: ".modal__footer",
      open: "[rel=\"modal:open\"]",
      close: "[rel=\"modal:close\"]",
      cancelBtn: ".modal__cancel",
      okBtn: ".modal__ok",
      page: "body",
      "class": "modal-visible",
      loadClass: "vanilla-modal",
      showFooter: false,
      clickOutside: true,
      closeKey: 27,
      transitions: true,
      transitionEnd: null,
      delegateOpenEvents: true,
      onBeforeOpen: function () {},
      onBeforeClose: function () {},
      onOpen: function () {},
      onClose: function () {},
      onCancel: function () {},
      onOk: function () {}
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
      console.error("Please fix errors before proceeding.");
    }
  };

  _prototypeProperties(_class, null, {
    _trimModal: {
      /**
       * @param {Object} userSettings
       */
      value: function TrimModal() {
        if (!this.$$.showFooter) {
          this.$.footer.remove();
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _applyUserSettings: {

      /**
       * @param {Object} userSettings
       */
      value: function ApplyUserSettings(userSettings) {
        if (typeof userSettings === "object") {
          for (var i in userSettings) {
            if (userSettings.hasOwnProperty(i)) {
              this.$$[i] = userSettings[i];
            }
          }
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _transitionEndVendorSniff: {
      value: function TransitionEndVendorSniff() {
        if (this.$$.transitions === false) return;
        var el = document.createElement("div");
        var transitions = {
          transition: "transitionend",
          OTransition: "otransitionend",
          MozTransition: "transitionend",
          WebkitTransition: "webkitTransitionEnd"
        };
        for (var i in transitions) {
          if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
            return transitions[i];
          }
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _getNode: {

      /**
       * @param {String} selector
       * @param {Node} parent
       */
      value: function GetNode(selector, parent) {
        var targetNode = parent || document;
        var node = targetNode.querySelector(selector);
        if (!node) {
          this.error = true;
          return console.error(selector + " not found in document.");
        }
        return node;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _createDOMElement: {

      /**
       * @param {String} htmlString
       */
      value: function CreateDOMElement(html) {
        var frame = document.createElement("iframe");
        frame.style.display = "none";
        document.body.appendChild(frame);
        frame.contentDocument.open();
        frame.contentDocument.write(html);
        frame.contentDocument.close();
        var el = frame.contentDocument.body.firstChild;
        document.body.removeChild(frame);
        return el;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _setupDomNodes: {
      value: function SetupDomNodes() {
        var $ = {};
        $.modal = this.isHtml ? this.fractionModal : this._getNode(this.$$.modal, null);
        $.page = this._getNode(this.$$.page);
        $.modalInner = this._getNode(this.$$.modalInner, this.isHtml ? this.fractionModal : this.modal);
        $.modalContent = this._getNode(this.$$.modalContent, this.isHtml ? this.fractionModal : this.modal);
        $.footer = this._getNode(this.$$.footer, this.isHtml ? this.fractionModal : this.modal);
        $.okBtn = this._getNode(this.$$.okBtn, this.isHtml ? this.fractionModal : this.modal);
        $.cancelBtn = this._getNode(this.$$.cancelBtn, this.isHtml ? this.fractionModal : this.modal);
        return $;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _addLoadedCssClass: {
      value: function AddLoadedCssClass() {
        this._addClass(this.$.page, this.$$.loadClass);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _addClass: {

      /**
       * @param {Node} el
       * @param {String} className
       */
      value: function AddClass(el, className) {
        if (el instanceof HTMLElement === false) return;
        var cssClasses = el.className.split(" ");
        if (cssClasses.indexOf(className) === -1) {
          cssClasses.push(className);
        }
        el.className = cssClasses.join(" ");
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _removeClass: {

      /**
       * @param {Node} el
       * @param {String} className
       */
      value: function RemoveClass(el, className) {
        if (el instanceof HTMLElement === false) return;
        var cssClasses = el.className.split(" ");
        if (cssClasses.indexOf(className) > -1) {
          cssClasses.splice(cssClasses.indexOf(className), 1);
        }
        el.className = cssClasses.join(" ");
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _setOpenId: {
      value: function SetOpenId() {
        var id = this.current.id || "anonymous";
        this.$.page.setAttribute("data-current-modal", id);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _removeOpenId: {
      value: function RemoveOpenId() {
        this.$.page.removeAttribute("data-current-modal");
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _getElementContext: {


      /**
       * @param {mixed} e
       */
      value: function GetElementContext(e) {
        if (e && typeof e.hash === "string") {
          return document.querySelector(e.hash);
        } else if (typeof e === "string") {
          return document.querySelector(e);
        } else {
          return console.error("No selector supplied to open()");
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _open: {

      /**
       * @param {Event} e
       */
      value: function Open(e) {
        this._releaseNode();
        this.current = this.isHtml ? this.content : this._getElementContext(e);
        if (!this.content && this.current instanceof HTMLElement === false) return console.error("VanillaModal target must exist on page.");
        if (typeof this.$$.onBeforeOpen === "function") this.$$.onBeforeOpen.call(this);
        this._captureNode();
        if (this.isHtml) {
          this.$.page.appendChild(this.$.modal);
        }
        this._addClass(this.$.page, this.$$["class"]);
        this._setOpenId();
        this.isOpen = true;
        if (typeof this.$$.onOpen === "function") this.$$.onOpen.call(this);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _detectTransition: {
      value: function DetectTransition() {
        var css = window.getComputedStyle(this.$.modal, null);
        var transitionDuration = ["transitionDuration", "oTransitionDuration", "MozTransitionDuration", "webkitTransitionDuration"];
        var hasTransition = transitionDuration.filter(function (i) {
          if (typeof css[i] === "string" && parseFloat(css[i]) > 0) {
            return true;
          }
        });
        return hasTransition.length ? true : false;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _close: {

      /**
       * @param {Event} e
       */
      value: function Close(e) {
        if (typeof this.$$.onBeforeClose === "function") this.$$.onBeforeClose.call(this);
        this._removeClass(this.$.page, this.$$["class"]);
        var transitions = this._detectTransition();
        if (this.$$.transitions && this.$$.transitionEnd && transitions) {
          this._closeModalWithTransition();
        } else {
          this._closeModal();
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _closeModal: {
      value: function CloseModal() {
        this._removeOpenId(this.$.page);
        if (!this.isHtml) {
          this._releaseNode();
        } else {
          this.$.modal.remove();
        }
        this.isOpen = false;
        this.current = null;
        if (typeof this.$$.onClose === "function") this.$$.onClose.call(this);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _closeModalWithTransition: {
      value: function CloseModalWithTransition() {
        var _closeTransitionHandler = (function () {
          this.$.modal.removeEventListener(this.$$.transitionEnd, _closeTransitionHandler);
          this._closeModal();
        }).bind(this);
        this.$.modal.addEventListener(this.$$.transitionEnd, _closeTransitionHandler);
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _captureNode: {
      value: function CaptureNode() {
        var cur = this.isHtml ? this.content : this.current;
        while (cur.childNodes.length > 0) {
          this.$.modalContent.appendChild(this.current.childNodes[0]);
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _releaseNode: {
      value: function ReleaseNode() {
        var cur = this.isHtml ? this.content : this.current;
        while (this.$.modalContent.childNodes.length > 0) {
          cur.appendChild(this.$.modalContent.childNodes[0]);
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _closeKeyHandler: {

      /**
       * @param {Event} e
       */
      value: function CloseKeyHandler(e) {
        if (typeof this.$$.closeKey !== "number") return;
        if (e.which === this.$$.closeKey && this.isOpen === true) {
          e.preventDefault();
          this.close();
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _outsideClickHandler: {

      /**
       * @param {Event} e
       */
      value: function OutsideClickHandler(e) {
        if (this.$$.clickOutside !== true) return;
        var node = e.target;
        while (node != document.body) {
          if (node === this.$.modalInner) return;
          node = node.parentNode;
        }
        this.close();
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _matches: {

      /**
       * @param {Event} e
       * @param {String} selector
       */
      value: function Matches(e, selector) {
        var el = e.target;
        var matches = (el.document || el.ownerDocument).querySelectorAll(selector);
        for (var i = 0; i < matches.length; i++) {
          var child = el;
          while (child !== document.body) {
            if (child === matches[i]) return child;
            child = child.parentNode;
          }
        }
        return null;
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _delegateOpen: {

      /**
       * @param {Event} e
       */
      value: function DelegateOpen(e) {
        var matches = this._matches(e, this.$$.open);
        if (matches) {
          e.preventDefault();
          return this.open(matches);
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _delegateClose: {

      /**
       * @param {Event} e
       */
      value: function DelegateClose(e) {
        if (this._matches(e, this.$$.close)) {
          e.preventDefault();
          return this.close();
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _actionsClickHandler: {

      /**
      * @param {Event} e
      */
      value: function ActionsClickHandler(e) {
        if (e.target == this.$.okBtn) {
          e.preventDefault();
          if (typeof this.$$.onOk === "function") this.$$.onOk.call(this);
          return this.close();
        }
        if (e.target == this.$.cancelBtn) {
          e.preventDefault();
          if (typeof this.$$.cancelOk === "function") this.$$.cancelOk.call(this);
          return this.close();
        }
      },
      writable: true,
      enumerable: true,
      configurable: true
    },
    _events: {


      /**
       * @private {Function} add
       */
      value: function Events() {
        var _closeKeyHandler = this._closeKeyHandler.bind(this);
        var _outsideClickHandler = this._outsideClickHandler.bind(this);
        var _delegateOpen = this._delegateOpen.bind(this);
        var _delegateClose = this._delegateClose.bind(this);
        var _actionsClickHandler = this._actionsClickHandler.bind(this);

        var add = function () {
          this.$.modal.addEventListener("click", _actionsClickHandler);
          this.$.modal.addEventListener("click", _outsideClickHandler);
          document.addEventListener("keydown", _closeKeyHandler);
          if (!this.delegateOpenEvents) {
            document.addEventListener("click", _delegateOpen);
          }
          document.addEventListener("click", _delegateClose);
        };

        this.destroy = function () {
          this.close();
          this.$.modal.removeEventListener("click", _outsideClickHandler);
          document.removeEventListener("keydown", _closeKeyHandler);
          if (!this.delegateOpenEvents) {
            document.removeEventListener("click", _delegateOpen);
          }
          document.removeEventListener("click", _delegateClose);
        };

        return {
          add: add.bind(this)
        };
      },
      writable: true,
      enumerable: true,
      configurable: true
    }
  });

  return _class;
})());